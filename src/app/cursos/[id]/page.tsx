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
      <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground rounded-lg">
        Selecciona un módulo con video para verlo aquí.
      </div>
    );
  }

  // Extract video ID from URL (basic implementation)
  let extractedId = videoId;
  try {
      const url = new URL(videoId);
      if (url.hostname.includes('youtube.com') && url.searchParams.has('v')) {
          extractedId = url.searchParams.get('v')!;
      } else if (url.hostname.includes('youtu.be')) {
          extractedId = url.pathname.substring(1);
      }
      // Add more checks if needed for different URL formats
  } catch (e) {
      // If it's not a valid URL, maybe it's already an ID? Or invalid input.
      console.warn("Could not parse video URL, assuming it's an ID:", videoId);
  }


  const embedUrl = `https://www.youtube.com/embed/${extractedId}`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md">
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
    setIsLoading(true);
    const foundCourse = lawModules.find((module) => module.id === id);
    setCourse(foundCourse); // Set course state
    if (foundCourse) {
        // Initialize completion status based on the found course
        setCompletedStatus(foundCourse.modules?.map(() => false) || []);
        // Optionally, set the first video as default if available
        const firstVideoModule = foundCourse.modules?.find(m => m.videoUrl);
        setSelectedVideoUrl(firstVideoModule?.videoUrl || null);
    }
    setIsLoading(false);
   }, [id]); // Depend on id

  // Function to toggle module completion
  const toggleModuleCompletion = (index: number) => {
    setCompletedStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = !newStatus[index];
      return newStatus;
    });
  };

  // Function to handle video selection
  const handleSelectVideo = (videoUrl: string | undefined) => {
      setSelectedVideoUrl(videoUrl || null);
  }

  // Effect to calculate progress whenever completion status changes
  useEffect(() => {
    // Ensure course and modules exist before calculating progress
    if (!course || !course.modules) {
        setProgressValue(0);
        return;
    }
    const totalModules = completedStatus.length;
    if (totalModules === 0) {
      setProgressValue(0);
      return;
    }
    const completedCount = completedStatus.filter(Boolean).length;
    const newProgress = Math.round((completedCount / totalModules) * 100);
    setProgressValue(newProgress);
  }, [completedStatus, course]); // Add course dependency


  // Handle loading state
  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 text-center">
            Cargando detalles del curso...
        </div>
    );
  }

  // Handle course not found after loading
  if (!course) {
     // In a Client Component, you render a message or redirect.
     return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Curso no encontrado</h1>
            <p className="text-muted-foreground mb-6">El curso con el ID "{id}" no existe.</p>
            <Button variant="outline" asChild>
                <Link href="/cursos">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Cursos
                </Link>
            </Button>
        </div>
     );
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
              <CardDescription>Marca módulos como completados y selecciona un video para verlo arriba.</CardDescription>
            </CardHeader>
            <CardContent>
              {course.modules && course.modules.length > 0 ? (
                <ul className="space-y-3">
                  {course.modules.map((module, index) => (
                    <li key={index} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md transition-colors duration-200 ${module.videoUrl ? 'hover:bg-secondary cursor-pointer' : 'bg-secondary/30'} ${selectedVideoUrl === module.videoUrl ? 'bg-accent/20 border border-accent' : 'bg-secondary/50'}`}>
                       <div className="flex items-center mb-2 sm:mb-0 flex-1" onClick={() => module.videoUrl && handleSelectVideo(module.videoUrl)}>
                           {module.videoUrl && <Youtube className="h-5 w-5 mr-3 text-red-600 flex-shrink-0" />}
                            <span className={`text-sm font-medium ${completedStatus[index] ? 'text-muted-foreground line-through' : ''} ${!module.videoUrl ? 'ml-8 sm:ml-0' : ''}`}>
                             {`Módulo ${index + 1}: ${module.title}`}
                            </span>
                       </div>

                      <div className="flex items-center justify-end space-x-2">
                          {/* Watch Video Button (redundant if clicking title works) */}
                          {/* {module.videoUrl && (
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectVideo(module.videoUrl)}
                                  className={`transition-colors duration-200 ${selectedVideoUrl === module.videoUrl ? 'border-primary text-primary' : ''}`}
                              >
                                <Youtube className="mr-2 h-4 w-4" /> Ver Video
                              </Button>
                          )} */}
                          <Button
                            variant={completedStatus[index] ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => toggleModuleCompletion(index)}
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
                Se ha añadido un reproductor de video de YouTube. Haz clic en el título de un módulo con video para cargarlo. El progreso sigue siendo interactivo pero no persistente.
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
