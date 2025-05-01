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

// --- Configuration Check ---
// Check if environment variables are set during server startup/build.
// Note: This check runs when the module is loaded, not on every request.
let configError = false;
if (!process.env.RESEND_API_KEY) {
    console.error("❌ ERROR: RESEND_API_KEY environment variable is not set.");
    configError = true;
}
if (!process.env.EMAIL_TO) {
    console.error("⚠️ WARNING: EMAIL_TO environment variable is not set. Using fallback: oscarjaviersierrasanchez@gmail.com");
    // No configError = true here, as we have a fallback
}
if (!process.env.EMAIL_FROM) {
    console.error("❌ ERROR: EMAIL_FROM environment variable is not set. This must be a verified domain email from Resend (e.g., no-reply@yourdomain.com).");
     configError = true;
} else if (process.env.EMAIL_FROM === 'onboarding@resend.dev') {
    console.warn("⚠️ WARNING: Using default EMAIL_FROM 'onboarding@resend.dev'. Ensure this is intended and allowed by Resend for your use case.");
}

// Only instantiate Resend if the API key is potentially available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const emailTo = process.env.EMAIL_TO || 'oscarjaviersierrasanchez@gmail.com'; // Fallback recipient
const emailFrom = process.env.EMAIL_FROM; // No fallback here, it must be set and verified

/**
 * Server action to send contact form data via email using Resend.
 * Validates input and handles email sending.
 *
 * Potential reasons for "Error al Enviar":
 * 1. Missing `.env.local` file or incorrect variables within it.
 * 2. `RESEND_API_KEY` is missing, invalid, or expired.
 * 3. `EMAIL_FROM` is missing or uses a domain *not verified* in your Resend account.
 * 4. `EMAIL_TO` is invalid (less likely with the fallback).
 * 5. Resend service outage or temporary API issues.
 * 6. Network connectivity problems on the server.
 * 7. Server environment doesn't have access to the environment variables.
 *
 * Check your server logs for more detailed error messages from Resend.
 */
export async function sendContactEmail(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  console.log('sendContactEmail action triggered.'); // Log entry point

  // 1. Validate Input Data
  const validatedFields = contactFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      error: 'Datos inválidos. Por favor, revisa el formulario.',
    };
  }
  console.log('Form data validated successfully.');

  // 2. Check Runtime Configuration
  if (!resend || !emailFrom) {
    const missingVars = [
      !resend && "RESEND_API_KEY (missing or invalid)",
      !emailFrom && "EMAIL_FROM (missing or unverified domain)",
    ].filter(Boolean).join(", ");
    console.error(`❌ Email configuration error at runtime: Missing or invalid: ${missingVars}`);
    return { success: false, error: 'Error de configuración del servidor [Code: CFG]. No se pudo enviar el correo.' };
  }
  console.log(`Sending email via Resend: From <${emailFrom}> To <${emailTo}>`);


  // 3. Attempt to Send Email
  const { name, email, subject, message } = validatedFields.data;
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

    // 4. Handle Resend Response
    if (error) {
      // Log the detailed error from Resend on the server
      console.error('❌ Resend API Error:', error);

      // Provide a generic error to the client, but potentially log a specific code
      // You could map common Resend error codes to user-friendlier messages if desired
      let clientErrorMessage = 'Error al enviar el correo [Code: RESEND]. Inténtalo de nuevo más tarde.';
      // Example: Customize message based on error type (check Resend's error structure)
      // if (error.name === 'validation_error') {
      //    clientErrorMessage = 'Error de validación con el servicio de correo. Contacta al soporte.';
      // }

      return { success: false, error: clientErrorMessage };
    }

    console.log('✅ Email sent successfully via Resend. ID:', data?.id);
    return { success: true };

  } catch (e) {
     // 5. Handle Unexpected Errors (Network issues, etc.)
    console.error('❌ Unexpected error sending email:', e);
    let errorMessage = 'Ocurrió un error inesperado al enviar el correo [Code: UNEXPECTED].';
    if (e instanceof Error) {
        // You could add more specific checks here if needed
        // errorMessage = `Error del servidor: ${e.message}`; // Avoid sending raw error messages to client
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * NOTE TO USER / DEVELOPER:
 * Ensure your environment variables are correctly set up in a `.env.local` file:
 *
 * RESEND_API_KEY=re_****************************     # Get from Resend Dashboard -> API Keys
 * EMAIL_TO=oscarjaviersierrasanchez@gmail.com       # Recipient address
 * EMAIL_FROM=tu_email_verificado@tudominio.com    # MUST be an email from a domain VERIFIED in Resend Dashboard -> Domains
 *
 * VERY IMPORTANT: The `EMAIL_FROM` domain *must* be verified with Resend, otherwise emails will fail.
 * Restart your development server (`npm run dev`) after creating or modifying the `.env.local` file.
 * Check the server console logs for detailed error messages if sending fails.
 */
