'use client'; // Required for hooks like useRouter and useContext

import type { Metadata } from 'next'; // Metadata type is fine, but generation might need server context
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Settings, BookOpen, Video, Image as ImageIcon, FileText, LogOut } from 'lucide-react'; // Added LogOut icon
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Metadata setup - Keep it simple for client component or move to a parent Server Component if needed
// export const metadata: Metadata = {
//   title: 'Admin - LexConnect',
//   description: 'Panel de administración para LexConnect',
// };

// Simple Admin Header with Logout
function AdminHeader() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally show an error toast to the user
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2" aria-label="Admin Dashboard">
          {/* Placeholder Logo or Text */}
          <span className="text-xl font-bold text-primary">Admin Panel</span>
        </Link>
        <nav className="flex items-center gap-4">
           <Button variant="outline" size="sm" asChild>
             <Link href="/">Ver Sitio Público</Link>
            </Button>
           {/* Logout button */}
           {!loading && user && (
             <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
             </Button>
           )}
           {loading && <Skeleton className="h-9 w-24" />}
        </nav>
      </div>
    </header>
  );
}

// Simple Admin Sidebar (Placeholder)
function AdminSidebar() {
    return (
        <aside className="w-64 border-r bg-muted/40 p-4 hidden md:block">
            <nav className="flex flex-col gap-2">
                <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/admin/courses" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                    <BookOpen className="h-4 w-4" />
                    <span>Cursos</span>
                </Link>
                <Link href="/admin/content" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                    <FileText className="h-4 w-4" />
                    <span>Contenido Texto</span>
                </Link>
                 <Link href="/admin/media" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                    <ImageIcon className="h-4 w-4" />
                    <span>Imágenes</span>
                </Link>
                 <Link href="/admin/media" className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                    <Video className="h-4 w-4" />
                    <span>Videos</span>
                </Link>
                 <Link href="/admin/settings" className="flex items-center gap-2 p-2 rounded hover:bg-muted mt-auto">
                     <Settings className="h-4 w-4" />
                     <span>Configuración</span>
                 </Link>

            </nav>
        </aside>
    );
}


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user is logged in, redirect to login page
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While loading, show a simple loading state (or a more elaborate skeleton)
  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Verificando autenticación...</p>
             {/* You could add a spinner here */}
        </div>
    );
  }

  // If user is not logged in (after loading), children won't be rendered due to redirect
  // If user is logged in, render the layout
  if (user) {
    return (
        <div className="flex min-h-screen flex-col">
            <AdminHeader />
             <div className="flex flex-1">
                 <AdminSidebar />
                 <main className="flex-1 p-6 md:p-8 lg:p-10">
                    {children}
                 </main>
             </div>
        </div>
      );
  }

  // Fallback in case redirect hasn't happened yet (or if needed for stricter checks)
  return null; // Or a minimal layout indicating redirection
}
