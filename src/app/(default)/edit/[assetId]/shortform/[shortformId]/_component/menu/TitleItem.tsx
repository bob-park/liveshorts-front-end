import { TitleContent } from '../type';

interface TitleItemProps {
  title: TitleContent;
  optionArray: string[];
  disabled: boolean;
  handleClickDeleteTitle: () => void;
  handleChangeTitle: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

interface LabelInputProps {
  label?: string;
  name: string;
  value: string | number;
  type?: string;
  disabled?: boolean;
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SelectProps {
  optionArray: string[];
  value: string;
  handleChangeTitle: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TitleItem({
  title,
  optionArray,
  disabled,
  handleClickDeleteTitle,
  handleChangeTitle,
}: TitleItemProps) {
  const {
    text,
    x1,
    y1,
    x2,
    y2,
    font,
    size,
    color,
    background,
    textOpacity,
    bgOpacity,
  } = title;

  return (
    <div className="flex flex-col gap-2 p-1">
      <LabelInput
        name="text"
        value={text}
        handleChangeTitle={handleChangeTitle}
      />

      <div className="flex gap-2">
        <LabelInput
          label="X1"
          name="x1"
          value={x1}
          disabled={disabled}
          handleChangeTitle={handleChangeTitle}
        />
        <LabelInput
          label="X2"
          name="x2"
          value={x2}
          disabled={disabled}
          handleChangeTitle={handleChangeTitle}
        />
      </div>

      <div className="flex gap-2">
        <LabelInput
          label="Y1"
          name="y1"
          value={y1}
          disabled={disabled}
          handleChangeTitle={handleChangeTitle}
        />
        <LabelInput
          label="Y2"
          name="y2"
          value={y2}
          disabled={disabled}
          handleChangeTitle={handleChangeTitle}
        />
      </div>

      <div>
        <span className="text-slate-400 text-xs">Text</span>
        <div className="flex flex-col gap-2">
          <Select
            optionArray={optionArray}
            value={font}
            handleChangeTitle={handleChangeTitle}
          />
          <LabelInput
            label="Size"
            name="size"
            value={size}
            handleChangeTitle={handleChangeTitle}
          />
          <LabelInput
            label="Color"
            name="color"
            value={color}
            type="color"
            handleChangeTitle={handleChangeTitle}
          />
          <LabelInput
            label="Opacity"
            name="textOpacity"
            value={textOpacity}
            handleChangeTitle={handleChangeTitle}
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
            handleChangeTitle={handleChangeTitle}
          />
          <LabelInput
            label="Opacity"
            name="bgOpacity"
            value={bgOpacity}
            handleChangeTitle={handleChangeTitle}
          />
        </div>
      </div>

      <div className="flex gap-2 self-end mt-6">
        <button className="btn">저장</button>
        <button className="btn" onClick={handleClickDeleteTitle}>
          삭제
        </button>
      </div>
    </div>
  );
}

function LabelInput({
  label,
  value,
  name,
  type,
  disabled,
  handleChangeTitle,
}: LabelInputProps) {
  return label ? (
    <label className="input input-bordered input-sm w-full min-w-1 flex items-center gap-2">
      <span className="text-slate-400 text-xs">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={handleChangeTitle}
        className={`${disabled && 'text-slate-400'} grow w-[100px]`}
      />
      {type === 'color' && (
        <input
          name={name}
          type="color"
          value={value}
          onChange={handleChangeTitle}
        />
      )}
    </label>
  ) : (
    <input
      type="text"
      name={name}
      value={value}
      disabled={disabled}
      onChange={handleChangeTitle}
      className={`${
        disabled && 'text-slate-400'
      } input input-bordered input-sm w-full min-w-1`}
    />
  );
}

function Select({ optionArray, value, handleChangeTitle }: SelectProps) {
  return (
    <select
      name="font"
      className="select select-sm select-bordered w-full max-w-xs"
      onChange={handleChangeTitle}
      value={value}
    >
      {optionArray.map((v, i) => (
        <option key={i} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}
