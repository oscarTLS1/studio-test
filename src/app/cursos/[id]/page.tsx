// src/app/cursos/[id]/page.tsx
'use client'; // Remains a Client Component

import { useParams, notFound as navigateNotFound } from 'next/navigation'; // Import useParams
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ListChecks, CheckCircle2, Circle, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image for sub-course display
import { lawModules } from '../page'; // Assuming this data source is correct

// YouTube Player Component (remains the same)
function YouTubePlayer({ videoId }: { videoId: string | null }) {
  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground rounded-lg shadow-inner">
        <Youtube className="h-10 w-10 mr-2 text-muted-foreground/50" />
        <span>Selecciona un módulo con video para verlo aquí.</span>
      </div>
    );
  }

  // Function to extract YouTube video ID from various URL formats
  const extractVideoID = (url: string): string | null => {
      if (!url) return null;
      let videoID: string | null = null;
      try {
          // Regular expression to find YouTube IDs in various URL formats
          const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          const match = url.match(regex);
          videoID = match ? match[1] : null;

          // If regex fails, try simple splitting for edge cases (less reliable)
          if (!videoID) {
              if (url.includes('youtube.com/watch?v=')) {
                  const urlObj = new URL(url);
                  videoID = urlObj.searchParams.get('v');
              } else if (url.includes('youtu.be/')) {
                  const parts = url.split('youtu.be/');
                  videoID = parts[1]?.split('?')[0];
              } else if (url.includes('/embed/')) {
                  const parts = url.split('/embed/');
                  videoID = parts[1]?.split('?')[0];
              } else if (url.includes('/shorts/')) {
                   const parts = url.split('/shorts/');
                   videoID = parts[1]?.split('?')[0];
              }
              // Basic validation if splitting worked
              if (videoID && !/^[a-zA-Z0-9_-]{11}$/.test(videoID)) {
                  console.warn("Potentially invalid YouTube ID extracted via splitting:", videoID);
                  videoID = null; // Invalidate if it doesn't match pattern
              }
          }

          // Final check on the extracted ID
          if (videoID && /^[a-zA-Z0-9_-]{11}$/.test(videoID)) {
              return videoID;
          } else {
              console.warn("Could not extract a valid YouTube ID from URL:", url, "Extracted:", videoID);
              return null; // Return null if no valid ID found
          }

      } catch (e) {
          console.error("Error parsing video URL:", url, e);
          return null; // Return null on parsing error
      }
  };


  const extractedId = extractVideoID(videoId);

  // Handle cases where ID extraction failed
  if (!extractedId) {
      return (
          <div className="aspect-video w-full bg-destructive/10 flex flex-col items-center justify-center text-destructive rounded-lg shadow-inner p-4">
              <Youtube className="h-10 w-10 mr-2 text-destructive/50" />
              <span>Error al cargar el video.</span>
              <span className="text-xs mt-1 text-center">No se pudo extraer un ID válido de la URL: {videoId}</span>
          </div>
      );
  }

  const embedUrl = `https://www.youtube.com/embed/${extractedId}?autoplay=0&rel=0`; // Added common parameters

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg border">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy" // Add lazy loading
      ></iframe>
    </div>
  );
}


// Type for a single course or sub-course module
interface CourseModule {
  title: string;
  videoUrl?: string; // Optional video URL
}

// Type for a course area (like Constitucional, Penal) or a sub-course (like Personas y Familia)
interface CourseData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // Optional image for sub-courses
  hint?: string; // Optional hint for images
  modules?: CourseModule[]; // Modules for regular courses or sub-courses
  subCourses?: Omit<CourseData, 'subCourses'>[]; // Sub-courses for areas like Civil
}


export default function CourseDetailPage() {
  const params = useParams(); // Use the hook
  const id = params.id as string; // Get the id from the hook's result

  // State for module completion status and progress value
  const [course, setCourse] = useState<CourseData | null | undefined>(undefined); // undefined initial state
  const [completedStatus, setCompletedStatus] = useState<boolean[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null); // State for selected video
  const [isSubCourseView, setIsSubCourseView] = useState(false); // Flag to check if displaying sub-courses

   // Effect to find the course based on id once params are available
   useEffect(() => {
    // Avoid unnecessary state updates if already loading or ID hasn't changed relevantly
    if (isLoading === false && course?.id === id) return;

    setIsLoading(true);
    let foundCourse: CourseData | undefined | null = null;
    let foundIsSubCourseView = false;

    // Check if the ID matches a main course area
    foundCourse = lawModules.find((area) => area.id === id);

    if (foundCourse) {
        // If it's 'civil', we display its sub-courses
        if (foundCourse.id === 'civil' && foundCourse.subCourses) {
            foundIsSubCourseView = true;
        }
        // If it's a normal course area (not 'civil'), prepare its modules
        else if (foundCourse.modules) {
             // Initialize completion status based on the found course
            const initialStatus = foundCourse.modules.map(() => false);
            setCompletedStatus(initialStatus);

            // Find the first module that *has* a videoUrl and set it as default
            const firstVideoModule = foundCourse.modules.find(m => m.videoUrl && m.videoUrl.trim() !== '');
            setSelectedVideoUrl(firstVideoModule?.videoUrl || null); // Set null if no module has a video initially

            // Initialize progress based on initial status
            const totalModules = initialStatus.length;
            const completedCount = initialStatus.filter(Boolean).length;
            setProgressValue(totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0);
        } else {
             // Course area exists but has neither modules nor subCourses (edge case)
             setCompletedStatus([]);
             setSelectedVideoUrl(null);
             setProgressValue(0);
        }
    } else {
        // If not found in main areas, check if the ID matches a sub-course within 'civil'
        const civilArea = lawModules.find(area => area.id === 'civil');
        if (civilArea?.subCourses) {
            foundCourse = civilArea.subCourses.find(sub => sub.id === id);
            if (foundCourse && foundCourse.modules) {
                 // Found a sub-course, prepare its modules
                const initialStatus = foundCourse.modules.map(() => false);
                setCompletedStatus(initialStatus);
                const firstVideoModule = foundCourse.modules.find(m => m.videoUrl && m.videoUrl.trim() !== '');
                setSelectedVideoUrl(firstVideoModule?.videoUrl || null);
                const totalModules = initialStatus.length;
                const completedCount = initialStatus.filter(Boolean).length;
                setProgressValue(totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0);
            }
        }
    }

    // Update state after checks
    if (foundCourse) {
        setCourse(foundCourse);
        setIsSubCourseView(foundIsSubCourseView);
    } else {
        setCourse(null); // Explicitly set to null if not found anywhere
        setIsSubCourseView(false);
        setCompletedStatus([]);
        setSelectedVideoUrl(null);
        setProgressValue(0);
    }

    setIsLoading(false);
   }, [id, isLoading, course?.id]); // Depend on id and loading state


  // Function to toggle module completion
  const toggleModuleCompletion = (index: number) => {
    setCompletedStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = !newStatus[index];

      // Calculate progress after status update
       if (course && course.modules) {
            const totalModules = newStatus.length;
            if (totalModules > 0) {
                const completedCount = newStatus.filter(Boolean).length;
                setProgressValue(Math.round((completedCount / totalModules) * 100));
            } else {
                setProgressValue(0);
            }
        } else {
           setProgressValue(0);
        }

      return newStatus;
    });
  };

  // Function to handle video selection
  const handleSelectVideo = (videoUrl: string | undefined) => {
      setSelectedVideoUrl(videoUrl || null);
  }


  // Handle loading state
  if (isLoading || course === undefined) { // Check for undefined initial state too
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 text-center">
            Cargando detalles del curso...
        </div>
    );
  }

  // Handle course not found after loading
  if (!course) {
     // Use Next.js notFound() for a standard 404 page
     navigateNotFound(); // This will render the nearest not-found.js file
  }

  // --- RENDER LOGIC ---

  // Common Back Button and Header
  const renderHeader = () => (
    <>
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          {/* Link back to the main courses page or 'civil' if it's a sub-course */}
          <Link href={isSubCourseView || course.id === 'civil' || !lawModules.find(m => m.id === id)?.subCourses ? '/cursos' : `/cursos/${lawModules.find(a => a.subCourses?.some(s => s.id === id))?.id || 'cursos'}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a {isSubCourseView ? 'Áreas' : (lawModules.find(a => a.subCourses?.some(s => s.id === id))?.title || 'Áreas')}
          </Link>
        </Button>
      </div>
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl mb-2">
          {course.title}
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl">
          {course.description}
        </p>
      </div>
    </>
  );


  // Render Sub-Course List (Specific to 'civil' or similar structure)
  const renderSubCourseList = () => (
     <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {course.subCourses?.map((subCourse) => (
            <Link key={subCourse.id} href={`/cursos/${subCourse.id}`} className="group block">
                 <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                 <CardHeader className="p-0">
                     <div className="relative h-48 w-full">
                        <Image
                         src={subCourse.imageUrl || 'https://picsum.photos/400/250?random=50'} // Default placeholder
                         alt={subCourse.title}
                         layout="fill"
                         objectFit="cover"
                         data-ai-hint={subCourse.hint || 'law study book'}
                         />
                     </div>
                 </CardHeader>
                 <CardContent className="flex flex-grow flex-col justify-between p-6">
                     <div>
                         <CardTitle className="mb-2 text-xl font-semibold">{subCourse.title}</CardTitle>
                         <CardDescription className="text-foreground/80">{subCourse.description}</CardDescription>
                     </div>
                 </CardContent>
                  <CardFooter className="p-6 pt-0">
                     <span className="text-sm text-primary group-hover:underline">Ver módulos del curso</span>
                  </CardFooter>
                 </Card>
            </Link>
        ))}
     </div>
  );


  // Render Module List and Progress (For regular courses or sub-courses)
  const renderModuleView = () => (
    <>
        {/* Video Player Area */}
      <div className="mb-12">
           <YouTubePlayer videoId={selectedVideoUrl} />
      </div>

      {/* Course Content Area */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Modules List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <ListChecks className="h-5 w-5 text-accent" />
                 Módulos del Curso
              </CardTitle>
              <CardDescription>
                Haz clic en un módulo con el ícono <Youtube className="inline-block h-4 w-4 text-red-600 align-middle mx-1"/> para cargar el video. Usa el botón para marcar tu progreso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.modules && course.modules.length > 0 ? (
                <ul className="space-y-3">
                  {course.modules.map((module, index) => (
                    <li
                        key={index}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md border transition-all duration-200
                                    ${module.videoUrl ? 'hover:bg-muted/80 cursor-pointer' : 'bg-secondary/30 cursor-default'}
                                    ${selectedVideoUrl === module.videoUrl ? 'bg-accent/20 border-accent ring-2 ring-accent/50' : 'border-border'}` // Highlight if selected
                                }
                        // Only attach click handler if there's a video
                        onClick={module.videoUrl ? () => handleSelectVideo(module.videoUrl) : undefined}
                        role={module.videoUrl ? "button" : undefined}
                        tabIndex={module.videoUrl ? 0 : undefined}
                        aria-label={module.videoUrl ? `Cargar video del Módulo ${index + 1}: ${module.title}` : `Módulo ${index + 1}: ${module.title}`}
                        onKeyDown={module.videoUrl ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectVideo(module.videoUrl); } : undefined} // Add keyboard accessibility
                    >
                       <div className="flex items-center mb-2 sm:mb-0 flex-1 mr-4"> {/* Added mr-4 for spacing */}
                           {module.videoUrl ? (
                                <Youtube className="h-5 w-5 mr-3 text-red-600 flex-shrink-0" aria-hidden="true" />
                           ) : (
                               <div className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true"></div> // Placeholder for alignment
                           )}
                            <span className={`text-sm font-medium ${completedStatus[index] ? 'text-muted-foreground line-through' : ''}`}>
                             {`Módulo ${index + 1}: ${module.title}`}
                            </span>
                       </div>

                      {/* Completion Button - Stop propagation to prevent video load */}
                      <div className="flex items-center justify-end space-x-2 flex-shrink-0"> {/* Prevent button from shrinking */}
                          <Button
                            variant={completedStatus[index] ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering li onClick/onKeyDown
                                toggleModuleCompletion(index);
                            }}
                            className={`transition-colors duration-200 ${completedStatus[index] ? 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200' : ''}`}
                            aria-pressed={completedStatus[index]}
                            aria-label={`Marcar Módulo ${index + 1} como ${completedStatus[index] ? 'no completado' : 'completado'}`}
                          >
                            {completedStatus[index] ? (
                               <> <CheckCircle2 className="mr-2 h-4 w-4" /> Completado </>
                            ) : (
                               <> <Circle className="mr-2 h-4 w-4" /> Marcar </>
                            )}
                          </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No hay módulos definidos para este curso aún.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress and Info */}
        <div className="md:col-span-1 space-y-6">
           <Card>
             <CardHeader>
               <CardTitle>Tu Progreso</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <Progress value={progressValue} aria-label={`Progreso del curso: ${progressValue}%`} />
               <p className="text-center text-sm text-muted-foreground">{progressValue}% Completado</p>
               <Button className="w-full" disabled={progressValue === 100}>
                   {progressValue === 100 ? '¡Curso Completado!' : 'Continuar Aprendiendo'}
               </Button>
             </CardContent>
           </Card>

            <Card className="bg-muted/40 border-dashed">
                <CardHeader>
                    <CardTitle className="text-base">Recursos Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Próximamente: Enlaces, descargas y más.</p>
                     {/* Placeholder for adding resources later */}
                     <div className="mt-4 space-y-2">
                         <Button variant="outline" size="sm" className="w-full" disabled>
                            <span className="opacity-50">Descargar Material (No disponible)</span>
                         </Button>
                         <Button variant="outline" size="sm" className="w-full" disabled>
                             <span className="opacity-50">Foro de Discusión (No disponible)</span>
                         </Button>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );


  // Render the main course detail UI
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
        {renderHeader()}

        {isSubCourseView ? renderSubCourseList() : renderModuleView()}

       <div className="mt-16 p-4 border rounded-lg bg-secondary/50 text-center">
            <h3 className="font-semibold text-lg mb-2">Nota de Desarrollo</h3>
            <p className="text-sm text-muted-foreground">
                {isSubCourseView
                  ? `Se muestran los cursos específicos dentro de ${course.title}. Haz clic en uno para ver sus módulos.`
                  : `Se muestran los módulos para ${course.title}. Haz clic en un módulo con video para cargarlo. El progreso no se guarda.`
                }
                 La lógica de extracción de ID de video se ha mejorado.
            </p>
       </div>
    </div>
  );
}

    