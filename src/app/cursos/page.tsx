import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Expanded data structure: modules are now objects with title and optional videoUrl
const lawModules = [
  {
    id: 'constitucional',
    title: 'Derecho Constitucional',
    description: 'Entiende la estructura y los principios fundamentales del gobierno y la constitución.',
    imageUrl: 'https://picsum.photos/400/250?random=20',
    hint: 'constitution law government building',
    modules: [
        { title: 'Introducción', videoUrl: 'https://www.youtube.com/watch?v=zY6z2WZ__44' },
        { title: 'Principios Fundamentales' }, // No video example
        { title: 'Derechos Humanos', videoUrl: 'https://www.youtube.com/watch?v=MI9a_7g9JUs' },
        { title: 'Control Constitucional' },
    ],
  },
  {
    id: 'civil',
    title: 'Derecho Civil',
    description: 'Aborda las relaciones entre particulares: contratos, familia, propiedad y sucesiones.',
    imageUrl: 'https://picsum.photos/400/250?random=21',
    hint: 'family law property contract signing',
    modules: [
        { title: 'Personas y Familia', videoUrl: 'https://www.youtube.com/watch?v=abcdef12345' }, // Placeholder URL
        { title: 'Bienes y Propiedad' },
        { title: 'Obligaciones y Contratos', videoUrl: 'https://www.youtube.com/watch?v=ghijkl67890' }, // Placeholder URL
        { title: 'Sucesiones' },
    ],
  },
  {
    id: 'penal',
    title: 'Derecho Penal',
    description: 'Estudia las leyes, procedimientos y consecuencias relacionadas con los delitos.',
    imageUrl: 'https://picsum.photos/400/250?random=22',
    hint: 'criminal law gavel handcuffs',
    modules: [
        { title: 'Teoría del Delito' },
        { title: 'Parte General', videoUrl: 'https://www.youtube.com/watch?v=mnopqrs54321' }, // Placeholder URL
        { title: 'Delitos Específicos' },
        { title: 'Proceso Penal' },
    ],
  },
  {
    id: 'procesal',
    title: 'Derecho Procesal',
    description: 'Comprende los procedimientos y trámites legales en las distintas ramas del Derecho.',
    imageUrl: 'https://picsum.photos/400/250?random=23',
    hint: 'legal procedure document flowchart',
    modules: [
        { title: 'Teoría General del Proceso', videoUrl: 'https://www.youtube.com/watch?v=tuvwxyz98765' }, // Placeholder URL
        { title: 'Proceso Civil' },
        { title: 'Proceso Penal' },
        { title: 'Recursos' },
    ],
  },
  {
    id: 'laboral',
    title: 'Derecho Laboral',
    description: 'Regula las relaciones entre empleadores y trabajadores, contratos y derechos laborales.',
    imageUrl: 'https://picsum.photos/400/250?random=24',
    hint: 'labor law employees working agreement',
     modules: [
        { title: 'Contrato de Trabajo' },
        { title: 'Derechos y Obligaciones' },
        { title: 'Seguridad Social', videoUrl: 'https://www.youtube.com/watch?v=12345abcde' }, // Placeholder URL
        { title: 'Derecho Colectivo' },
     ],
  },
  {
    id: 'mercantil',
    title: 'Derecho Mercantil',
    description: 'Estudia las leyes que rigen el comercio, las empresas y las sociedades mercantiles.',
    imageUrl: 'https://picsum.photos/400/250?random=25',
    hint: 'commercial law business handshake graph',
     modules: [
        { title: 'Sociedades Mercantiles' },
        { title: 'Títulos de Crédito' },
        { title: 'Contratos Mercantiles' },
        { title: 'Competencia', videoUrl: 'https://www.youtube.com/watch?v=67890fghij' }, // Placeholder URL
     ],
  },
  {
    id: 'administrativo',
    title: 'Derecho Administrativo',
    description: 'Aborda la organización, funcionamiento y control de la administración pública.',
    imageUrl: 'https://picsum.photos/400/250?random=26',
    hint: 'administrative law government office public service',
    modules: [
        { title: 'Acto Administrativo', videoUrl: 'https://www.youtube.com/watch?v=klmno54321' }, // Placeholder URL
        { title: 'Procedimiento Administrativo' },
        { title: 'Contratación Pública' },
        { title: 'Responsabilidad Estatal' },
    ],
  },
  {
    id: 'internacional',
    title: 'Derecho Internacional',
    description: 'Estudia las normas y principios que regulan las relaciones entre Estados y organizaciones.',
    imageUrl: 'https://picsum.photos/400/250?random=27',
    hint: 'international law flags globe handshake',
    modules: [
        { title: 'Fuentes del Derecho Intl.' },
        { title: 'Sujetos del Derecho Intl.' },
        { title: 'Derecho de los Tratados', videoUrl: 'https://www.youtube.com/watch?v=pqrst98765' }, // Placeholder URL
        { title: 'Solución de Controversias' },
    ],
  },
  {
    id: 'ambiental',
    title: 'Derecho Ambiental',
    description: 'Se enfoca en las leyes para la protección del medio ambiente y los recursos naturales.',
    imageUrl: 'https://picsum.photos/400/250?random=28',
    hint: 'environmental law nature green energy',
    modules: [
        { title: 'Principios Ambientales' },
        { title: 'Evaluación de Impacto', videoUrl: 'https://www.youtube.com/watch?v=uvwxy12345' }, // Placeholder URL
        { title: 'Legislación Específica' },
        { title: 'Responsabilidad Ambiental' },
    ],
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
