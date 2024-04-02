export default function SkeletonAssetItem() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition px-4 pt-6 hover:-translate-y-1 hover:scale-110 duration-300 ease-in-out delay-150 ">
      <figure className="w-full relative h-48">
        <div className="skeleton h-full w-full"></div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          <div className="skeleton w-full h-8"></div>
        </h2>
        <p className="pt-4"></p>
        <div className="card-actions justify-between">
          <div className="skeleton w-24 h-5"></div>
          <div className="skeleton w-24 h-5"></div>
        </div>
      </div>
    </div>
  );
}
