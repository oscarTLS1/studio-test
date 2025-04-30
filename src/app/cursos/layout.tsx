import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos - LexConnect',
  description: 'Explora nuestros cursos legales especializados.',
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Simple layout, just passes children through
}