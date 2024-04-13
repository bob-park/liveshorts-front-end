import axios from 'axios';

type FileSize = {
  size: number;
  unit: number;
};

type Status = {
  id: string;
  name: string;
  color: string;
};

const client = axios.create({
  withCredentials: true,
});
client.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (err) => {
    console.error(err);

    if (err.response.status === 401) {
      location.href = '/login';
    }

    return Promise.reject(err);
  },
);

const FILE_SIZE_UNITS = ['byte', 'KB', 'MB', 'GB', 'TB'];

const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

const statusList: Status[] = [
  {
    id: 'WAITING',
    name: '대기',
    color: 'neutral',
  },
  {
    id: 'PROCEEDING',
    name: '진행중',
    color: 'secondary',
  },
  {
    id: 'SUCCESS',
    name: '완료',
    color: 'primary',
  },
  {
    id: 'FAILURE',
    name: '실패',
    color: 'error',
  },
];

export function decodeJwt(token: string) {
  const base64Payload = token.split('.')[1];
  const payload = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payload.toString());
}

export function convertFileSize(fileSize: number = 0) {
  const { size, unit } = calculateFileSize(fileSize, 0);

  let result = size.toFixed(2);
  const remainder = size % 100;

  if (remainder === 0) {
    result = size + '';
  }

  return result + ' ' + FILE_SIZE_UNITS[unit];
}

function calculateFileSize(fileSize: number, unit: number): FileSize {
  const result = fileSize / 1_024;

  if (result > 1) {
    unit++;
  }

  if (result > 1_024) {
    return calculateFileSize(result, unit);
  }

  return { size: result, unit };
}

export function secondToTimecode(totalSeconds: number) {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);
  const hour = Math.floor(minutes / 60);

  return (
    `${hour > 9 ? hour : `0${hour}`}` +
    ':' +
    `${minutes % 60 > 9 ? minutes % 60 : `0${minutes % 60}`}` +
    ':' +
    `${seconds > 9 ? seconds : `0${seconds}`}`
  );
}

export function parseStatus(status?: string) {
  const result = statusList.find((item) => item.id === status);

  return result?.name;
}

export function parseStatusColor(status: string) {
  const result = statusList.find((item) => item.id === status);

  return result?.color;
}

export function getDayOfWeek(dayOfWeek: number) {
  return DAY_OF_WEEK[dayOfWeek];
}
