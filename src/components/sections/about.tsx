import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Scale } from 'lucide-react'; // Using existing icons

export function AboutSection() {
  return (
    <section id="quienes-somos" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-xl md:h-96 lg:h-[500px]">
             <Image
                src="https://picsum.photos/600/500?random=4" // Placeholder image for team/office
                alt="Equipo de LexConnect"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
             />
           </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Quiénes Somos
            </h2>
            <p className="text-lg text-foreground/80">
              LexConnect es una firma de abogados dedicada a brindar asesoría legal integral y personalizada. Nuestro equipo de profesionales altamente calificados está comprometido con la defensa de tus intereses y la búsqueda de soluciones efectivas para tus necesidades legales.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card className="bg-secondary/50">
                 <CardContent className="flex flex-col items-center p-6 text-center">
                    <Target className="mb-3 h-10 w-10 text-accent" />
                    <h3 className="mb-1 text-lg font-semibold text-primary">Nuestra Misión</h3>
                    <p className="text-sm text-muted-foreground">
                      Ofrecer servicios legales de la más alta calidad, basados en la ética, la confianza y la excelencia profesional.
                    </p>
                 </CardContent>
              </Card>
               <Card className="bg-secondary/50">
                 <CardContent className="flex flex-col items-center p-6 text-center">
                    <Scale className="mb-3 h-10 w-10 text-accent" /> {/* Using Scale as a placeholder */}
                    <h3 className="mb-1 text-lg font-semibold text-primary">Nuestros Valores</h3>
                    <p className="text-sm text-muted-foreground">
                      Integridad, compromiso, confidencialidad y orientación al cliente son los pilares de nuestro trabajo diario.
                    </p>
                 </CardContent>
               </Card>
            </div>
             <p className="text-lg text-foreground/80">
                Con años de experiencia en diversas áreas del derecho, estamos preparados para acompañarte en cada paso del proceso legal.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}
