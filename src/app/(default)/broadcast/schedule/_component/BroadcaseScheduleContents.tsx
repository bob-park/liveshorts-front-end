'use client';

// react
import { useState, useLayoutEffect } from 'react';

// nextjs
import { useRouter, useSearchParams } from 'next/navigation';

// daisyui
import { Menu } from 'react-daisyui';

// dayjs
import dayjs from 'dayjs';

import ScheduleDateSelector from '@/components/schedule/ScheduleDateSelector';
import ScheduleList from '@/components/schedule/ScheduleList';
import ReservShortFormView from '@/components/schedule/ReserveShortFormView';
import MoveOnTop from '@/components/common/MoveOnTop';
import useGetSchedules from '@/hooks/schedule/useGetSchedules';
import useReservationShortform from '@/hooks/schedule/useReservationShortform';
import { useStore } from '@/shared/rootStore';

type BroadcastScheduleContentProps = {
  channels: RecordChannel[];
  selectChannelId: number;
  selectDate: string;
};

export default function BroadcastScheduleContent(
  props: BroadcastScheduleContentProps,
) {
  // props
  const {
    channels,
    selectChannelId: prevChannelId,
    selectDate: prevDate,
  } = props;

  // nextjs
  const router = useRouter();
  const searchParams = useSearchParams();

  // store
  const addAlert = useStore((state) => state.addAlert);

  // state
  const [selectChannelId, setSelectChannelId] = useState<number>(prevChannelId);
  const [selectDate, setSelectDate] = useState<Date>(dayjs(prevDate).toDate());
  const [showReserveShortForm, setShowReserveShortForm] =
    useState<boolean>(false);
  const [reserveRecordSchedule, setReserveRecordSchedule] =
    useState<RecordSchedule>();

  const { schedules, onGetSchedules } = useGetSchedules(
    selectChannelId,
    selectDate,
  );
  const { onReservationShortform } = useReservationShortform(schedules || []);

  useLayoutEffect(() => {
    handleGetSchedule();
  }, [searchParams]);

  useLayoutEffect(() => {
    handleSubmit();
  }, [selectChannelId, selectDate]);

  // handle
  const handleSubmit = () => {
    const urlParams = new URLSearchParams();
    urlParams.append('channelId', selectChannelId + '');
    urlParams.append(
      'date',
      dayjs(selectDate || new Date()).format('YYYY-MM-DD'),
    );

    router.replace(`/broadcast/schedule?${urlParams}`);
  };

  const handleGetSchedule = () => {
    onGetSchedules();
  };

  const handleMoveScheduleDate = (isNext: boolean) => {
    const prevDate = dayjs(selectDate)
      .day(0)
      .add(7 * (isNext ? 1 : -1), 'day')
      .toDate();

    setSelectDate(prevDate);
  };

  const handleMoveAssetPage = (scheduleId: number) => {
    const schedule = schedules?.find((item) => item.scheduleId === scheduleId);

    if (!schedule || schedule.status !== 'SUCCESS') {
      return;
    }

    router.push(`/asset/${schedule.asset.assetId}`);
  };

  const handleReserveShortFormSchedule = (
    items: { itemId: string; startTime: string; endTime: string }[],
  ) => {
    if (!reserveRecordSchedule) {
      return;
    }

    onReservationShortform({
      scheduleId: reserveRecordSchedule.scheduleId,
      body: {
        channelId: selectChannelId,
        ranges: items.map((item) => ({
          itemId: item.itemId,
          time: {
            startTime: item.startTime,
            endTime: item.endTime,
          },
        })),
      },
    });

    items.forEach((item) => {
      const reservationItem = reserveRecordSchedule.options?.shopItems?.find(
        (shopItem) => shopItem.itemId === item.itemId,
      );

      reservationItem &&
        addAlert(`"${reservationItem.title}" 이(가) 숏폼 예약되었습니다.`);
    });
  };

  return (
    <>
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
                schedules={schedules || []}
                onRowClick={handleMoveAssetPage}
                onReverveShortForm={(scheduleId) => {
                  setReserveRecordSchedule(
                    schedules?.find((item) => item.scheduleId === scheduleId),
                  );
                  setShowReserveShortForm(true);
                }}
              />
            </div>
          </div>
        </div>

        <MoveOnTop />
      </div>
      <ReservShortFormView
        show={showReserveShortForm}
        schedule={reserveRecordSchedule}
        onBackdrop={() => setShowReserveShortForm(false)}
        onRequest={handleReserveShortFormSchedule}
      />
    </>
  );
}
