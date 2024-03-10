// day

import AssetHeader from './AssetHeader';

export default function AssetPage({ params }: { params: { assetId: number } }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* back drop */}
      <div className="col-span-1">
        <AssetHeader />
      </div>
      <div>asset and player</div>
    </div>
  );
}
