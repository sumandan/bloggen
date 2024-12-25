export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validatePassword(password: string): ValidationResult {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }

  // Add more password requirements as needed
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase letters and numbers'
    };
  }

  return { isValid: true };
}