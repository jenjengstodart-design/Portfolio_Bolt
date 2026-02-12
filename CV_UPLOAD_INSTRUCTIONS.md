# CV Upload Instructions

This guide explains how to upload your CV file so visitors can download it from your portfolio site.

## Storage Setup

The portfolio site now has a Supabase Storage bucket called `cv-files` that stores your CV file. The bucket is configured to:
- Allow public downloads (anyone can download the CV)
- Require authentication for uploads (only you can upload/update the CV)

## How to Upload Your CV

You have two options to upload your CV:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on the **cv-files** bucket
4. Click **Upload File**
5. Upload your CV file with the exact name: `Jen-Jeng-CV.pdf`
6. The file will now be available for download on your site

### Option 2: Using the Upload Utility (For Authenticated Users)

If you've set up authentication for your site, you can use the built-in upload utility:

```typescript
import { uploadCV } from './lib/storage';

// In your component
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const success = await uploadCV(file);
    if (success) {
      console.log('CV uploaded successfully');
    }
  }
};
```

## File Requirements

- **File name**: The CV must be named exactly `Jen-Jeng-CV.pdf`
- **File format**: PDF is recommended for compatibility
- **File size**: Keep under 10MB for optimal performance

## How the Download Works

When visitors click the "Download CV" button on your site:
1. The app fetches the public URL from Supabase Storage
2. A download link is created and clicked programmatically
3. The browser downloads the file with the name `Jen-Jeng-CV.pdf`

## Updating Your CV

To update your CV:
1. Upload a new file with the same name `Jen-Jeng-CV.pdf`
2. The new file will automatically replace the old one
3. Visitors will immediately see the updated version

## Email Contact

The footer and connect section now display an email link using the email from `profile.json`:
- Email: contact@jenjeng.com
- You can update this email by editing `src/content/profile.json`

## Technical Details

- Storage bucket: `cv-files`
- File name: `Jen-Jeng-CV.pdf`
- Utility functions: `src/lib/storage.ts`
- Updated pages: Home, About
- Updated components: Footer
