import { NextRequest, NextResponse } from 'next/server';

const API_PREFIX = '/api';
const UNCHECKED_AUTH_URI_PATTERNS: string[] = ['/api/user/login'];

const REDIRECT_URI_PATTERNS = ['/api/user/logout'];

const MAM_API_HOST = process.env.MAM_API_HOST;

function uncheckedAuth(url: string) {
  return UNCHECKED_AUTH_URI_PATTERNS.some((checkedUrl) => checkedUrl == url);
}

function checkInCludeRangeHeader(url: string) {
  return url.endsWith('resource');
}

async function callApi(
  url: string,
  method: string,
  accessToken: string | undefined,
  headers: Headers,
  params?: URLSearchParams,
  body?: any,
) {
  const isIncludeRange = checkInCludeRangeHeader(url);

  let replaceUrl = url;

  if (replaceUrl.endsWith('download')) {
    replaceUrl = url.substring(0, url.lastIndexOf('download') - 1);
  }

  let apiHeaders = new Headers();

  apiHeaders.append('Authorization', `Bearer ${accessToken}`);
  apiHeaders.append('User-Agent', headers.get('User-Agent') || '');
  apiHeaders.append('Content-Type', 'application/json');
  apiHeaders.append(
    'X-Forwarded-For',
    headers.get('X-Forwarded-For')?.split(',')[0] || '',
  );

  if (isIncludeRange) {
    apiHeaders.append('Range', headers.get('Range') || 'bytes=0-');
  }

  const response = await fetch(
    `${MAM_API_HOST + API_PREFIX + replaceUrl}${params ? `?${params}` : ''}`,
    {
      method,
      headers: apiHeaders,
      body,
    },
  );

  return response;
}

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  const pathname = nextUrl.pathname;
  const response = NextResponse.next();

  const isApi = pathname.startsWith(API_PREFIX);

  if (isApi) {
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

    if (uncheckedAuth(pathname) && apiResponse.status === 401) {
      return new NextResponse(apiResponse.body, {
        ...apiResponse,
        status: 401,
      });
    }

    return apiResponse;
  }

  return response;
}
