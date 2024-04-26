import { ActivePanel, Bgm, WorkMenu } from "../type";
import SimpleAudioPlayer from "./SimpleAudioPlayer";
import { bgmListDummy } from "./dummy";

interface BgmMenuProps {
  bgmList: Bgm[];
  selectedBgmId: string;
  handleClickBgm(bgm?: Bgm): void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
  handleClickPanel(panel: ActivePanel): void;
}

export default function BgmMenu({
  bgmList,
  selectedBgmId,
  handleClickBgm,
  handleClickWorkMenu,
  handleClickPanel,
}: BgmMenuProps) {
  return (
    <div
      onClick={() => {
        handleClickWorkMenu("bgm");
        handleClickPanel("bgm");
      }}
      className="p-2 flex flex-col gap-2"
    >
      <button
        onClick={() => {
          handleClickBgm();
        }}
        className="btn w-full"
      >
        BGM 사용 안함
      </button>

      <div className="p-2 flex flex-col gap-4 h-[calc(100vh-500px)] overflow-y-scroll">
        {bgmListDummy.map((v, i) => (
          <div
            key={i}
            onClick={() => {
              handleClickBgm(v);
            }}
            className={`
            card shadow-xl cursor-pointer
            ${selectedBgmId === v.bgmId && "outline outline-4 outline-slate-600 bg-slate-100"}
            hover:bg-slate-100`}
          >
            <div className="card-body flex flex-col gap-4">
              <span className="card-title">{v.title}</span>
              <SimpleAudioPlayer src={`/api/v1/asset/${v.bgmId}/resource?fileType=HI_RES`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
