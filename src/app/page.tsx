import { HeroSection } from '@/components/sections/hero';
import { CoursesSection } from '@/components/sections/courses';
import { ContactSection } from '@/components/sections/contact';
import { AboutSection } from '@/components/sections/about';

export default function Home() {
  return (
    <>
      <HeroSection />
      
      <CoursesSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
