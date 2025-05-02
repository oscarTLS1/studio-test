import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Expanded data structure with placeholder modules for each area
const lawModules = [
  {
    id: 'constitucional',
    title: 'Derecho Constitucional',
    description: 'Entiende la estructura y los principios fundamentales del gobierno y la constitución.',
    imageUrl: 'https://picsum.photos/400/250?random=20',
    hint: 'constitution law government building',
    modules: ['Introducción', 'Principios Fundamentales', 'Derechos Humanos', 'Control Constitucional'],
  },
  {
    id: 'civil',
    title: 'Derecho Civil',
    description: 'Aborda las relaciones entre particulares: contratos, familia, propiedad y sucesiones.',
    imageUrl: 'https://picsum.photos/400/250?random=21',
    hint: 'family law property contract signing',
    modules: ['Personas y Familia', 'Bienes y Propiedad', 'Obligaciones y Contratos', 'Sucesiones'],
  },
  {
    id: 'penal',
    title: 'Derecho Penal',
    description: 'Estudia las leyes, procedimientos y consecuencias relacionadas con los delitos.',
    imageUrl: 'https://picsum.photos/400/250?random=22',
    hint: 'criminal law gavel handcuffs',
    modules: ['Teoría del Delito', 'Parte General', 'Delitos Específicos', 'Proceso Penal'],
  },
  {
    id: 'procesal',
    title: 'Derecho Procesal',
    description: 'Comprende los procedimientos y trámites legales en las distintas ramas del Derecho.',
    imageUrl: 'https://picsum.photos/400/250?random=23',
    hint: 'legal procedure document flowchart',
    modules: ['Teoría General del Proceso', 'Proceso Civil', 'Proceso Penal', 'Recursos'],
  },
  {
    id: 'laboral',
    title: 'Derecho Laboral',
    description: 'Regula las relaciones entre empleadores y trabajadores, contratos y derechos laborales.',
    imageUrl: 'https://picsum.photos/400/250?random=24',
    hint: 'labor law employees working agreement',
    modules: ['Contrato de Trabajo', 'Derechos y Obligaciones', 'Seguridad Social', 'Derecho Colectivo'],
  },
  {
    id: 'mercantil',
    title: 'Derecho Mercantil',
    description: 'Estudia las leyes que rigen el comercio, las empresas y las sociedades mercantiles.',
    imageUrl: 'https://picsum.photos/400/250?random=25',
    hint: 'commercial law business handshake graph',
    modules: ['Sociedades Mercantiles', 'Títulos de Crédito', 'Contratos Mercantiles', 'Competencia'],
  },
  {
    id: 'administrativo',
    title: 'Derecho Administrativo',
    description: 'Aborda la organización, funcionamiento y control de la administración pública.',
    imageUrl: 'https://picsum.photos/400/250?random=26',
    hint: 'administrative law government office public service',
    modules: ['Acto Administrativo', 'Procedimiento Administrativo', 'Contratación Pública', 'Responsabilidad Estatal'],
  },
  {
    id: 'internacional',
    title: 'Derecho Internacional',
    description: 'Estudia las normas y principios que regulan las relaciones entre Estados y organizaciones.',
    imageUrl: 'https://picsum.photos/400/250?random=27',
    hint: 'international law flags globe handshake',
    modules: ['Fuentes del Derecho Intl.', 'Sujetos del Derecho Intl.', 'Derecho de los Tratados', 'Solución de Controversias'],
  },
  {
    id: 'ambiental',
    title: 'Derecho Ambiental',
    description: 'Se enfoca en las leyes para la protección del medio ambiente y los recursos naturales.',
    imageUrl: 'https://picsum.photos/400/250?random=28',
    hint: 'environmental law nature green energy',
    modules: ['Principios Ambientales', 'Evaluación de Impacto', 'Legislación Específica', 'Responsabilidad Ambiental'],
  },
];

// This page displays the list of all available course modules/areas
export default function CursosPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      {/* Back button moved to the top-left of the content area */}
      <div className="mb-8 flex justify-start"> {/* Container to align button left */}
         <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Inicio
            </Link>
         </Button>
      </div>
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
          Áreas de Práctica y Estudio
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-foreground/80">
          Explora las principales ramas del derecho que abordamos en nuestros servicios y programas formativos. Haz clic en un área para ver los detalles.
        </p>
      </div>
      {/* Updated Grid for Law Modules */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lawModules.map((module) => (
          <Link key={module.id} href={`/cursos/${module.id}`} className="group block">
             <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
               <CardHeader className="p-0">
                 <div className="relative h-48 w-full">
                    <Image
                     src={module.imageUrl}
                     alt={module.title}
                     layout="fill"
                     objectFit="cover"
                     data-ai-hint={module.hint}
                     />
                 </div>
               </CardHeader>
               <CardContent className="flex flex-grow flex-col justify-between p-6">
                 <div>
                   <CardTitle className="mb-2 text-xl font-semibold">{module.title}</CardTitle>
                   <CardDescription className="text-foreground/80">{module.description}</CardDescription>
                   {/* Removed module count and specific details button */}
                  </div>
               </CardContent>
                {/* Optional: Add a footer or remove it */}
                {/*
                <CardFooter className="p-6 pt-0">
                  <span className="text-sm text-primary group-hover:underline">Ver módulos</span>
                </CardFooter>
                */}
             </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
// Added this export to satisfy Next.js convention, though data is static here
export { lawModules };
