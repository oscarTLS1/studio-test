'use client'; // Remains a Client Component

import { useParams, notFound as navigateNotFound } from 'next/navigation'; // Import useParams
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ListChecks, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { lawModules } from '../page'; // Assuming this data source is correct

// Remove the explicit params prop type here, useParams handles it
export default function CourseDetailPage() {
  const params = useParams(); // Use the hook
  const id = params.id as string; // Get the id from the hook's result

  // State for module completion status and progress value
  const [course, setCourse] = useState<typeof lawModules[0] | null | undefined>(undefined); // undefined initial state
  const [completedStatus, setCompletedStatus] = useState<boolean[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

   // Effect to find the course based on id once params are available
   useEffect(() => {
    setIsLoading(true);
    const foundCourse = lawModules.find((module) => module.id === id);
    setCourse(foundCourse); // Set course state
    if (foundCourse) {
        // Initialize completion status based on the found course
        setCompletedStatus(foundCourse.modules?.map(() => false) || []);
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
              <CardDescription>Haz clic en un módulo para marcarlo como completado.</CardDescription>
            </CardHeader>
            <CardContent>
              {course.modules && course.modules.length > 0 ? (
                <ul className="space-y-3">
                  {course.modules.map((moduleTitle, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md transition-colors duration-200 hover:bg-secondary">
                      <span className={`text-sm font-medium ${completedStatus[index] ? 'text-muted-foreground line-through' : ''}`}>
                        {`Módulo ${index + 1}: ${moduleTitle}`}
                      </span>
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
                </CardContent>
            </Card>
        </div>
      </div>

       <div className="mt-16 p-4 border rounded-lg bg-secondary/50 text-center">
            <h3 className="font-semibold text-lg mb-2">Nota de Desarrollo</h3>
            <p className="text-sm text-muted-foreground">
                El progreso del curso ahora es interactivo. El contenido real de cada módulo se implementará en futuras etapas. El estado de completado no se guarda permanentemente (se reinicia al recargar).
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
