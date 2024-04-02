import { WorkMenu } from "./EditShorts";

interface TabMenuProps {
  selectedWorkMenu: WorkMenu;
  handleClick: (workMenu: WorkMenu) => void;
}

interface TabMenuItemProps {
  value: string;
  isSelected: boolean;
  handleClick: () => void;
}

export default function TabMenu({ selectedWorkMenu, handleClick }: TabMenuProps) {
  return (
    <div role="tablist" className="w-full tab tabs-boxed p-0 border-slate-700">
      <TabMenuItem
        value="Title"
        isSelected={selectedWorkMenu === "title"}
        handleClick={() => {
          handleClick("title");
        }}
      />
      <TabMenuItem
        value="Subtitle"
        isSelected={selectedWorkMenu === "subtitle"}
        handleClick={() => {
          handleClick("subtitle");
        }}
      />
      <TabMenuItem
        value="BGM"
        isSelected={selectedWorkMenu === "bgm"}
        handleClick={() => {
          handleClick("bgm");
        }}
      />
    </div>
  );
}

function TabMenuItem({ value, isSelected, handleClick }: TabMenuItemProps) {
  return (
    <a
      id={`${isSelected && "active-tab"}`}
      role="tab"
      onClick={handleClick}
      className={`
        tab w-1/3
        ${isSelected && "tab-active "}
      `}
    >
      {value}
    </a>
  );
}
