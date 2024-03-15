export default function CreateShorts() {
  return (
    <div className="grid grid-rows-[1fr,300px] h-full">
      <div className="grid grid-cols-[300px,1fr] border-b">
        <div className="border-r">작업 패널</div>
        <div>
          <video src="/Users/cjc/Downloads/test.mp4"></video>
        </div>
      </div>
      <div className="">프로그레스바</div>
    </div>
  );
}
