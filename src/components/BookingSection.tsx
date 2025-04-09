
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Check } from 'lucide-react';
import { format, addDays, setHours, setMinutes, isAfter, isBefore, addWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

type TimeSlot = {
  hour: number;
  minute: number;
  formatted: string;
};

const BookingSection = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate time slots between 9am and 5pm
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of [0, 30]) {
        slots.push({
          hour,
          minute,
          formatted: `${hour % 12 || 12}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSelectDate = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTimeSlot(null);
    if (newDate) {
      setStep(2);
    }
  };

  const handleSelectTime = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTimeSlot || !name || !email) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Create appointment datetime
    const appointmentDate = new Date(date);
    appointmentDate.setHours(selectedTimeSlot.hour);
    appointmentDate.setMinutes(selectedTimeSlot.minute);

    try {
      // To be implemented in the next step
      // This is where we'll call the Supabase Edge Function
      
      toast({
        title: "Booking request submitted!",
        description: "We'll contact you to confirm your appointment soon.",
      });
      
      // Reset form
      setDate(undefined);
      setSelectedTimeSlot(null);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Something went wrong",
        description: "Unable to submit your booking request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if a date should be disabled (weekends or past dates)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    return isBefore(date, today) || isWeekend;
  };

  return (
    <section className="py-16 bg-white" id="book-appointment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-carmen-navy mb-4">Book a Demo</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule a 30-minute call with a Carmen team member to see how our BPM solution can help your business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-carmen-cream rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-carmen-navy">
                  {step === 1 ? 'Select a Date' : step === 2 ? 'Choose a Time' : 'Your Information'}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-2", 
                    step >= 1 ? "bg-carmen-teal text-white" : "bg-gray-200")}>1</span>
                  <span className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-2", 
                    step >= 2 ? "bg-carmen-teal text-white" : "bg-gray-200")}>2</span>
                  <span className={cn("w-8 h-8 rounded-full flex items-center justify-center", 
                    step >= 3 ? "bg-carmen-teal text-white" : "bg-gray-200")}>3</span>
                </div>
              </div>
              
              {step === 1 && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
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
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
                    {timeSlots.map((slot, idx) => (
                      <Button
                        key={idx}
                        variant={selectedTimeSlot?.formatted === slot.formatted ? "default" : "outline"}
                        className={cn(
                          selectedTimeSlot?.formatted === slot.formatted 
                            ? "bg-carmen-teal hover:bg-carmen-teal/90" 
                            : "hover:bg-carmen-teal/10 hover:text-carmen-teal"
                        )}
                        onClick={() => handleSelectTime(slot)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {slot.formatted}
                      </Button>
                    ))}
                  </div>
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="(123) 456-7890"
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
                    {isSubmitting ? "Submitting..." : "Book Appointment"}
                  </Button>
                </form>
              ) : (
                <div className="h-full flex flex-col justify-center items-center p-8 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="mb-4 text-carmen-teal">
                    <CalendarIcon className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-carmen-navy mb-2">Schedule Your Demo</h3>
                  <p className="text-gray-600 mb-4">
                    Select a date and time that works for you, and our team will guide you through how Carmen can transform your business processes.
                  </p>
                  {step === 1 ? (
                    <p className="text-carmen-teal font-medium">Please select a date to continue</p>
                  ) : (
                    <p className="text-carmen-teal font-medium">Please select a time slot to continue</p>
                  )}
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
