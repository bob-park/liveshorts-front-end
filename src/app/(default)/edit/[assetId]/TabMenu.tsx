import { WorkMenu } from "./EditShorts";

interface TabMenuProps {
  selectedWorkMenu: WorkMenu;
  handleClick: (workMenu: WorkMenu) => void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
}

interface TabMenuItemProps {
  value: string;
  isSelected: boolean;
  handleClick: () => void;
  handleClickWorkMenu(): void;
}

export default function TabMenu({ selectedWorkMenu, handleClick, handleClickWorkMenu }: TabMenuProps) {
  return (
    <div role="tablist" className="w-full tab tabs-boxed p-0 border-slate-700">
      <TabMenuItem
        value="템플릿"
        isSelected={selectedWorkMenu === "template"}
        handleClick={() => {
          handleClick("template");
        }}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("template");
        }}
      />
      <TabMenuItem
        value="제목"
        isSelected={selectedWorkMenu === "title"}
        handleClick={() => {
          handleClick("title");
        }}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("title");
        }}
      />
      <TabMenuItem
        value="자막"
        isSelected={selectedWorkMenu === "subtitle"}
        handleClick={() => {
          handleClick("subtitle");
        }}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("subtitle");
        }}
      />
      <TabMenuItem
        value="BGM"
        isSelected={selectedWorkMenu === "bgm"}
        handleClick={() => {
          handleClick("bgm");
        }}
        handleClickWorkMenu={() => {
          handleClickWorkMenu("bgm");
        }}
      />
    </div>
  );
}

function TabMenuItem({ value, isSelected, handleClick, handleClickWorkMenu }: TabMenuItemProps) {
  return (
    <a
      id={`${isSelected && "active-tab"}`}
      role="tab"
      onClick={() => {
        handleClick();
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
