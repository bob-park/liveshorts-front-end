import { TimeObject } from "./type";

export function secondsToHhmmss(seconds: number) {
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);

  const HH = String(hour).padStart(2, "0");
  const MM = String(min).padStart(2, "0");
  const SS = String(sec).padStart(2, "0");

  return `${HH}:${MM}:${SS}`;
}

export function secondsToMmss(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  const MM = String(min).padStart(2, "0");
  const SS = String(sec).padStart(2, "0");

  return `${MM}:${SS}`;
}

export function secondsToTimeObject(seconds: number) {
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = Math.round(seconds % 60);

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

export function hexToRgba(hex: string, alpha?: number) {
  if (!hex) {
    return;
  }

  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha !== undefined) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export function generateTimeArray(startSeconds: number, endSeconds: number, stepSeconds: number) {
  const timeArray = [];
  for (let i = startSeconds; i <= endSeconds; i += stepSeconds) {
    timeArray.push(secondsToHhmmss(i));
  }
  return timeArray;
}
