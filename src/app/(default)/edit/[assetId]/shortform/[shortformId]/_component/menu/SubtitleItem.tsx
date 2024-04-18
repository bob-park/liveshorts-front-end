import { SubtitleContent } from "../type";
import { FONT_ARRAY } from "../EditShorts";
import TimeInput from "@/components/edit/TimeInput";

interface SubtitleItemProps {
  subtitle: SubtitleContent;
  disabled: boolean;
  handleClickDeleteSubtitle: () => void;
  handleChangeSubtitle: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleChangeSubtitleStartTime(e: React.ChangeEvent<HTMLInputElement>): void;
  handleChangeSubtitleEndTime(e: React.ChangeEvent<HTMLInputElement>): void;
}

interface LabelInputProps {
  label?: string;
  name: string;
  value: string | number;
  type?: string;
  disabled?: boolean;
  handleChangeSubtitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SelectProps {
  value: string;
  handleChangeSubtitle: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SubtitleItem({
  subtitle,
  disabled,
  handleClickDeleteSubtitle,
  handleChangeSubtitle,
  handleChangeSubtitleStartTime,
  handleChangeSubtitleEndTime,
}: SubtitleItemProps) {
  const { text, x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity, startTime, endTime } = subtitle;

  return (
    <div className="flex flex-col gap-2 p-1">
      <LabelInput name="text" value={text} handleChangeSubtitle={handleChangeSubtitle} />

      <div className="flex gap-2">
        <LabelInput label="X1" name="x1" value={x1} disabled={disabled} handleChangeSubtitle={handleChangeSubtitle} />
        <LabelInput label="X2" name="x2" value={x2} disabled={disabled} handleChangeSubtitle={handleChangeSubtitle} />
      </div>

      <div className="flex gap-2">
        <LabelInput label="Y1" name="y1" value={y1} disabled={disabled} handleChangeSubtitle={handleChangeSubtitle} />
        <LabelInput label="Y2" name="y2" value={y2} disabled={disabled} handleChangeSubtitle={handleChangeSubtitle} />
      </div>

      <div>
        <span className="text-slate-400 text-xs">Text</span>
        <div className="flex flex-col gap-2">
          <Select value={font} handleChangeSubtitle={handleChangeSubtitle} />
          <LabelInput label="Size" name="size" value={size} handleChangeSubtitle={handleChangeSubtitle} />
          <LabelInput
            label="Color"
            name="color"
            value={color}
            type="color"
            handleChangeSubtitle={handleChangeSubtitle}
          />
          <LabelInput
            label="Opacity"
            name="textOpacity"
            value={textOpacity}
            handleChangeSubtitle={handleChangeSubtitle}
          />
        </div>
      </div>

      <div>
        <span className="text-slate-400 text-xs">Background</span>
        <div className="flex flex-col gap-2">
          <LabelInput
            label="Color"
            name="background"
            value={background}
            type="color"
            handleChangeSubtitle={handleChangeSubtitle}
          />
          <LabelInput label="Opacity" name="bgOpacity" value={bgOpacity} handleChangeSubtitle={handleChangeSubtitle} />
        </div>
      </div>

      <div>
        <span className="text-slate-400 text-xs">Time</span>
        <div className="flex flex-col gap-2">
          <TimeInput value={startTime} handleChange={handleChangeSubtitleStartTime} />
          <TimeInput value={endTime} handleChange={handleChangeSubtitleEndTime} />
        </div>
      </div>

      <div className="flex gap-2 self-end mt-6">
        <button className="btn">저장</button>
        <button className="btn" onClick={handleClickDeleteSubtitle}>
          삭제
        </button>
      </div>
    </div>
  );
}

function LabelInput({ label, value, name, type, disabled, handleChangeSubtitle }: LabelInputProps) {
  return label ? (
    <label className="input input-bordered input-sm w-full min-w-1 flex items-center gap-2">
      <span className="text-slate-400 text-xs">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={handleChangeSubtitle}
        className={`${disabled && "text-slate-400"} grow w-[100px]`}
      />
      {type === "color" && <input name={name} type="color" value={value} onChange={handleChangeSubtitle} />}
    </label>
  ) : (
    <input
      type="text"
      name={name}
      value={value}
      disabled={disabled}
      onChange={handleChangeSubtitle}
      className={`${disabled && "text-slate-400"} input input-bordered input-sm w-full min-w-1`}
    />
  );
}

function Select({ value, handleChangeSubtitle }: SelectProps) {
  return (
    <select
      name="font"
      className="select select-sm select-bordered w-full max-w-xs"
      onChange={handleChangeSubtitle}
      value={value}
    >
      {FONT_ARRAY.map((v, i) => (
        <option key={i} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}
