'use client';

import { useState } from 'react';
import { IconLogout } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function LogoutButton({ 
  className = '', 
  variant = 'default',
  size = 'md',
  showIcon = true,
  children
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Try API logout first
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        // Fallback to client-side logout
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to client-side logout
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      // Always redirect
      window.location.href = '/';
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        flex items-center gap-2 rounded-lg font-medium
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {showIcon && <IconLogout className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
      {isLoggingOut ? 'Logging out...' : (children || 'Logout')}
    </button>
  );
}