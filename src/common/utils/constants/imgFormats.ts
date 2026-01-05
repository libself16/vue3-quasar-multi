export interface ResultImgPathListType {
  isInImages?: boolean
  url: string
  formats: string[]
}

export const PNG_FORMATS = ["webp", "png"]
export const JPG_FORMATS = ["webp", "jpg"]
export const JPEG_FORMATS = ["webp", "jpeg"]
export const COMMON_FORMATS = ["webp", "png", "jpg", "jpeg"]

export const SVG_FORMATS = ["svg"]
export const GIF_FORMATS = ["gif"]

export const ALL_FORMATS = ["webp", "png", "jpg", "jpeg", "svg", "gif"]
