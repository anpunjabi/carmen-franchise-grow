
import { User, BarChart2, Calendar, LineChart } from 'lucide-react';
import React from 'react';

export interface ModuleCollageData {
  photo: string;
  screenshot: string;
  tagline1: string;
  tagline2: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  collage: ModuleCollageData;
}

export const modules: Module[] = [
  {
    id: "quote-invoice",
    title: "Quote and Invoice Builder",
    description: "Create professional quotes and invoices in minutes with customizable templates.",
    icon: <User className="w-5 h-5" />,
    collage: {
      photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
      screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
      tagline1: "Simple",
      tagline2: "Professional"
    }
  },
  {
    id: "project-tracker",
    title: "Project Tracker",
    description: "Keep projects on schedule and within budget with comprehensive tracking tools.",
    icon: <BarChart2 className="w-5 h-5" />,
    collage: {
      photo: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600&h=400",
      screenshot: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600&h=400",
      tagline1: "Organized",
      tagline2: "Efficient"
    }
  },
  {
    id: "appointment-scheduler",
    title: "Appointment Scheduler",
    description: "Streamline booking with an intelligent scheduling system that integrates with your calendar.",
    icon: <Calendar className="w-5 h-5" />,
    collage: {
      photo: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=600&h=400",
      screenshot: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=600&h=400",
      tagline1: "Seamless",
      tagline2: "Automated"
    }
  },
  {
    id: "pipeline-analytics",
    title: "Pipeline Analytics",
    description: "Gain insights into your sales pipeline with powerful analytics and visualization tools.",
    icon: <LineChart className="w-5 h-5" />,
    collage: {
      photo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400",
      screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400",
      tagline1: "Insightful",
      tagline2: "Strategic"
    }
  }
];
