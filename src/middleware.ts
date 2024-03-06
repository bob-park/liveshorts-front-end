import axios from 'axios';

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const API_PREFIX = '/api';
const UNCHECKED_AUTH_URI_PATTERNS: string[] = ['/api/user/login'];

const MAM_API_HOST = process.env.MAM_API_HOST;

function checkedAuth(url: string) {
  return !UNCHECKED_AUTH_URI_PATTERNS.some((checkedUrl) => checkedUrl == url);
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
        Range: headers.get('Range') || '',
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

    if (checkedAuth(pathname) && apiResponse.status === 401) {
      console.log('no auth.');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return apiResponse;
  }

  return response;
}
