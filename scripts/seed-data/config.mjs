import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

/** .env.local 에서 NEXT_PUBLIC_API_BASE_URL 을 직접 읽어온다 (process.env 에 없을 경우 대비). */
const readEnvLocal = (key) => {
  try {
    const content = readFileSync(path.join(projectRoot, '.env.local'), 'utf-8');
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match?.[1]?.trim();
  } catch {
    return undefined;
  }
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  readEnvLocal('NEXT_PUBLIC_API_BASE_URL');

if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL 을 찾을 수 없습니다. .env.local 을 확인하거나 환경변수로 넘겨주세요.'
  );
}

/**
 * 백엔드(GlobalNomad API)에 직접 요청을 보내는 얇은 fetch 래퍼.
 * 이 프로젝트의 seed 스크립트는 Next.js 서버 없이 독립 실행되므로
 * BFF(/api/proxy)를 거치지 않고 백엔드를 바로 호출한다.
 */
export const apiRequest = async (
  endpoint,
  { method = 'GET', body, accessToken, isFormData = false } = {}
) => {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    const message = data?.message ?? `API Error: ${response.status}`;
    throw new Error(`[${method} ${endpoint}] ${message}`);
  }

  return data;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
