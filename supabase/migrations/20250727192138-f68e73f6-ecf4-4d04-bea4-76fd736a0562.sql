-- Clean up remaining franchise entries for Hero variants that don't use pagePrefix
-- These components (HeroSecondary, HeroTertiary, HeroQuaternary, HeroQuinary) use hardcoded IDs
-- so they should not have franchise-specific entries

DELETE FROM content_edits 
WHERE page_identifier = 'franchise' 
AND (
  id LIKE 'franchise-hero-secondary-%' OR
  id LIKE 'franchise-hero-tertiary-%' OR
  id LIKE 'franchise-hero-quaternary-%' OR
  id LIKE 'franchise-hero-quinary-%'
);