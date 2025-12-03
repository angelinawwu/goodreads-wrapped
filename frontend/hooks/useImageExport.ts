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

      // Create download link
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
