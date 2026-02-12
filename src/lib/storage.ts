import { supabase } from './supabase';

const CV_BUCKET = 'cv-files';
const CV_FILENAME = 'Jen-Jeng-CV.pdf';

export async function getCVDownloadUrl(): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from(CV_BUCKET)
      .getPublicUrl(CV_FILENAME);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting CV URL:', error);
    return null;
  }
}

export async function downloadCV(): Promise<void> {
  const url = await getCVDownloadUrl();

  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = CV_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error('CV not available for download');
  }
}

export async function uploadCV(file: File): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(CV_BUCKET)
      .upload(CV_FILENAME, file, {
        upsert: true,
        contentType: 'application/pdf'
      });

    if (error) {
      console.error('Error uploading CV:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error uploading CV:', error);
    return false;
  }
}
