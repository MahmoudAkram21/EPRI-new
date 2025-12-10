'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Search, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { PageContainer } from '@/components/page-container';
import { Section } from '@/components/section';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Conference {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  capacity: number;
  cover_image: string;
  agenda: string;
  guidelines: string;
  status: string;
  featured: boolean;
  address?: {
    city: string;
    country: string;
  } | null;
}

export default function ConferencesPage() {
  return null;
}
