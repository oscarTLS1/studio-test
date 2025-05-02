import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Settings, BookOpen, Video, Image as ImageIcon, FileText } from 'lucide-react'; // Added relevant icons

export const metadata: Metadata = {
  title: 'Admin - LexConnect',
  description: 'Panel de administración para LexConnect',
};

// Simple Admin Header
function AdminHeader() {
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
           {/* Add logout button later */}
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
                    <span>Cursos</span> {/* This now correctly links to the courses list */}
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
  return (
     // Note: Authentication/Authorization should wrap this layout in a real app
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
