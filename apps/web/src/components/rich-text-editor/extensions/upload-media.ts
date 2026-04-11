type ProgressCallback = (progress: number) => void

export function readAsDataUrl(file: File, onProgress?: ProgressCallback): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    if (onProgress) {
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      }
    }

    reader.onload = () => {
      onProgress?.(100)
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
