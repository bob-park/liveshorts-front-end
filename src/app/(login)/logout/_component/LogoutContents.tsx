'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function LogoutContents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // queryClient.invalidateQueries({ queryKey: ['assets', 'search'] });
    // console.log('logout');
  }, []);

  return (
    <div className="size-full">
      <span className="loading loading-infinity loading-lg" />
      <h4 className="font-bold text-xl">loading...</h4>
    </div>
  );
}
