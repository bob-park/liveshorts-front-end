export default function GlobalLoading() {
  return (
    <div className="flex gap-x-2 justify-center items-center w-screen h-screen">
      <span className="loading loading-infinity loading-lg" />
      <h4 className="font-bold text-xl">loading...</h4>
    </div>
  );
}
