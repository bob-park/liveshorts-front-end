'use client';

// nextjs
import Image from 'next/image';

type AssetItemProps = {
  assetId: number;
};

export default function AssetItem(props: AssetItemProps) {
  // props
  const { assetId } = props;

  // handle

  return (
    <div className="flex flex-col gap-4 w-52">
      <div className="w-full relative h-32">
        <Image
          src={`/api/v1/asset/${assetId}/resource?fileType=THUMBNAIL`}
          alt="thumbnail"
          fill
          onError={(e) => (e.currentTarget.src = '/default_thumbnail.png')}
        />
      </div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
}
