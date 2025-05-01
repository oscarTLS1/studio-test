'use server';

import { Resend } from 'resend';
import { z } from 'zod';

// Define the schema for input validation, matching the client-side form schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('Por favor, introduce una dirección de correo electrónico válida.'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres.'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres.'),
});

// Type alias for validated form data
type ContactFormData = z.infer<typeof contactFormSchema>;

// Ensure environment variables are set
if (!process.env.RESEND_API_KEY) {
    console.error("Error: RESEND_API_KEY environment variable is not set.");
}
if (!process.env.EMAIL_TO) {
    console.error("Error: EMAIL_TO environment variable is not set. Using fallback.");
}
if (!process.env.EMAIL_FROM) {
    console.error("Error: EMAIL_FROM environment variable is not set. Using fallback.");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const emailTo = process.env.EMAIL_TO || 'oscarjaviersierrasanchez@gmail.com'; // Fallback recipient
const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev'; // Fallback sender (Resend default)

/**
 * Server action to send contact form data via email using Resend.
 * Validates input and handles email sending.
 *
 * Requires environment variables:
 * - RESEND_API_KEY: Your Resend API key.
 * - EMAIL_TO: The email address to send the contact form submissions to.
 * - EMAIL_FROM: The 'From' address for the email (must be a domain verified with Resend).
 */
export async function sendContactEmail(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  // Validate input data against the schema
  const validatedFields = contactFormSchema.safeParse(formData);

  // If validation fails, return an error
  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      error: 'Datos inválidos. Por favor, revisa el formulario.',
      // Consider returning specific field errors if needed:
      // error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  // Check if essential environment variables are missing after the initial check
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_TO || !process.env.EMAIL_FROM) {
    const missingVars = [
      !process.env.RESEND_API_KEY && "RESEND_API_KEY",
      !process.env.EMAIL_TO && "EMAIL_TO",
      !process.env.EMAIL_FROM && "EMAIL_FROM",
    ].filter(Boolean).join(", ");
    console.error(`Email configuration error: Missing environment variables: ${missingVars}`);
    return { success: false, error: 'Error de configuración del servidor. No se pudo enviar el correo.' };
  }


  try {
    const { data, error } = await resend.emails.send({
      from: `Contacto LexConnect <${emailFrom}>`, // Use the configured 'from' address
      to: [emailTo], // Send to the configured recipient
      subject: `Nuevo Mensaje de Contacto: ${subject}`,
      reply_to: email, // Set the sender's email as the reply-to address
      html: `
        <h1>Nuevo Mensaje de Contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <hr>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error: 'Error al enviar el correo. Inténtalo de nuevo más tarde.' };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (e) {
    console.error('Error sending email:', e);
     // Check if it's a known Resend error type if needed for more specific messages
    if (e instanceof Error) {
        return { success: false, error: `Error del servidor: ${e.message}` };
    }
    return { success: false, error: 'Ocurrió un error inesperado al enviar el correo.' };
  }
}

/**
 * NOTE TO USER:
 * To make this work, you need to:
 * 1. Install the `resend` package: `npm install resend` (already added to package.json).
 * 2. Sign up for Resend (https://resend.com/) and get an API key.
 * 3. Verify a domain with Resend to use as the 'From' address.
 * 4. Create a `.env.local` file in the root of your project (if it doesn't exist).
 * 5. Add the following environment variables to your `.env.local` file:
 *
 *    RESEND_API_KEY=your_resend_api_key
 *    EMAIL_TO=oscarjaviersierrasanchez@gmail.com
 *    EMAIL_FROM=your_verified_email@yourdomain.com  # Replace with your verified Resend domain email
 *
 * 6. Restart your development server (`npm run dev`) after adding the .env.local file.
 */
