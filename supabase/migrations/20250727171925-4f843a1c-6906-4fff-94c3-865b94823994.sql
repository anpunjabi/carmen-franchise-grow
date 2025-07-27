-- Create franchise page settings by copying home page structure
INSERT INTO public.landing_page_settings (
    page_identifier,
    section_visibility,
    element_visibility,
    section_order
)
SELECT 
    'franchise' as page_identifier,
    section_visibility,
    element_visibility,
    section_order
FROM public.landing_page_settings 
WHERE page_identifier = 'home'
LIMIT 1;