import EditShorts from './EditShorts';
import { cookies } from 'next/headers';

const MAM_API_HOST = process.env.MAM_API_HOST;
const API_PREFIX = '/api';

export default async function TemplateProvider({
  assetId,
}: {
  assetId: number;
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  //   headers.append("User-Agent", headers.get("User-Agent") || "");
  headers.append('Content-Type', 'application/json');

  const result = await fetch(
    `${MAM_API_HOST}/${API_PREFIX}/v1/shorts/template/list`,
  );
  const templateList = await result.json();

  return <EditShorts assetId={assetId} templateList={templateList} />;
}
