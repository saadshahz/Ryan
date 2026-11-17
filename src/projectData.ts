import { fitWidth } from "./responsiveImage";
/*
 * Central project data for the project detail pages (/projects/:slug).
 *
 * Project names, categories, statuses and primary images match the existing Projects page.
 * Everything else (location, specifications, features, FAQ answers and the extra gallery
 * images) is illustrative placeholder content for the client presentation. Replace it with
 * verified details from Ryan Group before launch.
 */

export type ProjectImage = { src: string; alt: string };

export type FeatureIcon =
  | "architecture"
  | "planning"
  | "quality"
  | "layout"
  | "design"
  | "detail"
  | "living"
  | "sustainable";

export type ProjectFeature = { icon: FeatureIcon; title: string; description: string };
export type ProjectFaq = { question: string; answer: string };

export type Project = {
  slug: string;
  number: string;
  name: string;
  /** Short label used for the hero eyebrow, e.g. "Residential Project". */
  category: string;
  projectType: string;
  location: string;
  status: string;
  summary: string;
  description: string;
  secondaryDescription: string;
  heroImage: string;
  cardImage: ProjectImage;
  galleryImages: ProjectImage[];
  specifications: [label: string, value: string][];
  features: ProjectFeature[];
  address: {
    lines: string[];
    /** Only set once a verified address exists; enables "Get Directions". */
    mapsUrl?: string;
  };
  faqs: ProjectFaq[];
};

const image = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=86`;

const placeholderFeatures: ProjectFeature[] = [
  {
    icon: "architecture",
    title: "Contemporary Architecture",
    description: "Clean geometry and a considered, modern facade.",
  },
  {
    icon: "planning",
    title: "Thoughtful Space Planning",
    description: "Proportions planned around how spaces are used.",
  },
  {
    icon: "quality",
    title: "Quality Construction",
    description: "Disciplined execution and dependable materials.",
  },
  {
    icon: "layout",
    title: "Functional Layouts",
    description: "Efficient circulation with no wasted space.",
  },
  {
    icon: "design",
    title: "Modern Design",
    description: "A refined design language with a timeless feel.",
  },
  {
    icon: "detail",
    title: "Attention to Detail",
    description: "Careful finishing at every junction and edge.",
  },
  {
    icon: "living",
    title: "Comfortable Living Spaces",
    description: "Light, air and comfort placed at the centre.",
  },
  {
    icon: "sustainable",
    title: "Sustainable Design Considerations",
    description: "Daylight and ventilation considered from the outset.",
  },
];

const placeholderFaqs = (name: string, type: string): ProjectFaq[] => [
  {
    question: `What is ${name}?`,
    answer: `${name} is a ${type.toLowerCase()} project from Ryan Group's portfolio. It reflects the group's focus on thoughtful planning, quality construction and lasting value. Detailed project information will be published once confirmed by Ryan Group.`,
  },
  {
    question: `Where is ${name} located?`,
    answer: `Location details for ${name} are still being confirmed for this presentation. Please contact Ryan Group for information about the project's location.`,
  },
  {
    question: `What type of project is ${name}?`,
    answer: `${name} is a ${type.toLowerCase()} project, delivered with Ryan Group's emphasis on contemporary architecture, functional planning and quality construction.`,
  },
  {
    question: `Is ${name} a completed project?`,
    answer: `${name} is presented in Ryan Group's portfolio as a completed project. Please contact Ryan Group to confirm the latest project details.`,
  },
  {
    question: "How can I learn more about the project?",
    answer:
      "Explore the gallery, overview and specifications on this page. For anything not covered here, Ryan Group's team can share further information on request.",
  },
  {
    question: "How can I contact Ryan Group regarding this development?",
    answer:
      "Use the enquiry form on the Contact page and choose “Existing Project Inquiry”, or reach the team using the email and phone details listed in the footer.",
  },
];

export const projects: Project[] = [
  {
    slug: "ryan-heights",
    number: "01",
    name: "Ryan Heights",
    category: "Residential Project",
    projectType: "Residential Construction",
    location: "Dummy Location",
    status: "Completed",
    summary:
      "A thoughtfully designed residential development reflecting Ryan Group's commitment to quality, architectural excellence, and enduring value.",
    description:
      "Ryan Heights represents Ryan Group's commitment to thoughtful residential construction. Designed with attention to architectural detail, functionality, and quality, the project reflects a vision of spaces built for lasting value.",
    secondaryDescription:
      "A contemporary residential concept shaped around clean geometry, generous natural light, and a calm relationship between interior and exterior spaces, with every stage guided by careful planning and disciplined execution.",
    heroImage: fitWidth(image("1757359056339-22968344cce6", 2200)),
    cardImage: {
      src: image("1757356657991-c3fd6e2e812e", 1200),
      alt: "Ryan Heights modern luxury residence",
    },
    galleryImages: [
      {
        src: image("1757356657991-c3fd6e2e812e", 1400),
        alt: "Glazed residence with terraces and a pool at dusk",
      },
      {
        src: image("1757359056339-22968344cce6", 1400),
        alt: "Contemporary residence with illuminated glass facades",
      },
      {
        src: image("1628012209120-d9db7abf7eab", 1400),
        alt: "White cubic residential architecture against a blue sky",
      },
      {
        src: image("1496236436299-cde70e3587cf", 1400),
        alt: "Textured concrete facade detailing",
      },
      {
        src: image("1614595737476-42487331b8a1", 1400),
        alt: "Facade with timber-framed windows and clean lines",
      },
    ],
    specifications: [
      ["Project Name", "Ryan Heights"],
      ["Project Type", "Residential"],
      ["Location", "Dummy Location"],
      ["Project Status", "Completed"],
      ["Architecture", "Contemporary"],
      ["Development Type", "Residential Construction"],
    ],
    features: placeholderFeatures,
    address: { lines: ["Dummy Location", "Address to be confirmed"] },
    faqs: placeholderFaqs("Ryan Heights", "Residential construction"),
  },
  {
    slug: "ryan-grand-residency",
    number: "02",
    name: "Ryan Grand Residency",
    category: "Residential Project",
    projectType: "Residential Development",
    location: "Dummy Location",
    status: "Completed",
    summary:
      "A residential development balancing an elegant facade rhythm with practical planning and a distinctly modern architectural identity.",
    description:
      "Ryan Grand Residency brings Ryan Group's construction discipline to a larger residential setting. Its layered facade, generous terraces, and practical planning reflect a commitment to architecture that is both expressive and enduring.",
    secondaryDescription:
      "The development is shaped around a rhythm of cantilevered balconies and open, light-filled interiors, balancing a strong architectural identity with the comfort of everyday living.",
    heroImage: fitWidth(image("1624204386084-dd8c05e32226", 2200)),
    cardImage: {
      src: image("1777400547618-2fb8571fb11c", 1200),
      alt: "Ryan Grand Residency contemporary apartment building",
    },
    galleryImages: [
      {
        src: image("1777400547618-2fb8571fb11c", 1400),
        alt: "Cantilevered balconies of a contemporary residential building",
      },
      {
        src: image("1624204386084-dd8c05e32226", 1400),
        alt: "Residential tower balconies against an evening sky",
      },
      {
        src: image("1758193431355-54df41421657", 1400),
        alt: "Residential building with a glazed street-level facade",
      },
      {
        src: image("1453586857165-eb78d44460ca", 1400),
        alt: "Curved balcony forms in warm evening light",
      },
      {
        src: image("1589360810891-0935e508429a", 1400),
        alt: "Dark facade with vertical architectural slats",
      },
    ],
    specifications: [
      ["Project Name", "Ryan Grand Residency"],
      ["Project Type", "Residential"],
      ["Location", "Dummy Location"],
      ["Project Status", "Completed"],
      ["Architecture", "Modern"],
      ["Development Type", "Residential Development"],
    ],
    features: placeholderFeatures,
    address: { lines: ["Dummy Location", "Address to be confirmed"] },
    faqs: placeholderFaqs("Ryan Grand Residency", "Residential development"),
  },
];

export const projectPath = (slug: string) => `/projects/${slug}`;

export const findProject = (slug: string) => projects.find((project) => project.slug === slug);
