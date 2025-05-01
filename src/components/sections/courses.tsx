import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Sample data - in a real app, this would come from a database/CMS
const coursesData = [
  {
    id: 1,
    title: 'Introducción al Derecho Corporativo',
    description: 'Aprende los fundamentos legales esenciales para la gestión empresarial.',
    imageUrl: 'https://picsum.photos/400/250?random=1',
    hint: 'law study',
  },
  {
    id: 2,
    title: 'Derecho Laboral para Empleadores',
    description: 'Navega las complejidades de la legislación laboral y evita contingencias.',
    imageUrl: 'https://picsum.photos/400/250?random=2',
    hint: 'legal documents',
  },
  {
    id: 3,
    title: 'Protección de Datos Personales',
    description: 'Cumple con la normativa vigente y protege la información sensible.',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    hint: 'data privacy lock',
  },
];

export function CoursesSection() {
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coursesData.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
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
                    {/* This button now links to the main /cursos page */}
                    <Link href="/cursos">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ver Detalles del Curso
                    </Link>
                 </Button>
                </CardFooter>
            </Card>
          ))}
        </div>
         <div className="mt-12 text-center">
             {/* This button correctly links to the /cursos page which lists all courses */}
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
