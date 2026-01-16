import imageCompression from "browser-image-compression"

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 0.3,          // ~300 KB
    maxWidthOrHeight: 800,
    useWebWorker: true,
  }

  return await imageCompression(file, options)
}
