
export const exportCanvasAsImage = (canvas: HTMLCanvasElement, filename = 'floor-plan-export') => {
  try {
    // Create a link element to trigger download
    const link = document.createElement('a');
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `${filename}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);
    
    return true;
  } catch (error) {
    console.error('Error exporting canvas:', error);
    return false;
  }
};
