
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { google } from "npm:googleapis@126.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const gmail = google.gmail('v1');

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, message }: ContactFormData = await req.json();

    // Create JWT client using service account credentials
    const auth = new google.auth.JWT(
      Deno.env.get('GMAIL_CLIENT_EMAIL'),
      undefined,
      Deno.env.get('GMAIL_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/gmail.send'],
      'hello@carmenbpm.com' // The email address you're sending on behalf of
    );

    // Construct email content
    const emailContent = `
From: Carmen BPM <hello@carmenbpm.com>
To: hello@carmenbpm.com
Subject: New Contact Form Submission from ${name}

Name: ${name}
Email: ${email}
Company: ${company}

Message:
${message}
    `.trim();

    // Encode the email content
    const encodedEmail = Buffer.from(emailContent).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    console.log('Sending email...');

    // Send the email using Gmail API
    const response = await gmail.users.messages.send({
      auth,
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log('Email sent successfully:', response.data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email. Please try again later.',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
