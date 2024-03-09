'use client';

// react
import { useEffect, useLayoutEffect, useState } from 'react';

// nextjs
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// react icon
import {
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineSearch,
} from 'react-icons/hi';
import { GrPowerReset } from 'react-icons/gr';

import Datepicker from 'react-tailwindcss-datepicker';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

// componets
import AssetViewItem from '@/app/components/asset/AssetViewItem';
import AssetListItem from '@/app/components/asset/AssetListItem';
import SkeletonAssetViewItem from '@/app/components/asset/SkeletonAssetViewItem';
import SkeletonAssetListItem from '@/app/components/asset/SkeletonAssetListItem';

// dayjs
import dayjs from 'dayjs';

// action
import { assetActions } from '@/store/asset';
import { Button } from 'react-daisyui';

const { requestSearchAsset } = assetActions;

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

type SearchAsseResultProps = {
  isListView: boolean;
  searchAssetParams: SearchAssetParams;
  channels: SearchChannel[];
};

type SearchChannel = { channelId: number; name: string };

type SearchAssetParams = {
  title: string;
  channelId?: number;
  isShortForm: boolean;
  broadcastDate: string;
  page: number;
  size: number;
};

const LoadingThumbanilAssets = (props: { size: number }) => {
  const { size } = props;

  return (
    <>
      {new Array(size).fill('').map((value, index) => (
        <SkeletonAssetViewItem key={`skeleton-asset-item-${index}`} />
      ))}
    </>
  );
};

const LoadingListAssets = (props: { size: number }) => {
  const { size } = props;

  return (
    <>
      {new Array(size).fill('').map((value, index) => (
        <SkeletonAssetListItem key={`skeleton-asset-item-${index}`} />
      ))}
    </>
  );
};

const ThumbnailAssetView = (props: { assets: Asset[]; isLoading: boolean }) => {
  const { assets, isLoading } = props;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,min-content))] gap-8 justify-center justify-items-center content-center mt-4">
      {isLoading ? (
        <LoadingThumbanilAssets size={10} />
      ) : (
        assets.map((item) => (
          <AssetViewItem
            key={`asset-view-item-${item.assetId}`}
            assetId={item.assetId}
            title={item.title}
            assetStatus={item.assetStatus}
            category={item.category.name}
            createdDate={item.createdDate}
          />
        ))
      )}
    </div>
  );
};

const ListAssetView = (props: { isLoading: boolean; assets: Asset[] }) => {
  // props
  const { isLoading, assets } = props;

  return (
    <div className="grid grid-cols-1 min-w-[900px] gap-4">
      {/* header */}
      <div className="col-span-1 grid grid-cols-7 gap-4 text-center font-bold border-b-2 border-b-gray-300 h-12 mx-10 justify-center items-center">
        <div className="col-span-1"></div>
        <div className="col-span-2">제목</div>
        <div className="col-span-1">대분류</div>
        <div className="col-span-1">크기</div>
        <div className="col-span-1">생성일</div>
        <div className="col-span-1">생성자</div>
      </div>
      {/* content */}
      <div className="col-span-1">
        {isLoading ? (
          <LoadingListAssets size={10} />
        ) : (
          assets.map((item) => (
            <AssetListItem
              key={`asset-list-item-${item.assetId}`}
              assetId={item.assetId}
              title={item.title}
              assetStatus={item.assetStatus}
              category={item.category.name}
              createdDate={item.createdDate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default function SearchAsseResult(props: SearchAsseResultProps) {
  // props
  const {
    isListView,
    searchAssetParams: prevSearchAssetParams,
    channels,
  } = props;

  // router
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // state
  const [listViewMode, setListViewMode] = useState<boolean>(isListView);
  const [searchAssetParams, setSearchAssetParams] = useState<SearchAssetParams>(
    prevSearchAssetParams,
  );

  // store
  const dispatch = useAppDispatch();
  const { isLoading, assets, pagination } = useAppSelector(
    (state) => state.asset,
  );

  // useEffect
  useLayoutEffect(() => {
    handleSearch();
  }, [searchParams]);

  // handle
  const handleSearch = () => {
    const metas: string[] = [];

    searchAssetParams.broadcastDate &&
      metas.push(
        `2024-1ee5ed97-c594-4a3e-9e88-08cfbc7a2320,${searchAssetParams.broadcastDate}`,
      );

    searchAssetParams.channelId &&
      metas.push(
        `2024-1de7a2cd-72c6-4057-87d3-97926a85e0bb,${
          channels.find(
            (item) => item.channelId === searchAssetParams.channelId,
          )?.name || ''
        }`,
      );

    dispatch(
      requestSearchAsset({
        page: searchAssetParams.page,
        size: searchAssetParams.size,
        isDeleted: false,
        assetType: 'VIDEO',
        assetStatus: 'REGISTERED',
        metas,
        title: searchAssetParams.title || '',
      }),
    );
  };

  const handleToggleViewMode = (isListView: boolean) => {
    setListViewMode(isListView);

    document.cookie = `isListView=${isListView}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlSearchParams = new URLSearchParams();

    Object.entries(searchAssetParams).forEach(([key, value]) => {
      urlSearchParams.set(key, value ? String(value) : '');
    });

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const handleInitializeSearchParams = () => {
    setSearchAssetParams({
      title: '',
      channelId: undefined,
      isShortForm: false,
      broadcastDate: dayjs().format('YYYY-MM-DD'),
      page: 0,
      size: 20,
    });
  };

  return (
    <div className="grid grid-cols-1 m-2">
      {/* search form */}
      <div className="card bg-base-100 shadow-xl mx-10 p-6 min-w-[850px]">
        <form className="p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-7">
            {/* 애셋 제목 */}
            <div className="col-span-1">
              <div className="grid grid-cols-3 gap-5 h-12">
                <div className="col-span-1 flex justify-end items-center">
                  <h2 className="font-extrabold">제목</h2>
                </div>
                <div className="col-span-2">
                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      type="text"
                      className="grow"
                      placeholder="Search"
                      defaultValue={searchAssetParams.title}
                      onChange={(e) =>
                        setSearchAssetParams({
                          ...searchAssetParams,
                          title: e.target.value,
                        })
                      }
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
            {/* 숏폼 여부 */}
            <div className="col-span-1">
              <div className="grid grid-cols-3 gap-5 h-12">
                <div className="col-span-1 flex justify-end items-center">
                  <h2 className="font-extrabold">숏폼 여부</h2>
                </div>
                <div className="col-span-2 flex justify-start items-center">
                  <input
                    type="checkbox"
                    className="toggle toggle-lg toggle-neutral"
                    checked={searchAssetParams.isShortForm}
                    onChange={(e) =>
                      setSearchAssetParams({
                        ...searchAssetParams,
                        isShortForm: e.target.checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* 채널 목록 */}
            <div className="col-span-2">
              <div className="grid grid-cols-6 gap-5 h-12">
                <div className="col-span-1 flex justify-end items-center">
                  <h2 className="font-extrabold">채널</h2>
                </div>
                <div className="col-span-5">
                  <div className="join">
                    <Button
                      className="join-item w-24"
                      type="button"
                      active={!!!searchAssetParams.channelId}
                      color={
                        !!!searchAssetParams.channelId ? 'neutral' : undefined
                      }
                      onClick={() =>
                        setSearchAssetParams({
                          ...searchAssetParams,
                          channelId: undefined,
                        })
                      }
                    >
                      전체
                    </Button>
                    {channels.map((channel) => (
                      <Button
                        key={`channel-key-${channel.channelId}`}
                        className="join-item"
                        type="button"
                        active={
                          channel.channelId == searchAssetParams.channelId
                        }
                        color={
                          channel.channelId == searchAssetParams.channelId
                            ? 'neutral'
                            : undefined
                        }
                        onClick={() =>
                          setSearchAssetParams({
                            ...searchAssetParams,
                            channelId: channel.channelId,
                          })
                        }
                      >
                        {channel.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 방송일 */}
            <div className="col-span-1">
              <div className="grid grid-cols-3 gap-5 h-12">
                <div className="col-span-1 flex justify-end items-center">
                  <h2 className="font-extrabold">방송일</h2>
                </div>
                <div className="col-span-2">
                  <Datepicker
                    placeholder="날짜 선택"
                    inputClassName="input w-full input-neutral input-bordered focus:outline-offset-0 z-100"
                    asSingle
                    value={{
                      startDate: dayjs(
                        searchAssetParams.broadcastDate,
                        DEFAULT_DATE_FORMAT,
                      ).toDate(),
                      endDate: dayjs(
                        searchAssetParams.broadcastDate,
                        DEFAULT_DATE_FORMAT,
                      ).toDate(),
                    }}
                    showFooter
                    onChange={(value) =>
                      setSearchAssetParams({
                        ...searchAssetParams,
                        broadcastDate: dayjs(value?.endDate).format(
                          DEFAULT_DATE_FORMAT,
                        ),
                      })
                    }
                    i18n="ko"
                    configs={{
                      footer: {
                        cancel: '취소',
                        apply: '적용',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-1"></div>
            <div className="col-span-1"></div>
            <div className="col-span-1 flex justify-end mr-10">
              <Button
                className="mr-4"
                type="button"
                size="md"
                onClick={handleInitializeSearchParams}
              >
                <GrPowerReset className="w-6 h-6" />
                초기화
              </Button>
              <Button
                type="submit"
                size="md"
                color="neutral"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? <></> : <HiOutlineSearch className="w-6 h-6" />}
                검색
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* view mode */}
      <div className="col-span-1">
        <div className="grid grid-cols-2 justify-between items-center">
          <div className="col-span-1 mx-10">
            <h3 className="text-base text-gray-500">
              총 <strong>{pagination.totalCount}</strong>개 중{' '}
              <strong>
                {pagination.size * pagination.currentPage + assets.length}
              </strong>
              개
            </h3>
          </div>
          <div className="col-span-1 text-right">
            <div className="join mx-10 my-5">
              <div className="tooltip w-full" data-tip="썸네일뷰">
                <Button
                  className="join-item"
                  color={!listViewMode ? 'neutral' : undefined}
                  active={!listViewMode}
                  onClick={() => handleToggleViewMode(false)}
                >
                  <HiOutlineViewGrid />
                </Button>
              </div>
              <div
                className="tooltip w-full"
                data-tip="리스트뷰"
                onClick={() => handleToggleViewMode(true)}
              >
                <Button
                  className="join-item"
                  active={listViewMode}
                  color={listViewMode ? 'neutral' : undefined}
                >
                  <HiOutlineViewList />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* contents */}
      <div className="col-span-1">
        {listViewMode ? (
          <ListAssetView isLoading={isLoading} assets={assets} />
        ) : (
          <ThumbnailAssetView isLoading={isLoading} assets={assets} />
        )}
      </div>
    </div>
  );
}
