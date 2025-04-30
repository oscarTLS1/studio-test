import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Placeholder data for editable sections
const editableSections = [
    { id: 'heroTitle', label: 'Título Principal (Hero)', content: 'Asesoría Legal Confiable y Experta' },
    { id: 'heroSubtitle', label: 'Subtítulo (Hero)', content: 'Protegemos tus derechos y ofrecemos soluciones legales efectivas. Agenda tu consulta gratuita hoy mismo.' },
    { id: 'aboutText', label: 'Texto Quiénes Somos', content: 'LexConnect es una firma de abogados dedicada a brindar asesoría legal integral y personalizada...' },
    // Add more sections as needed
];

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Gestionar Contenido de Texto</h1>
      <p className="text-muted-foreground">
        Modifica los textos que aparecen en las diferentes secciones del sitio web.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Editar Textos</CardTitle>
          <CardDescription>Actualiza el contenido de texto de cada sección. Guarda los cambios al finalizar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {editableSections.map((section) => (
            <div key={section.id} className="space-y-2">
              <Label htmlFor={section.id} className="text-base font-medium">{section.label}</Label>
              <Textarea
                id={section.id}
                defaultValue={section.content}
                rows={section.id.includes('Subtitle') || section.id.includes('Text') ? 4 : 2} // Adjust rows based on expected content length
                className="text-sm"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <Button>Guardar Cambios</Button>
             {/* Add loading/success state later */}
          </div>
        </CardContent>
      </Card>

       <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold text-lg mb-2">Funcionalidad Pendiente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Conectar estos campos a la base de datos para guardar los cambios.</li>
                <li>Implementar la lógica para mostrar estos textos dinámicamente en las páginas públicas.</li>
                 <li>Considerar un editor de texto enriquecido (Rich Text Editor) para más opciones de formato.</li>
                <li>Añadir manejo de errores y confirmaciones de guardado.</li>
            </ul>
       </div>
    </div>
  );
}
