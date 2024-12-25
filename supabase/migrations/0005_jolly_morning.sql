/*
  # Add image support to blogs

  1. Changes
    - Add featured_image column to blogs table
    - Create storage bucket for blog images
    - Add policies for image access

  2. Security
    - Enable RLS for storage bucket
    - Add policies for authenticated users to upload/read images
*/

-- Create storage bucket for blog images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Add featured_image column to blogs table
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Create storage policies
CREATE POLICY "Users can upload blog images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images' AND auth.uid() = owner);

CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'blog-images');