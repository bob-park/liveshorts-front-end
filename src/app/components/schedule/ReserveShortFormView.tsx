// react
import { useState, useLayoutEffect, useEffect } from 'react';

// react icon
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { SiYoutubeshorts } from 'react-icons/si';

// dayjs
import dayjs from 'dayjs';

// common
import { getDayOfWeek } from '@/utils/common';
import TimePicker from './TimePicker';
import { all } from 'redux-saga/effects';

type ReservShortFormViewProps = {
  show: boolean;
  schedule?: RecordSchedule;
  onBackdrop?: () => void;
};

type ReserveItem = {
  itemId: string;
  startTime: string;
  endTime: string;
};

export default function ReservShortFormView(props: ReservShortFormViewProps) {
  // props;
  const { show, schedule, onBackdrop } = props;

  // state
  const [reserveItems, setReserveItems] = useState<ReserveItem[]>([]);
  const [selectItemId, setSelectItemId] = useState<string>();
  const [selectStartTime, setSelectStartTime] = useState<{
    hour: number;
    minute: number;
  }>({ hour: 0, minute: 0 });

  const [selectEndTime, setSelectEndTime] = useState<{
    hour: number;
    minute: number;
  }>({ hour: 0, minute: 10 });

  // useLayoutEffect
  useLayoutEffect(() => {
    const modal = document.getElementById(
      'reserve_short_form_modal',
    ) as HTMLDialogElement;

    show && modal.showModal();

    setSelectStartTime({ hour: 0, minute: 0 });
    setSelectEndTime({ hour: 0, minute: 10 });
    setSelectItemId(undefined);
    setReserveItems([]);
  }, [show, schedule]);

  // handle
  const handleBackdrop = () => {
    onBackdrop && onBackdrop();
  };

  const handleKeyboardDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      handleBackdrop();
    }
  };

  const handleAddReserveItem = () => {
    setReserveItems((prev) => {
      const newReserveItems = prev.slice();

      const isAdd = newReserveItems.every(
        (item) => item.itemId !== selectItemId,
      );

      if (isAdd && selectItemId) {
        newReserveItems.push({
          itemId: selectItemId,
          startTime: `${
            selectStartTime.hour > 9
              ? selectStartTime.hour
              : `0${selectStartTime.hour}`
          }:${
            selectStartTime.minute > 9
              ? selectStartTime.minute
              : `0${selectStartTime.minute}`
          }:00`,
          endTime: `${
            selectEndTime.hour > 9
              ? selectEndTime.hour
              : `0${selectEndTime.hour}`
          }:${
            selectEndTime.minute > 9
              ? selectEndTime.minute
              : `0${selectEndTime.minute}`
          }:00`,
        });
      }

      return newReserveItems;
    });
  };

  const handleRemoveReserveItem = (itemId: string) => {
    setReserveItems((prev) => {
      const newReserveItems = prev.slice();

      const index = newReserveItems.findIndex((item) => item.itemId === itemId);

      if (index > -1) {
        newReserveItems.splice(index);
      }

      return newReserveItems;
    });
  };

  return (
    <dialog
      id="reserve_short_form_modal"
      className="modal modal-bottom sm:modal-middle"
      onKeyDownCapture={handleKeyboardDown}
    >
      <div className="modal-box min-h-[920px]">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleBackdrop}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">숏폼 예약하기</h3>
        <div className="grid grid-cols-3 gap-5 mt-10 items-center">
          {/* 방송 시간 */}
          <div className="col-span-1 text-right text-lg">
            <h3>방송 시간 : </h3>
          </div>
          <div className="col-span-2">
            <p className="text-lg font-semibold ">
              <span className="">
                {dayjs(schedule?.startDateTime).format('YYYY-MM-DD')}
                <span>
                  (
                  <span>
                    {getDayOfWeek(dayjs(schedule?.startDateTime).day())}
                  </span>
                  )
                </span>
              </span>
              <span> </span>
              <span>{dayjs(schedule?.startDateTime).format('HH:mm')}</span>
              <span> ~ </span>
              <span>{dayjs(schedule?.endDateTime).format('HH:mm')}</span>
            </p>
          </div>

          {/* 방송 제목 */}
          <div className="col-span-1 text-right text-lg">
            <h3>프로그램 제목 : </h3>
          </div>
          <div className="col-span-2 text-left font-bold text-xl">
            <div className="tooltip w-full" data-tip={schedule?.title}>
              <h2 className="text-left truncate">{schedule?.title}</h2>
            </div>
          </div>

          {/* 아이템 목록 */}
          <div className="col-span-2 mt-5">
            <h2 className="text-lg font-bold">숏폼 예약 아이템 목록</h2>
          </div>
          <div className="col-span-1"></div>

          <div className="col-span-3 mt-1 w-full">
            <select
              className="select select-bordered w-full"
              value={selectItemId || ''}
              onChange={(e) => setSelectItemId(e.target.value || undefined)}
            >
              <option value="" disabled>
                선택
              </option>
              {schedule?.options?.shopItems?.map((shopItem) => (
                <option
                  key={`reserve-shop-item-${shopItem.itemId}`}
                  disabled={reserveItems.some(
                    (item) => item.itemId === shopItem.itemId,
                  )}
                  value={shopItem.itemId}
                >
                  {shopItem.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-3 mt-2">
            <div className="grid grid-cols-6 gap-5 justify-center items-center mx-3">
              <div className="col-span-2">
                <TimePicker
                  time={selectStartTime}
                  onChange={(time) => setSelectStartTime(time)}
                />
              </div>
              <div className="col-span-1 text-center"> ~ </div>
              <div className="col-span-2">
                <TimePicker
                  time={selectEndTime}
                  onChange={(time) => setSelectEndTime(time)}
                />
              </div>
              <div className="col-span-1 text-center">
                <button
                  className="btn btn-circle btn-neutral btn-sm"
                  type="button"
                  onClick={handleAddReserveItem}
                >
                  <FaPlus className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* 예약 추가된 목록 */}
          <div className="col-span-3 mt-2 h-72 overflow-auto shadow-xl rounded-xl">
            {reserveItems.map((reserveItem) => (
              <div
                key={`reserve-list-item-${reserveItem.itemId}`}
                className="flex gap-2 justify-start items-center m-2 p-2 relative rounded-xl bg-slate-300"
              >
                <div className="flex-none">
                  <div
                    className="tooltip"
                    data-tip={
                      schedule?.options?.shopItems?.find(
                        (item) => item.itemId === reserveItem.itemId,
                      )?.title
                    }
                  >
                    <div className="text-left font-bold text-md w-full truncate">
                      {
                        schedule?.options?.shopItems?.find(
                          (item) => item.itemId === reserveItem.itemId,
                        )?.title
                      }
                    </div>
                  </div>
                  <div>
                    <span>{reserveItem.startTime}</span>
                    <span> ~ </span>
                    <span>{reserveItem.endTime}</span>
                  </div>
                </div>
                <div className="absolute right-4">
                  <button
                    className="btn btn-xs btn-circle btn-neutral "
                    type="button"
                    onClick={() => handleRemoveReserveItem(reserveItem.itemId)}
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* button */}
        <div className="col-span-3 mt-8 mr-2">
          <div className="flex justify-end items-center">
            <button
              className="btn btn-neutral hover:scale-105"
              type="button"
              disabled={reserveItems.length === 0}
            >
              <SiYoutubeshorts
                className={`w-6 h-6 ${
                  reserveItems.length === 0 ? 'text-gray-600' : 'text-red-600'
                }`}
              />
              숏폼 예약
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
