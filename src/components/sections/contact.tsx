'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, introduce una dirección de correo electrónico válida.',
  }),
  subject: z.string().min(5, {
    message: 'El asunto debe tener al menos 5 caracteres.',
  }),
  message: z.string().min(10, {
    message: 'El mensaje debe tener al menos 10 caracteres.',
  }),
});

export function ContactSection() {
    const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Placeholder submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate API call
    console.log('Form submitted:', values);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    toast({
      title: "Mensaje Enviado",
      description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
    })
    form.reset(); // Reset form after successful submission
  }

  return (
    <section id="contacto" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Ponte en Contacto
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            ¿Tienes preguntas o necesitas asesoría? Envíanos un mensaje.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary">Información de Contacto</h3>
            <div className="space-y-4 text-foreground/80">
               <div className="flex items-start gap-4">
                 <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                 <div>
                   <h4 className="font-medium text-foreground">Correo Electrónico</h4>
                   <a href="mailto:info@lexconnect.com" className="hover:text-accent">info@lexconnect.com</a>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                 <div>
                   <h4 className="font-medium text-foreground">Teléfono</h4>
                   <a href="tel:+1234567890" className="hover:text-accent">+1 (234) 567-890</a>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                 <div>
                    <h4 className="font-medium text-foreground">Oficina</h4>
                    <p>123 Calle Falsa, Ciudad Ejemplo, CP 12345</p>
                 </div>
               </div>
            </div>
             {/* You can add a map here if needed */}
             {/* <div className="mt-8 h-64 rounded-lg bg-muted"> Map Placeholder </div> */}
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
                <CardDescription>Completa el formulario y te responderemos a la brevedad.</CardDescription>
             </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asunto</FormLabel>
                        <FormControl>
                          <Input placeholder="Motivo de tu consulta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Escribe tu mensaje aquí..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
