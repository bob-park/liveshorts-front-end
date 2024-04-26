import { ActivePanel, WorkMenu } from "./type";

interface TabMenuProps {
  selectedWorkMenu: WorkMenu;
  handleClickWorkMenu(workMenu: WorkMenu): void;
  handleClickPanel(panel: ActivePanel): void;
}

interface TabMenuItemProps {
  value: string;
  isSelected: boolean;
  handleClickWorkMenu(): void;
}

export default function TabMenu({ selectedWorkMenu, handleClickWorkMenu, handleClickPanel }: TabMenuProps) {
  return (
    <div role="tablist" className="w-full tab tabs-boxed p-0 border-slate-700">
      <TabMenuItem
        value="템플릿"
        isSelected={selectedWorkMenu === "template"}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("template");
          handleClickPanel("video");
        }}
      />
      <TabMenuItem
        value="제목"
        isSelected={selectedWorkMenu === "title"}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("title");
          handleClickPanel("title");
        }}
      />
      <TabMenuItem
        value="자막"
        isSelected={selectedWorkMenu === "subtitle"}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("subtitle");
          handleClickPanel("subtitle");
        }}
      />
      <TabMenuItem
        value="BGM"
        isSelected={selectedWorkMenu === "bgm"}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("bgm");
          handleClickPanel("bgm");
        }}
      />
    </div>
  );
}

function TabMenuItem({ value, isSelected, handleClickWorkMenu }: TabMenuItemProps) {
  return (
    <a
      id={`${isSelected && "active-tab"}`}
      role="tab"
      onClick={() => {
        handleClickWorkMenu();
      }}
      className={`
        tab w-1/4
        ${isSelected && "tab-active "}
      `}
    >
      {value}
    </a>
  );
}
