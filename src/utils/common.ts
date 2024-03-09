import axios from 'axios';

type FileSize = {
  size: number;
  unit: number;
};

const client = axios.create({ withCredentials: true });

const FILE_SIZE_UNITS = ['byte', 'KB', 'MB', 'GB', 'TB'];

export async function get<R>(
  url: string,
  params?: { [name: string]: any },
): Promise<ApiResult<R>> {
  const urlSearchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value instanceof Array) {
      value.forEach((item) => {
        urlSearchParams.append(key, item);
      });
    } else {
      urlSearchParams.set(key, value);
    }
  });

  return await client
    .get(url + '?' + urlSearchParams.toString().replaceAll('%2B', '+'))
    .then((res) => {
      return {
        state: 'SUCCESS' as ApiResultState,
        status: res.status,
        data: res.data.result as R,
        page: res.data.page,
      };
    })
    .catch((err) => {
      console.error(err);

      return {
        state: 'FAILURE',
        status: err.response.status,
        error: {
          message: err.response.data?.error?.message,
        },
      };
    });
}
export async function post<B, R>(url: string, body?: B): Promise<ApiResult<R>> {
  return client
    .post(url, body)
    .then((res) => {
      return {
        state: 'SUCCESS' as ApiResultState,
        status: res.status,
        data: res.data.result as R,
      };
    })
    .catch((err) => {
      console.error(err);

      return {
        state: 'FAILURE',
        status: err.response.status,
        error: {
          message: err.response.data?.error?.message,
        },
      };
    });
}

export async function put<B, R>(url: string, body?: B): Promise<ApiResult<R>> {
  return client
    .put(url, body)
    .then((res) => {
      return {
        state: 'SUCCESS' as ApiResultState,
        status: res.status,
        data: res.data.result as R,
      };
    })
    .catch((err) => {
      console.error(err);

      return {
        state: 'FAILURE',
        status: err.response.status,
        error: {
          message: err.response.data?.error?.message,
        },
      };
    });
}

export async function del<B, R>(url: string): Promise<ApiResult<R>> {
  return client
    .delete(url)
    .then((res) => {
      return {
        state: 'SUCCESS' as ApiResultState,
        status: res.status,
        data: res.data.result as R,
      };
    })
    .catch((err) => {
      console.error(err);

      return {
        state: 'FAILURE',
        status: err.response.status,
        error: {
          message: err.response.data?.error?.message,
        },
      };
    });
}

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
