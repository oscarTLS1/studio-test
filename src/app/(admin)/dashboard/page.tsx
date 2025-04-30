import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, FileText, Image as ImageIcon, Video } from 'lucide-react';


export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
      <p className="text-muted-foreground">
        Bienvenido al panel de administración. Desde aquí puedes gestionar el contenido del sitio web.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              Gestionar Cursos
            </CardTitle>
            <CardDescription>Añade, edita o elimina cursos y sus módulos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
                <Link href="/admin/courses">Ir a Cursos</Link>
            </Button>
             {/* Placeholder Content */}
             <p className="mt-4 text-sm text-muted-foreground">Número de cursos: 3 (Ejemplo)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Gestionar Contenido
            </CardTitle>
            <CardDescription>Edita textos en las diferentes secciones de la web.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild variant="outline">
                <Link href="/admin/content">Ir a Contenido</Link>
             </Button>
              {/* Placeholder Content */}
              <p className="mt-4 text-sm text-muted-foreground">Secciones editables: 4 (Ejemplo)</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-accent" /> <Video className="h-5 w-5 text-accent" />
                Gestionar Media
             </CardTitle>
            <CardDescription>Sube y administra imágenes y videos para el sitio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
                <Link href="/admin/media">Ir a Media</Link>
             </Button>
             {/* Placeholder Content */}
             <p className="mt-4 text-sm text-muted-foreground">Archivos subidos: 15 (Ejemplo)</p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold text-lg mb-2">Próximos Pasos</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Implementar autenticación para proteger esta área.</li>
                <li>Conectar a una base de datos (ej. Firestore) para guardar los datos.</li>
                <li>Crear formularios para subir/editar cursos, textos, imágenes y videos.</li>
                <li>Modificar las páginas públicas para que muestren el contenido dinámico.</li>
            </ul>
       </div>
    </div>
  );
}
