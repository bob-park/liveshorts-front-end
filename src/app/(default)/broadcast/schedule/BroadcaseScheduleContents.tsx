'use client';

// react
import { useState, useLayoutEffect } from 'react';

// daisyui
import { Menu } from 'react-daisyui';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

// dayjs
import dayjs from 'dayjs';

// store
import { scheduleActions } from '@/store/schedule';

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

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-1">
        <Menu horizontal className="px-10 text-lg">
          {channels.map((channel) => (
            <Menu.Item key={`channel-id-${channel.channelId}`} className="mx-3">
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
    </div>
  );
}
