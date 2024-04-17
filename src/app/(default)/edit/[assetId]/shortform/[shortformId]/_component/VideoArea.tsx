import TitleInput from "./menu/TitleInput";
import { ActivePanel, Template, TitleContent, WorkMenu } from "./type";

interface VideoAreaProps {
  videoAreaRef: React.RefObject<HTMLDivElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  templateImageRef: React.RefObject<HTMLDivElement>;
  loaded: boolean;
  hasTitle: boolean;
  templateImageSize: { width: number; height: number };
  selectedTemplate: Template | null;
  titleContent: TitleContent;
  videoSrc: string;
  videoX: number;
  handleChangeTitle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
  handleMouseDownVideo(e: React.MouseEvent<HTMLVideoElement>): void;
  handleLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>): void;
  handleTimeUpdate(time: number): void;
  handleClickPanel(panel: ActivePanel): void;
  handlePause(): void;
  handlePlay(): void;
}

export default function VideoArea({
  videoAreaRef,
  videoRef,
  templateImageRef,
  loaded,
  hasTitle,
  templateImageSize,
  selectedTemplate,
  titleContent,
  videoSrc,
  videoX,
  handleChangeTitle,
  handleClickWorkMenu,
  handleMouseDownVideo,
  handleLoadedMetadata,
  handleTimeUpdate,
  handleClickPanel,
  handlePause,
  handlePlay,
}: VideoAreaProps) {
  return (
    <div
      ref={videoAreaRef}
      style={{ minWidth: videoRef.current?.clientWidth }}
      className={`relative min-h-[100px] h-[calc(100vh-500px)] w-[calc(100vw-100px)] flex justify-center items-center m-auto overflow-hidden`}
    >
      {!loaded && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading loading-spinner loading-lg text-black" />
      )}

      <div
        ref={templateImageRef}
        onClick={(e) => {
          e.stopPropagation();
          handleClickPanel("template");
          handleClickWorkMenu("template");
        }}
        style={{ width: templateImageSize.width, height: templateImageSize.height }}
        className={`relative border border-green-500 ${loaded ? "block" : "hidden"}`}
      >
        <div
          style={{
            height:
              templateImageSize.height *
              ((selectedTemplate?.videoPosition.y2 ?? 1) - (selectedTemplate?.videoPosition.y1 ?? 0)),
            top: (videoAreaRef.current?.clientHeight ?? 0) * (selectedTemplate?.videoPosition.y1 ?? 0),
          }}
          className="absolute w-full border border-red-500 z-10"
        ></div>
        {/* TODO - 이부분 에러 처리 */}
        <img
          src={`/api/v1/shorts/template/${selectedTemplate?.templateId}/file`}
          alt="template-img"
          className="w-full h-full"
        />
        {hasTitle && titleContent && !selectedTemplate?.options.title.none && (
          <TitleInput
            title={titleContent}
            templateWidth={templateImageSize.width}
            handleChangeTitle={handleChangeTitle}
            handleClickPanel={() => {
              handleClickPanel("title");
            }}
            handleClickWorkMenu={handleClickWorkMenu}
          />
        )}
      </div>

      <video
        playsInline
        ref={videoRef}
        src={videoSrc}
        onTimeUpdate={(e) => {
          handleTimeUpdate(e.currentTarget.currentTime);
        }}
        onLoadedMetadataCapture={handleLoadedMetadata}
        onPause={handlePause}
        onPlay={handlePlay}
        onClick={(e) => {
          e.preventDefault();
        }}
        onMouseDown={handleMouseDownVideo}
        style={{
          height: `${
            templateImageSize.height *
            ((selectedTemplate?.videoPosition.y2 ?? 1) - (selectedTemplate?.videoPosition.y1 ?? 0))
          }px`,
          left: `${videoX}px`,
        }}
        className={`aspect-auto absolute
      /-translate-x-1/2
      ${loaded ? "block" : "hidden"}
      `}
      ></video>
    </div>
  );
}
