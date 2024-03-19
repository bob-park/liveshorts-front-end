// react
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// react icons
import { IoPlay, IoPause } from 'react-icons/io5';

type ShortFormViewProps = {
  show: boolean;
  task?: ShortFormTask;
  onBackdrop?: () => void;
};

export default function ShortFormPreview(props: ShortFormViewProps) {
  // props
  const { show, task, onBackdrop } = props;

  // state
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [shortFormSrc, setShortFormSrc] = useState<string>('');
  const [shortFormProgress, setShortFormProgress] = useState<number>(0);
  const [hover, setHover] = useState<boolean>(false);

  // ref
  const shortFormRef = useRef<HTMLVideoElement>(null);

  // useLayoutEffect
  useLayoutEffect(() => {
    const modal = document.getElementById(
      'short_form_preview_modal',
    ) as HTMLDialogElement;

    show && modal.showModal();

    if (task) {
      setShortFormSrc(
        `/api/v1/shorts/task/${task.id}/resource?t=${new Date().getTime()}`,
      );
      setShortFormProgress(0);
      setIsPlay(false);

      // shortFormRef.current?.load();
    }
  }, [show, task]);

  // handle
  const handleBackdrop = () => {
    onBackdrop && onBackdrop();

    if (shortFormRef.current) {
      shortFormRef.current.pause();
      onBackdrop && onBackdrop();
    }
  };

  const handlePlay = () => {
    !isPlay ? shortFormRef.current?.play() : shortFormRef.current?.pause();
  };

  const handleKeyboardDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      handleBackdrop();
    }
  };

  return (
    <dialog
      id="short_form_preview_modal"
      className="modal modal-bottom sm:modal-middle"
      onKeyDownCapture={handleKeyboardDown}
    >
      <div className="modal-box h-full">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleBackdrop}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">숏폼 미리보기</h3>
        <div
          className="grid grid-cols-1 w-full h-fit mt-5 relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="col-span-1 size-full ">
            {task && (
              <video
                className="size-full rounded-2xl"
                src={shortFormSrc}
                ref={shortFormRef}
                onTimeUpdate={(e) => {
                  setShortFormProgress(
                    Math.floor(
                      (e.currentTarget.currentTime / e.currentTarget.duration) *
                        100,
                    ),
                  );
                }}
                onPlay={() => setIsPlay(true)}
                onPause={() => setIsPlay(false)}
                onLoadedMetadata={(e) => e.currentTarget.play()}
              />
            )}
          </div>

          {task && (
            <div className="absolute top-3 left-0 w-full px-4 ">
              <div className="relative w-full h-1 bg-gray-400">
                <div
                  className={`absolute top-0 left-0 bg-white h-1 ${
                    isPlay ? 'transition-all duration-500' : ''
                  }`}
                  style={{ width: `${shortFormProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          <div
            className={`absolute top-0 left-0 size-full rounded-2xl transition-opacity duration-300 ${
              hover
                ? 'opacity-100 bg-gradient-to-b from-black via-transparent to-black'
                : 'opacity-0'
            }`}
          >
            <button
              className="btn btn-sm btn-ghost text-white mt-5 ml-2"
              type="button"
              onClick={handlePlay}
            >
              {isPlay ? (
                <IoPause className="w-5 h-5" />
              ) : (
                <IoPlay className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
