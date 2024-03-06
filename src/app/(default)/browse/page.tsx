import SkeletonAsset from '@/app/components/asset/SkeletonAsset';

export default function Browse() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 justify-items-center content-center">
      {new Array(8).fill('').map((value, index) => (
        <SkeletonAsset key={`skeleton-asset-${index}`} />
      ))}
    </div>
  );
}
