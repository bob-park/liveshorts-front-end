import dayjs from 'dayjs';

export async function getSchedules(
  channelId: number,
  params: {
    selectDate: Date;
  },
) {
  const { selectDate } = params;

  const urlSearchParams = new URLSearchParams();

  urlSearchParams.append(
    'startDateTime',
    dayjs(selectDate).format('YYYY-MM-DDT00:00:00'),
  );

  urlSearchParams.append(
    'endDateTime',
    dayjs(selectDate).format('YYYY-MM-DDT23:59:59'),
  );

  const response = await fetch(
    `/api/record/channel/${channelId}/schedule?` + urlSearchParams,
    {
      method: 'get',
      next: {
        tags: ['schedules'],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response
    .json()
    .then((res: ApiResponse<RecordSchedule[]>) => res.result);
}
