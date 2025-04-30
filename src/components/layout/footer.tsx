import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-6 text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 text-sm md:flex-row md:px-6">
        <p>&copy; {currentYear} LexConnect. Todos los derechos reservados.</p>
        <nav className="mt-2 flex gap-4 md:mt-0">
          <Link href="#" className="hover:text-foreground">
            Política de Privacidad
          </Link>
          <Link href="#" className="hover:text-foreground">
            Términos de Servicio
          </Link>
        </nav>
      </div>
    </footer>
  );
}
