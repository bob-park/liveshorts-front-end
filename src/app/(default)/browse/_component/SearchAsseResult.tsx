'use client';

// react
import { useLayoutEffect, useState } from 'react';

// nextjs
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { setIsListView } from '../action';

// react icon
import {
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineSearch,
} from 'react-icons/hi';
import { GrPowerReset } from 'react-icons/gr';

import Datepicker from 'react-tailwindcss-datepicker';

// dayjs
import dayjs from 'dayjs';

import { Button, Loading } from 'react-daisyui';
import MoveOnTop from '@/components/common/MoveOnTop';
import ListAssetView from './ListAssetView';
import ThumbnailAssetView from './ThumbAssetView';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { searchAsset } from '@/entries/asset/api/requestAsset';
import { useStore } from '@/shared/rootStore';

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
  isShortForm?: boolean;
  onlyCreateShortFormByMe: boolean;
  broadcastDate: string;
  page: number;
  size: number;
};

function parseParams(
  page: number,
  searchParams: SearchAssetParams,
): URLSearchParams {
  const metas: string[] = [];

  searchParams.broadcastDate &&
    metas.push(
      `2024-1ee5ed97-c594-4a3e-9e88-08cfbc7a2320,${searchParams.broadcastDate}`,
    );

  searchParams.channelId &&
    metas.push(
      `2024-1de7a2cd-72c6-4057-87d3-97926a85e0bb,${searchParams.channelId}`,
    );

  const params = {
    page,
    size: searchParams.size,
    isDeleted: false,
    assetStatus: 'REGISTERED',
    metas,
    title: searchParams.title || '',
    existShortForm:
      searchParams.isShortForm == undefined ? '' : searchParams.isShortForm,
    onlyCreateShortFormByMe: searchParams.onlyCreateShortFormByMe,
  };

  const urlSearchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value instanceof Array) {
      value.forEach((item) => {
        urlSearchParams.append(key, item);
      });
    } else {
      urlSearchParams.set(key, value != undefined ? value + '' : '');
    }
  });

  return urlSearchParams;
}

function search(page: number, searchParams: SearchAssetParams) {
  return searchAsset(parseParams(page, searchParams));
}

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

  // store
  const assets = useStore((state) => state.assets);
  const assetsPage = useStore((state) => state.assetsPage);
  const searchAssetAfter = useStore((state) => state.searchAssetAfter);
  const initAssetPage = useStore((state) => state.initAssetPage);

  // state
  const [listViewMode, setListViewMode] = useState<boolean>(isListView);
  const [searchAssetParams, setSearchAssetParams] = useState<SearchAssetParams>(
    prevSearchAssetParams,
  );

  // query client
  const queryClient = useQueryClient();

  const { data: searchResult, isPending } = useQuery<ApiResponse<Asset[]>>({
    queryKey: ['assets', 'search'],
    queryFn: () => search(0, searchAssetParams),
    staleTime: 60 * 1_000,
    enabled: false,
  });

  const { mutate: onSearch, isPending: isLoading } = useMutation({
    mutationKey: ['assets', 'search'],
    mutationFn: () =>
      search(!assetsPage ? 0 : assetsPage.currentPage + 1, searchAssetParams),
    onMutate: () => {
      if (!assetsPage) {
        queryClient.removeQueries({
          queryKey: ['assets', 'search'],
          exact: true,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['assets', 'search'], data);
      searchAssetAfter(data.result, data?.page);
    },
  });

  // useEffect
  useLayoutEffect(() => {
    setListViewMode(isListView);
  }, [isListView]);

  useLayoutEffect(() => {
    handleSearch();
  }, [searchParams]);

  useLayoutEffect(() => {
    initAssetPage();
  }, [searchAssetParams]);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    const observerTarget = document.getElementById('observer');

    if (observerTarget) {
      observer.observe(observerTarget);
    }
    return () => {
      observer.disconnect();
    };
  }, [assetsPage, isLoading]);

  // handle
  const handleSearch = () => {
    onSearch();
  };

  const handleToggleViewMode = (isListView: boolean) => {
    setIsListView(isListView);
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();

    const urlSearchParams = new URLSearchParams();

    Object.entries(searchAssetParams).forEach(([key, value]) => {
      urlSearchParams.set(key, value != undefined ? String(value) : '');
    });

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const handleInitializeSearchParams = () => {
    setSearchAssetParams({
      title: '',
      channelId: undefined,
      isShortForm: undefined,
      onlyCreateShortFormByMe: false,
      broadcastDate: dayjs().format('YYYY-MM-DD'),
      page: 0,
      size: 30,
    });
  };

  const handleMoveAsset = (assetId: number) => {
    router.push(`/asset/${assetId}`);
  };

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];

    const currentPage = assetsPage?.currentPage || 0;
    const totalPage = assetsPage?.totalPage || 0;

    if (target.isIntersecting && !isLoading && currentPage + 1 < totalPage) {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col m-2 relative">
      {/* search form */}
      <div className="card bg-base-100 mx-10 shadow-xl p-6 min-w-[850px]">
        <form className="flex justify-center p-4 " onSubmit={handleSubmit}>
          <div className="flex-1 max-w-[1080px]">
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
                        placeholder="키워드"
                        value={searchAssetParams.title}
                        onChange={(e) =>
                          setSearchAssetParams({
                            ...searchAssetParams,
                            title: e.target.value,
                          })
                        }
                      />
                      <HiOutlineSearch className="w-4 h-4 opacity-70" />
                    </label>
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
                      useRange={false}
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
              {/* 숏폼 여부 */}
              <div className="col-span-1">
                <div className="grid grid-cols-3 gap-5 h-12">
                  <div className="col-span-1 flex justify-end items-center">
                    <h2 className="font-extrabold">숏폼 여부</h2>
                  </div>
                  <div className="col-span-2 flex justify-start items-center">
                    <div className="flex justify-start items-center">
                      <div className="form-control mr-2">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="radio-10"
                            className="radio"
                            checked={searchAssetParams.isShortForm == undefined}
                            onChange={(e) =>
                              e.target.checked &&
                              setSearchAssetParams({
                                ...searchAssetParams,
                                isShortForm: undefined,
                              })
                            }
                          />
                          <span className="ml-2">전체</span>
                        </label>
                      </div>
                      <div className="form-control mr-2">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="radio-10"
                            className="radio"
                            checked={searchAssetParams.isShortForm === false}
                            onChange={(e) =>
                              e.target.checked &&
                              setSearchAssetParams({
                                ...searchAssetParams,
                                isShortForm: false,
                              })
                            }
                          />
                          <span className="ml-2">없음</span>
                        </label>
                      </div>
                      <div className="form-control mr-2">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="radio-10"
                            className="radio"
                            checked={searchAssetParams.isShortForm === true}
                            onChange={(e) =>
                              e.target.checked &&
                              setSearchAssetParams({
                                ...searchAssetParams,
                                isShortForm: true,
                              })
                            }
                          />
                          <span className="ml-2">있음</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 내가 생성한 작업 */}
              <div className="col-span-1">
                <div
                  className={`grid grid-cols-3 gap-5 h-12 transition-all duration-150 ${
                    searchAssetParams.isShortForm
                      ? 'opacity-100'
                      : '-translate-x-1 opacity-0'
                  }`}
                >
                  <div className="col-span-1 flex justify-end items-center">
                    <h2 className="font-extrabold">내가 만든 숏폼</h2>
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-start items-center h-full">
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="checkbox"
                            className="toggle"
                            checked={searchAssetParams.onlyCreateShortFormByMe}
                            onChange={(e) =>
                              setSearchAssetParams({
                                ...searchAssetParams,
                                onlyCreateShortFormByMe: e.target.checked,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1"></div>

              {/* 버튼 */}
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
                  loading={isPending}
                  disabled={isPending}
                >
                  {isPending ? <></> : <HiOutlineSearch className="w-6 h-6" />}
                  검색
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* view mode */}
      <div className="col-span-1">
        <div className="grid grid-cols-2 justify-between items-center">
          <div className="col-span-1 mx-10">
            <h3 className="text-base text-gray-500">
              총<strong>{searchResult?.page?.totalCount || 0}</strong>개 중{' '}
              <strong>{assets.length}</strong>개
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
          <ListAssetView
            isLoading={isPending}
            assets={assets || []}
            onClick={handleMoveAsset}
          />
        ) : (
          <ThumbnailAssetView
            isLoading={isPending}
            assets={assets || []}
            onClick={handleMoveAsset}
          />
        )}
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center items-center h-60">
          <Loading variant="dots" size="lg" />
        </div>
      ) : (
        <div id="observer" className="h-2"></div>
      )}

      <MoveOnTop />
    </div>
  );
}
