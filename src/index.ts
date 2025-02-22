import { useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min";


export interface UsePdfRendererOptions {
  scale?: number;
  withCredentials?: boolean;
  quality?: number;
  imageType?: 'png' | 'jpeg';
}

export interface UsePdfRendererReturn {
  images: string[];
  loading: boolean;
  progress: number;
  error: Error | null;
  renderPdf: (pdfUrl: string) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for rendering PDF files as images
 * @param options Configuration options for PDF rendering
 * @returns Object containing rendered images and control functions
 * @example
 * ```tsx
 * const { images, loading, renderPdf } = usePdfRenderer();
 * await renderPdf('https://example.com/document.pdf');
 * ```
 */
export const usePdfRenderer = (options: UsePdfRendererOptions = {}): UsePdfRendererReturn => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setImages([]);
    setLoading(false);
    setProgress(0);
    setError(null);
  }, []);

  const renderPdf = useCallback(async (pdfUrl: string) => {
    const canvasList: HTMLCanvasElement[] = [];
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const loadingTask = pdfjs.getDocument({ 
        url: pdfUrl, 
        withCredentials: options.withCredentials ?? false 
      });

      loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
        setProgress(total ? (loaded / total) * 0.3 : 0);
      };

      const pdf = await loadingTask.promise;
      const imageList: string[] = [];
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: options.scale ?? 2 });

        const canvas = document.createElement("canvas");
        canvasList.push(canvas);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not get canvas context");
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        
        const imageType = options.imageType ?? 'png';
        const quality = options.quality ?? (imageType === 'png' ? undefined : 0.8);
        imageList.push(canvas.toDataURL(`image/${imageType}`, quality));

        setProgress(0.3 + (i / totalPages) * 0.7);
      }

      setImages(imageList);
      setProgress(1);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to render PDF');
      setError(error);
      console.error("Error loading PDF:", error);
      throw error;
    } finally {
      setLoading(false);
      // Cleanup canvases
      canvasList.forEach(canvas => {
        canvas.width = 0;
        canvas.height = 0;
      });
    }
  }, [options.scale, options.withCredentials, options.quality, options.imageType]);

  return { 
    images, 
    loading, 
    progress,
    error,
    renderPdf,
    reset 
  };
}; 