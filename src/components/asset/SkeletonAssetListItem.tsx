export default function SkeletonAssetListItem() {
  return (
    <div className="grid grid-cols-8 gap-4 mx-10 my-2 px-2 py-3 rounded-xl transition ease-in-out delay-150 hover:shadow-2xl hover:-translate-y-1 hover:scale-100 duration-300">
      <div className="col-span-1 h-24 flex justify-center items-center ">
        <div className="skeleton w-44 h-full rounded-xl object-contain"></div>
      </div>
      <div className="col-span-2 flex justify-start items-center">
        <div className="skeleton w-full h-8 mx-5"></div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="skeleton w-24 h-8"></div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="skeleton w-24 h-8"></div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="skeleton w-32 h-8"></div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="skeleton w-32 h-8"></div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="skeleton w-32 h-8"></div>
      </div>
    </div>
  );
}
