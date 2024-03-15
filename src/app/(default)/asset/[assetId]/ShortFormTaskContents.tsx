'use client';

// react
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

import { shortFormActions } from '@/store/shortform';
import ShortFormList from '@/app/components/shortform/ShortFormList';

// action
const { requestSearchShortFormTask } = shortFormActions;

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
    <div className="gird grid-cols-1 gap-2 w-full h-full">
      <ShortFormList tasks={tasks} />
    </div>
  );
}
