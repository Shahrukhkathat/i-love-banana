
export function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const result = reader.result;
        const mimeType = result.substring(5, result.indexOf(';'));
        const base64 = result.substring(result.indexOf(',') + 1);
        resolve({ base64, mimeType });
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
