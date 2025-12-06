import { useCallback } from 'react';
import { toPng } from 'html-to-image';

export function useImageExport() {
  const exportToImage = useCallback(async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    try {
      // Generate image
      const dataUrl = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2, // Higher quality for sharing
        backgroundColor: '#BDB297',
      });

      // Detect mobile devices
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                       (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);

      // Use Web Share API on mobile (especially iOS) to save to Photos
      if (isMobile && navigator.share) {
        try {
          // Convert data URL to Blob for Web Share API
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'goodreads-wrapped-2025.png', { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Goodreads Wrapped 2025',
              text: 'Check out my reading year!',
            });
            return dataUrl;
          }
        } catch (shareError) {
          // User cancelled share or share failed, fall through to download
          if ((shareError as Error).name !== 'AbortError') {
            console.log('Share failed, falling back to download:', shareError);
          }
        }
      }

      // Desktop: Use original download link method
      const link = document.createElement('a');
      link.download = 'goodreads-wrapped-2025.png';
      link.href = dataUrl;
      link.click();

      return dataUrl;
    } catch (error) {
      console.error('Failed to export image:', error);
      throw error;
    }
  }, []);

  return { exportToImage };
}
