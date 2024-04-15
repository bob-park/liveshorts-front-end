'use client';

// react
import {} from 'react';

// nextjs
import { useRouter } from 'next/navigation';

import BackwardButton from '@/components/common/BackwardButton';

type ShortformHeaderProps = {
  assetId: number;
};

export default function ShortformHeader(props: ShortformHeaderProps) {
  //props
  const { assetId } = props;

  // router
  const router = useRouter();

  // handler
  const handleBackdrop = () => {
    // router.push(`/asset/${assetId}`);
    router.back();
  };

  return (
    <div className="grid grid-cols-2 gap-4 justify-start items-center">
      <div className="col-span-1">
        <BackwardButton title="Browse" onBackward={handleBackdrop} />
      </div>
    </div>
  );
}
