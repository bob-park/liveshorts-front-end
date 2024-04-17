import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addShortformSchedule } from '@/entries/schedule/api';

export default function useReservationShortform(schedules: RecordSchedule[]) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['schedules', 'add', 'shortform'],
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
      const newSchedules = schedules.slice();

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

  return { onReservationShortform: mutate, isLoading: isPending };
}
