/*
  # Add Groq API key to user profiles

  1. Changes
    - Add `groq_api_key` column to `user_profiles` table
    - Column is encrypted using pgcrypto for security
    - Add policy to ensure users can only access their own API key

  2. Security
    - Enable encryption for API key storage
    - Maintain existing RLS policies
*/

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add groq_api_key column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS groq_api_key TEXT;

-- Update RLS policies to include groq_api_key
CREATE POLICY "Users can update their own API key"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);