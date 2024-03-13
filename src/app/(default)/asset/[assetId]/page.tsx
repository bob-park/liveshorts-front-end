// day

import AssetHeaderContents from './AssetHeaderContents';
import AssetPlayeContents from './AssetPlayerContents';

export default function AssetPage({ params }: { params: { assetId: number } }) {
  const { assetId } = params;


  

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* back drop */}
      <div className="col-span-1">
        <AssetHeaderContents />
      </div>
      <div className="col-span-1">
        <div className="grid grid-cols-2 xl:grid-cols-3  gap-3 justify-center items-center">
          <div className="col-span-2">
            <AssetPlayeContents assetId={assetId} />
          </div>
          {/* shortfrom task list */}
          <div className="col-span-1">shortform task list</div>
        </div>
      </div>
    </div>
  );
}
