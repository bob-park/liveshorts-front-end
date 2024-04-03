export interface TitleContent {
  text: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  font: string;
  size: number;
  color: string;
  background: string;
  textOpacity: number;
  bgOpacity: number;
}

export interface Template {
  templateId: string;
  title: string;
  templatePath: string;
  isDeleted: boolean;
  isOverlay: boolean;
  storage: Storage;
  options: {
    title: TitleOptions;
    subtitle: SubtitleOptions;
  };
  videoRatio: string;
  videoPosition: VideoPosition;
  templateCategories: TemplateCategory[];
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export type ActivePanel = "video" | "template" | "title" | "subtitle" | "bgm";
export type WorkMenu = "template" | "title" | "subtitle" | "bgm";

// non export type
interface Storage {
  storageId: number;
  name: string;
  description: string;
  storageType: string;
  winDrivePath: string;
  macMountPath: string;
  uncPath: string;
  nasPath: string;
  serverPath: string;
}

interface TitleOptions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  font: string;
  size: number;
  color: string;
  background: string;
  textOpacity: number;
  bgOpacity: number;
  none: boolean;
}

interface SubtitleOptions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  font: string;
  size: number;
  color: string;
  background: string;
  textOpacity: number;
  bgOpacity: number;
  none: boolean;
}

interface VideoPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  yDeltaPixel: number;
}

interface TemplateCategory {
  id: number;
  categoryId: number;
}