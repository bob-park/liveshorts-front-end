import { CgPlayListRemove } from 'react-icons/cg';

export default function EmptyAssets() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-40">
      <div className="">
        <CgPlayListRemove className="w-24 h-24 text-gray-500" />
      </div>
      <div className="mt-2 text-md font-bold">
        <h3>영상이 없습니다.</h3>
      </div>
    </div>
  );
}
