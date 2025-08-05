import { Button } from '@/components/ui/button';
import { Grid3X3, LayoutGrid, Columns3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingSection from '@/components/BookingSection';

const Demo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden pt-20 md:pt-24" id="hero">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-orange-200/30 blur-xl"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-red-200/30 blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-amber-200/40 blur-lg"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="max-w-2xl">
              <p className="text-lg font-medium text-amber-700 mb-4 tracking-wide">
                Introducing Carmen
              </p>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                The world's first<br />
                <span className="text-amber-600">AI fitness</span><br />
                franchise platform
              </h1>

              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-lg">
                Transform your fitness business with AI-powered insights, automated operations, and data-driven growth strategies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('book-appointment')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Your Franchise
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-80 h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-black rounded-t-[2.5rem] flex items-center justify-between px-8">
                      <span className="text-white text-sm font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-6 h-3 bg-white rounded-sm"></div>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="pt-16 p-6 h-full bg-gradient-to-b from-amber-50 to-orange-50">
                      {/* Chat Bubbles */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm ml-8">
                          <p className="text-gray-800 text-sm font-medium">Hey Carmen, how's my franchise performance looking?</p>
                        </div>
                        
                        <div className="bg-amber-600 text-white rounded-2xl rounded-tl-md p-4 shadow-sm mr-8">
                          <p className="text-sm">Great question! Your revenue is up 23% this month. Your member retention rate is excellent at 94%.</p>
                        </div>
                        
                        <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm ml-8">
                          <p className="text-gray-800 text-sm">What should I focus on next?</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <div className="flex justify-around">
                            <div className="flex flex-col items-center p-2">
                              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mb-1">
                                <span className="text-amber-600 text-xs">📊</span>
                              </div>
                              <span className="text-xs text-gray-600">Analytics</span>
                            </div>
                            <div className="flex flex-col items-center p-2">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                                <span className="text-orange-600 text-xs">💡</span>
                              </div>
                              <span className="text-xs text-gray-600">Insights</span>
                            </div>
                            <div className="flex flex-col items-center p-2">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-1">
                                <span className="text-red-600 text-xs">🎯</span>
                              </div>
                              <span className="text-xs text-gray-600">Goals</span>
                            </div>
                            <div className="flex flex-col items-center p-2">
                              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mb-1">
                                <span className="text-amber-600 text-xs">💰</span>
                              </div>
                              <span className="text-xs text-gray-600">Revenue</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+23%</div>
                    <div className="text-xs text-gray-600">Revenue Growth</div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-4 bg-white rounded-2xl p-4 shadow-lg animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                    <div className="text-xs text-gray-600">Retention Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-600 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-carmen-sky/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-carmen-soft-teal/10 blur-3xl rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-carmen-navy mb-4">
              Powerful Features, {' '}
              <span className="bg-carmen-gradient bg-clip-text text-transparent">
                Limitless Flexibility
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carmen combines powerful BPM capabilities with unprecedented flexibility,
              allowing you to create a solution that works exactly how you need it to.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="bg-carmen-sand rounded-3xl p-6 shadow-soft border border-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex-1">
              <div className="rounded-full bg-white w-14 h-14 flex items-center justify-center mb-4 shadow-sm">
                <Grid3X3 size={24} className="text-carmen-blue" />
              </div>
              <h3 className="text-xl font-semibold text-carmen-navy mb-2">
                Modular Architecture
              </h3>
              <p className="text-gray-600">
                Add only the modules you need, when you need them, avoiding bloated software.
              </p>
            </div>

            <div className="bg-carmen-sand rounded-3xl p-6 shadow-soft border border-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex-1">
              <div className="rounded-full bg-white w-14 h-14 flex items-center justify-center mb-4 shadow-sm">
                <LayoutGrid size={24} className="text-carmen-blue" />
              </div>
              <h3 className="text-xl font-semibold text-carmen-navy mb-2">
                Fully Customizable
              </h3>
              <p className="text-gray-600">
                Tailor the workflow engine to match your exact business processes and requirements.
              </p>
            </div>

            <div className="bg-carmen-sand rounded-3xl p-6 shadow-soft border border-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex-1">
              <div className="rounded-full bg-white w-14 h-14 flex items-center justify-center mb-4 shadow-sm">
                <Columns3 size={24} className="text-carmen-blue" />
              </div>
              <h3 className="text-xl font-semibold text-carmen-navy mb-2">
                AI-Powered Configuration
              </h3>
              <p className="text-gray-600">
                Use our AI chat to effortlessly customize Carmen to fit your business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <BookingSection />

      <Footer />
    </div>
  );
};

export default Demo;