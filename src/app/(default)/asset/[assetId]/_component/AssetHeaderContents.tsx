'use client';

// react
import {} from 'react';

// nextjs
import { useRouter } from 'next/navigation';

import BackwardButton from '@/components/common/BackwardButton';

type AssetHeaderContentsProps = {
  prevUri?: string;
};

export default function AssetHeaderContents(props: AssetHeaderContentsProps) {
  // props
  const { prevUri } = props;

  // router
  const router = useRouter();

  // handler
  const handleBackdrop = () => {
    prevUri ? router.push(prevUri) : router.back();
  };

  return (
    <div className="grid grid-cols-2 gap-4 justify-start items-center">
      <div className="col-span-1">
        <BackwardButton title="Browse" onBackward={handleBackdrop} />
      </div>
    </div>
  );
}
