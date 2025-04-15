
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
      'hello@carmenbpm.com'
    );

    console.log('Creating email content...');

    // Construct email content with a professional template
    const emailContent = `
From: Carmen BPM <hello@carmenbpm.com>
To: hello@carmenbpm.com
Subject: New Contact Form Submission from ${name}
Content-Type: text/html; charset=utf-8

<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  
  <div style="background: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Company:</strong> ${company}</p>
  </div>

  <div style="margin-top: 20px;">
    <h3 style="color: #555;">Message:</h3>
    <p style="line-height: 1.6;">${message}</p>
  </div>
</div>
    `.trim();

    console.log('Encoding email...');

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
