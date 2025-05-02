'use client'; // Remains a Client Component

import { useParams, notFound as navigateNotFound } from 'next/navigation'; // Import useParams
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ListChecks, CheckCircle2, Circle, Youtube } from 'lucide-react';
import Link from 'next/link';
import { lawModules } from '../page'; // Assuming this data source is correct

// YouTube Player Component (Simple iframe wrapper)
// In a real app, consider using a library like react-youtube for better control
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
          // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
          if (url.includes('youtube.com/watch?v=')) {
              const urlObj = new URL(url);
              videoID = urlObj.searchParams.get('v');
          }
          // Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
          else if (url.includes('youtube.com/shorts/')) {
              const parts = url.split('/shorts/');
              videoID = parts[1]?.split('?')[0]; // Get part after /shorts/ and before any query params
          }
          // Shortened youtu.be URL: https://youtu.be/VIDEO_ID
          else if (url.includes('youtu.be/')) {
              const parts = url.split('youtu.be/');
              videoID = parts[1]?.split('?')[0]; // Get part after youtu.be/ and before any query params
          }
          // Embed URL: https://www.youtube.com/embed/VIDEO_ID
          else if (url.includes('youtube.com/embed/')) {
              const parts = url.split('/embed/');
              videoID = parts[1]?.split('?')[0];
          }
          // If it looks like just an ID (no slashes, no query params)
          else if (!url.includes('/') && !url.includes('?') && url.length > 5) { // Basic check for ID-like string
             videoID = url;
          }

          // Basic validation for common ID patterns (alphanumeric, underscore, hyphen)
          if (videoID && /^[a-zA-Z0-9_-]{11}$/.test(videoID)) {
              return videoID;
          } else {
              console.warn("Extracted string doesn't look like a standard YouTube ID:", videoID);
              // Fallback: If we couldn't extract a standard ID, maybe the input *was* the ID?
              // Or perhaps return null if strict parsing is needed.
              // Let's try returning the initial non-null extraction if validation fails, might still work in some cases.
              return videoID || null;
          }

      } catch (e) {
          console.error("Error parsing video URL:", url, e);
          // If parsing fails, it might be just the ID or invalid. Return null.
          return null;
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

  const embedUrl = `https://www.youtube.com/embed/${extractedId}`;

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
      ></iframe>
    </div>
  );
}


// Remove the explicit params prop type here, useParams handles it
export default function CourseDetailPage() {
  const params = useParams(); // Use the hook
  const id = params.id as string; // Get the id from the hook's result

  // State for module completion status and progress value
  const [course, setCourse] = useState<typeof lawModules[0] | null | undefined>(undefined); // undefined initial state
  const [completedStatus, setCompletedStatus] = useState<boolean[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null); // State for selected video

   // Effect to find the course based on id once params are available
   useEffect(() => {
    // Avoid unnecessary state updates if already loading or ID hasn't changed relevantly
    if (isLoading === false && course?.id === id) return;

    setIsLoading(true);
    const foundCourse = lawModules.find((module) => module.id === id);

    if (foundCourse) {
        setCourse(foundCourse); // Set course state
        // Initialize completion status based on the found course
        const initialStatus = foundCourse.modules?.map(() => false) || [];
        setCompletedStatus(initialStatus);
        // Optionally, set the first video as default if available
        const firstVideoModule = foundCourse.modules?.find(m => m.videoUrl);
        setSelectedVideoUrl(firstVideoModule?.videoUrl || null);
        // Initialize progress based on initial status
        const totalModules = initialStatus.length;
        const completedCount = initialStatus.filter(Boolean).length;
        setProgressValue(totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0);
    } else {
        setCourse(null); // Explicitly set to null if not found
        setCompletedStatus([]);
        setSelectedVideoUrl(null); // Ensure no video selected if course not found
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

  // Removed the redundant progress calculation useEffect as it's handled in toggleModuleCompletion


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
     // In a Client Component, you render a message or redirect.
     // Use Next.js notFound() for a standard 404 page
     navigateNotFound(); // This will render the nearest not-found.js file
  }


  // Render the main course detail UI
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cursos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Áreas
          </Link>
        </Button>
      </div>

      {/* Course Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl mb-2">
          {course.title}
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl">
          {course.description}
        </p>
      </div>

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

       <div className="mt-16 p-4 border rounded-lg bg-secondary/50 text-center">
            <h3 className="font-semibold text-lg mb-2">Nota de Desarrollo</h3>
            <p className="text-sm text-muted-foreground">
                Se ha añadido un reproductor de video de YouTube. Haz clic en el módulo correspondiente (con ícono <Youtube className="inline-block h-4 w-4 text-red-600 align-middle mx-1"/>) para cargarlo. El progreso se actualiza al marcar módulos como completados, pero no se guarda entre visitas. La lógica de extracción de ID de video se ha mejorado.
            </p>
       </div>
    </div>
  );
}

// Optional: Generate static paths is still relevant if you want SSG for known courses
// export async function generateStaticParams() {
//   // This function runs at build time on the server
//   // Fetch course IDs if dynamic, or use static list
//   return lawModules.map((module) => ({
//     id: module.id,
//   }));
// }
