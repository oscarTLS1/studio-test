import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, BookOpen, Mail, Users, Scale } from 'lucide-react';
import type { SVGProps } from 'react';

// Placeholder Logo Component
const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-8 w-8 text-primary"
    {...props}
  >
    <path d="M12 1.5a2.25 2.25 0 0 0-2.25 2.25v.386a10.47 10.47 0 0 0-8.51 3.768 1.5 1.5 0 0 0-.19 1.817l.007.01 2.67 4.502a3 3 0 0 0 2.54 1.452H9V18a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-2.316h.733a3 3 0 0 0 2.54-1.452l2.67-4.502.007-.01a1.5 1.5 0 0 0-.19-1.817 10.47 10.47 0 0 0-8.51-3.768V3.75A2.25 2.25 0 0 0 12 1.5Zm0 4.5a7.47 7.47 0 0 1 6.24 3.32L17.1 11.25H6.9L5.76 9.32A7.47 7.47 0 0 1 12 6Zm-3 7.5h6v2.25a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 15.75V13.5Z" />
  </svg>
);


const navItems = [
  { href: '#inicio', label: 'Inicio', icon: Home },
  { href: '#cursos', label: 'Cursos', icon: BookOpen },
  { href: '#contacto', label: 'Contacto', icon: Mail },
  { href: '#quienes-somos', label: 'Quiénes Somos', icon: Users },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#inicio" className="flex items-center gap-2" aria-label="LexConnect Home">
          <Logo />
          <span className="text-xl font-bold text-primary">LexConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
              prefetch={false}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button (Desktop) */}
        <div className="hidden md:block">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#contacto">Consulta Gratis</Link>
          </Button>
        </div>


        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="grid gap-6 text-lg font-medium mt-8">
              {navItems.map((item) => (
                 <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 px-2.5 text-foreground/80 hover:text-foreground"
                    prefetch={false}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
              ))}
               <Button asChild size="lg" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                 <Link href="#contacto">Consulta Gratis</Link>
                </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
