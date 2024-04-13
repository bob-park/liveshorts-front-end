import SkeletonAssetViewItem from '@/components/asset/SkeletonAssetViewItem';

export default function LoadingThumbanilAssets(props: { size: number }) {
  const { size } = props;

  return (
    <>
      {new Array(size).fill('').map((value, index) => (
        <SkeletonAssetViewItem key={`skeleton-asset-item-${index}`} />
      ))}
    </>
  );
}
