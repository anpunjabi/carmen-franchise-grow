
-- Create the content_edits table to store editable text content
CREATE TABLE IF NOT EXISTS public.content_edits (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies to allow authenticated admin users to read/write content
ALTER TABLE public.content_edits ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content
CREATE POLICY "Allow public read access to content"
  ON public.content_edits
  FOR SELECT
  USING (true);

-- Only allow Carmen Admin users to update content
CREATE POLICY "Allow Carmen Admin users to update content"
  ON public.content_edits
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.user_id = auth.uid() 
      AND users."Carmen Admin" = true
    )
  );

-- Only allow Carmen Admin users to insert content
CREATE POLICY "Allow Carmen Admin users to insert content"
  ON public.content_edits
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.user_id = auth.uid() 
      AND users."Carmen Admin" = true
    )
  );
