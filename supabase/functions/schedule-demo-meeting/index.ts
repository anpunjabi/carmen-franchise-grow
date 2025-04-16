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
  console.log('Request received:', new Date().toISOString());
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
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
      console.log('Routing to get-availability handler');
      return await handleGetAvailability(req);
    }

    // Default route for scheduling a meeting
    console.log('Routing to schedule meeting handler');
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
  
  try {
    const body = await req.text();
    console.log('Request body:', body);
    
    const requestData = JSON.parse(body) as AvailabilitySlotsRequest;
    console.log('Parsed request data:', requestData);
    
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

    // Initialize Google Calendar client with detailed logging
    console.log('Initializing Google Calendar client');
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

    console.log('Successfully initialized calendar client');

    // Convert date string to Date object
    const requestDate = new Date(date);
    console.log('Request date:', requestDate.toISOString());
    
    // Set time to start of day in UTC
    requestDate.setUTCHours(0, 0, 0, 0);
    
    // Create start and end time for the day (10am to 7pm EST)
    const startTime = new Date(requestDate);
    startTime.setUTCHours(15, 0, 0, 0);  // 10am EST = 15:00 UTC (during standard time)
    
    const endTime = new Date(requestDate);
    endTime.setUTCHours(24, 0, 0, 0);  // 7pm EST = 24:00 UTC (during standard time)
    
    console.log('Fetching calendar events from', startTime.toISOString(), 'to', endTime.toISOString());
    console.log('Using calendar ID:', 'hello@carmenbpm.com');
    
    try {
      // Get existing events for the specified date
      const events = await calendar.events.list({
        calendarId: 'hello@carmenbpm.com', // Explicitly specify the calendar ID
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      console.log('Calendar API response received');
      console.log('Response status:', events.status);
      console.log('Events data:', JSON.stringify(events.data));

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
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

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
  } catch (parseError) {
    console.error('Error parsing request:', parseError);
    return new Response(
      JSON.stringify({ error: 'Invalid request format' }),
      {
        status: 400,
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
  const clientEmail = Deno.env.get('GMAIL_CLIENT_EMAIL');
  
  console.log('Starting Google Calendar initialization');
  console.log('Client email available:', !!clientEmail);
  console.log('Private key available:', !!privateKey);
  
  if (clientEmail) {
    console.log('Using client email:', clientEmail);
  }
  
  if (!privateKey || !clientEmail) {
    console.error('Missing required environment variables:', {
      hasPrivateKey: !!privateKey,
      hasClientEmail: !!clientEmail
    });
    return null;
  }

  try {
    console.log('Creating JWT auth client');
    const formattedKey = privateKey.replace(/\\n/g, '\n');
    console.log('Private key length after formatting:', formattedKey.length);
    
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      formattedKey,
      [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      'hello@carmenbpm.com'
    );

    // Test the authentication
    try {
      console.log('Authorizing with Google...');
      await auth.authorize();
      console.log('Successfully authenticated with Google');
    } catch (authError) {
      console.error('Authentication error:', authError);
      if (authError instanceof Error) {
        console.error('Auth error details:', authError.message);
        console.error('Auth error stack:', authError.stack);
      }
      throw new Error('Failed to authenticate with Google Calendar');
    }

    // Initialize Google Calendar API
    console.log('Initializing calendar API client');
    const calendar = google.calendar({ version: 'v3', auth });
    console.log('Successfully initialized Google Calendar client');
    
    // Test the calendar client with a simple API call
    try {
      console.log('Testing calendar API with a simple call...');
      const calendarList = await calendar.calendarList.list({ maxResults: 1 });
      console.log('Calendar API test successful, found calendars:', calendarList.data.items?.length || 0);
    } catch (calendarError) {
      console.error('Calendar API test failed:', calendarError);
      if (calendarError instanceof Error) {
        console.error('Calendar error details:', calendarError.message);
      }
      // Don't throw here, just log the error
    }
    
    return calendar;
  } catch (error) {
    console.error('Error initializing Google Calendar:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    return null;
  }
}
