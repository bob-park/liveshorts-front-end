"use client";

import Image from "next/image";
import { useState } from "react";

interface TemplateMenuImageProps {
  templateId: string;
  className: string;
}

export default function TemplateMenuImage({ templateId, className }: TemplateMenuImageProps) {
  const [src, setSrc] = useState(`/api/v1/shorts/template/${templateId}/file`);
  return (
    <Image
      width={100}
      height={100}
      src={src}
      alt="template-image"
      onError={() => setSrc("/default_thumbnail.png")}
      className={className}
    />
  );
}
