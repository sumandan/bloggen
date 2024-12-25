/*
  # Add preferred model column to user_profiles

  1. Changes
    - Add preferred_model column to user_profiles table
    - Set default value to 'mixtral-8x7b-32768'
    - Add check constraint to ensure valid model selection
*/

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS preferred_model TEXT DEFAULT 'mixtral-8x7b-32768';

-- Add check constraint for valid models
ALTER TABLE user_profiles
ADD CONSTRAINT valid_preferred_model CHECK (
  preferred_model IN (
    'distil-whisper-large-v3-en',
    'gemma2-9b-it',
    'gemma-7b-it',
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'llama-guard-3-8b',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'mixtral-8x7b-32768',
    'whisper-large-v3',
    'whisper-large-v3-turbo'
  )
);