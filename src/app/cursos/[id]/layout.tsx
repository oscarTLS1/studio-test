import type { Metadata } from 'next';

// Optionally, you could generate dynamic metadata here based on the course ID
export const metadata: Metadata = {
  title: 'Detalle del Curso - LexConnect', // Generic title, can be improved
  description: 'Aprende más sobre esta área del derecho.',
};

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Simple layout, passes children through
}
