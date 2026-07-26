/**
 * OCR service — dynamically imports tesseract.js so it doesn't land in the
 * main bundle. The eng.traineddata is streamed from CDN on first run and
 * cached in IndexedDB thereafter by tesseract.js.
 */
export type OcrProgress = (progress: number) => void

export class OcrAbortedError extends Error {
  constructor() {
    super('OCR aborted')
    this.name = 'OcrAbortedError'
  }
}

export async function runOcr(
  files: File[],
  onProgress: OcrProgress,
  signal?: AbortSignal,
): Promise<string> {
  if (signal?.aborted) throw new OcrAbortedError()

  const { createWorker } = await import('tesseract.js')

  if (signal?.aborted) throw new OcrAbortedError()

  const worker = await createWorker('eng', 1, {
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') onProgress(m.progress)
    },
  })

  const onAbort = () => {
    worker.terminate().catch(() => { /* worker may already be gone */ })
  }
  signal?.addEventListener('abort', onAbort)

  try {
    const texts: string[] = []
    for (let i = 0; i < files.length; i++) {
      if (signal?.aborted) throw new OcrAbortedError()
      const { data } = await worker.recognize(files[i])
      texts.push(data.text || '')
    }
    return texts.join('\n\n')
  } catch (e) {
    if (signal?.aborted) throw new OcrAbortedError()
    throw e
  } finally {
    signal?.removeEventListener('abort', onAbort)
    await worker.terminate().catch(() => { /* worker may already be gone */ })
  }
}
