import { NextRequest, NextResponse } from 'next/server';

const API_PREFIX = '/api';
const UNCHECKED_URI_PATTERNS: string[] = [];

const MAM_API_HOST = process.env.MAM_API_HOST;

function checkedAuth(url: string) {
  if (UNCHECKED_URI_PATTERNS.some((checkedUrl) => checkedUrl == url)) {
    return false;
  }

  return url.startsWith(API_PREFIX);
}

async function callApi(
  url: string,
  method: string,
  accessToken: string | undefined,
  headers: Headers,
  params?: URLSearchParams,
  body?: any,
) {
  const response = await fetch(
    `${MAM_API_HOST + API_PREFIX + url}${params ? `?${params}` : ''}`,
    {
      method,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': headers.get('User-Agent') || '',
      },
      body,
    },
  );

  return response;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const response = NextResponse.next();
  const cookies = req.cookies;

  if (checkedAuth(pathname)) {
    const requestUrl = pathname.substring(API_PREFIX.length);

    const params = req.nextUrl.searchParams;

    const body = req.body;

    const apiResponse = await callApi(
      requestUrl,
      req.method,
      cookies.get('accessToken')?.value,
      req.headers,
      params,
      body,
    );

    return new NextResponse(apiResponse.body, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: apiResponse.headers,
    });
  }

  return response;
}
