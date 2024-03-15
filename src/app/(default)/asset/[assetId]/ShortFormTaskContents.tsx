'use client';

// react
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

// react icons
import { SiYoutubeshorts } from 'react-icons/si';
import { CgPlayListRemove } from 'react-icons/cg';
import { IoAddCircleSharp } from 'react-icons/io5';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

import { shortFormActions } from '@/store/shortform';
import ShortFormList from '@/app/components/shortform/ShortFormList';

// action
const { requestSearchShortFormTask } = shortFormActions;

const ShortFormLoading = () => {
  return (
    <div className="flex justify-center items-center w-full h-40">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
};

const EmptyShortFormList = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-40">
      <div className="">
        <CgPlayListRemove className="w-24 h-24 text-gray-500" />
      </div>
      <div className="mt-2 text-md font-bold">
        <h3>숏폼 영상이 없습니다.</h3>
      </div>
    </div>
  );
};

export default function ShortFormTaskContents(props: { assetId: number }) {
  // props
  const { assetId } = props;

  // store
  const dispatch = useAppDispatch();
  const { isLoading, tasks } = useAppSelector((state) => state.shortForm);

  //useEffect
  useLayoutEffect(() => {
    dispatch(requestSearchShortFormTask({ assetId }));
  }, []);

  return (
    <div className="gird grid-cols-1 gap-2 w-full h-full rounded-box shadow-2xl p-5">
      <div className="col-span-1">
        <div className="flex justify-center items-center relative">
          <SiYoutubeshorts className="w-10 h-10 text-red-700" />
          <span className="ml-2 text-lg font-bold">숏폼 영상 목록</span>

          <div className="absolute left-0">
            <button
              className="btn btn-neutral transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-950 duration-300"
              type="button"
            >
              <IoAddCircleSharp className="w-6 h-6" />
              숏폼 생성
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-1 mt-4">
        {isLoading && <ShortFormLoading />}
        {!isLoading && tasks.length === 0 && <EmptyShortFormList />}
        {!isLoading && tasks && <ShortFormList tasks={tasks} />}
      </div>
    </div>
  );
}
