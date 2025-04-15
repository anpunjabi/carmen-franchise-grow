
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { google } from "npm:googleapis@126.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  appointmentDate: string; // ISO string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Received request data:', requestData);
    
    const { name, email, phone, message, appointmentDate }: BookingRequest = requestData;

    if (!name || !email || !appointmentDate) {
      console.error('Missing required fields:', { name, email, appointmentDate });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Processing demo booking request:', { name, email, appointmentDate });

    // Create JWT client using service account credentials
    const privateKey = Deno.env.get('GMAIL_PRIVATE_KEY');
    if (!privateKey) {
      console.error('GMAIL_PRIVATE_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const auth = new google.auth.JWT(
      Deno.env.get('GMAIL_CLIENT_EMAIL'),
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      'hello@carmenbpm.com'
    );

    // Initialize Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Parse appointment date
    const appointmentDateTime = new Date(appointmentDate);
    
    // Calculate end time (30 minutes after start time)
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);
    
    // Format for Google Calendar API
    const startTime = appointmentDateTime.toISOString();
    const endTime = endDateTime.toISOString();

    console.log('Appointment time details:', {
      appointmentDate,
      parsedDate: appointmentDateTime,
      startTime,
      endTime
    });

    // Create meeting description with user details
    const meetingDescription = `
Demo call with ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${message ? `Message: ${message}` : ''}
    `.trim();

    // Create the calendar event with Google Meet
    console.log('Creating calendar event...');
    const event = {
      summary: `Carmen BPM Demo Call with ${name}`,
      location: 'Google Meet',
      description: meetingDescription,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      attendees: [
        { email: email },
        { email: 'hello@carmenbpm.com' }
      ],
      // Add Google Meet conferencing
      conferenceData: {
        createRequest: {
          requestId: `demo-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 * 24 }, // 1 day before
          { method: 'popup', minutes: 10 }, // 10 minutes before
        ],
      },
    };

    // Insert the event to the calendar with conferenceDataVersion=1 to enable Google Meet
    const calendarResponse = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
      sendUpdates: 'all', // Send emails to all attendees
    });

    console.log('Calendar event created successfully:', calendarResponse.data);

    // Return the success response with the meeting details
    return new Response(
      JSON.stringify({
        success: true,
        meeting: {
          id: calendarResponse.data.id,
          link: calendarResponse.data.hangoutLink,
          startTime,
          endTime,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error scheduling demo meeting:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to schedule demo meeting. Please try again later.',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
