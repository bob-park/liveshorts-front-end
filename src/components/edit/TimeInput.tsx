export interface TimeObject {
  hour: string;
  min: string;
  sec: string;
}

interface TimeInputProps {
  value: TimeObject;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IndividualInputProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TimeInput({ value, handleChange }: TimeInputProps) {
  return (
    <div
      className={`
    flex gap-[2px] justify-between
    `}
    >
      <IndividualInput name="hour" value={value.hour} handleChange={handleChange} />
      <span>:</span>
      <IndividualInput name="min" value={value.min} handleChange={handleChange} />
      <span>:</span>
      <IndividualInput name="sec" value={value.sec} handleChange={handleChange} />
    </div>
  );
}

function IndividualInput({ name, value, handleChange }: IndividualInputProps) {
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
      className={`
      timeInput
    w-[20px] bg-[none]
    focus:outline-0
       `}
    />
  );
}
