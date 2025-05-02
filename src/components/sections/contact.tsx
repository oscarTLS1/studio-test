
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser'; // Import EmailJS

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
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, introduce una dirección de correo electrónico válida.',
  }),
  phone: z.string().min(7, { // Added phone field
    message: 'El teléfono debe tener al menos 7 dígitos.',
  }).regex(/^[0-9+\-\s()]*$/, { // Basic regex for digits, +, -, spaces, ()
      message: 'Por favor, introduce un número de teléfono válido.',
  }),
  subject: z.string().min(5, {
    message: 'El asunto debe tener al menos 5 caracteres.',
  }),
  message: z.string().min(10, {
    message: 'El mensaje debe tener al menos 10 caracteres.',
  }),
});

// --- EmailJS Configuration Check ---
// Check if environment variables are set client-side.
// This check runs when the script is loaded, but the UI feedback depends on the component mounting.
let emailJsConfigError = false;
if (typeof window !== 'undefined') { // Only run this check on the client
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
        console.error("❌ ERROR: NEXT_PUBLIC_EMAILJS_SERVICE_ID environment variable is not set.");
        emailJsConfigError = true;
    }
    if (!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
        console.error("❌ ERROR: NEXT_PUBLIC_EMAILJS_TEMPLATE_ID environment variable is not set. Remember to set the template in the .env.local file");
        emailJsConfigError = true;
    }
    if (!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
        console.error("❌ ERROR: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY environment variable is not set.");
        emailJsConfigError = true;
    }
}


export function ContactSection() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClient, setIsClient] = useState(false); // State to track client-side mount

    useEffect(() => {
      setIsClient(true); // Set to true once component mounts on the client
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: '',
        email: '',
        phone: '', // Added default value for phone
        subject: '',
        message: '',
        },
    });

    // Updated submit handler to use EmailJS on the client-side
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        // Runtime check for configuration (only on client)
        if (isClient && emailJsConfigError) {
            console.error('❌ EmailJS configuration error detected client-side.');
            toast({
                title: "Error de Configuración",
                description: "Faltan variables para el envío de correos [Code: EMAILJS_CFG]. Contacta al administrador.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

        // Prepare template parameters matching your EmailJS template
        // This object includes all the form fields to be sent in the email.
        // Ensure your EmailJS template uses these variable names (e.g., {{from_name}}, {{from_email}}, etc.)
        // **IMPORTANT**: You MUST add {{phone}} to your EmailJS template for the phone number to appear.
        const templateParams = {
            from_name: values.name, // Client's name
            from_email: values.email, // Client's email
            phone: values.phone, // Client's phone number (NEW)
            subject: values.subject, // Email subject line
            message: values.message, // Client's message content
            // The recipient email can be set here or preferably in the EmailJS template settings
            to_email: 'sierrasanchezoscarjavier@gmail.com'
        };

        // Log the parameters being sent to EmailJS for debugging
        console.log('Attempting to send email with params:', templateParams);

        try {
            // Use emailjs.send with public key
            const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log('EmailJS Success:', response.status, response.text);

            toast({
              title: "Mensaje Enviado",
              description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
            });
            form.reset(); // Reset form fields after successful submission

        } catch (error: any) {
            console.error('EmailJS Error encountered:', error);

            let errorDescription = "No se pudo enviar el mensaje [Code: EMAILJS_SEND]. Inténtalo de nuevo más tarde.";
            if (error?.status && typeof error?.text === 'string') {
                 // Specific API error from EmailJS
                 errorDescription = `Error ${error.status}: ${error.text} [Code: EMAILJS_API]. Verifica la configuración de EmailJS (IDs, Clave Pública, Plantilla, Destinatario y Límites de Uso). Asegúrate que tu plantilla usa las variables correctas: {{from_name}}, {{from_email}}, {{phone}}, {{subject}}, {{message}}.`;
                 console.error(`EmailJS API Error Details: Status=${error.status}, Text=${error.text}`);
            } else if (error instanceof Error) {
                 // General JavaScript error
                 errorDescription = `Error: ${error.message} [Code: EMAILJS_CLIENT]. Revisa la consola del navegador para más detalles.`;
            } else {
                 // Unknown error structure
                 errorDescription = `Ocurrió un error inesperado [Code: EMAILJS_UNKNOWN]. Revisa la consola del navegador.`;
                 console.error("Unknown EmailJS error structure:", error);
            }

            toast({
                title: "Error al Enviar",
                description: errorDescription,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
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

            {/* Developer Note: Show config error only after component has mounted on client */}
            {isClient && emailJsConfigError && (
                 <div className="mb-8 p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive text-center">
                    <p className="font-semibold">¡Atención Desarrollador!</p>
                    <p className="text-sm">Las variables de entorno de EmailJS (<code>NEXT_PUBLIC_EMAILJS_...</code>) no están configuradas correctamente en tu <code>.env.local</code>. El formulario de contacto no funcionará.</p>
                    <p className="text-sm mt-1">Asegúrate de obtenerlas de tu dashboard de EmailJS y reiniciar el servidor de desarrollo.</p>
                 </div>
            )}


            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-primary">Información de Contacto</h3>
                <div className="space-y-4 text-foreground/80">
                <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                    <div>
                    <h4 className="font-medium text-foreground">Correo Electrónico</h4>
                    {/* Make sure this email matches the one configured in EmailJS if not using template {{to_email}} */}
                    <a href="mailto:sierrasanchezoscarjavier@gmail.com" className="hover:text-accent">sierrasanchezoscarjavier@gmail.com</a>
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
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                            <Input type="tel" placeholder="Tu número de teléfono" {...field} />
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
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting || (isClient && emailJsConfigError)} // Disable if submitting or config error
                        >
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
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

/**
 * NOTE TO USER / DEVELOPER using EmailJS:
 *
 * 1.  **Sign up for EmailJS:** Go to https://www.emailjs.com/ and create an account.
 * 2.  **Add an Email Service:** Connect your email provider (e.g., Gmail, Outlook) in the EmailJS dashboard under "Email Services".
 * 3.  **Create an Email Template:**
 *     *   Go to "Email Templates" and create a new template.
 *     *   **Important:** Define the variables you want to receive from the form. This code now sends `from_name`, `from_email`, `phone`, `subject`, and `message`. Make sure your template uses these exact names within double curly braces `{{variable_name}}`.
 *     *   Example Template Body (Make sure this matches what you need):
 *         ```text
 *         Nuevo mensaje de contacto de: {{from_name}}
 *         Email: {{from_email}}
 *         Teléfono: {{phone}}
 *
 *         Asunto: {{subject}}
 *
 *         Mensaje:
 *         {{message}}
 *         ```
 *     *   In the template settings on EmailJS, set the **Recipient Email Address** to `sierrasanchezoscarjavier@gmail.com` (or use the `{{to_email}}` variable if you prefer setting it in the code, though setting it in the template is often simpler).
 * 4.  **Get Your IDs and Key:**
 *     *   Find your **Service ID** on the "Email Services" page.
 *     *   Find your **Template ID** on the "Email Templates" page (the one you just created/configured).
 *     *   Find your **Public Key** (User ID) under "Account" -> "API Keys".
 * 5.  **Configure Environment Variables:**
 *     *   Create a `.env.local` file in the root of your project (if it doesn't exist).
 *     *   Add the following lines, replacing the placeholder values with the actual IDs and Key from EmailJS:
 *       ```.env.local
 *       NEXT_PUBLIC_EMAILJS_SERVICE_ID="YOUR_SERVICE_ID"
 *       NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="YOUR_TEMPLATE_ID"
 *       NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="YOUR_PUBLIC_KEY"
 *       ```
 *     *   **Crucially:** Prefixing with `NEXT_PUBLIC_` makes these variables accessible in the browser (client-side). Do NOT store private keys here.
 * 6.  **Restart Your Development Server:** Run `npm run dev` or `yarn dev` again to load the new environment variables.
 * 7.  **Check EmailJS Account Limits:** Free accounts have monthly sending limits. Ensure you haven't exceeded them. Check the EmailJS dashboard.
 */

    