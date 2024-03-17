'use client';

// react
import {} from 'react';

// nextjs
import { useRouter } from 'next/navigation';

import BackwardButton from '@/app/components/common/BackwardButton';

export default function BroadcastScheduleHeaderContents() {
  // router
  const router = useRouter();

  // handler
  const handleBackdrop = () => {
    router.back();
  };

  return (
    <div className="grid grid-cols-2 gap-4 justify-start items-center">
      <div className="col-span-1">
        <BackwardButton title="뒤로" onBackward={handleBackdrop} />
      </div>
    </div>
  );
}
