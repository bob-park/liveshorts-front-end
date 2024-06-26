import { TimeObject } from "@/app/(default)/edit/[assetId]/shortform/[shortformId]/_component/type";

interface TimeInputProps {
  value: TimeObject;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  correctInput?(e: React.FocusEvent<HTMLInputElement>): void;
}

interface IndividualInputProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  correctInput?(e: React.FocusEvent<HTMLInputElement>): void;
}

export default function TimeInput({ value, handleChange, correctInput }: TimeInputProps) {
  return (
    <div
      className={`
    flex gap-[2px] h-[30px] items-center justify-evenly
    input-bordered input w-full
    `}
    >
      <IndividualInput name="hour" value={value.hour} handleChange={handleChange} correctInput={correctInput} />
      <span>:</span>
      <IndividualInput name="min" value={value.min} handleChange={handleChange} correctInput={correctInput} />
      <span>:</span>
      <IndividualInput name="sec" value={value.sec} handleChange={handleChange} correctInput={correctInput} />
    </div>
  );
}

function IndividualInput({ name, value, handleChange, correctInput }: IndividualInputProps) {
  function maxLengthCheck(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.value.length > e.currentTarget.maxLength) {
      e.currentTarget.value = e.currentTarget.value.slice(0, e.currentTarget.maxLength);
    }
  }
  return (
    <input
      type="number"
      name={name}
      value={value}
      maxLength={2}
      step={1}
      min={0}
      onInput={maxLengthCheck}
      onChange={handleChange}
      onBlur={correctInput}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className={`
      timeInput
    w-[20px] bg-[none]
    focus:outline-0
       `}
    />
  );
}
