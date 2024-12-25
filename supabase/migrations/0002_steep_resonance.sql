/*
  # Add insert policy for user profiles
  
  1. Changes
    - Add policy to allow users to create their own profile during signup
  
  2. Security
    - Policy ensures users can only create a profile with their own user_id
*/

-- Add policy for inserting user profiles
CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);