import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="inicio" className="relative w-full py-20 md:py-32 lg:py-40 bg-secondary overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://picsum.photos/1920/1080?grayscale&blur=2" // Placeholder image
        alt="Fondo legal abstracto"
        layout="fill"
        objectFit="cover"
        quality={80}
        className="absolute inset-0 z-0 opacity-20"
        priority // Load image early
      />
       {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/80 to-secondary z-10"></div>

      <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          Asesoría Legal Confiable y Experta
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80 md:text-xl lg:text-2xl max-w-3xl mx-auto">
          Protegemos tus derechos y ofrecemos soluciones legales efectivas. Agenda tu consulta gratuita hoy mismo.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="#contacto">Obtener Consulta Gratis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="#quienes-somos">Conocer Más</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
