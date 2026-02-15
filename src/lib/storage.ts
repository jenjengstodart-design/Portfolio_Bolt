const CV_FILENAME = '/JenJeng_CV.pdf';

export async function getCVDownloadUrl(): Promise<string> {
  return CV_FILENAME;
}

export async function downloadCV(): Promise<void> {
  const link = document.createElement('a');
  link.href = CV_FILENAME;
  link.download = 'JenJeng_CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
