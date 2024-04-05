type ScheduleState = {
  isLoading: boolean;
  schedules: RecordSchedule[];
};

type ScheduleStauts = 'WAITING' | 'RECORDING' | 'SUCCESS' | 'FAILURE';
type ScheduleOptions = {
  shopItems?: ShopItem[];
};
type ShortFormRecordScheduleStatus =
  | 'ABORT'
  | 'WAITING'
  | 'PROCEEDING'
  | 'SUCCESS'
  | 'FAILURE';

type ShopItem = {
  itemId: string;
  title: string;
};

type ShortFormItemRange = {
  id: string;
  itemId: string;
  time: {
    startTime: string;
    endTime: string;
  };
  createdDate: Date;
  createdBy: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
};

type ShortFormRecordSchedule = {
  id: string;
  schedule?: RecordSchedule;
  status: ShortFormRecordScheduleStatus;
  ranges: ShortFormItemRange[];
  createdDate: Date;
  createdBy: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
};

type RecordChannel = {
  channelId: number;
  channelName: string;
};

type RecordSchedule = {
  scheduleId: number;
  title: string;
  asset: Asset;
  status: ScheduleStauts;
  channel: RecordChannel;
  startDateTime: Date;
  endDateTime: Date;
  recordStartDate?: Date;
  recordEndDate?: Date;
  message?: string;
  options?: ScheduleOptions;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
  shorts?: ShortFormRecordSchedule;
};
