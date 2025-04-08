

-- Check if the bpm_theme_settings table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bpm_theme_settings') THEN
        CREATE TABLE public.bpm_theme_settings (
            bpm_id UUID PRIMARY KEY,
            theme JSONB NOT NULL,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Create a row for the landing page configuration if it doesn't exist
INSERT INTO public.bpm_theme_settings (bpm_id, theme)
VALUES (
    'landing-page', 
    '{"sectionVisibility": {"hero": true, "features": true, "modules": true, "partnerships": true, "partner": true}, "elementVisibility": {}}'::jsonb
)
ON CONFLICT (bpm_id) DO NOTHING;

-- Add RLS policies for the bpm_theme_settings table
ALTER TABLE public.bpm_theme_settings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to view theme settings
CREATE POLICY "Allow all users to view theme settings" 
ON public.bpm_theme_settings 
FOR SELECT 
USING (true);

-- Create a policy that allows Carmen admins to update theme settings
CREATE POLICY "Allow Carmen admins to update theme settings" 
ON public.bpm_theme_settings 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE user_id = auth.uid() 
        AND "Carmen Admin" = true
    )
);

-- Create a policy that allows Carmen admins to insert theme settings
CREATE POLICY "Allow Carmen admins to insert theme settings" 
ON public.bpm_theme_settings 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE user_id = auth.uid() 
        AND "Carmen Admin" = true
    )
);

