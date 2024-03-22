'use client';

// react
import { useState, useLayoutEffect } from 'react';

// nextjs
import { useRouter } from 'next/navigation';

// daisyui
import { Menu } from 'react-daisyui';

// react icon
import { FaArrowUp } from 'react-icons/fa';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

// dayjs
import dayjs from 'dayjs';

// store
import { scheduleActions } from '@/store/schedule';

import ScheduleDateSelector from '@/app/components/schedule/ScheduleDateSelector';
import ScheduleList from '@/app/components/schedule/ScheduleList';

type BroadcastScheduleContentProps = {
  channels: RecordChannel[];
};

// action
const { requestGetSchedule } = scheduleActions;

export default function BroadcastScheduleContent(
  props: BroadcastScheduleContentProps,
) {
  // props
  const { channels } = props;

  // nextjs
  const router = useRouter();

  // state
  const [selectChannelId, setSelectChannelId] = useState<number>(
    channels[0].channelId,
  );
  const [selectDate, setSelectDate] = useState<Date>(new Date());

  // store
  const dispatch = useAppDispatch();
  const { isLoading, schedules } = useAppSelector((state) => state.schedule);

  // useEffect
  useLayoutEffect(() => {
    handleGetSchedule();
  }, [selectChannelId, selectDate]);

  // handle
  const handleGetSchedule = () => {
    const startDateTime = dayjs(selectDate).format('YYYY-MM-DDT00:00:00');
    const endDateTime = dayjs(selectDate).format('YYYY-MM-DDT23:59:59');

    dispatch(
      requestGetSchedule({
        channelId: selectChannelId,
        startDateTime,
        endDateTime,
      }),
    );
  };

  const handleMoveScheduleDate = (isNext: boolean) => {
    const prevDate = dayjs(selectDate)
      .day(0)
      .add(7 * (isNext ? 1 : -1), 'day')
      .toDate();

    setSelectDate(prevDate);
  };

  const handleMoveAssetPage = (scheduleId: number) => {
    const schedule = schedules.find((item) => item.scheduleId === scheduleId);

    if (!schedule || schedule.status !== 'SUCCESS') {
      return;
    }

    router.push(`/asset/${schedule.asset.assetId}`);
  };

  const handleScrollTop = () => {
    scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 px-10">
        <div className="col-span-1">
          {/* 채널 목록 */}
          <div className="flex gap-2 justify-start items-center">
            <div className="w-16 text-right">
              <h2 className="text-xl font-bold">채널</h2>
            </div>
            <Menu horizontal className="px-5 text-lg">
              {channels.map((channel) => (
                <Menu.Item
                  key={`channel-id-${channel.channelId}`}
                  className="mx-3"
                >
                  <button
                    className={`btn btn-lg   ${
                      selectChannelId === channel.channelId
                        ? 'btn-neutral'
                        : 'btn-ghost'
                    }`}
                    type="button"
                    onClick={() => setSelectChannelId(channel.channelId)}
                  >
                    {channel.channelName}
                  </button>
                </Menu.Item>
              ))}
            </Menu>
          </div>
          {/* 날짜 목록 */}
          <div className="col-span-1 mt-3">
            <ScheduleDateSelector
              selectDate={selectDate}
              onSelectDate={(date) => setSelectDate(date)}
              onPrev={() => handleMoveScheduleDate(false)}
              onNext={() => handleMoveScheduleDate(true)}
            />
          </div>
          {/* 스케쥴 목록 */}
          <div className="col-span-1 mt-3">
            <ScheduleList
              schedules={schedules}
              onRowClick={handleMoveAssetPage}
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-5">
        <div className="flex justify-end">
          <button
            className="btn btn-circle btn-neutral"
            type="button"
            onClick={handleScrollTop}
          >
            <FaArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
