'use client'; // Form interactions require Client Component

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';

interface Module {
  id: string; // Use unique ID for keys, e.g., timestamp or UUID
  title: string;
  videoUrl: string; // Added videoUrl field
}

export default function AdminAddCoursePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement database save logic here
    console.log('Saving course:', { title: courseTitle, description: courseDescription, modules });
    // Show success toast/message
    // Redirect back to courses list or show success state
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Añadir Nuevo Curso</h1>
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
          <CardDescription>Define los detalles principales del curso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseTitle">Título del Curso</Label>
            <Input
              id="courseTitle"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Ej: Introducción al Derecho Constitucional"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseDescription">Descripción Corta</Label>
            <Textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
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
          <CardDescription>Añade y organiza los módulos de aprendizaje. Incluye un título y la URL del video de YouTube para cada uno.</CardDescription>
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
               <UploadCloud className="mr-2 h-4 w-4" /> Guardar Curso
            </Button>
            {/* Add loading/success state later */}
         </CardFooter>
      </Card>


      <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold text-lg mb-2">Funcionalidad Pendiente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Implementar la lógica para guardar el curso y sus módulos (incluyendo URL de video) en la base de datos.</li>
                <li>Añadir validación más robusta (e.g., Zod).</li>
                <li>Mostrar mensajes de éxito/error al guardar.</li>
                <li>Considerar la carga de imágenes de portada para el curso.</li>
                <li>Permitir reordenar módulos (drag and drop).</li>
            </ul>
       </div>
    </form>
  );
}
