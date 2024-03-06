'use client';

export default function SkeletonAssetItem() {
  return (
    <div className="flex flex-col gap-4 w-64 p-3 rounded-lg shadow-xl">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
}
