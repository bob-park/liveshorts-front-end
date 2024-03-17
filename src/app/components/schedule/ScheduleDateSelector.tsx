// react
import { useState, useEffect } from 'react';

// react icons
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

// dayjs
import dayjs from 'dayjs';

type ScheduleDateSelectorProps = {
  selectDate: Date;
  onPrev?: () => void;
  onNext?: () => void;
  onSelectDate?: (date: Date) => void;
};

const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function getDayOfWeek(dayOfWeek: number) {
  return DAY_OF_WEEK[dayOfWeek];
}

export default function ScheduleDateSelector(props: ScheduleDateSelectorProps) {
  // props
  const { selectDate, onSelectDate, onPrev, onNext } = props;

  // state
  const [dateList, setDateList] = useState<Date[]>([]);

  // useEffect
  useEffect(() => {
    const newDateList: Date[] = [];
    const startDate = dayjs(selectDate).day(0).toDate();

    for (
      let currentDate = dayjs(startDate);
      currentDate.toDate() <= dayjs(startDate).add(6, 'day').toDate();
      currentDate = currentDate.add(1, 'day')
    ) {
      newDateList.push(currentDate.toDate());
    }

    setDateList(newDateList);
  }, [selectDate]);

  // handle
  const handleSelectDate = (date: Date) => {
    onSelectDate && onSelectDate(date);
  };

  const handlePrev = () => {
    onPrev && onPrev();
  };

  const handleNext = () => {
    onNext && onNext();
  };

  return (
    <div className="grid grid-cols-9 gap-10 w-full h-full">
      {/* prev */}
      <button className="btn btn-ghost btn-neutral" onClick={handlePrev}>
        <IoIosArrowBack className="w-5 h-5" />
      </button>
      {/* date list */}
      {dateList.map((date, index) => (
        <div key={`schedule-date-selector-${index}`}>
          <p
            className={`text-center font-bold ${
              date.getDate() === selectDate.getDate()
                ? 'text-blue-600 scale-110'
                : 'text-gray-400'
            } hover:text-blue-600`}
            onClick={() => handleSelectDate(date)}
          >
            <span className={`text-xl`}>{dayjs(date).format('MM.DD')}</span>
            <span className="text-sm">
              {date.getDate() === new Date().getDate()
                ? '오늘'
                : getDayOfWeek(dayjs(date).day())}
            </span>
          </p>
        </div>
      ))}
      {/* next */}
      <button className="btn btn-ghost btn-neutral" onClick={handleNext}>
        <IoIosArrowForward className="w-5 h-5" />
      </button>
    </div>
  );
}
