// react
import { useLayoutEffect, useState } from 'react';

// nextjs
import Image from 'next/image';

// react icons
import { SiYoutubeshorts } from 'react-icons/si';
import { VscRecord } from 'react-icons/vsc';
import { BiVideoRecording } from 'react-icons/bi';
import { IoWarning } from 'react-icons/io5';

// dayjs
import dayjs from 'dayjs';

type ScheduleListProps = {
  schedules: RecordSchedule[];
  onRowClick?: (scheduleId: number) => void;
  onReverveShortForm?: (scheduleId: number) => void;
};

function parseStatus(status: ScheduleStauts) {
  switch (status) {
    case 'WAITING':
      return <></>;
    case 'RECORDING':
      return <div className="badge badge-error">ON AIR</div>;
    case 'SUCCESS':
      return <></>;
    case 'FAILURE':
      return <></>;
  }
}

function parseShortsStatus(status: ShortFormRecordScheduleStatus) {
  switch (status) {
    case 'ABORT':
      return <div className="badge badge-lg badge-ghost">숏폼 생성 예약</div>;
    case 'WAITING':
      return <div className="badge badge-lg badge-ghost">숏폼 생성 대기</div>;
    case 'PROCEEDING':
      return <div className="badge badge-lg badge-ghost">숏폼 생성 진행</div>;
    case 'SUCCESS':
      return <div className="badge badge-lg badge-neutral">숏폼 생성 완료</div>;
    case 'FAILURE':
      return <div className="badge badge-lg badge-error">숏폼 생성 실패</div>;
  }
}

const ScheduleListItem = ({
  schedule,
  onReverveShortForm,
}: {
  schedule: RecordSchedule;
  onReverveShortForm?: (scheduleId: number) => void;
}) => {
  // state
  const [assetImageSrc, setAssetImageSrc] = useState<string>(
    `/api/v1/asset/${schedule.asset.assetId}/resource?fileType=THUMBNAIL`,
  );

  const [itemsHover, setItemsHover] = useState<boolean>(false);

  // handle
  const handleReverveShortForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onReverveShortForm && onReverveShortForm(schedule.scheduleId);
  };

  return (
    <div className="flex w-full gap-5 h-44 items-center px-5 py-2 transition ease-in-out delay-150 rounded-2xl shadow-xl hover:scale-105 hover:-translate-y-1 duration-300">
      {/* 방송 시간 */}
      <div className="flex-none w-24 text-center text-lg font-bold">
        <div>{parseStatus(schedule.status)}</div>
        <div className="">
          <span>{dayjs(schedule.startDateTime).format('HH:mm')}</span>
        </div>
        <div>
          <span className="font-normal"> ~ </span>
        </div>
        <div>
          <span>{dayjs(schedule.endDateTime).format('HH:mm')}</span>
        </div>
      </div>
      {/* thumbnail */}
      <div className="flex-none ">
        <figure className="w-48 h-28 flex justify-center items-center">
          {schedule.status === 'FAILURE' && (
            <div>
              <IoWarning className="w-10 h-10 text-yellow-600" />
            </div>
          )}
          {schedule.status === 'WAITING' && (
            <div>
              <VscRecord className="w-10 h-10" />
            </div>
          )}
          {schedule.status === 'RECORDING' && (
            <div>
              <BiVideoRecording className="w-10 h-10 text-red-600 animate-bounce" />
            </div>
          )}
          {schedule.asset.assetStatus === 'REGISTERED' && (
            <Image
              className="w-auto h-full rounded-xl object-contain"
              src={assetImageSrc}
              alt="thumbnail"
              width={400}
              height={300}
              onError={() => setAssetImageSrc('/default_thumbnail.png')}
            />
          )}
        </figure>
      </div>
      {/* 정보 */}
      <div className="flex-1 w-2/4 relative">
        <div className="flex flex-col gap-2">
          {/* title */}
          <div className="text-start">
            {schedule.shorts && (
              <div className="text-red-600">
                <SiYoutubeshorts className="w-5 h-5" />
              </div>
            )}
            <div className="tooltip max-w-full" data-tip={schedule.title}>
              <h2 className="text-start truncate text-xl font-bold">
                {schedule.title}
              </h2>
            </div>
          </div>
          <div className="flex justify-start gap-5 items-center">
            <div
              className="badge badge-lg badge-primary"
              onMouseEnter={() => setItemsHover(true)}
              onMouseLeave={() => setItemsHover(false)}
            >
              {schedule.options?.shopItems?.length || 0}개 상품
            </div>

            {/* shorts 여부 */}
            {schedule.shorts && (
              <div>{parseShortsStatus(schedule.shorts.status)}</div>
            )}
          </div>

          <div className="flex justify-start gap-4">
            <button
              className="btn btn-sm hover:scale-110"
              type="button"
              onClick={handleReverveShortForm}
            >
              <SiYoutubeshorts />
              숏폼 예약
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ScheduleList(props: ScheduleListProps) {
  // props
  const { schedules, onRowClick, onReverveShortForm } = props;

  // useLayoutEffect
  useLayoutEffect(() => {
    const onAirSchedule = schedules.find(
      (schedule) => schedule.status === 'RECORDING',
    );

    if (!onAirSchedule) {
      return;
    }

    const scheduleTag = document.getElementById(
      `schedule-item-${onAirSchedule.scheduleId}`,
    );

    if (!scheduleTag) {
      return;
    }

    const scrollTop = scheduleTag.offsetTop - 100;

    scrollTo({ top: scrollTop, behavior: 'smooth' });
  }, [schedules]);

  // handle
  const handleRowClick = (scheduleId: number) => {
    onRowClick && onRowClick(scheduleId);
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      {schedules.map((schedule) => (
        <div
          key={`schedule-item-${schedule.scheduleId}`}
          id={`schedule-item-${schedule.scheduleId}`}
          className="mx-10 my-1"
          onClick={() => handleRowClick(schedule.scheduleId)}
        >
          <ScheduleListItem
            schedule={schedule}
            onReverveShortForm={onReverveShortForm}
          />
        </div>
      ))}
    </div>
  );
}
