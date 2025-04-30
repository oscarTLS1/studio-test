import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Image as ImageIcon, Video, Trash2 } from 'lucide-react';
import Image from 'next/image'; // Using next/image for placeholders

// Placeholder media data
const placeholderMedia = [
  { id: 1, name: 'hero-background.jpg', type: 'image', url: 'https://picsum.photos/100/60?random=10' },
  { id: 2, name: 'curso-intro.mp4', type: 'video', url: 'https://via.placeholder.com/100x60.png?text=Video+Thumb' },
  { id: 3, name: 'team-photo.png', type: 'image', url: 'https://picsum.photos/100/60?random=11' },
  { id: 4, name: 'course-module1.jpg', type: 'image', url: 'https://picsum.photos/100/60?random=12' },
];


export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
             <h1 className="text-3xl font-bold text-primary">Gestionar Media</h1>
        </div>

        {/* Upload Section */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UploadCloud className="h-5 w-5 text-accent" />Subir Nuevos Archivos</CardTitle>
                <CardDescription>Selecciona imágenes o videos para subir al servidor.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="media-upload">Archivo</Label>
                    <Input id="media-upload" type="file" multiple /> {/* Allow multiple files */}
                 </div>
                 <Button className="mt-4">Subir Archivos</Button>
                  {/* Add progress indicator later */}
            </CardContent>
        </Card>


        {/* Media Library Section */}
        <Card>
            <CardHeader>
                <CardTitle>Biblioteca de Media</CardTitle>
                <CardDescription>Archivos subidos disponibles para usar en el sitio.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {placeholderMedia.map((media) => (
                         <div key={media.id} className="relative group border rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-muted">
                            {media.type === 'image' ? (
                                <Image src={media.url} alt={media.name} layout="fill" objectFit="cover" />
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <Video className="h-8 w-8 mb-1" />
                                     <span className="text-xs px-1 text-center break-all">{media.name}</span>
                                </div>
                            )}
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                                {/* Add copy URL button later */}
                            </div>
                         </div>
                    ))}
                 </div>
                 {/* Add Pagination later */}
            </CardContent>
        </Card>

        <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold text-lg mb-2">Funcionalidad Pendiente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Implementar lógica de subida de archivos (ej. a Firebase Storage).</li>
                <li>Mostrar miniaturas reales para videos.</li>
                <li>Implementar la eliminación de archivos (incluyendo del almacenamiento).</li>
                <li>Conectar la biblioteca de media para seleccionar archivos en cursos y contenido.</li>
                 <li>Añadir paginación o carga infinita para la biblioteca.</li>
                 <li>Mostrar indicadores de progreso durante la subida.</li>
            </ul>
       </div>
    </div>
  );
}
