import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Expanded data structure: modules are now objects with title and optional videoUrl/externalLink
// Added a real YouTube URL for demonstration purposes.
// Restructured 'civil' to have subCourses.
// Restructured 'laboral' to have subCourses.
const lawModules = [
  {
    id: 'constitucional',
    title: 'Derecho Constitucional',
    description: 'Entiende la estructura y los principios fundamentales del gobierno y la constitución.',
    imageUrl: 'https://picsum.photos/400/250?random=20',
    hint: 'constitution law government building',
    modules: [
        { title: 'Introducción', videoUrl: 'https://www.youtube.com/watch?v=Kzi1LR6k_ak' }, // Example real URL
        { title: 'Principios Fundamentales' }, // No video example
        { title: 'Derechos Humanos', videoUrl: 'https://www.youtube.com/watch?v=MI9a_7g9JUs' },
        { title: 'Control Constitucional' },
    ],
  },
  {
    id: 'civil',
    title: 'Derecho Civil',
    description: 'Aborda las relaciones entre particulares: contratos, familia, propiedad y sucesiones.',
    imageUrl: 'https://picsum.photos/400/250?random=21',
    hint: 'family law property contract signing',
    // 'civil' now lists sub-courses instead of direct modules
    subCourses: [
      {
        id: 'personas-y-familia',
        title: 'Personas y Familia',
        description: 'Conceptos fundamentales sobre la persona, el matrimonio, parentesco y filiación.',
        imageUrl: 'https://picsum.photos/400/250?random=31',
        hint: 'family parents children',
        modules: [
          { title: 'Concepto de Persona', videoUrl: 'https://www.youtube.com/watch?v=civ1_mod1' },
          { title: 'Atributos de la Personalidad', videoUrl: 'https://www.youtube.com/watch?v=civ1_mod2' },
          { title: 'El Matrimonio' },
          { title: 'Parentesco y Filiación' },
        ]
      },
      {
        id: 'bienes-y-propiedad',
        title: 'Bienes y Propiedad',
        description: 'Estudio de los diferentes tipos de bienes y los derechos reales sobre ellos.',
        imageUrl: 'https://picsum.photos/400/250?random=32',
        hint: 'property house keys land',
        modules: [
          { title: 'Clasificación de los Bienes' },
          { title: 'Derecho de Propiedad', videoUrl: 'https://www.youtube.com/watch?v=civ2_mod1' },
          { title: 'Posesión y Usucapión', videoUrl: 'https://www.youtube.com/watch?v=civ2_mod2' },
          { title: 'Derechos Reales de Goce' },
        ]
      },
      {
        id: 'obligaciones-y-contratos',
        title: 'Obligaciones y Contratos',
        description: 'Análisis de las fuentes de las obligaciones y los principales tipos de contratos civiles.',
        imageUrl: 'https://picsum.photos/400/250?random=33',
        hint: 'contract signing document agreement',
        modules: [
          { title: 'Teoría General de las Obligaciones', videoUrl: 'https://www.youtube.com/watch?v=civ3_mod1' },
          { title: 'Fuentes de las Obligaciones' },
          { title: 'Contratos Preparatorios', videoUrl: 'https://www.youtube.com/watch?v=civ3_mod2' },
          { title: 'Contratos Traslativos de Dominio' },
          { title: 'Contratos de Prestación de Servicios' },
        ]
      },
      {
        id: 'sucesiones',
        title: 'Sucesiones',
        description: 'Regulación de la transmisión de bienes y derechos por causa de muerte.',
        imageUrl: 'https://picsum.photos/400/250?random=34',
        hint: 'inheritance will testament family tree',
        modules: [
          { title: 'Sucesión Testamentaria', videoUrl: 'https://www.youtube.com/watch?v=civ4_mod1' },
          { title: 'Sucesión Legítima (Intestada)' },
          { title: 'El Testamento', videoUrl: 'https://www.youtube.com/watch?v=civ4_mod2' },
          { title: 'Albaceas e Interventores' },
        ]
      },
    ]
  },
  {
    id: 'penal',
    title: 'Derecho Penal',
    description: 'Estudia las leyes, procedimientos y consecuencias relacionadas con los delitos.',
    imageUrl: 'https://picsum.photos/400/250?random=22',
    hint: 'criminal law gavel handcuffs',
    modules: [
        { title: 'Teoría del Delito' },
        { title: 'Parte General', videoUrl: 'https://www.youtube.com/watch?v=mnopqrs54321' }, // Placeholder URL
        { title: 'Delitos Específicos' },
        { title: 'Proceso Penal' },
    ],
  },
  {
    id: 'procesal',
    title: 'Derecho Procesal',
    description: 'Comprende los procedimientos y trámites legales en las distintas ramas del Derecho.',
    imageUrl: 'https://picsum.photos/400/250?random=23',
    hint: 'legal procedure document flowchart',
    modules: [
        { title: 'Teoría General del Proceso', videoUrl: 'https://www.youtube.com/watch?v=tuvwxyz98765' }, // Placeholder URL
        { title: 'Proceso Civil' },
        { title: 'Proceso Penal' },
        { title: 'Recursos' },
    ],
  },
  {
    id: 'laboral',
    title: 'Derecho Laboral',
    description: 'Regula las relaciones entre empleadores y trabajadores, contratos y derechos laborales.',
    imageUrl: 'https://picsum.photos/400/250?random=24',
    hint: 'labor law employees working agreement',
    // Restructured 'laboral' to have subCourses
    subCourses: [
        {
            id: 'colectivo',
            title: 'Derecho Colectivo del Trabajo',
            description: 'Estudio de las relaciones sindicales, negociación colectiva y huelga.',
            imageUrl: 'https://picsum.photos/400/250?random=41',
            hint: 'union workers strike negotiation',
            modules: [
                { title: 'Libertad Sindical', videoUrl: 'https://www.youtube.com/watch?v=lab1_mod1' },
                { title: 'Negociación Colectiva' },
                { title: 'Contrato Colectivo', videoUrl: 'https://www.youtube.com/watch?v=lab1_mod2' },
                { title: 'Derecho de Huelga' },
            ]
        },
        {
            id: 'seguridad-social',
            title: 'Derecho y Seguridad Social',
            description: 'Análisis del sistema de seguridad social, pensiones, riesgos laborales y salud.',
            imageUrl: 'https://picsum.photos/400/250?random=42',
            hint: 'social security pension health insurance',
            modules: [
                { title: 'Principios de la Seguridad Social' },
                { title: 'Sistema de Pensiones', videoUrl: 'https://www.youtube.com/watch?v=lab2_mod1' },
                { title: 'Riesgos Laborales (ARL)', videoUrl: 'https://www.youtube.com/watch?v=lab2_mod2' },
                { title: 'Sistema de Salud (EPS)' },
            ]
        },
        {
            id: 'liquidaciones',
            title: 'Liquidaciones Laborales',
            description: 'Cálculo de prestaciones sociales, indemnizaciones y liquidación final del contrato.',
            imageUrl: 'https://picsum.photos/400/250?random=43',
            hint: 'calculator money severance pay',
            modules: [
                { title: 'Conceptos Salariales y Prestacionales' },
                { title: 'Liquidación de Cesantías e Intereses', videoUrl: 'https://www.youtube.com/watch?v=lab3_mod1' },
                { title: 'Prima de Servicios y Vacaciones' },
                { title: 'Indemnizaciones por Despido', videoUrl: 'https://www.youtube.com/watch?v=lab3_mod2' },
            ]
        },
        {
            id: 'procesal-laboral',
            title: 'Derecho Procesal Laboral',
            description: 'Estudio de los procedimientos judiciales en materia laboral y de seguridad social.',
            imageUrl: 'https://picsum.photos/400/250?random=44',
            hint: 'courtroom judge gavel legal process',
            modules: [
                {
                    title: 'Principios Generales y Competencia',
                    videoUrl: 'https://www.youtube.com/watch?v=lab4_mod1',
                    externalLink: 'http://www.secretariasenado.gov.co/senado/basedoc/codigo_procedimental_laboral_pr001.html#1' // Placeholder link
                },
                {
                    title: 'Demanda, Admisión y Notificación',
                    externalLink: 'http://www.secretariasenado.gov.co/senado/basedoc/codigo_procedimental_laboral_pr001.html#25' // Placeholder link
                },
                {
                    title: 'Audiencias (Conciliación, Decisión, Trámite y Juzgamiento)',
                    externalLink: 'http://www.secretariasenado.gov.co/senado/basedoc/codigo_procedimental_laboral_pr002.html#72' // Placeholder link
                },
                {
                    title: 'Régimen Probatorio Laboral',
                    videoUrl: 'https://www.youtube.com/watch?v=lab4_mod2',
                    externalLink: 'http://www.secretariasenado.gov.co/senado/basedoc/codigo_procedimental_laboral_pr001.html#51' // Placeholder link
                },
                {
                    title: 'Recursos (Reposición, Apelación, Súplica, Casación, Revisión)',
                    externalLink: 'http://www.secretariasenado.gov.co/senado/basedoc/codigo_procedimental_laboral_pr002.html#62' // Placeholder link
                },
                {
                    title: 'Procesos Especiales (Fuero Sindical, Huelga)',
                    externalLink: 'http://www.secretariasenado.gov.co/senado/basedoc/codigo_procedimental_laboral_pr003.html#113' // Placeholder link
                },
            ]
        },
    ],
  },
  {
    id: 'mercantil',
    title: 'Derecho Mercantil',
    description: 'Estudia las leyes que rigen el comercio, las empresas y las sociedades mercantiles.',
    imageUrl: 'https://picsum.photos/400/250?random=25',
    hint: 'commercial law business handshake graph',
     modules: [
        { title: 'Sociedades Mercantiles' },
        { title: 'Títulos de Crédito' },
        { title: 'Contratos Mercantiles' },
        { title: 'Competencia', videoUrl: 'https://www.youtube.com/watch?v=67890fghij' }, // Placeholder URL
     ],
  },
  {
    id: 'administrativo',
    title: 'Derecho Administrativo',
    description: 'Aborda la organización, funcionamiento y control de la administración pública.',
    imageUrl: 'https://picsum.photos/400/250?random=26',
    hint: 'administrative law government office public service',
    modules: [
        { title: 'Acto Administrativo', videoUrl: 'https://www.youtube.com/watch?v=klmno54321' }, // Placeholder URL
        { title: 'Procedimiento Administrativo' },
        { title: 'Contratación Pública' },
        { title: 'Responsabilidad Estatal' },
    ],
  },
  {
    id: 'internacional',
    title: 'Derecho Internacional',
    description: 'Estudia las normas y principios que regulan las relaciones entre Estados y organizaciones.',
    imageUrl: 'https://picsum.photos/400/250?random=27',
    hint: 'international law flags globe handshake',
    modules: [
        { title: 'Fuentes del Derecho Intl.' },
        { title: 'Sujetos del Derecho Intl.' },
        { title: 'Derecho de los Tratados', videoUrl: 'https://www.youtube.com/watch?v=pqrst98765' }, // Placeholder URL
        { title: 'Solución de Controversias' },
    ],
  },
  {
    id: 'ambiental',
    title: 'Derecho Ambiental',
    description: 'Se enfoca en las leyes para la protección del medio ambiente y los recursos naturales.',
    imageUrl: 'https://picsum.photos/400/250?random=28',
    hint: 'environmental law nature green energy',
    modules: [
        { title: 'Principios Ambientales' },
        { title: 'Evaluación de Impacto', videoUrl: 'https://www.youtube.com/watch?v=uvwxy12345' }, // Placeholder URL
        { title: 'Legislación Específica' },
        { title: 'Responsabilidad Ambiental' },
    ],
  },
];

// This page displays the list of all available course areas
export default function CursosPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      {/* Back button moved to the top-left of the content area */}
      <div className="mb-8 flex justify-start"> {/* Container to align button left */}
         <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Inicio
            </Link>
         </Button>
      </div>
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
          Áreas de Práctica y Estudio
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-foreground/80">
          Explora las principales ramas del derecho que abordamos en nuestros servicios y programas formativos. Haz clic en un área para ver los detalles.
        </p>
      </div>
      {/* Updated Grid for Law Modules/Areas */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lawModules.map((module) => (
          <Link key={module.id} href={`/cursos/${module.id}`} className="group block">
             <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
               <CardHeader className="p-0">
                 <div className="relative h-48 w-full">
                    <Image
                     src={module.imageUrl}
                     alt={module.title}
                     layout="fill"
                     objectFit="cover"
                     data-ai-hint={module.hint}
                     />
                 </div>
               </CardHeader>
               <CardContent className="flex flex-grow flex-col justify-between p-6">
                 <div>
                   <CardTitle className="mb-2 text-xl font-semibold">{module.title}</CardTitle>
                   <CardDescription className="text-foreground/80">{module.description}</CardDescription>
                   {/* Removed module count and specific details button */}
                  </div>
               </CardContent>
                {/* Optional: Add a footer or remove it */}
                {/*
                <CardFooter className="p-6 pt-0">
                  <span className="text-sm text-primary group-hover:underline">Ver módulos</span>
                </CardFooter>
                */}
             </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
// Added this export to satisfy Next.js convention, though data is static here
export { lawModules };
