// src/app/cursos/[id]/page.tsx
'use client'; // Requires client-side interaction for state, effects, auth, and data fetching

import { useParams, notFound as navigateNotFound } from 'next/navigation'; // Import useParams
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ListChecks, CheckCircle2, Circle, Youtube, Link as LinkExternal } from 'lucide-react'; // Added LinkExternal
import Link from 'next/link';
import Image from 'next/image'; // Import Image for sub-course display
import { lawModules } from '../page'; // Assuming this data source is correct
import { useAuth } from '@/context/AuthContext'; // Import Auth context
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '@/lib/firebase/config'; // Firestore instance
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query'; // React Query for data fetching/mutation

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
  externalLink?: string; // Optional external link for content
}

// Type for a course area (like Constitucional, Penal) or a sub-course (like Personas y Familia)
interface CourseData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // Optional image for sub-courses
  hint?: string; // Optional hint for images
  modules?: CourseModule[]; // Modules for regular courses or sub-courses
  subCourses?: Omit<CourseData, 'subCourses'>[]; // Sub-courses for areas like Civil or Laboral
}

// Type for user progress data stored in Firestore
interface UserProgress {
    completedModules: boolean[];
    lastAccessed?: number; // Timestamp
}

// Fetch user progress from Firestore
const fetchUserProgress = async (userId: string, courseId: string): Promise<UserProgress | null> => {
    if (!userId) return null; // No user logged in
    const progressRef = doc(db, 'userProgress', userId, 'courses', courseId);
    const docSnap = await getDoc(progressRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProgress;
    }
    return null; // No progress found for this user/course
};

// Save user progress to Firestore
const saveUserProgress = async ({ userId, courseId, progressData }: { userId: string; courseId: string; progressData: UserProgress }) => {
    if (!userId) throw new Error("User not logged in");
    const progressRef = doc(db, 'userProgress', userId, 'courses', courseId);
    await setDoc(progressRef, progressData, { merge: true }); // Use merge to avoid overwriting other fields if any
};

// --- React Query Client ---
const queryClient = new QueryClient();

// Wrap the main component export with QueryClientProvider
export default function CourseDetailPageWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <CourseDetailPage />
        </QueryClientProvider>
    );
}


// --- Main Component ---
function CourseDetailPage() {
  const params = useParams(); // Use the hook
  const id = params.id as string; // Get the id from the hook's result
  const { user, loading: authLoading } = useAuth(); // Get user and loading state from Auth context

  // State for module completion status and progress value
  const [course, setCourse] = useState<CourseData | null | undefined>(undefined); // undefined initial state
  const [completedStatus, setCompletedStatus] = useState<boolean[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state for course data finding
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null); // State for selected video
  const [isSubCourseView, setIsSubCourseView] = useState(false); // Flag to check if displaying sub-courses
  const [parentAreaId, setParentAreaId] = useState<string | null>(null); // Track parent area ID for sub-courses

  // --- React Query for User Progress ---
  const { data: userProgress, isLoading: progressLoading, refetch: refetchProgress } = useQuery({
      queryKey: ['userProgress', user?.uid, id], // Query key includes user ID and course ID
      queryFn: () => fetchUserProgress(user!.uid, id),
      enabled: !!user && !authLoading && course !== undefined, // Only run query if user is logged in, auth finished, and course data identified
      staleTime: 5 * 60 * 1000, // Cache progress for 5 minutes
  });

  // --- React Query Mutation for Saving Progress ---
  const mutation = useMutation({
      mutationFn: saveUserProgress,
      onSuccess: () => {
          // Optionally invalidate and refetch progress after saving, though local state update might be sufficient
          // queryClient.invalidateQueries({ queryKey: ['userProgress', user?.uid, id] });
          console.log("Progress saved successfully.");
      },
      onError: (error) => {
          console.error("Error saving progress:", error);
          // Optionally show a toast message to the user
      },
  });


   // Effect to find the course data based on id
   useEffect(() => {
    if (isLoading === false && course?.id === id) return;

    setIsLoading(true);
    let foundCourse: CourseData | undefined | null = null;
    let foundIsSubCourseView = false;
    let foundParentAreaId: string | null = null;

    // Logic to find the course (remains the same)
    foundCourse = lawModules.find((area) => area.id === id);
    if (foundCourse) {
        if ((foundCourse.id === 'civil' || foundCourse.id === 'laboral' || foundCourse.id === 'administrativo') && foundCourse.subCourses) {
            foundIsSubCourseView = true;
        } else if (foundCourse.modules) {
             // Select first video initially if no progress loaded yet
             const firstVideoModule = foundCourse.modules.find(m => m.videoUrl && m.videoUrl.trim() !== '');
             setSelectedVideoUrl(firstVideoModule?.videoUrl || null);
        }
    } else {
        const areasWithSubCourses = lawModules.filter(area => area.subCourses);
        for (const area of areasWithSubCourses) {
            foundCourse = area.subCourses?.find(sub => sub.id === id);
            if (foundCourse) {
                foundParentAreaId = area.id;
                if (foundCourse.modules) {
                    const firstVideoModule = foundCourse.modules.find(m => m.videoUrl && m.videoUrl.trim() !== '');
                    setSelectedVideoUrl(firstVideoModule?.videoUrl || null);
                }
                break;
            }
        }
    }

    // Update course state
    if (foundCourse) {
        setCourse(foundCourse);
        setIsSubCourseView(foundIsSubCourseView);
        setParentAreaId(foundParentAreaId);
    } else {
        setCourse(null);
        setIsSubCourseView(false);
        setParentAreaId(null);
    }
    setIsLoading(false);
   }, [id, course?.id]); // Simplified dependency array

    // Effect to initialize completion status from Firestore or default
   useEffect(() => {
       if (!course || !course.modules || progressLoading || authLoading) return; // Wait for course, modules, and loading states

       let initialStatus: boolean[];
       if (user && userProgress) {
           // User logged in and progress data loaded
           initialStatus = userProgress.completedModules || course.modules.map(() => false);
           // Ensure the loaded status array matches the number of modules
           if (initialStatus.length !== course.modules.length) {
               console.warn("Mismatch between loaded progress and course modules. Resetting progress.");
               initialStatus = course.modules.map(() => false);
           }
       } else {
           // User not logged in or no progress data found, use default (all false)
           initialStatus = course.modules.map(() => false);
       }

       setCompletedStatus(initialStatus);

       // Calculate initial progress based on the status
       const totalModules = initialStatus.length;
       const completedCount = initialStatus.filter(Boolean).length;
       setProgressValue(totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0);

   }, [course, user, userProgress, progressLoading, authLoading]);


  // Function to toggle module completion and save progress
  const toggleModuleCompletion = (index: number) => {
    if (!course || !course.modules) return;

    const newStatus = [...completedStatus];
    newStatus[index] = !newStatus[index];
    setCompletedStatus(newStatus); // Update local state immediately for UI responsiveness

     // Calculate and update progress value
    const totalModules = newStatus.length;
    if (totalModules > 0) {
        const completedCount = newStatus.filter(Boolean).length;
        setProgressValue(Math.round((completedCount / totalModules) * 100));
    } else {
        setProgressValue(0);
    }

    // Save progress to Firestore if user is logged in
    if (user) {
        const progressData: UserProgress = {
            completedModules: newStatus,
            lastAccessed: Date.now(),
        };
        mutation.mutate({ userId: user.uid, courseId: id, progressData });
    } else {
        console.log("User not logged in. Progress not saved.");
        // Optionally, you could store progress in localStorage for anonymous users
    }
  };

  // Function to handle video selection
  const handleSelectVideo = (videoUrl: string | undefined) => {
      setSelectedVideoUrl(videoUrl || null);
  }

  // Function to handle opening external links
  const handleOpenExternalLink = (url: string | undefined) => {
      if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
      }
  };


  // Handle loading states (Auth, Course finding, Progress fetching)
  const combinedLoading = isLoading || authLoading || (user && progressLoading);
  if (combinedLoading || course === undefined) {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 text-center">
            Cargando...
             {/* You could add a spinner here */}
        </div>
    );
  }

  // Handle course not found after loading
  if (!course) {
     navigateNotFound(); // Use Next.js notFound() for a standard 404 page
  }

  // --- RENDER LOGIC ---

  // Common Back Button and Header
  const renderHeader = () => {
    const backLink = parentAreaId ? `/cursos/${parentAreaId}` : '/cursos';
    const backLabel = parentAreaId
        ? `Volver a ${lawModules.find(a => a.id === parentAreaId)?.title || 'Área'}`
        : 'Volver a Áreas';

    return (
      <>
        <div className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href={backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
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
  };


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
                 Haz clic en un módulo con <Youtube className="inline-block h-4 w-4 text-red-600 align-middle mx-1"/> para cargar el video, o con <LinkExternal className="inline-block h-4 w-4 text-blue-600 align-middle mx-1"/> para abrir el contenido externo. Usa el botón para marcar tu progreso.
                 {!user && !authLoading && <span className="text-sm text-amber-600 block mt-1"> (Inicia sesión para guardar tu progreso)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.modules && course.modules.length > 0 ? (
                <ul className="space-y-3">
                  {course.modules.map((module, index) => {
                    const hasVideo = !!module.videoUrl;
                    const hasExternalLink = !!module.externalLink;
                    const isClickable = hasVideo || hasExternalLink;
                    const isSelectedVideo = hasVideo && selectedVideoUrl === module.videoUrl;
                    // Safely access completedStatus[index]
                    const isCompleted = completedStatus?.[index] ?? false;

                    const handleClick = () => {
                      if (hasVideo) {
                        handleSelectVideo(module.videoUrl);
                      } else if (hasExternalLink) {
                        handleOpenExternalLink(module.externalLink);
                      }
                    };

                    const handleKeyDown = (e: React.KeyboardEvent) => {
                      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                        handleClick();
                      }
                    };

                    return (
                      <li
                        key={index}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md border transition-all duration-200
                                      ${isClickable ? 'hover:bg-muted/80 cursor-pointer' : 'bg-secondary/30 cursor-default'}
                                      ${isSelectedVideo ? 'bg-accent/20 border-accent ring-2 ring-accent/50' : 'border-border'}` // Highlight if video selected
                                }
                        onClick={isClickable ? handleClick : undefined}
                        role={isClickable ? "button" : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        aria-label={
                           hasVideo ? `Cargar video del Módulo ${index + 1}: ${module.title}`
                           : hasExternalLink ? `Abrir contenido externo del Módulo ${index + 1}: ${module.title}`
                           : `Módulo ${index + 1}: ${module.title}`
                        }
                        onKeyDown={handleKeyDown} // Add keyboard accessibility
                      >
                        <div className="flex items-center mb-2 sm:mb-0 flex-1 mr-4"> {/* Added mr-4 for spacing */}
                          {hasVideo ? (
                            <Youtube className="h-5 w-5 mr-3 text-red-600 flex-shrink-0" aria-hidden="true" />
                          ) : hasExternalLink ? (
                             <LinkExternal className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <div className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true"></div> // Placeholder for alignment
                          )}
                          <span className={`text-sm font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                            {`Módulo ${index + 1}: ${module.title}`}
                          </span>
                        </div>

                        {/* Completion Button - Stop propagation to prevent video/link activation */}
                        <div className="flex items-center justify-end space-x-2 flex-shrink-0"> {/* Prevent button from shrinking */}
                          <Button
                            variant={isCompleted ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering li onClick/onKeyDown
                              toggleModuleCompletion(index);
                            }}
                            className={`transition-colors duration-200 ${isCompleted ? 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200' : ''}`}
                            aria-pressed={isCompleted}
                            aria-label={`Marcar Módulo ${index + 1} como ${isCompleted ? 'no completado' : 'completado'}`}
                             // disabled={!user} // Optionally disable if user not logged in
                          >
                            {isCompleted ? (
                              <> <CheckCircle2 className="mr-2 h-4 w-4" /> Completado </>
                            ) : (
                              <> <Circle className="mr-2 h-4 w-4" /> Marcar </>
                            )}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
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
               <p className="text-center text-sm text-muted-foreground">{progressValue}% Completado {mutation.isPending ? "(Guardando...)" : ""}{mutation.isError ? "(Error al guardar)" : ""}</p>
               <Button className="w-full" disabled={progressValue === 100 || mutation.isPending}>
                   {progressValue === 100 ? '¡Curso Completado!' : (mutation.isPending ? 'Guardando Progreso...' : 'Continuar Aprendiendo')}
               </Button>
                {!user && !authLoading && <p className="text-xs text-center text-amber-600 mt-1">Inicia sesión para guardar tu progreso.</p>}
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
                  : `Se muestran los módulos para ${course.title}. ${user ? 'Tu progreso se guarda automáticamente.' : 'Inicia sesión para guardar el progreso.'}`
                }
            </p>
       </div>
    </div>
  );
}
