// react
import { useState, useEffect } from 'react';

// react icon
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

// dayjs
import dayjs from 'dayjs';

type TimePickerProps = {
  time: {
    hour: number;
    minute: number;
  };
  onChange?: (time: { hour: number; minute: number }) => void;
};

export default function TimePicker(props: TimePickerProps) {
  // props;
  const { time, onChange } = props;

  // state
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);

  // useEffect
  useEffect(() => {
    setHour(time.hour);
    setMinute(time.minute);
  }, [time]);

  // handle
  const handleChangeHour = (isPlus: boolean) => {
    const plusValue = isPlus ? 1 : -1;

    const newValue = hour + plusValue;

    setHour((prev) => {
      const nv = newValue > 0 ? newValue : 0;

      onChange && onChange({ hour: nv, minute });

      return nv;
    });
  };

  const handleChangeMinute = (isPlus: boolean) => {
    const plusValue = isPlus ? 1 : -1;

    const newValue = minute + plusValue;

    setMinute((prev) => {
      const nv = newValue > 0 ? newValue : 0;

      onChange && onChange({ hour, minute: nv });

      return nv;
    });
  };

  return (
    <label className="form-control w-full max-w-xs">
      <div className="w-full ">
        <div className="flex gap-5 justify-center items-center">
          <div className="flex flex-col w-16 justify-center items-center">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => handleChangeHour(true)}
            >
              <IoIosArrowUp />
            </button>
            <div className="flex gap-2 justify-center items-center">
              <input
                className="w-10 text-center my-4"
                defaultValue={hour > 9 ? hour : `0${hour}`}
              />
              <span>시</span>
            </div>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => handleChangeHour(false)}
            >
              <IoIosArrowDown />
            </button>
          </div>

          <div className="flex flex-col justify-center items-center">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => handleChangeMinute(true)}
            >
              <IoIosArrowUp />
            </button>
            <div className="flex gap-2 justify-center items-center">
              <input
                className="w-10 text-center my-4"
                defaultValue={minute > 9 ? minute : `0${minute}`}
                max="59"
              />
              <span>분</span>
            </div>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => handleChangeMinute(false)}
            >
              <IoIosArrowDown />
            </button>
          </div>
        </div>
      </div>
    </label>
  );
}
