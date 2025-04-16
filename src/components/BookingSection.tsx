import { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Clock, Check, Wrench, Star, Mail, Loader2, AlertCircle } from 'lucide-react';
import { format, addDays, setHours, setMinutes, isAfter, isBefore, addWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import EditableText from './EditableText';
import { supabase } from '@/integrations/supabase/client';

type TimeSlot = {
  hour: number;
  minute: number;
  formatted: string;
  available: boolean;
};

type BusySlot = {
  start: string;
  end: string;
};

const BookingSection = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const generateTimeSlots = (selectedDate: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    for (let hour = 10; hour < 19; hour++) {
      for (let minute of [0, 30]) {
        slots.push({
          hour,
          minute,
          formatted: `${hour % 12 || 12}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`,
          available: true
        });
      }
    }
    
    return slots;
  };

  const fetchAvailability = useCallback(async (selectedDate: Date) => {
    if (!selectedDate) return;
    
    setIsLoadingSlots(true);
    setAvailabilityError(null);
    setDebugInfo(null);
    
    try {
      console.log('Fetching availability for:', selectedDate.toISOString());
      
      const baseSlots = generateTimeSlots(selectedDate);
      setTimeSlots(baseSlots);
      
      const { data, error } = await supabase.functions.invoke('schedule-demo-meeting/get-availability', {
        body: { date: selectedDate.toISOString() }
      });
      
      if (error) {
        console.error('Error fetching availability from edge function:', error);
        throw new Error(`Error from server: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from server');
      }
      
      console.log('Availability response:', data);
      setDebugInfo(JSON.stringify(data, null, 2));
      
      if (data.busySlots && Array.isArray(data.busySlots)) {
        setBusySlots(data.busySlots);
        
        const updatedSlots = markUnavailableSlots(baseSlots, data.busySlots, selectedDate);
        setTimeSlots(updatedSlots);
        
        console.log('Updated time slots:', updatedSlots);
      } else {
        console.warn('Unexpected response format:', data);
        
        if (data.error || data.details) {
          setDebugInfo(`Server error: ${data.error || ''} - ${data.details || ''}`);
          throw new Error(data.error || 'Unexpected response format from server');
        }
      }
    } catch (error) {
      console.error('Error in fetchAvailability:', error);
      setAvailabilityError(error instanceof Error ? error.message : 'Failed to fetch availability');
      
      setTimeSlots(prevSlots => 
        prevSlots.map(slot => ({ ...slot, available: false }))
      );
      
      toast({
        title: "Error",
        description: "Could not fetch availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSlots(false);
      setIsRetrying(false);
    }
  }, [toast]);

  const markUnavailableSlots = (slots: TimeSlot[], busySlots: BusySlot[], selectedDate: Date): TimeSlot[] => {
    return slots.map(slot => {
      const slotStart = new Date(selectedDate);
      slotStart.setHours(slot.hour, slot.minute, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + 30);
      
      const isOverlapping = busySlots.some(busySlot => {
        const busyStart = new Date(busySlot.start);
        const busyEnd = new Date(busySlot.end);
        
        return (
          (slotStart >= busyStart && slotStart < busyEnd) || 
          (slotEnd > busyStart && slotEnd <= busyEnd) || 
          (slotStart <= busyStart && slotEnd >= busyEnd)
        );
      });
      
      return {
        ...slot,
        available: !isOverlapping
      };
    });
  };

  useEffect(() => {
    if (date) {
      fetchAvailability(date);
    }
  }, [date, fetchAvailability]);

  const handleSelectDate = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTimeSlot(null);
    setAvailabilityError(null);
    if (newDate) {
      setStep(2);
    }
  };

  const handleSelectTime = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedTimeSlot(slot);
    setStep(3);
  };

  const handleRetryAvailability = () => {
    if (!date) return;
    setIsRetrying(true);
    fetchAvailability(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTimeSlot || !name || !email || !company) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(selectedTimeSlot.hour);
      appointmentDateTime.setMinutes(selectedTimeSlot.minute);
      
      console.log('Scheduling demo meeting with date:', appointmentDateTime.toISOString());
      
      const { data, error } = await supabase.functions.invoke('schedule-demo-meeting', {
        body: {
          name,
          email,
          company,
          message,
          appointmentDate: appointmentDateTime.toISOString(),
        },
      });

      if (error) {
        console.error('Error calling schedule-demo-meeting:', error);
        throw error;
      }
      
      console.log('Meeting scheduled:', data);
      
      if (data.meeting?.link) {
        setMeetingLink(data.meeting.link);
      }
      
      toast({
        title: "Booking confirmed!",
        description: "Your demo session has been scheduled. Check your email for the calendar invitation.",
      });
      
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
      setStep(4);
    } catch (error) {
      console.error('Error scheduling demo meeting:', error);
      toast({
        title: "Booking failed",
        description: "There was an error scheduling your meeting. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return isBefore(date, today);
  };

  const ConfirmationView = () => (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-carmen-teal/10 text-carmen-teal rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-carmen-navy mb-2">Your demo is scheduled!</h3>
      <p className="text-gray-600 mb-4">
        We've sent a calendar invitation to your email. You'll receive a Google Meet link to join at your scheduled time.
      </p>
      {meetingLink && (
        <div className="p-4 bg-carmen-cream rounded-lg mb-4">
          <p className="font-medium text-carmen-navy mb-2">Google Meet Link:</p>
          <a 
            href={meetingLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-carmen-teal hover:underline break-all"
          >
            {meetingLink}
          </a>
        </div>
      )}
      <Button 
        onClick={() => {
          setDate(undefined);
          setSelectedTimeSlot(null);
          setStep(1);
          setMeetingLink(null);
        }}
        className="bg-carmen-gradient mt-4"
      >
        Book Another Demo
      </Button>
    </div>
  );

  return (
    <section className="py-16 bg-white" id="book-appointment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <EditableText id="booking-title" as="h2" className="text-3xl md:text-4xl font-bold text-carmen-navy mb-4">
            Book a Demo
          </EditableText>
          <EditableText id="booking-description" as="p" className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule a 30-minute call with a Carmen team member to see how our BPM solution can help your business.
          </EditableText>
        </div>

        <div className="max-w-4xl mx-auto bg-carmen-cream rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-carmen-navy">
                  {step === 1 ? 'Select a Date' : 
                   step === 2 ? 'Choose a Time' : 
                   step === 3 ? 'Your Information' :
                   'Confirmation'}
                </h3>
                {step < 4 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-2", 
                      step >= 1 ? "bg-carmen-teal text-white" : "bg-gray-200")}>1</span>
                    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-2", 
                      step >= 2 ? "bg-carmen-teal text-white" : "bg-gray-200")}>2</span>
                    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center", 
                      step >= 3 ? "bg-carmen-teal text-white" : "bg-gray-200")}>3</span>
                  </div>
                )}
              </div>
              
              {step === 1 && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-carmen-teal font-medium mb-4">Please select a date to continue</p>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelectDate}
                    disabled={isDateDisabled}
                    fromDate={new Date()}
                    toDate={addWeeks(new Date(), 4)}
                    className="pointer-events-auto"
                  />
                </div>
              )}
              
              {step === 2 && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="mb-4 flex items-center text-carmen-navy">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    <span>{date && format(date, 'EEEE, MMMM d, yyyy')}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStep(1)}
                      className="ml-auto text-carmen-teal hover:text-carmen-navy"
                    >
                      Change
                    </Button>
                  </div>
                  <p className="text-carmen-teal font-medium mb-4">Please select a time slot to continue</p>
                  
                  {availabilityError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Could not fetch calendar availability.
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={handleRetryAvailability}
                          disabled={isRetrying || isLoadingSlots}
                          className="ml-2 mt-2"
                        >
                          {isRetrying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Retrying...
                            </>
                          ) : (
                            'Try Again'
                          )}
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {debugInfo && (
                    <div className="text-xs bg-gray-100 p-2 mb-4 rounded overflow-auto max-h-32">
                      <pre>{debugInfo}</pre>
                    </div>
                  )}
                  
                  {isLoadingSlots ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-carmen-teal" />
                      <span className="ml-2 text-carmen-teal">Loading available times...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
                      {timeSlots.map((slot, idx) => (
                        <Button
                          key={idx}
                          variant={selectedTimeSlot?.formatted === slot.formatted ? "default" : "outline"}
                          className={cn(
                            selectedTimeSlot?.formatted === slot.formatted 
                              ? "bg-carmen-teal hover:bg-carmen-teal/90" 
                              : slot.available 
                                ? "hover:bg-carmen-teal/10 hover:text-carmen-teal" 
                                : "opacity-50 cursor-not-allowed bg-gray-100 hover:bg-gray-100"
                          )}
                          onClick={() => slot.available && handleSelectTime(slot)}
                          disabled={!slot.available}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.formatted}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {step === 3 && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="mb-4 flex items-center text-carmen-navy">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    <span>{date && format(date, 'EEEE, MMMM d, yyyy')}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStep(1)}
                      className="ml-auto text-carmen-teal hover:text-carmen-navy"
                    >
                      Change
                    </Button>
                  </div>
                  <div className="mb-6 flex items-center text-carmen-navy">
                    <Clock className="mr-2 h-5 w-5" />
                    <span>{selectedTimeSlot?.formatted}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStep(2)}
                      className="ml-auto text-carmen-teal hover:text-carmen-navy"
                    >
                      Change
                    </Button>
                  </div>
                  <div className="p-3 bg-carmen-cream rounded-lg mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-carmen-teal mr-2" />
                      30 minute consultation call
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Check className="h-4 w-4 text-carmen-teal mr-2" />
                      Google Meet link provided
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Check className="h-4 w-4 text-carmen-teal mr-2" />
                      Calendar invitation sent to your email
                    </div>
                  </div>
                </div>
              )}
              
              {step === 4 && <ConfirmationView />}
            </div>

            <div className="md:w-1/2">
              {step === 3 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input 
                      id="company" 
                      type="text" 
                      value={company} 
                      onChange={(e) => setCompany(e.target.value)} 
                      placeholder="Your company"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">What would you like to discuss?</Label>
                    <textarea 
                      id="message"
                      className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      placeholder="Brief description of your business needs..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-carmen-gradient hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : "Book Appointment"}
                  </Button>
                </form>
              ) : step === 4 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-carmen-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-10 w-10 text-carmen-teal" />
                    </div>
                    <h3 className="text-xl font-semibold text-carmen-navy mb-2">Check Your Email</h3>
                    <p className="text-gray-600">
                      We've sent you a calendar invitation with all the details for your demo session.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <EditableText id="booking-what-to-expect" as="h3" className="text-xl font-semibold text-carmen-navy mb-4">
                    What to Expect
                  </EditableText>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-carmen-cream p-2 rounded-full mr-3">
                        <Clock className="h-5 w-5 text-carmen-teal" />
                      </div>
                      <div>
                        <EditableText id="booking-demo-title" as="h4" className="font-medium text-carmen-navy">
                          Personalized 30-Minute Demo
                        </EditableText>
                        <EditableText id="booking-demo-description" as="p" className="text-gray-600 text-sm">
                          We'll tailor the presentation to your specific industry and needs.
                        </EditableText>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-carmen-cream p-2 rounded-full mr-3">
                        <Wrench className="h-5 w-5 text-carmen-teal" />
                      </div>
                      <div>
                        <EditableText id="booking-customization-title" as="h4" className="font-medium text-carmen-navy">
                          Free Customization
                        </EditableText>
                        <EditableText id="booking-customization-description" as="p" className="text-gray-600 text-sm">
                          We'll fine tune Carmen to your business needs within 48 hours.
                        </EditableText>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-carmen-cream p-2 rounded-full mr-3">
                        <Star className="h-5 w-5 text-carmen-teal" />
                      </div>
                      <div>
                        <EditableText id="booking-trial-title" as="h4" className="font-medium text-carmen-navy">
                          Free Trial
                        </EditableText>
                        <EditableText id="booking-trial-description" as="p" className="text-gray-600 text-sm">
                          Test out Carmen for a month - we're sure you'll love working with her.
                        </EditableText>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
