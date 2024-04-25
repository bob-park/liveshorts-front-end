import EditShorts from "./EditShorts";
import { cookies } from "next/headers";

const MAM_API_HOST = process.env.MAM_API_HOST;
const API_PREFIX = "/api";

export default async function ResourceProvider({ assetId, shortformId }: { assetId: number; shortformId: string }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  const videoSrc = `/api/v1/asset/${assetId}/resource?fileType=HI_RES&t=${new Date().getTime()}`;

  const templateResult = await fetch(`${MAM_API_HOST}${API_PREFIX}/v1/shorts/template/list`, { headers });
  const templateList = await templateResult.json();

  const bgmResult = await fetch(`${MAM_API_HOST}${API_PREFIX}/v1/shorts/bgm/list`, { headers });
  const bgmList = await bgmResult.json();

  return (
    <EditShorts shortformId={shortformId} videoSrc={videoSrc} templateList={templateList.result} bgmList={bgmList} />
  );
}
