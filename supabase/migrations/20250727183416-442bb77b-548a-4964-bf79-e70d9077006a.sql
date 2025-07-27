-- Populate content_edits table for franchise page
-- This creates franchise-specific content entries based on existing home page content and component analysis

INSERT INTO content_edits (id, content, page_identifier) VALUES
-- Hero components (franchise-prefixed versions)
('franchise-hero-heading-1', 'You''re losing revenue at the unit level', 'franchise'),
('franchise-hero-heading-2', ' shouldn''t be this hard', 'franchise'),
('franchise-hero-paragraph', 'Now, it isn''t. Carmen is a flexible, modular BPM builder that adapts to your business needs, not the other way around. Create a custom solution with only the features you need.', 'franchise'),
('franchise-hero-button-primary', 'Get Started', 'franchise'),
('franchise-hero-button-secondary', 'Explore Features', 'franchise'),
('franchise-hero-card-title', 'Custom BPM Dashboard', 'franchise'),
('franchise-hero-card-description', 'Personalized for your specific business needs', 'franchise'),

-- HeroSecondary components (franchise-prefixed versions)
('franchise-hero-secondary-heading-1', 'Most business software creates more work for your team.', 'franchise'),
('franchise-hero-secondary-heading-2', 'Carmen gets things done.', 'franchise'),
('franchise-hero-secondary-paragraph', 'She''s your CExO that keeps track of customer touchpoints, manages internal business operations, and handles reporting - all you have to do ask.', 'franchise'),
('franchise-hero-secondary-button-primary', 'Book a Demo', 'franchise'),
('franchise-hero-secondary-button-secondary', 'View Modules', 'franchise'),
('franchise-hero-secondary-card-title', 'Franchise Management', 'franchise'),
('franchise-hero-secondary-card-description', 'Streamline operations across all locations', 'franchise'),

-- HeroTertiary components (franchise-prefixed versions)
('franchise-hero-tertiary-heading-1', 'Scale your franchise operations', 'franchise'),
('franchise-hero-tertiary-heading-2', ' with intelligent automation', 'franchise'),
('franchise-hero-tertiary-paragraph', 'Carmen helps franchise owners maintain consistency, track performance, and streamline operations across multiple locations. Get real-time insights and automated workflows.', 'franchise'),
('franchise-hero-tertiary-button-primary', 'Get Started', 'franchise'),
('franchise-hero-tertiary-button-secondary', 'Explore Features', 'franchise'),
('franchise-hero-tertiary-card-title', 'Multi-Location Dashboard', 'franchise'),
('franchise-hero-tertiary-card-description', 'Monitor all franchise locations from one place', 'franchise'),

-- HeroQuaternary components (franchise-prefixed versions)
('franchise-hero-quaternary-heading-1', 'Franchise management', 'franchise'),
('franchise-hero-quaternary-heading-2', ' made simple', 'franchise'),
('franchise-hero-quaternary-paragraph', 'From compliance tracking to performance analytics, Carmen adapts to your franchise''s unique needs. Build custom workflows without technical complexity.', 'franchise'),
('franchise-hero-quaternary-button-primary', 'Book a Demo', 'franchise'),
('franchise-hero-quaternary-button-secondary', 'View Modules', 'franchise'),
('franchise-hero-quaternary-card-title', 'Workflow Designer', 'franchise'),
('franchise-hero-quaternary-card-description', 'Design custom processes for your franchise', 'franchise'),

-- HeroQuinary components (franchise-prefixed versions)
('franchise-hero-quinary-heading-1', 'Meet Carmen - Your franchise operations partner', 'franchise'),
('franchise-hero-quinary-heading-2', '', 'franchise'),
('franchise-hero-quinary-paragraph', 'Carmen moulds to fit your franchise business process, not the other way around. You get custom business software without the development costs and time drain.', 'franchise'),
('franchise-hero-quinary-button-primary', 'Book a Demo', 'franchise'),
('franchise-hero-quinary-button-secondary', 'View Modules', 'franchise'),
('franchise-hero-quinary-card-title', 'Franchise Intelligence', 'franchise'),
('franchise-hero-quinary-card-description', 'Smart insights for franchise growth', 'franchise'),

-- Features components (franchise-prefixed versions)
('franchise-features-heading', 'Why Choose Carmen for Your Franchise?', 'franchise'),
('franchise-features-description', 'Carmen''s modular approach means you only pay for what you need, while maintaining the flexibility to grow.', 'franchise'),
('franchise-features-feature-1-title', 'Modular Architecture', 'franchise'),
('franchise-features-feature-1-description', 'Build your system piece by piece. Add modules as your franchise grows and your needs evolve.', 'franchise'),
('franchise-features-feature-2-title', 'Fully Customizable', 'franchise'),
('franchise-features-feature-2-description', 'Every business is unique. Carmen adapts to your processes, workflows, and franchise requirements.', 'franchise'),
('franchise-features-feature-3-title', 'AI-Powered Configuration', 'franchise'),
('franchise-features-feature-3-description', 'Let AI help you set up and optimize your franchise management system for maximum efficiency.', 'franchise'),

-- Modules components (franchise-prefixed versions)
('franchise-modules-heading', 'Franchise Management Modules', 'franchise'),
('franchise-modules-description', 'Choose from our library of pre-built modules designed specifically for franchise operations.', 'franchise'),

-- Partnerships components (franchise-prefixed versions)
('franchise-partnerships-heading', 'Franchise Success Partners', 'franchise'),
('franchise-partnerships-description', 'We work with leading franchise consultants and technology partners to ensure your success.', 'franchise'),

-- BookingSection components (franchise-prefixed versions)
('franchise-booking-trial-description', 'Start your franchise transformation today - try Carmen risk-free for 30 days.', 'franchise'),

-- Footer components (franchise-prefixed versions)
('franchise-footer-company-description', 'Carmen BPM - Intelligent franchise management software that adapts to your business needs.', 'franchise'),
('franchise-footer-contact-title', 'Contact Us', 'franchise'),
('franchise-footer-follow-title', 'Follow Us', 'franchise'),
('franchise-footer-copyright', '© 2024 Carmen BPM. All rights reserved.', 'franchise');

-- Insert landing page settings for franchise page
INSERT INTO landing_page_settings (page_identifier, section_visibility, element_visibility, section_order)
VALUES (
  'franchise',
  '{
    "hero": true,
    "features": true,
    "modules": true,
    "partnerships": true,
    "bookingSection": true
  }'::jsonb,
  '{}'::jsonb,
  '{
    "hero": 1,
    "features": 2,
    "modules": 3,
    "partnerships": 4,
    "bookingSection": 5
  }'::jsonb
)
ON CONFLICT (page_identifier) 
DO UPDATE SET 
  section_visibility = EXCLUDED.section_visibility,
  section_order = EXCLUDED.section_order;