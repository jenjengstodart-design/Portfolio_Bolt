# Changelog

All notable changes to this project will be documented in this file.

## [2026-02-12] - Content and UI Updates

### Changed

#### Services Page
- Changed "Who It's For" heading to "When do you need it" in the Services page
- Updated `services.json` to rename the field from `whoItsFor` to `whenYouNeedIt`
- Updated `Services.tsx` component to use the new field name and display the new heading

#### Projects
- Simplified industry labels by removing detailed suffixes:
  - "FMCG / Manufacturing" → "FMCG"
  - "FMCG / Pet Nutrition" → "FMCG"
  - "Government / Science" → "Government"
  - "Healthcare / Digital Health" → "Healthcare"
  - "Technology / SaaS" → "Technology"
  - "Gaming / Esports" → "Gaming"
  - "Media / Broadcasting" → "Media"

#### Contact Information
- Updated email address to jen.jengstodart@gmail.com across all pages
- Contact page now pulls email from profile.json for consistency

### Technical Details

**Files Modified:**
- `/src/content/services.json` - Renamed `whoItsFor` field to `whenYouNeedIt`
- `/src/content/projects.json` - Simplified industry field values
- `/src/pages/Services.tsx` - Updated heading text and field reference
- `/src/pages/Contact.tsx` - Updated to use profile email dynamically

**Rationale:**
- "When do you need it" provides clearer context for potential clients about timing and situations
- Simplified industry labels reduce visual clutter and improve readability
- Dynamic email reference ensures consistency across the entire site
