export default function SkeletonAssetListItem() {
  return (
    <div className="grid grid-cols-5 m-2 p-1 rounded-xl hover:shadow-2xl">
      <div className="col-span-1 h-24 flex justify-center items-center ">
        <div className="skeleton w-44 h-full"></div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="skeleton w-24 h-8"></div>
      </div>
      <div className="col-span-2 flex justify-start items-center">
        <div className="skeleton w-80 h-8"></div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="skeleton w-32 h-8"></div>
      </div>
    </div>
  );
}
