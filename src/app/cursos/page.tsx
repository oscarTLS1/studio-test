import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// New data structure for law modules
const lawModules = [
  {
    id: 'constitucional',
    title: 'Derecho Constitucional',
    description: 'Entiende la estructura y los principios fundamentales del gobierno y la constitución.',
    imageUrl: 'https://picsum.photos/400/250?random=20',
    hint: 'constitution law government building',
  },
  {
    id: 'civil',
    title: 'Derecho Civil',
    description: 'Aborda las relaciones entre particulares: contratos, familia, propiedad y sucesiones.',
    imageUrl: 'https://picsum.photos/400/250?random=21',
    hint: 'family law property contract signing',
  },
  {
    id: 'penal',
    title: 'Derecho Penal',
    description: 'Estudia las leyes, procedimientos y consecuencias relacionadas con los delitos.',
    imageUrl: 'https://picsum.photos/400/250?random=22',
    hint: 'criminal law gavel handcuffs',
  },
  {
    id: 'procesal',
    title: 'Derecho Procesal',
    description: 'Comprende los procedimientos y trámites legales en las distintas ramas del Derecho.',
    imageUrl: 'https://picsum.photos/400/250?random=23',
    hint: 'legal procedure document flowchart',
  },
  {
    id: 'laboral',
    title: 'Derecho Laboral',
    description: 'Regula las relaciones entre empleadores y trabajadores, contratos y derechos laborales.',
    imageUrl: 'https://picsum.photos/400/250?random=24',
    hint: 'labor law employees working agreement',
  },
  {
    id: 'mercantil',
    title: 'Derecho Mercantil',
    description: 'Estudia las leyes que rigen el comercio, las empresas y las sociedades mercantiles.',
    imageUrl: 'https://picsum.photos/400/250?random=25',
    hint: 'commercial law business handshake graph',
  },
  {
    id: 'administrativo',
    title: 'Derecho Administrativo',
    description: 'Aborda la organización, funcionamiento y control de la administración pública.',
    imageUrl: 'https://picsum.photos/400/250?random=26',
    hint: 'administrative law government office public service',
  },
  {
    id: 'internacional',
    title: 'Derecho Internacional',
    description: 'Estudia las normas y principios que regulan las relaciones entre Estados y organizaciones.',
    imageUrl: 'https://picsum.photos/400/250?random=27',
    hint: 'international law flags globe handshake',
  },
  {
    id: 'ambiental',
    title: 'Derecho Ambiental',
    description: 'Se enfoca en las leyes para la protección del medio ambiente y los recursos naturales.',
    imageUrl: 'https://picsum.photos/400/250?random=28',
    hint: 'environmental law nature green energy',
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
          Explora las principales ramas del derecho que abordamos en nuestros servicios y programas formativos.
        </p>
      </div>
      {/* Updated Grid for Law Modules */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lawModules.map((module) => (
          <Card key={module.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
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
                {/* Removed module count and specific details button for now */}
               </div>
            </CardContent>
             {/* Optional: Add a generic footer or remove it if not needed for modules */}
             {/*
             <CardFooter className="p-6 pt-0">
               <Button variant="link" className="w-full justify-start p-0">
                  Más información...
               </Button>
             </CardFooter>
             */}
          </Card>
        ))}
      </div>

       {/* Removed the individual course detail sections as they are no longer relevant */}
       {/* The "Ver Todos los Cursos" button from the home page now leads here. */}

    </div>
  );
}
