import axios from 'axios';

const client = axios.create({ withCredentials: true });

export async function get<R>(
  url: string,
  params?: { [name: string]: any },
): Promise<ApiResult<R>> {
  return await client
    .get(url, { params })
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