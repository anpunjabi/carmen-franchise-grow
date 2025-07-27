-- Clean up excess franchise content entries
-- Keep only entries for components that actually use pagePrefix (Hero and Features)
-- Delete all entries for components that use hardcoded IDs

DELETE FROM content_edits 
WHERE page_identifier = 'franchise' 
AND id NOT LIKE 'franchise-hero-%'
AND id NOT LIKE 'franchise-features-%';

-- Also delete any terms-of-service entry for franchise since that's page-specific to home
DELETE FROM content_edits 
WHERE page_identifier = 'franchise' 
AND id = 'franchise-terms-of-service';