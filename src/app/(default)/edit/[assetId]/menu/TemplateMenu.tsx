import { Template } from "../type";

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

      <div className="p-2 flex flex-col gap-4 h-[calc(100vh-440px)] overflow-y-scroll">
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
            <div className="card-body">
              <span className="card-title">{v.title}</span>
              <img src={`/api/v1/shorts/template/${v.templateId}/file`} alt="template-img" className="w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
