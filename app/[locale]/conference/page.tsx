'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

export default function ConferenceRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const go = async () => {
      try {
        const data = await apiClient.getAdminEvents();
        const conferences = data.events.filter((e: any) => e.is_conference);
        if (!isMounted) return;
        if (conferences.length > 0) {
          // Prefer featured, otherwise most recent
          const featured = conferences.find((e: any) => e.featured);
          const target =
            featured ||
            conferences.sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0];
          router.replace(`/conference/${target.id}`);
        } else {
          // No conference exists; fallback to events list
          router.replace('/events');
        }
      } catch {
        router.replace('/events');
      }
    };
    go();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return null;
}


