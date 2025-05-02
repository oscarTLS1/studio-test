'use client'; // Form interactions require Client Component

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use hooks for client components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { lawModules } from '@/app/cursos/page'; // Import placeholder data source

interface Module {
  id: string; // Unique ID for keys
  title: string;
  videoUrl: string;
}

// Placeholder type for Course data
interface CourseData {
    id: string;
    title: string;
    description: string;
    modules: Module[];
}


export default function AdminEditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);

  // Fetch course data based on ID (using placeholder data)
  useEffect(() => {
    setIsLoading(true);
    // TODO: Replace with actual data fetching from database
    const foundCourse = lawModules.find((c) => c.id === courseId); // Use the public data temporarily

    if (foundCourse) {
      const adaptedModules: Module[] = (foundCourse.modules || []).map((m, index) => ({
        id: `${courseId}-module-${index}-${Date.now()}`, // Generate somewhat unique ID for keys
        title: m.title,
        videoUrl: m.videoUrl || '', // Ensure videoUrl is always a string
      }));
      setCourseData({
          id: foundCourse.id,
          title: foundCourse.title,
          description: foundCourse.description,
          modules: adaptedModules, // Use the adapted structure
      });
      setModules(adaptedModules);
    } else {
      // Handle course not found, maybe redirect or show error
      console.error("Course not found with ID:", courseId);
      // Optionally redirect: router.push('/admin/courses');
    }
    setIsLoading(false);
  }, [courseId, router]);


  const addModule = () => {
    setModules([...modules, { id: Date.now().toString(), title: '', videoUrl: '' }]);
  };

  const removeModule = (id: string) => {
    setModules(modules.filter(module => module.id !== id));
  };

  const handleModuleChange = (id: string, field: keyof Module, value: string) => {
    setModules(modules.map(module =>
      module.id === id ? { ...module, [field]: value } : module
    ));
  };

   const handleCourseDetailChange = (field: keyof Omit<CourseData, 'id' | 'modules'>, value: string) => {
      if (courseData) {
         setCourseData({ ...courseData, [field]: value });
      }
   };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement database update logic here
    if (courseData) {
      console.log('Updating course:', { ...courseData, modules });
      // Show success toast/message
      // Optionally redirect: router.push('/admin/courses');
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Cargando datos del curso...</div>;
  }

  if (!courseData) {
    return (
        <div className="text-center py-10">
            <p className="text-destructive mb-4">Curso no encontrado.</p>
            <Button variant="outline" asChild>
                <Link href="/admin/courses">Volver a la lista</Link>
            </Button>
        </div>
    );
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Editar Curso</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Cursos
          </Link>
        </Button>
      </div>

      {/* Course Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Curso</CardTitle>
          <CardDescription>Modifica los detalles principales del curso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseTitle">Título del Curso</Label>
            <Input
              id="courseTitle"
              value={courseData.title}
              onChange={(e) => handleCourseDetailChange('title', e.target.value)}
              placeholder="Ej: Introducción al Derecho Constitucional"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseDescription">Descripción Corta</Label>
            <Textarea
              id="courseDescription"
              value={courseData.description}
              onChange={(e) => handleCourseDetailChange('description', e.target.value)}
              placeholder="Una breve descripción del contenido del curso..."
              rows={3}
              required
            />
          </div>
           {/* Add fields for image URL, category, etc. later */}
        </CardContent>
      </Card>

      {/* Modules Card */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos del Curso</CardTitle>
          <CardDescription>Edita, añade o elimina los módulos de aprendizaje.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.length > 0 && (
             <div className="space-y-4">
                 {modules.map((module, index) => (
                    <div key={module.id} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 border rounded-md bg-muted/30 relative">
                       <div className="flex-grow w-full sm:w-auto space-y-2">
                          <Label htmlFor={`moduleTitle-${module.id}`}>{`Módulo ${index + 1}: Título`}</Label>
                          <Input
                             id={`moduleTitle-${module.id}`}
                             value={module.title}
                             onChange={(e) => handleModuleChange(module.id, 'title', e.target.value)}
                             placeholder="Título del módulo"
                             required
                          />
                       </div>
                        <div className="flex-grow w-full sm:w-auto space-y-2">
                          <Label htmlFor={`moduleVideoUrl-${module.id}`}>URL del Video (YouTube)</Label>
                           <Input
                              id={`moduleVideoUrl-${module.id}`}
                              type="url"
                              value={module.videoUrl}
                              onChange={(e) => handleModuleChange(module.id, 'videoUrl', e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=..."
                           />
                       </div>
                        <Button
                            type="button" // Prevent form submission
                            variant="destructive"
                            size="icon"
                            onClick={() => removeModule(module.id)}
                             className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto sm:self-end h-9 w-9 flex-shrink-0" // Position adjustment
                            aria-label="Eliminar Módulo"
                        >
                             <Trash2 className="h-4 w-4" />
                         </Button>
                    </div>
                 ))}
             </div>
          )}
          <Button type="button" variant="outline" onClick={addModule}>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Módulo
          </Button>
        </CardContent>
         <CardFooter className="flex justify-end">
           <Button type="submit">
               <UploadCloud className="mr-2 h-4 w-4" /> Guardar Cambios
            </Button>
            {/* Add loading/success state later */}
         </CardFooter>
      </Card>

      <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold text-lg mb-2">Funcionalidad Pendiente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Implementar la lógica para actualizar el curso y sus módulos en la base de datos.</li>
                <li>Manejar errores si el curso no se encuentra al cargar.</li>
                <li>Mostrar mensajes de éxito/error al guardar.</li>
                <li>Permitir reordenar módulos.</li>
            </ul>
       </div>
    </form>
  );
}
