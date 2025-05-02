'use client'; // Header needs client-side interaction for auth state and mobile menu

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Home, BookOpen, Mail, Users, LogIn, LogOut, User } from 'lucide-react'; // Added LogIn, LogOut, User icons
import type { SVGProps } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

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

// Removed Contacto from here
const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/cursos', label: 'Cursos', icon: BookOpen },
  // { href: '/#contacto', label: 'Contacto', icon: Mail }, // Removed from main nav
  { href: '/#quienes-somos', label: 'Quiénes Somos', icon: Users },
];

export function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally redirect to homepage or login page after logout
      router.push('/');
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally show an error toast
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="LexConnect Home">
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
              prefetch={item.href.startsWith('/')}
            >
              {/* No icons in desktop nav for cleaner look, adjust if needed */}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth & Contact Buttons (Desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Contact Button added here */}
           <Button variant="outline" size="sm" asChild>
              <Link href="/#contacto">
                 <Mail className="mr-2 h-4 w-4" /> Contáctenos
              </Link>
           </Button>

          {/* Auth Buttons */}
          {loading ? (
            <Skeleton className="h-9 w-24" /> // Show skeleton while loading auth state
          ) : user ? (
            <>
              {/* Optional: Link to a profile or dashboard page */}
              {/* <Button variant="ghost" size="sm" asChild>
                 <Link href="/profile">
                   <User className="mr-2 h-4 w-4" /> Perfil
                 </Link>
               </Button> */}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
              </Link>
            </Button>
            // Optional: Add a Sign Up button
            // <Button variant="outline" size="sm" asChild>
            //   <Link href="/signup">Crear Cuenta</Link>
            // </Button>
          )}
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
            <Link href="/" className="flex items-center gap-2 mb-8 px-2.5" aria-label="LexConnect Home">
                 <Logo />
                 <span className="text-xl font-bold text-primary">LexConnect</span>
             </Link>
            <nav className="grid gap-6 text-lg font-medium">
              {navItems.map((item) => (
                 <SheetClose asChild key={item.href}>
                     <Link
                        href={item.href}
                        className="flex items-center gap-4 px-2.5 text-foreground/80 hover:text-foreground"
                        prefetch={item.href.startsWith('/')}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                 </SheetClose>
              ))}

               {/* Contact Link - Added separately */}
               <SheetClose asChild>
                   <Link
                      href="/#contacto"
                      className="flex items-center gap-4 px-2.5 text-foreground/80 hover:text-foreground"
                    >
                      <Mail className="h-5 w-5" />
                      Contacto
                  </Link>
               </SheetClose>


               {/* Auth Buttons (Mobile) */}
               <div className="mt-6 border-t pt-6 grid gap-4">
                  {loading ? (
                     <Skeleton className="h-10 w-full" />
                  ) : user ? (
                      <SheetClose asChild>
                         <Button variant="outline" onClick={handleLogout} className="justify-start gap-4 px-2.5">
                           <LogOut className="h-5 w-5" /> Cerrar Sesión
                         </Button>
                      </SheetClose>
                  ) : (
                     <SheetClose asChild>
                         <Button asChild className="justify-start gap-4 px-2.5">
                             <Link href="/login">
                                <LogIn className="h-5 w-5" /> Iniciar Sesión
                             </Link>
                         </Button>
                     </SheetClose>
                     // Optional: Add Sign Up for mobile
                    //  <SheetClose asChild>
                    //      <Button variant="outline" asChild className="justify-start gap-4 px-2.5">
                    //          <Link href="/signup">
                    //              <UserPlus className="h-5 w-5" /> Crear Cuenta
                    //          </Link>
                    //      </Button>
                    //  </SheetClose>
                  )}
               </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
