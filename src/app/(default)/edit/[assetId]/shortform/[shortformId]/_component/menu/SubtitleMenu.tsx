import { ActivePanel, WorkMenu } from "../type";

interface SubtitleMenuProps {
  handleClickWorkMenu(workMenu: WorkMenu): void;
  handleClickPanel(panel: ActivePanel): void;
}

export default function SubtitleMenu({ handleClickWorkMenu, handleClickPanel }: SubtitleMenuProps) {
  return (
    <div
      onClick={() => {
        handleClickWorkMenu("bgm");
        handleClickPanel("bgm");
      }}
    >
      w
    </div>
  );
}
