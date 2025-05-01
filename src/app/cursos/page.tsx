import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Re-using placeholder data for consistency, fetch real data in a real app
// This data represents all available courses
const coursesData = [
  {
    id: 1,
    title: 'Introducción al Derecho Corporativo',
    description: 'Aprende los fundamentos legales esenciales para la gestión empresarial moderna y la toma de decisiones estratégicas.',
    longDescription: 'Este curso cubre la formación de sociedades, gobierno corporativo, fusiones y adquisiciones, y la regulación de valores. Ideal para empresarios y profesionales legales.',
    imageUrl: 'https://picsum.photos/400/250?random=1',
    hint: 'corporate law books',
    modules: 5,
  },
  {
    id: 2,
    title: 'Derecho Laboral para Empleadores',
    description: 'Navega las complejidades de la legislación laboral y evita contingencias costosas.',
    longDescription: 'Profundiza en contratos laborales, despidos, seguridad social, negociación colectiva y prevención de litigios. Esencial para gerentes de RRHH y dueños de negocios.',
    imageUrl: 'https://picsum.photos/400/250?random=2',
    hint: 'labor law handshake',
    modules: 8,
  },
  {
    id: 3,
    title: 'Protección de Datos Personales',
    description: 'Cumple con la normativa vigente (RGPD, LOPD) y protege la información sensible.',
    longDescription: 'Explora los principios de protección de datos, derechos de los interesados, transferencias internacionales y gestión de brechas de seguridad. Relevante para cualquier organización.',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    hint: 'data privacy shield',
    modules: 6,
  },
   {
    id: 4,
    title: 'Contratación Mercantil Avanzada',
    description: 'Domina la redacción y negociación de contratos comerciales complejos.',
    longDescription: 'Análisis detallado de cláusulas clave, contratos de distribución, agencia, franquicia y resolución de disputas contractuales.',
    imageUrl: 'https://picsum.photos/400/250?random=5',
    hint: 'contract law signing',
    modules: 7,
  },
   {
    id: 5,
    title: 'Propiedad Intelectual en la Era Digital',
    description: 'Protege tus activos intangibles: marcas, patentes y derechos de autor online.',
    longDescription: 'Cubre el registro de marcas, protección de software, licencias de contenido digital, y la lucha contra la piratería en internet.',
    imageUrl: 'https://picsum.photos/400/250?random=6',
    hint: 'intellectual property lightbulb',
    modules: 6,
   },
];

// This page displays the list of all available courses
export default function CursosPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="mb-12 flex flex-col items-center text-center relative">
           {/* Back button placed top-left for easy navigation */}
           <Button variant="outline" size="sm" asChild className="absolute left-0 top-0 mb-4 md:mb-0">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Inicio
              </Link>
           </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl mt-12 md:mt-0">
            Nuestros Cursos Especializados
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-foreground/80">
            Explora nuestra oferta formativa completa. Amplía tus conocimientos legales con programas diseñados e impartidos por expertos en la materia.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coursesData.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
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
                   <p className="mb-3 text-sm text-muted-foreground">{course.modules} Módulos</p>
                  <CardDescription className="text-foreground/80">{course.description}</CardDescription>
                  {/* Uncomment below to show longer description directly on the card */}
                  {/* <p className="mt-4 text-sm text-foreground/70">{course.longDescription}</p> */}
                 </div>
              </CardContent>
               <CardFooter className="p-6 pt-0">
                 {/* In a real app, this button might link to a dedicated course detail page like /cursos/{course.id} */}
                 {/* For now, it scrolls to a section on this page (if such sections exist) */}
                 <Button variant="outline" className="w-full" asChild>
                    <Link href={`/cursos#curso-${course.id}`}> {/* Updated link to be an anchor on the same page */}
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ver Detalles del Curso
                    </Link>
                 </Button>
                </CardFooter>
            </Card>
          ))}
        </div>

         {/* Placeholder sections for individual course details (scrolled to by the buttons above) */}
         <div className="mt-20 space-y-16">
             {coursesData.map(course => (
                <section key={`detail-${course.id}`} id={`curso-${course.id}`} className="scroll-mt-20 p-6 border rounded-lg bg-card shadow-md">
                     {/* Example Detail View Section */}
                     <h3 className="text-2xl font-semibold mb-4 text-primary">{course.title} - Detalles</h3>
                     <p className="text-foreground/90 mb-2">{course.longDescription}</p>
                     <p className="text-muted-foreground">Número de módulos: {course.modules}</p>
                     {/* Add more details like syllabus, instructor info, enrollment button etc. */}
                     <Button className="mt-4">Inscribirse Ahora</Button>
                </section>
             ))}
         </div>
    </div>
  );
}
