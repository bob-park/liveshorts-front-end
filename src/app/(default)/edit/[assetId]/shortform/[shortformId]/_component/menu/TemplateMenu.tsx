import { Template } from "../type";
import TemplateMenuImage from "./TemplateMenuImage";

interface TemplateMenuProps {
  templateList: Template[];
  selectedTemplateId: string;
  handleClickTemplate(template?: Template): void;
}

export default function TemplateMenu({ templateList, selectedTemplateId, handleClickTemplate }: TemplateMenuProps) {
  return (
    <div className="p-2 flex flex-col gap-2">
      <button
        onClick={() => {
          handleClickTemplate();
        }}
        className="btn w-full"
      >
        템플릿 사용 안함
      </button>

      <div className="p-2 flex flex-col gap-4 h-[calc(100vh-500px)] overflow-y-scroll">
        {templateList.map((v, i) => (
          <div
            key={i}
            onClick={() => {
              handleClickTemplate(v);
            }}
            className={`
            card shadow-xl cursor-pointer
            ${selectedTemplateId === v.templateId && "outline outline-4 outline-slate-600 bg-slate-100"}
            hover:bg-slate-100`}
          >
            <div className="card-body flex flex-col gap-4">
              <span className="card-title">{v.title}</span>
              <TemplateMenuImage templateId={v.templateId} className="w-1/2 mx-auto border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
