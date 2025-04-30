import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Configuración</h1>
      <p className="text-muted-foreground">
        Ajusta la configuración general del sitio y del panel de administración.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Configuración General del Sitio</CardTitle>
          <CardDescription>Ajustes que afectan la parte pública del sitio web.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Nombre del Sitio</Label>
            <Input id="siteName" defaultValue="LexConnect - Servicios Legales" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de Contacto Principal</Label>
            <Input id="contactEmail" type="email" defaultValue="info@lexconnect.com" />
          </div>
          <div className="space-y-2">
             <Label htmlFor="contactPhone">Teléfono de Contacto Principal</Label>
             <Input id="contactPhone" type="tel" defaultValue="+1 (234) 567-890" />
           </div>
           {/* Add more settings like address, social media links etc. */}
           <div className="flex items-center space-x-2">
             <Checkbox id="maintenanceMode" />
             <Label htmlFor="maintenanceMode">Activar Modo Mantenimiento</Label>
           </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Configuración del Administrador</CardTitle>
           <CardDescription>Ajustes específicos del panel de administración.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="adminEmail">Email del Administrador</Label>
                <Input id="adminEmail" type="email" defaultValue="admin@lexconnect.com" disabled /> {/* Usually non-editable here */}
            </div>
             {/* Add password change functionality later */}
             {/* Add notification preferences later */}
        </CardContent>
      </Card>


      <div className="flex justify-end">
        <Button>Guardar Configuración</Button>
        {/* Add loading/success state later */}
      </div>

       <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
            <h3 className="font-semibold text-lg mb-2">Funcionalidad Pendiente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Conectar estos campos a una base de datos o archivo de configuración.</li>
                <li>Implementar la lógica para que el sitio use estos valores.</li>
                <li>Añadir validación a los campos.</li>
                <li>Implementar funcionalidad de cambio de contraseña segura.</li>
                 <li>Integrar el modo mantenimiento en el sitio público.</li>
            </ul>
       </div>
    </div>
  );
}
