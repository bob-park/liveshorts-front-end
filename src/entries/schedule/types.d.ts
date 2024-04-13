type ScheduleStauts = 'WAITING' | 'RECORDING' | 'SUCCESS' | 'FAILURE';

type ShortFormRecordScheduleStatus =
  | 'ABORT'
  | 'WAITING'
  | 'PROCEEDING'
  | 'SUCCESS'
  | 'FAILURE';

interface ScheduleOptions {
  shopItems?: ShopItem[];
}

interface ShopItem {
  itemId: string;
  title: string;
}

interface ShortFormItemRange {
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
}

interface ShortFormRecordSchedule {
  id: string;
  schedule?: RecordSchedule;
  status: ShortFormRecordScheduleStatus;
  ranges: ShortFormItemRange[];
  createdDate: Date;
  createdBy: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
}

interface RecordChannel {
  channelId: number;
  channelName: string;
}

interface RecordSchedule {
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
}
