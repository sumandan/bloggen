import { supabase } from './supabase';

export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?type=recovery`,
    });

    if (error) throw error;

    return {
      success: true,
    };
  } catch (err) {
    console.error('Reset password error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send reset password email'
    };
  }
}

export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return {
      success: true
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update password'
    };
  }
}
export interface AuthResponse {
  success: boolean;
  error?: string;
  userId?: string;
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        return {
          success: false,
          error: 'Invalid email or password. Please try again.'
        };
      }
      throw error;
    }

    return {
      success: true,
      userId: data.user?.id
    };
  } catch (err) {
    return {
      success: false,
      error: 'An error occurred. Please try again later.'
    };
  }
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message === 'User already registered') {
        return {
          success: false,
          error: 'An account with this email already exists. Please sign in instead.'
        };
      }
      throw error;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert([{ 
          user_id: data.user.id, 
          email: data.user.email 
        }], { 
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;
    }

    return {
      success: true,
      userId: data.user?.id
    };
  } catch (err) {
    console.error('Sign up error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An error occurred. Please try again later.'
    };
  }
}