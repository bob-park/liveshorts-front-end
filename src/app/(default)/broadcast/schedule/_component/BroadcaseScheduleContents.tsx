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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addShortformSchedule, getSchedules } from '@/entries/schedule/api';

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

  // state
  const [selectChannelId, setSelectChannelId] = useState<number>(prevChannelId);
  const [selectDate, setSelectDate] = useState<Date>(dayjs(prevDate).toDate());
  const [showReserveShortForm, setShowReserveShortForm] =
    useState<boolean>(false);
  const [reserveRecordSchedule, setReserveRecordSchedule] =
    useState<RecordSchedule>();

  // query client
  const queryClient = useQueryClient();
  const { data: schedules } = useQuery<RecordSchedule[]>({
    queryKey: ['schedules'],
    queryFn: () => getSchedules(selectChannelId, { selectDate }),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
    enabled: false,
  });

  const { mutate: onGetSchedules } = useMutation({
    mutationKey: ['schedules'],
    mutationFn: () => getSchedules(selectChannelId, { selectDate }),
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['schedules'], data);
    },
  });

  const { mutate: onAddShortformSchedule } = useMutation({
    mutationKey: [
      'schedules',
      reserveRecordSchedule?.scheduleId,
      'add',
      'shortform',
    ],
    mutationFn: ({
      scheduleId,
      body,
    }: {
      scheduleId: number;
      body: {
        channelId: number;
        ranges: {
          itemId: string;
          time: {
            startTime: string;
            endTime: string;
          };
        }[];
      };
    }) => addShortformSchedule(scheduleId, body),
    onSuccess: (data) => {
      const newSchedules = schedules?.slice() || [];

      const index = newSchedules.findIndex(
        (item) => item.scheduleId === data.schedule?.scheduleId,
      );

      if (index >= 0) {
        newSchedules[index] = {
          ...newSchedules[index],
          shorts: data,
        };
      }

      queryClient.setQueryData(['schedules'], newSchedules);
    },
  });

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

    onAddShortformSchedule({
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
