/*
  # Create CV Storage Bucket

  1. Storage Bucket
    - Create a public bucket named 'cv-files' for storing CV/resume files
  
  2. Security
    - Make bucket publicly accessible for downloads
    - Only authenticated users (admin) can upload files
    - Anyone can download files from the bucket

  ## Usage
  After creating this bucket:
  1. Upload your CV file to the bucket using Supabase Dashboard or API
  2. The file will be publicly accessible via a URL
  3. Use the file name in your application to generate download links
*/

-- Create the CV files bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-files', 'cv-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to download files
CREATE POLICY "Public Access to CV files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cv-files');

-- Allow authenticated users to upload files (for admin use)
CREATE POLICY "Authenticated users can upload CV files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cv-files');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update CV files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-files')
WITH CHECK (bucket_id = 'cv-files');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete CV files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cv-files');