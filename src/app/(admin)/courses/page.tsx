import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Placeholder data
const placeholderCourses = [
  { id: 1, title: 'Introducción al Derecho Corporativo', modules: 5, published: true },
  { id: 2, title: 'Derecho Laboral para Empleadores', modules: 8, published: true },
  { id: 3, title: 'Protección de Datos Personales', modules: 6, published: false },
];

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
             <h1 className="text-3xl font-bold text-primary">Gestionar Cursos</h1>
             <Button>
                 <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Curso
             </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Lista de Cursos</CardTitle>
                <CardDescription>Aquí puedes ver, editar y eliminar los cursos existentes.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Título del Curso</TableHead>
                        <TableHead className="text-center">Módulos</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {placeholderCourses.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell className="text-center">{course.modules}</TableCell>
                             <TableCell className="text-center">
                                <span className={`px-2 py-1 text-xs rounded ${course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {course.published ? 'Publicado' : 'Borrador'}
                                </span>
                             </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm">Editar</Button>
                                <Button variant="destructive" size="sm">Eliminar</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                 </Table>
                 {/* Add Pagination later */}
            </CardContent>
        </Card>

        <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold text-lg mb-2">Funcionalidad Pendiente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Crear formulario para añadir/editar cursos y módulos.</li>
                <li>Implementar lógica para guardar/actualizar/eliminar cursos en la base de datos.</li>
                <li>Añadir funcionalidad para subir contenido (texto, video) para cada módulo.</li>
                <li>Implementar paginación si la lista de cursos crece.</li>
            </ul>
       </div>
    </div>
  );
}
