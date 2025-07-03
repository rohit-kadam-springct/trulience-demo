'use client';

import { useSearchParams } from 'next/navigation';

export function useUrlParams<T extends Record<string, string>>() {
  const searchParams = useSearchParams();

  const params = {} as T;

  searchParams.forEach((value, key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params as any)[key] = value;
  });

  return params;
}