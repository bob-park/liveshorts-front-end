'use client';

// react
import {} from 'react';

// nextjs
import { useRouter } from 'next/navigation';

// daisy ui
import { Button } from 'react-daisyui';

// react icons
import { IoChevronBack } from 'react-icons/io5';

export default function AssetHeader() {
  // router
  const router = useRouter();

  // handler
  const handleBackdrop = () => {
    router.back();
  };

  return (
    <div className="grid grid-cols-2 gap-4 justify-start items-center">
      <div className="col-span-1">
        <Button className="h-16" type="button" onClick={handleBackdrop}>
          <IoChevronBack className="w-6 h-6" />
          <div className="flex flex-col items-start">
            <span className="text-base-content/50 hidden text-xs font-normal md:block">
              Back
            </span>
            <span className="text-base">Browse</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
