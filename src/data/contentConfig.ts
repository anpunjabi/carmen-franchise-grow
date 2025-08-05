import { Module } from './moduleData';
import { modules } from './moduleData';

export interface ContentConfig {
  texts: Record<string, string>;
  sections: {
    visibility: Record<string, boolean>;
    order: Record<string, number>;
  };
  modules: Module[];
  images: Record<string, string>;
  meta: {
    version: string;
    lastUpdated: string;
  };
}

export const defaultContentConfig: ContentConfig = {
  texts: {
    // Hero section texts
    "hero-headline": "Transform Your Business with AI-Powered Solutions",
    "hero-intro": "Discover how artificial intelligence can streamline your operations, boost productivity, and drive growth.",
    "hero-description": "Our comprehensive AI platform offers cutting-edge tools designed for modern businesses. From automation to analytics, we provide everything you need to stay ahead in today's competitive landscape.",
    
    // Features section
    "features-title": "Powerful Features",
    "features-subtitle": "Everything you need to succeed",
    
    // Modules section
    "modules-title": "Our Modules",
    "modules-subtitle": "Choose the tools that fit your business",
    
    // Footer texts
    "footer-tagline": "Building the future with AI",
    "footer-copyright": "© 2024 Your Company. All rights reserved.",
    
    // Navigation
    "nav-home": "Home",
    "nav-features": "Features",
    "nav-modules": "Modules",
    "nav-contact": "Contact",
    
    // Call to action texts
    "cta-primary": "Get Started",
    "cta-secondary": "Learn More",
    "cta-demo": "Schedule Demo",
  },
  
  sections: {
    visibility: {
      "hero": true,
      "hero-secondary": false,
      "hero-tertiary": false,
      "hero-quaternary": false,
      "hero-quinary": false,
      "hero-sixth": false,
      "features": true,
      "modules": true,
      "partnerships": true,
      "footer": true,
    },
    order: {
      "hero": 1,
      "hero-secondary": 2,
      "hero-tertiary": 3,
      "hero-quaternary": 4,
      "hero-quinary": 5,
      "hero-sixth": 6,
      "features": 7,
      "modules": 8,
      "partnerships": 9,
      "footer": 10,
    }
  },
  
  modules: modules,
  
  images: {
    "hero-main": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600",
    "logo": "/carmen-logo.png",
    "placeholder": "/placeholder.svg",
  },
  
  meta: {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
  }
};

// Runtime storage for edits (in-memory only)
let runtimeConfig: ContentConfig = JSON.parse(JSON.stringify(defaultContentConfig));

export const getContentConfig = (): ContentConfig => {
  return runtimeConfig;
};

export const updateContentConfig = (updates: Partial<ContentConfig>): void => {
  runtimeConfig = {
    ...runtimeConfig,
    ...updates,
    meta: {
      ...runtimeConfig.meta,
      lastUpdated: new Date().toISOString(),
    }
  };
};

export const resetContentConfig = (): void => {
  runtimeConfig = JSON.parse(JSON.stringify(defaultContentConfig));
};

export const exportContentConfig = (): string => {
  return `import { Module } from './moduleData';
import { modules } from './moduleData';

export interface ContentConfig {
  texts: Record<string, string>;
  sections: {
    visibility: Record<string, boolean>;
    order: Record<string, number>;
  };
  modules: Module[];
  images: Record<string, string>;
  meta: {
    version: string;
    lastUpdated: string;
  };
}

export const defaultContentConfig: ContentConfig = ${JSON.stringify(runtimeConfig, null, 2)};

// Runtime storage for edits (in-memory only)
let runtimeConfig: ContentConfig = JSON.parse(JSON.stringify(defaultContentConfig));

export const getContentConfig = (): ContentConfig => {
  return runtimeConfig;
};

export const updateContentConfig = (updates: Partial<ContentConfig>): void => {
  runtimeConfig = {
    ...runtimeConfig,
    ...updates,
    meta: {
      ...runtimeConfig.meta,
      lastUpdated: new Date().toISOString(),
    }
  };
};

export const resetContentConfig = (): void => {
  runtimeConfig = JSON.parse(JSON.stringify(defaultContentConfig));
};

export const exportContentConfig = (): string => {
  // This function is included for completeness but should be replaced with actual export logic
  return JSON.stringify(runtimeConfig, null, 2);
};
`;
};