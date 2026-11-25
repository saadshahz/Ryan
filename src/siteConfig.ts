/*
 * Site-wide business details, used by the footer, Contact page, enquiry form and the
 * floating contact button.
 *
 * ⚠️ BEFORE LAUNCH: every value marked PLACEHOLDER is dummy presentation data.
 * Replace it with Ryan Group's verified details (see README → "Before you deploy").
 */
export const site = {
  name: "Ryan Group",

  /** PLACEHOLDER: public enquiry email (also receives the enquiry form's email draft). */
  email: "hello@ryangroup.example",

  /** PLACEHOLDER: public phone number. `tel` is digits with country code for tel: links. */
  phone: { display: "+91 98000 00000", tel: "+919800000000" },

  /** PLACEHOLDER: office address lines shown in the footer. */
  address: ["Ryan House, Business District,", "Mumbai, India 400001"],

  /** PLACEHOLDER: replace with Ryan Group's own profile URLs. */
  socials: {
    linkedin: "https://www.linkedin.com",
    instagram: "https://www.instagram.com",
    facebook: "https://www.facebook.com",
  },

  /**
   * WhatsApp number in international format, digits only (e.g. "919876543210").
   * Leave null until a verified number exists: the floating button then links to the
   * Contact page enquiry form instead of WhatsApp.
   */
  whatsappNumber: null as string | null,

  /**
   * Homepage hero background film (muted, looping). Place an approved file in public/ and set
   * `src` to its URL path, e.g. "/media/hero.mp4" (encode spaces as %20). Keep it short
   * (10-20 s), around 1280-1920 px wide, H.264 with +faststart, and ideally under 8 MB.
   * While null, the hero shows its still image.
   */
  heroVideo: { src: "/hero_background.mp4", type: "video/mp4" } as { src: string; type: string } | null,
};
