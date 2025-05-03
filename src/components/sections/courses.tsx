
'use client'; // Required for useRef and Autoplay plugin

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay'; // Import Autoplay plugin
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel components

// Data structure for law areas (remains the same)
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

export function CoursesSection() {
   // Add Autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <section id="cursos" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Cursos Especializados
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Amplía tus conocimientos legales con nuestros cursos diseñados por expertos.
          </p>
        </div>

        {/* Carousel Implementation */}
        <Carousel
          plugins={[plugin.current]} // Apply autoplay plugin
          className="w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto" // Adjust max width as needed
          opts={{
            align: "start",
            loop: true, // Enable looping
          }}
        >
          <CarouselContent className="-ml-4">
            {lawModules.map((course) => ( // Map through all modules for looping carousel
              <CarouselItem key={course.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full"> {/* Added padding and height */}
                  <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint={course.hint}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col justify-between p-6">
                      <div>
                        <CardTitle className="mb-2 text-xl font-semibold">{course.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{course.description}</CardDescription>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/cursos/${course.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Ver Detalles del Curso
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
           {/* Optional: Add indicators if desired (requires manual implementation or another library) */}
        </Carousel>

        {/* "Ver Todos los Cursos" button remains */}
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/cursos">
              Ver Todos los Cursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
