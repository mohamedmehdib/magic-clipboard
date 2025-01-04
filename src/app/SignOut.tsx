'use client';

import { useState } from 'react';
import supabase from '@/lib/supabaseClient';

const SignOut = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSignOut = async () => {
    setIsDisabled(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isDisabled}
      className={`py-2 px-4 rounded ${
        isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
      }`}
      style={{ transition: 'none' }}
    >
      {isDisabled ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
};

export default SignOut;
