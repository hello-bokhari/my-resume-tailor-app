// src/hooks/useUserRedirect.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function useUserRedirect(protect: boolean = true) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (protect && !data.user) {
        router.replace('/auth');
      }
      if (!protect && data.user) {
        router.replace('/journal');
      }
    };

    checkAuth();
  }, [protect, router]);
}
