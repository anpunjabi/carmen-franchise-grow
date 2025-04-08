
-- Create RPC functions to safely fetch and update privacy policy
CREATE OR REPLACE FUNCTION public.get_privacy_policy()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  policy_content text;
BEGIN
  SELECT content INTO policy_content
  FROM public.privacy_policy
  WHERE id = '00000000-0000-0000-0000-000000000001';
  
  RETURN policy_content;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_privacy_policy(new_content text, policy_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the privacy policy content
  UPDATE public.privacy_policy
  SET 
    content = new_content,
    updated_at = now(),
    updated_by = auth.uid()
  WHERE id = policy_id;
END;
$$;
