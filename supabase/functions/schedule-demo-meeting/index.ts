
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { google } from "npm:googleapis@126.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  name: string;
  email: string;
  company: string;
  message: string;
  appointmentDate: string; // ISO string
}

interface AvailabilitySlotsRequest {
  date: string; // ISO string for the day to check
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const endpoint = pathParts[pathParts.length - 1];

    console.log('Request path:', url.pathname);
    console.log('Determined endpoint:', endpoint);

    // Route for getting available time slots
    if (endpoint === 'get-availability') {
      return await handleGetAvailability(req);
    }

    // Default route for scheduling a meeting
    return await handleScheduleMeeting(req);
  } catch (error) {
    console.error('Error in edge function:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return new Response(
      JSON.stringify({ 
        error: 'An error occurred. Please try again later.',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function handleGetAvailability(req: Request) {
  console.log('Processing availability request');
  
  const requestData = await req.json() as AvailabilitySlotsRequest;
  const { date } = requestData;
  
  if (!date) {
    console.error('Missing required date field');
    return new Response(
      JSON.stringify({ error: 'Date is required' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Initialize Google Calendar client
  const calendar = await initializeGoogleCalendar();
  if (!calendar) {
    console.error('Failed to initialize Google Calendar');
    return new Response(
      JSON.stringify({ error: 'Failed to initialize calendar' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Convert date string to Date object
  const requestDate = new Date(date);
  
  // Set time to start of day in UTC (will convert to EST below)
  requestDate.setUTCHours(0, 0, 0, 0);
  
  // Create start and end time for the day (10am to 7pm EST)
  const startTime = new Date(requestDate);
  startTime.setUTCHours(15, 0, 0, 0);  // 10am EST = 15:00 UTC (during standard time)
  
  const endTime = new Date(requestDate);
  endTime.setUTCHours(24, 0, 0, 0);  // 7pm EST = 24:00 UTC (during standard time)
  
  try {
    console.log('Fetching calendar events from', startTime.toISOString(), 'to', endTime.toISOString());
    
    // Get existing events for the specified date
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Extract busy time slots from events
    const busySlots = events.data.items?.map(event => ({
      start: new Date(event.start?.dateTime || '').toISOString(),
      end: new Date(event.end?.dateTime || '').toISOString(),
    })) || [];

    console.log('Found existing events:', busySlots.length);
    console.log('Busy slots:', JSON.stringify(busySlots));

    // Return the busy slots
    return new Response(
      JSON.stringify({ busySlots }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch calendar events',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleScheduleMeeting(req: Request) {
  const requestData = await req.json();
  console.log('Received request data:', requestData);
  
  const { name, email, company, message, appointmentDate }: BookingRequest = requestData;

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

  console.log('Processing demo booking request:', { name, email, company, appointmentDate });

  // Initialize Google Calendar client
  const calendar = await initializeGoogleCalendar();
  if (!calendar) {
    return new Response(
      JSON.stringify({ error: 'Failed to initialize calendar' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Parse appointment date
  const appointmentDateTime = new Date(appointmentDate);
  
  // Calculate end time (30 minutes after start time)
  const endDateTime = new Date(appointmentDateTime);
  endDateTime.setMinutes(endDateTime.getMinutes() + 30);
  
  // Format for Google Calendar API
  const startTime = appointmentDateTime.toISOString();
  const endTime = endDateTime.toISOString();

  // Create meeting description with user details
  const meetingDescription = `
Demo call with ${name}
Company: ${company}
Email: ${email}
${message ? `Message: ${message}` : ''}
  `.trim();

  // Create the calendar event with Google Meet
  console.log('Creating calendar event...');
  const event = {
    summary: `Carmen BPM Demo Call with ${name} (${company})`,
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

  try {
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
    console.error('Error creating calendar event:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to schedule meeting',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function initializeGoogleCalendar() {
  const privateKey = Deno.env.get('GMAIL_PRIVATE_KEY');
  if (!privateKey) {
    console.error('GMAIL_PRIVATE_KEY environment variable is not set');
    return null;
  }

  try {
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
    return google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('Error initializing Google Calendar:', error);
    return null;
  }
}
