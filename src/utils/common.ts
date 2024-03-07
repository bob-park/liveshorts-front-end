import axios from 'axios';

const client = axios.create({ withCredentials: true });

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
    .get(url + '?' + urlSearchParams)
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
