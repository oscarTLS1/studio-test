import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// Removed GeistMono import as it was causing issues and might not be needed
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider


const geistSans = GeistSans;


export const metadata: Metadata = {
  title: 'LexConnect - Inicio', // Updated title for the root layout (homepage)
  description: 'Ofrecemos servicios legales profesionales y cursos especializados.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} scroll-smooth`}>
       {/* Removed geistMono variable from className */}
      <body className={`antialiased flex flex-col min-h-screen`}>
        <AuthProvider> {/* Wrap the entire application with AuthProvider */}
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
