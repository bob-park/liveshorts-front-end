import { TimeObject } from "@/components/edit/TimeInput";

export function secondsToHhmmss(seconds: number) {
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);

  const HH = String(hour).padStart(2, "0");
  const MM = String(min).padStart(2, "0");
  const SS = String(sec).padStart(2, "0");

  return `${HH}:${MM}:${SS}`;
}

export function secondsToTimeObject(seconds: number) {
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  const formattedHour = String(hour).padStart(2, "0");
  const formattedMin = String(min).padStart(2, "0");
  const formattedSec = String(sec).padStart(2, "0");

  return {
    hour: formattedHour,
    min: formattedMin,
    sec: formattedSec,
  };
}

export function timeObjectToSeconds(time: TimeObject) {
  const { hour, min, sec } = time;
  const numberHour = Number(hour);
  const numberMin = Number(min);
  const numberSec = Number(sec);

  return numberHour * 3600 + numberMin * 60 + numberSec;
}

export function fillRangeWithInterval(number: number, videoDuration: number) {
  const interval = videoDuration / (number - 1);

  const result = [];
  for (let i = 0; i < number - 1; i++) {
    result.push(Math.round(i * interval));
  }
  const timeArray = result.map((v) => secondsToHhmmss(v));

  return timeArray;
}
