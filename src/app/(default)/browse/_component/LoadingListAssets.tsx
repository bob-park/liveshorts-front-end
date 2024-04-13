import SkeletonAssetListItem from '@/components/asset/SkeletonAssetListItem';

export default function LoadingListAssets(props: { size: number }) {
  const { size } = props;

  return (
    <>
      {new Array(size).fill('').map((value, index) => (
        <SkeletonAssetListItem key={`skeleton-asset-item-${index}`} />
      ))}
    </>
  );
}
