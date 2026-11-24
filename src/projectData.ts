import { fitWidth } from "./responsiveImage";
/*
 * Central project data for the project detail pages (/projects/:slug).
 *
 * Ryan Heights and Ryan Grand Residency: names, categories, statuses and primary images match the
 * existing Projects page. Everything else (location, specifications, features, FAQ answers and the extra gallery
 * images) is illustrative placeholder content for the client presentation. Replace it with
 * verified details from Ryan Group before launch.
 *
 * Ryan Emerald Valley (isVerified) uses project information supplied by Ryan Group and its own
 * renders and draft masterplan from public/emerald/.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  /** Gallery videos: `src` is the poster image and `video` the file played in the viewer. */
  video?: {
    src: string;
    type: string;
    title: string;
    /** Frame shape, e.g. "9 / 16" for portrait films; reserves the player size before loading. */
    aspectRatio?: string;
  };
};

export type FeatureIcon =
  | "architecture"
  | "planning"
  | "quality"
  | "layout"
  | "design"
  | "detail"
  | "living"
  | "sustainable"
  | "landscape"
  | "temple"
  | "fitness"
  | "cctv"
  | "senior"
  | "games"
  | "entrance"
  | "roads"
  | "security";

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
  /** Main image in the projects carousel. Defaults to the first gallery image. */
  carouselImage?: ProjectImage;
  galleryImages: ProjectImage[];
  specifications: [label: string, value: string][];
  features: ProjectFeature[];
  /** True for projects whose details are confirmed by Ryan Group (no placeholder labels). */
  isVerified?: boolean;
  /** Label on the project image in the carousel, e.g. "EOI Open". Defaults to "Featured Project". */
  badge?: string;
  /** Label for the enquiry call to action, e.g. "Register Your Interest". */
  enquiryLabel?: string;
  /** Note shown under the gallery, e.g. that images are artist’s impressions. */
  imageNote?: string;
  subtitle?: string;
  presentedBy?: string;
  developedBy?: string;
  highlights?: [label: string, value: string][];
  plotDimensions?: string[];
  masterplan?: ProjectImage & {
    /** Higher-resolution file for close inspection. */
    fullSrc: string;
    /** Caption such as "Draft masterplan dated 18.11.2025". */
    note: string;
  };
  amenities?: ProjectFeature[];
  pricing?: {
    startingPrice: string;
    approvals: string[];
  };
  address: {
    lines: string[];
    /** Only set once a verified address exists; enables "Get Directions". */
    mapsUrl?: string;
  };
  faqs: ProjectFaq[];
};

/** Ryan Emerald Valley assets live in public/emerald/ (web-sized copies in public/emerald/web/). */
const emeraldAsset = (file: string) => `${import.meta.env.BASE_URL}emerald/${encodeURI(file)}`;

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
  {
    slug: "ryan-emerald-valley",
    number: "03",
    name: "Ryan Emerald Valley",
    category: "Villa Plot Development",
    projectType: "Residential Villa Plot Development",
    location: "Near Sathanuru Bus Stop, Kanakapura",
    status: "EOI Collection Open",
    summary:
      "A thoughtfully planned 9.25-acre villa plot development offering 151 premium residential plots in Kanakapura.",
    description:
      "Ryan Emerald Valley is an exclusive residential villa plot development presented by Ryan Group and developed by Ryan Buildtech. Spread across 9.25 acres, the development features 151 premium residential villa plots, offering an opportunity to build a dream home in a thoughtfully planned residential environment.",
    secondaryDescription:
      "Located near Sathanuru Bus Stop, Kanakapura, the project combines comfortable living, planned infrastructure, and investment potential. Every detail is conceived to support a balanced residential community.",
    heroImage: emeraldAsset("web/entrance-arch-cover-2400.jpg"),
    cardImage: {
      src: emeraldAsset("web/entrance-arch-cover-1200.jpg"),
      alt: "Artist’s impression of the Ryan Emerald Valley entrance arch",
    },
    galleryImages: [
      {
        src: emeraldAsset("web/entrance-arch-2400.jpg"),
        alt: "Artist’s impression of the grand entrance arch at Ryan Emerald Valley, with the gated entry road and security cabin",
      },
      {
        src: emeraldAsset("web/aerial-view-2400.jpg"),
        alt: "Artist’s impression of an aerial view of Ryan Emerald Valley, showing the numbered villa plots, internal roads and landscaped parks",
      },
      {
        src: emeraldAsset("web/aerial-view-cover-1200.jpg"),
        alt: "Ryan Emerald Valley project film: amenities and lifestyle",
        video: {
          src: emeraldAsset("Video 1.mp4"),
          type: "video/mp4",
          aspectRatio: "9 / 16",
          title: "Project Film · Amenities & Lifestyle",
        },
      },
      {
        src: emeraldAsset("web/entrance-arch-cover-1200.jpg"),
        alt: "Ryan Emerald Valley project film: entrance, plots and surroundings",
        video: {
          // Web-optimised copy (720p, ~8 MB) of "video 2.mp4"; the 20 MB original stays in public/emerald/.
          src: emeraldAsset("web/film-2-720p.mp4"),
          type: "video/mp4",
          aspectRatio: "9 / 16",
          title: "Project Film · Entrance, Plots & Surroundings",
        },
      },
      {
        src: emeraldAsset("web/masterplan-draft-1800.jpg"),
        alt: "Draft masterplan of Ryan Emerald Valley, showing the plot layout, roads, parks and amenity zones",
      },
    ],
    specifications: [
      ["Presented By", "Ryan Group"],
      ["Developed By", "Ryan Buildtech"],
      ["Project Type", "Premium Residential Villa Plot Development"],
      ["Location", "Near Sathanuru Bus Stop, Kanakapura"],
      ["Total Area", "9.25 Acres"],
      ["Total Plots", "151 Premium Residential Plots"],
      ["Plot Dimensions", "30 × 40, 30 × 50, 60 × 40"],
      ["Launch Price", "From ₹2,850 per sq. ft."],
      ["Approvals", "BMRDA & RERA Approved"],
      ["Current Status", "EOI Collection Open"],
    ],
    features: [
      { icon: "landscape", title: "Beautifully Landscaped Parks & Gardens", description: "Landscaped green spaces for everyday recreation and relaxation." },
      { icon: "temple", title: "Dedicated Sai Baba Temple", description: "A dedicated temple within the planned community." },
      { icon: "fitness", title: "Outdoor Fitness Centre", description: "An outdoor fitness area for an active lifestyle." },
      { icon: "cctv", title: "24/7 CCTV Surveillance", description: "Continuous CCTV surveillance across the development." },
      { icon: "senior", title: "Dedicated Senior Citizens' Park", description: "A dedicated park for senior residents." },
      { icon: "games", title: "Indoor Games Area", description: "A sheltered indoor space for games and recreation." },
      { icon: "entrance", title: "Grand Entrance Arch", description: "A distinguished entrance arch welcoming residents and visitors." },
      { icon: "roads", title: "Wide, Tree-Lined Roads", description: "Wide internal roads planned with tree-lined edges." },
      { icon: "security", title: "24/7 Security", description: "Round-the-clock security for residents." },
    ],
    carouselImage: {
      src: emeraldAsset("web/entrance-arch-cover-1200.jpg"),
      alt: "Artist’s impression of the grand entrance arch at Ryan Emerald Valley",
    },
    isVerified: true,
    badge: "EOI Open",
    enquiryLabel: "Register Your Interest",
    imageNote: "Images are artist’s impressions and the masterplan is a draft, for representation only.",
    subtitle: "A New Address for a Better Tomorrow.",
    presentedBy: "Ryan Group",
    developedBy: "Ryan Buildtech",
    highlights: [
      ["9.25 Acres", "Total Development Area"],
      ["151", "Premium Residential Plots"],
      ["3", "Plot Dimension Options"],
      ["₹2,850", "Starting Price per Sq. Ft."],
    ],
    plotDimensions: ["30 × 40", "30 × 50", "60 × 40"],
    masterplan: {
      src: emeraldAsset("web/masterplan-draft-3600.jpg"),
      fullSrc: emeraldAsset("01.Masterplan_DRAFT_18.11.2025.png"),
      alt: "Draft masterplan of Ryan Emerald Valley, showing the plot layout, internal roads, parks, civic amenity area and amenity zones, with a legend and plot categories",
      note: "Draft masterplan dated 18.11.2025 · Subject to change",
    },
    pricing: {
      startingPrice: "₹2,850 per sq. ft. onwards",
      approvals: ["BMRDA Approved", "RERA Approved"],
    },
    address: {
      lines: ["Near Sathanuru Bus Stop", "Kanakapura"],
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sathanuru+Bus+Stop%2C+Kanakapura%2C+Karnataka",
    },
    faqs: [
      { question: "Where is Ryan Emerald Valley located?", answer: "Ryan Emerald Valley is located near Sathanuru Bus Stop in Kanakapura." },
      { question: "Who is developing the project?", answer: "Ryan Emerald Valley is presented by Ryan Group and developed by Ryan Buildtech." },
      { question: "How large is the development?", answer: "The development spans 9.25 acres." },
      { question: "How many residential plots are available in the project?", answer: "The project comprises 151 premium residential plots." },
      { question: "What plot dimensions are offered?", answer: "The available plot dimension options are 30 × 40, 30 × 50, and 60 × 40." },
      { question: "What is the starting price?", answer: "The launch price starts from ₹2,850 per sq. ft. onwards. Please confirm current pricing and availability with the project sales team." },
      { question: "What approvals does the project have?", answer: "The project is BMRDA and RERA approved." },
      { question: "Is EOI collection currently open?", answer: "Yes. Expression of Interest (EOI) collection is currently open. Use the Register Your Interest form to receive priority updates on plot availability, pricing and project details." },
    ],
  },
];

export const projectPath = (slug: string) => `/projects/${slug}`;

/** Contact page enquiry form with this project preselected. */
export const projectEnquiryPath = (project: Project) =>
  `/contacts?project=${encodeURIComponent(project.slug)}#enquiry-form`;

export const findProject = (slug: string) => projects.find((project) => project.slug === slug);
