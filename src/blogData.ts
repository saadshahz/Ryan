import { fitWidth } from "./responsiveImage";
/*
 * Central article data for the Blog listing (/blog) and article pages (/blog/:slug).
 *
 * Every article here is illustrative placeholder content for the client presentation. It is
 * not published Ryan Group writing and contains no verified facts, figures or project claims.
 * Replace it with real articles before launch.
 *
 * Inline text in paragraphs, list items, quotes and callouts supports **bold** and *italic*.
 */

export type BlogCategory =
  | "Architecture & Design"
  | "Architecture"
  | "Construction"
  | "Real Estate"
  | "Design"
  | "Company Updates";

export type ArticleBlock =
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "figure"; src: string; alt: string; caption: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title: string; text: string };

export type Article = {
  id: number;
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  /** Card-sized cover image. */
  coverImage: { src: string; alt: string };
  /** Wide, high-resolution version of the cover for the article page. */
  heroImage: string;
  /** ISO date (YYYY-MM-DD). */
  publicationDate: string;
  author: string;
  featured: boolean;
  content: ArticleBlock[];
};

const image = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=86`;

const AUTHOR = "Ryan Group Editorial Team";

/* ------------------------------------------------------------------------------------------
 * Category templates: shared supporting sections, combined with each article's own intro,
 * key points and quote so every article reads as a complete, distinct page.
 * ---------------------------------------------------------------------------------------- */

const figureFor: Record<BlogCategory, [id: string, alt: string, caption: string]> = {
  "Architecture & Design": [
    "1757359056339-22968344cce6",
    "Contemporary residence with illuminated glass facades at dusk",
    "Generous glazing and layered terraces connect interior spaces with the landscape.",
  ],
  Architecture: [
    "1453586857165-eb78d44460ca",
    "Curved balcony forms in warm evening light",
    "Repeated architectural elements give a facade rhythm and a recognisable identity.",
  ],
  Construction: [
    "1608619769165-25647672335f",
    "Concrete building under construction against an evening sky",
    "Quality is decided floor by floor, long before the finishes are applied.",
  ],
  "Real Estate": [
    "1680874261352-ed1ee3d1cf01",
    "Row of white contemporary villas",
    "A consistent architectural language helps a development feel considered and complete.",
  ],
  Design: [
    "1614595737476-42487331b8a1",
    "White facade with timber-framed windows and clean lines",
    "Restrained palettes let natural materials and daylight carry the design.",
  ],
  "Company Updates": [
    "1770756248866-00b8b7c1dd75",
    "Tower crane beside a building under construction",
    "Every project begins with careful planning and a clear commitment to quality.",
  ],
};
const FALLBACK_FIGURE: [string, string] = [
  "1496236436299-cde70e3587cf",
  "Close view of textured concrete facade detailing",
];

const categorySections: Record<BlogCategory, ArticleBlock[]> = {
  "Architecture & Design": [
    { type: "h2", text: "Design that begins with purpose" },
    {
      type: "p",
      text: "Enduring buildings rarely happen by accident. They begin with a clear understanding of how a space will be used, who will use it and how those needs may change. When purpose leads the design, decisions about form, light and circulation become far easier to defend.",
    },
    { type: "h3", text: "Construction that honours the drawings" },
    {
      type: "p",
      text: "A considered design only holds its value when it is built with the same care. **Material selection, junction detailing and disciplined site supervision** decide whether a building ages gracefully or prematurely.",
    },
  ],
  Architecture: [
    { type: "h2", text: "Planning before form" },
    {
      type: "p",
      text: "Good architecture starts long before a facade is drawn. Orientation, site constraints and the *daily routines of the people who will occupy a building* shape the most important early decisions.",
    },
    { type: "h3", text: "Proportion, light and movement" },
    {
      type: "p",
      text: "Well-proportioned rooms, natural light and intuitive movement between spaces are often felt more than they are noticed. Together they create buildings that are **calm, comfortable and easy to live in**.",
    },
  ],
  Construction: [
    { type: "h2", text: "Quality is a process, not an inspection" },
    {
      type: "p",
      text: "Quality in construction is the result of hundreds of small, correct decisions made consistently from the foundations to the finishing. **Clear specifications, experienced supervision and honest communication** keep those decisions aligned.",
    },
    { type: "h3", text: "Where craftsmanship becomes visible" },
    {
      type: "p",
      text: "Dependable materials only perform as intended when they are installed with skill. Joints, edges and openings are where *long-term durability is quietly decided*.",
    },
  ],
  "Real Estate": [
    { type: "h2", text: "Looking beyond location" },
    {
      type: "p",
      text: "Location matters, but it is only the starting point. How a development responds to its surroundings, its access and its community often decides **how well it is received over time**.",
    },
    { type: "h3", text: "Designed around everyday experience" },
    {
      type: "p",
      text: "Successful developments are planned around clear arrivals, comfortable shared spaces and layouts that make sense from the very first visit. These are *qualities that are hard to add later and easy to plan for early*.",
    },
  ],
  Design: [
    { type: "h2", text: "Form with a function" },
    {
      type: "p",
      text: "Contemporary design is at its best when every visual decision also solves a practical problem. A deep window reveal can shade a room; a carefully placed wall can **define a quiet corner without closing it off**.",
    },
    { type: "h3", text: "Light, material and texture" },
    {
      type: "p",
      text: "Natural light, honest materials and a restrained palette give interiors a calm, lasting character. Texture adds warmth *without the need for decoration that quickly dates*.",
    },
  ],
  "Company Updates": [
    { type: "h2", text: "Our approach" },
    {
      type: "p",
      text: "Ryan Group's work is built on a simple idea: every project should be **planned with care, built with integrity and delivered with lasting value in mind**.",
    },
    { type: "h3", text: "Working together" },
    {
      type: "p",
      text: "Clear communication with clients, designers and on-site teams keeps every project aligned from the first conversation to the final handover. *Verified company updates will be published here as they are confirmed.*",
    },
  ],
};

const processSteps: Record<BlogCategory, string[]> = {
  "Architecture & Design": [
    "Understand the brief, the site and the people the space will serve.",
    "Develop a design that balances form, function and long-term maintenance.",
    "Build with disciplined supervision so the finished space matches the intent.",
  ],
  Architecture: [
    "Study the site: orientation, access, views and surrounding context.",
    "Organise spaces around light, movement and everyday use.",
    "Refine proportions and materials until the design feels effortless.",
  ],
  Construction: [
    "Confirm drawings, specifications and sequencing before work begins.",
    "Inspect each stage before the next one covers it up.",
    "Protect completed work and document progress through to handover.",
  ],
  "Real Estate": [
    "Read the neighbourhood and understand who the development is for.",
    "Plan shared spaces, access and amenities around daily routines.",
    "Choose materials and details that hold their quality over time.",
  ],
  Design: [
    "Start with how the space will be used, not how it will be styled.",
    "Edit the palette until each material earns its place.",
    "Test layouts against real routines: storage, circulation and comfort.",
  ],
  "Company Updates": [
    "Listen carefully and define the brief together.",
    "Plan the work transparently, with clear responsibilities.",
    "Deliver with integrity and stand behind the finished result.",
  ],
};

type ArticleInput = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  image: string;
  alt: string;
  publicationDate: string;
  featured?: boolean;
  /** Article-specific opening paragraph (follows the excerpt). */
  intro: string;
  /** Article-specific key takeaways. */
  points: string[];
  /** Article-specific pull quote. */
  quote: string;
  /** Fully bespoke content; replaces the generated structure when provided. */
  content?: ArticleBlock[];
};

const buildContent = (input: ArticleInput): ArticleBlock[] => {
  const [figureId, figureAlt, caption] = figureFor[input.category];
  const [id, alt] = figureId === input.image ? FALLBACK_FIGURE : [figureId, figureAlt];
  return [
    { type: "lead", text: input.excerpt },
    { type: "p", text: input.intro },
    { type: "h2", text: "Key takeaways" },
    { type: "ul", items: input.points },
    ...categorySections[input.category],
    { type: "figure", src: image(id, 1600), alt, caption: `${caption} Illustrative image.` },
    { type: "quote", text: input.quote, cite: AUTHOR },
    { type: "h2", text: "A simple framework" },
    { type: "ol", items: processSteps[input.category] },
    {
      type: "callout",
      title: "The takeaway",
      text: `Thoughtful planning, honest materials and disciplined execution are what turn *${input.title.replace(/[?.]$/, "")}* from an idea into lasting value.`,
    },
  ];
};

const article = (input: ArticleInput, index: number): Article => ({
  id: index + 1,
  slug: input.slug,
  title: input.title,
  category: input.category,
  excerpt: input.excerpt,
  publicationDate: input.publicationDate,
  author: AUTHOR,
  featured: input.featured ?? false,
  coverImage: { src: image(input.image, input.featured ? 1600 : 1000), alt: input.alt },
  heroImage: fitWidth(image(input.image, 2400)),
  content: input.content ?? buildContent(input),
});

export const articles: Article[] = (
  [
    {
      slug: "building-spaces-that-stand-the-test-of-time",
      title: "Building Spaces That Stand the Test of Time",
      category: "Architecture & Design",
      excerpt:
        "Explore how thoughtful architectural planning, quality construction, and attention to detail contribute to spaces designed for enduring value.",
      image: "1757356657991-c3fd6e2e812e",
      alt: "Contemporary glazed residence with terraces and a pool at dusk",
      publicationDate: "2026-11-12",
      featured: true,
      intro: "",
      points: [],
      quote: "",
      content: [
        {
          type: "lead",
          text: "Some buildings feel as considered on their twentieth anniversary as they did on the day they were completed. That longevity is rarely luck. It is the product of *decisions made early, and made well*.",
        },
        {
          type: "p",
          text: "In a market that often rewards speed, the qualities that make a building last can be easy to overlook. Yet the spaces people value most share a handful of traits: clear planning, honest materials, careful construction and a design that adapts as needs change.",
        },
        { type: "h2", text: "1. Planning comes before everything" },
        {
          type: "p",
          text: "Before a single line of the facade is drawn, a lasting building begins with questions. Who will use this space? How will daylight move through it across the year? What will need to change in ten years, and how easily can it?",
        },
        { type: "h3", text: "Reading the site" },
        {
          type: "p",
          text: "Orientation, access, neighbouring buildings and the way rain and sun meet the site all shape the right design response. Getting these fundamentals right gives the architecture **a clear logic that carries through every later stage**.",
        },
        { type: "h3", text: "Designing for change" },
        {
          type: "ul",
          items: [
            "**Flexible layouts** that can be reconfigured without structural work.",
            "**Accessible services** so maintenance never means demolition.",
            "**Generous proportions** that remain comfortable as routines evolve.",
          ],
        },
        {
          type: "figure",
          src: image("1757359056339-22968344cce6", 1600),
          alt: "Contemporary residence with illuminated glass facades at dusk",
          caption:
            "Large openings and layered terraces draw daylight deep into the plan. Illustrative image.",
        },
        { type: "h2", text: "2. Materials chosen for how they age" },
        {
          type: "p",
          text: "Every material changes over time. The question is whether it changes gracefully. Concrete, stone, timber and glass, when specified and detailed correctly, *gain character rather than losing it*.",
        },
        {
          type: "quote",
          text: "A building's true quality is revealed not on completion day, but in how it performs ten or twenty years later.",
          cite: AUTHOR,
        },
        { type: "h2", text: "3. Construction that honours the design" },
        {
          type: "p",
          text: "Even the best drawings can be undone by poor execution. Enduring buildings depend on disciplined construction, where each stage is checked before the next one covers it up.",
        },
        {
          type: "ol",
          items: [
            "Confirm drawings, specifications and sequencing before work begins.",
            "Inspect foundations, structure and waterproofing at every critical stage.",
            "Give junctions, edges and openings the same attention as the visible surfaces.",
            "Protect completed work and document every stage through to handover.",
          ],
        },
        { type: "h2", text: "4. Details that are felt, not just seen" },
        {
          type: "p",
          text: "The difference between an ordinary building and an exceptional one often lies in details few people consciously notice: a door that closes softly, a window that frames the right view, a threshold with no awkward step. **These details are what make a space feel effortless to live in.**",
        },
        {
          type: "callout",
          title: "The takeaway",
          text: "Spaces that stand the test of time are planned with purpose, built with discipline and finished with care. Those qualities cost far less to build in from the start than to add later.",
        },
      ],
    },
    {
      slug: "future-of-modern-residential-architecture",
      title: "The Future of Modern Residential Architecture",
      category: "Architecture",
      excerpt:
        "How light, flexibility and honest materials are reshaping the way homes are designed and built.",
      image: "1614595737683-1740e41bfaac",
      alt: "Modern white residential building with clean geometric volumes",
      publicationDate: "2026-11-09",
      intro: "",
      points: [],
      quote: "",
      content: [
        {
          type: "lead",
          text: "Homes are being asked to do more than ever: to be places of rest, work, gathering and retreat, often within the same few rooms. Modern residential architecture is evolving to meet that challenge *with clarity rather than complexity*.",
        },
        {
          type: "p",
          text: "The most compelling new homes are not defined by a single style. Instead, they share a set of principles that put **daylight, flexibility and material honesty** at the centre of every decision.",
        },
        { type: "h2", text: "Light as a building material" },
        {
          type: "p",
          text: "Natural light is increasingly treated as something to be designed, not simply allowed in. Careful orientation, deep reveals and well-placed openings bring daylight further into the plan while controlling heat and glare.",
        },
        { type: "h3", text: "What this looks like in practice" },
        {
          type: "ul",
          items: [
            "Living spaces oriented towards the best light of the day.",
            "Balconies and overhangs that shade in summer and admit low winter sun.",
            "Courtyards and light wells that bring daylight to the centre of deeper plans.",
          ],
        },
        {
          type: "figure",
          src: image("1624204386084-dd8c05e32226", 1600),
          alt: "Residential balconies against an evening sky",
          caption:
            "Balconies extend living space outdoors while shading the rooms behind them. Illustrative image.",
        },
        { type: "h2", text: "Flexible plans for changing lives" },
        {
          type: "p",
          text: "Rigid room-by-room layouts are giving way to plans that can adapt. A study becomes a nursery; a dining area becomes a workspace. *Good residential design anticipates these shifts* without requiring major renovation.",
        },
        {
          type: "quote",
          text: "The best homes are not finished on handover day. They are designed to grow with the people who live in them.",
          cite: AUTHOR,
        },
        { type: "h2", text: "Honest, durable materials" },
        {
          type: "p",
          text: "There is a growing preference for materials that are what they appear to be: exposed concrete, natural timber, stone and glass. Specified well, they require less maintenance and **develop character instead of wear**.",
        },
        { type: "h2", text: "Principles worth building on" },
        {
          type: "ol",
          items: [
            "Design around daylight and natural ventilation first.",
            "Keep plans open to adaptation over the life of the home.",
            "Choose materials for how they age, not just how they look on day one.",
            "Invest in construction quality where it cannot be seen as well as where it can.",
          ],
        },
        {
          type: "callout",
          title: "Looking ahead",
          text: "The future of residential architecture is less about striking forms and more about *quiet, lasting quality*: homes that are calm, flexible and built to endure.",
        },
      ],
    },
    {
      slug: "thoughtful-design-in-modern-construction",
      title: "The Role of Thoughtful Design in Modern Construction",
      category: "Architecture",
      excerpt:
        "Discover how architectural planning and design principles shape functional and visually refined spaces.",
      image: "1628012209120-d9db7abf7eab",
      alt: "White cubic residential architecture against a blue sky",
      publicationDate: "2026-11-05",
      intro:
        "Design and construction are often discussed as separate disciplines. In practice, the most successful buildings treat them as **one continuous conversation** from the first sketch to the final handover.",
      points: [
        "Design decisions made early have the greatest influence on cost and quality.",
        "Clear drawings reduce on-site improvisation and rework.",
        "Simple, well-resolved forms are often easier to build well.",
      ],
      quote: "Thoughtful design is not decoration added at the end. It is the logic that holds a building together.",
    },
    {
      slug: "understanding-quality-in-residential-construction",
      title: "Understanding Quality in Residential Construction",
      category: "Construction",
      excerpt:
        "Explore the importance of materials, craftsmanship, and execution in delivering lasting developments.",
      image: "1496236436299-cde70e3587cf",
      alt: "Close view of textured concrete facade detailing",
      publicationDate: "2026-10-29",
      intro:
        "Quality is one of the most used words in construction and one of the least defined. For homeowners, it is ultimately measured by *how a home performs, year after year*.",
      points: [
        "Quality is built in at every stage, not inspected in at the end.",
        "Hidden work such as waterproofing matters as much as visible finishes.",
        "Skilled installation is what allows good materials to perform.",
      ],
      quote: "The quality of a home is decided in the details nobody sees once the walls are closed.",
    },
    {
      slug: "what-makes-a-property-development-stand-out",
      title: "What Makes a Property Development Stand Out?",
      category: "Real Estate",
      excerpt:
        "A look at the essential elements that contribute to a well-planned and thoughtfully designed property.",
      image: "1777400547618-2fb8571fb11c",
      alt: "Cantilevered balconies of a contemporary residential building",
      publicationDate: "2026-10-22",
      intro:
        "Two developments can share a location, a budget and a timeline, yet feel entirely different to live in. The difference usually lies in **planning, proportion and care**.",
      points: [
        "A clear architectural identity makes a development memorable.",
        "Shared spaces should be designed as carefully as private ones.",
        "Construction quality protects how a property is perceived over time.",
      ],
      quote: "A development stands out when every space, shared or private, feels intentional.",
    },
    {
      slug: "modern-architecture-balancing-form-and-function",
      title: "Modern Architecture: Balancing Form and Function",
      category: "Design",
      excerpt:
        "Learn how contemporary design approaches combine visual appeal with everyday functionality.",
      image: "1614595737476-42487331b8a1",
      alt: "White facade with timber-framed windows and clean lines",
      publicationDate: "2026-10-15",
      intro:
        "\"Form follows function\" is one of architecture's best-known ideas. Today's best buildings go further: *form and function reinforce each other* until neither feels like a compromise.",
      points: [
        "Every visual gesture should also solve a practical problem.",
        "Restraint often creates more impact than ornament.",
        "Comfort and usability are part of a building's beauty.",
      ],
      quote: "When form and function work together, a space stops feeling designed and simply feels right.",
    },
    {
      slug: "from-concept-to-completion",
      title: "From Concept to Completion: The Construction Journey",
      category: "Construction",
      excerpt:
        "Explore the stages involved in turning an architectural vision into a completed building.",
      image: "1608619769165-25647672335f",
      alt: "Concrete building under construction against an evening sky",
      publicationDate: "2026-10-08",
      intro:
        "Every completed building is the end of a long sequence of decisions, approvals and coordinated work. Understanding that journey helps clients **set expectations and make better choices**.",
      points: [
        "Pre-construction planning shapes the rest of the project.",
        "Structure, services and envelope must be closely coordinated.",
        "Finishing and handover deserve as much attention as the frame.",
      ],
      quote: "A smooth construction journey is planned long before the first excavation.",
    },
    {
      slug: "creating-spaces-with-long-term-value",
      title: "Creating Spaces with Long-Term Value",
      category: "Architecture",
      excerpt:
        "Understand how thoughtful design and quality construction contribute to enduring value.",
      image: "1757359056339-22968344cce6",
      alt: "Contemporary residence with illuminated glass facades at dusk",
      publicationDate: "2026-10-01",
      intro:
        "Long-term value is rarely about the most expensive finishes. It comes from **spaces that remain useful, comfortable and easy to maintain** for decades.",
      points: [
        "Adaptable layouts extend the useful life of a building.",
        "Durable materials reduce maintenance over time.",
        "Timeless design ages better than passing trends.",
      ],
      quote: "Value is what remains once the novelty of a new building has worn off.",
    },
    {
      slug: "natural-light-in-residential-design",
      title: "Why Natural Light Matters in Residential Design",
      category: "Design",
      excerpt:
        "How orientation, openings and balconies bring daylight deeper into homes and shape how they feel.",
      image: "1624204386084-dd8c05e32226",
      alt: "Residential balconies against an evening sky",
      publicationDate: "2026-09-24",
      intro:
        "Daylight changes how a room feels more than almost any finish can. Designing for it is one of the simplest ways to make a home *calmer and more comfortable*.",
      points: [
        "Orientation decides which rooms receive the best light.",
        "Shading is as important as glazing in warm climates.",
        "Light-coloured, matte surfaces help daylight travel further.",
      ],
      quote: "Natural light is the one material every home can use, and the easiest to waste.",
    },
    {
      slug: "site-planning-the-groundwork-behind-every-build",
      title: "Site Planning: The Groundwork Behind Every Build",
      category: "Construction",
      excerpt:
        "Why surveys, drawings and early coordination decide so much of a project's eventual quality.",
      image: "1760296404241-2d60056d401f",
      alt: "Black-and-white view of a residential tower with layered balconies",
      publicationDate: "2026-09-17",
      intro:
        "Before foundations are poured, a building is shaped by surveys, soil conditions, access routes and coordination between teams. **Good site planning prevents expensive surprises later.**",
      points: [
        "Accurate surveys reduce risk throughout construction.",
        "Site logistics affect safety, speed and quality.",
        "Early coordination between disciplines avoids clashes on site.",
      ],
      quote: "The groundwork you cannot see determines the quality of everything you can.",
    },
    {
      slug: "reading-a-neighbourhood-before-you-build",
      title: "Reading a Neighbourhood Before You Build",
      category: "Real Estate",
      excerpt:
        "Understanding context, access and community is the first step towards a development that belongs.",
      image: "1758193431355-54df41421657",
      alt: "Residential building with a glazed street-level facade",
      publicationDate: "2026-09-10",
      intro:
        "Every site sits within a living context of streets, neighbours and daily routines. Developments that *respond to that context* tend to feel established from the day they open.",
      points: [
        "Street character should inform scale and materials.",
        "Access and movement shape how a development is used.",
        "Ground floors are where a building meets its community.",
      ],
      quote: "A development belongs when it feels like it could not have been built anywhere else.",
    },
    {
      slug: "how-ryan-group-approaches-every-new-project",
      title: "How Ryan Group Approaches Every New Project",
      category: "Company Updates",
      excerpt:
        "An illustrative look at the principles of planning, integrity and quality that guide the group's work.",
      image: "1770756248866-00b8b7c1dd75",
      alt: "Tower crane beside a building under construction",
      publicationDate: "2026-09-03",
      intro:
        "This illustrative article shows how a company perspective piece would appear in the journal. It describes **principles rather than verified project details**.",
      points: [
        "Every project begins by understanding the client's goals.",
        "Transparent planning keeps everyone aligned.",
        "Quality and integrity guide decisions on site.",
      ],
      quote: "Every project is an opportunity to build trust as well as buildings.",
    },
    {
      slug: "facade-design-the-first-impression",
      title: "Facade Design: The First Impression of a Building",
      category: "Architecture",
      excerpt:
        "How rhythm, shadow and material on the outside of a building communicate its character.",
      image: "1589360810891-0935e508429a",
      alt: "Dark facade with vertical architectural slats",
      publicationDate: "2026-08-27",
      intro:
        "A facade is the first thing people experience and the part of a building most exposed to weather. Designing it well means balancing **expression, performance and durability**.",
      points: [
        "Rhythm and repetition give a facade calm and order.",
        "Shadow is as important as surface in architectural expression.",
        "Facade materials must be chosen for weathering as well as looks.",
      ],
      quote: "A good facade tells you how a building is organised before you step inside.",
    },
    {
      slug: "material-honesty-concrete-timber-and-glass",
      title: "Material Honesty: Letting Concrete, Timber and Glass Speak",
      category: "Design",
      excerpt:
        "Why restrained palettes and honest materials create interiors that age with quiet confidence.",
      image: "1736774011107-fe132f73ddc1",
      alt: "Black-and-white study of a textured concrete wall",
      publicationDate: "2026-08-20",
      intro:
        "Material honesty means letting materials be what they are, rather than disguising them. The result is architecture with *texture, depth and integrity*.",
      points: [
        "Fewer materials, used well, create calmer spaces.",
        "Natural textures add warmth without decoration.",
        "Honest materials tend to age with character.",
      ],
      quote: "When materials are allowed to speak for themselves, a space needs very little else.",
    },
    {
      slug: "safety-and-discipline-on-site",
      title: "Safety and Discipline on the Construction Site",
      category: "Construction",
      excerpt:
        "The everyday habits that keep sites organised, safe and on track from the first pour to handover.",
      image: "1569169513673-2cecbfc943a9",
      alt: "Tower crane rising above a construction site",
      publicationDate: "2026-08-13",
      intro:
        "A safe site is almost always a well-run site. The same habits that protect people also **protect quality, programme and budget**.",
      points: [
        "Clear routines make safety part of daily work.",
        "Organised sites reduce errors and damage to completed work.",
        "Good communication keeps every trade aligned.",
      ],
      quote: "Discipline on site is visible in the safety of the team and the quality of the work.",
    },
    {
      slug: "commercial-spaces-built-around-people",
      title: "Commercial Spaces Built Around the People Who Use Them",
      category: "Real Estate",
      excerpt:
        "Clear arrivals, comfortable circulation and flexible floors make commercial buildings work harder.",
      image: "1573918644828-9598c67e680c",
      alt: "Concrete frame of a multi-storey building under construction",
      publicationDate: "2026-08-06",
      intro:
        "Commercial buildings succeed when they make everyday tasks easier for the people inside them. That starts with *planning around movement, comfort and flexibility*.",
      points: [
        "A clear arrival experience sets the tone for the whole building.",
        "Flexible floor plates adapt to changing tenants.",
        "Daylight and air quality affect how people feel and work.",
      ],
      quote: "The best commercial spaces are designed around people first and floor area second.",
    },
    {
      slug: "curves-balconies-and-the-rhythm-of-a-facade",
      title: "Curves, Balconies and the Rhythm of a Facade",
      category: "Architecture",
      excerpt:
        "How repeated elements give residential buildings a calm, recognisable architectural identity.",
      image: "1453586857165-eb78d44460ca",
      alt: "Curved balcony forms in warm evening light",
      publicationDate: "2026-07-30",
      intro:
        "Balconies do more than extend living space. Repeated across a facade, they create **rhythm, shadow and a recognisable identity**.",
      points: [
        "Repetition creates order and calm on large facades.",
        "Curves soften a building's presence on the street.",
        "Balconies provide shade as well as outdoor space.",
      ],
      quote: "Rhythm turns a large building into something people can read and remember.",
    },
    {
      slug: "looking-ahead-growing-business-verticals",
      title: "Looking Ahead: Ryan Group's Growing Business Verticals",
      category: "Company Updates",
      excerpt:
        "An illustrative placeholder for future updates on the group's construction, accommodation and real estate ventures.",
      image: "1680874261352-ed1ee3d1cf01",
      alt: "Row of white contemporary villas",
      publicationDate: "2026-07-23",
      intro:
        "This placeholder article shows how future business updates would be presented. *No dates, figures or project commitments are implied.*",
      points: [
        "Construction remains the foundation of the group's work.",
        "Future verticals will be announced once confirmed.",
        "Every venture will share the same commitment to quality.",
      ],
      quote: "Growth is only meaningful when it is built on the same foundation of quality.",
    },
  ] satisfies ArticleInput[]
).map(article);

export const blogPath = (slug: string) => `/blog/${slug}`;

export const findArticle = (slug: string) => articles.find((item) => item.slug === slug);

export const featuredArticle = articles.find((item) => item.featured) ?? articles[0];

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const blockText = (block: ArticleBlock) => {
  switch (block.type) {
    case "ul":
    case "ol":
      return block.items.join(" ");
    case "figure":
      return block.caption;
    case "callout":
      return `${block.title} ${block.text}`;
    default:
      return block.text;
  }
};

export const readingTime = (item: Article) => {
  const words = item.content.map(blockText).join(" ").split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
};
