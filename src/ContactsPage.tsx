import { useEffect, useRef, type ReactNode } from "react";
import EnquiryForm, { CONTACT_EMAIL, type EnquiryFormHandle, type Topic } from "./EnquiryForm";
import { Arrow, PageFooter, PageHeader, RevealPage } from "./PageChrome";

/*
 * Placeholder contact details: the same dummy values used across the site.
 * Replace with Ryan Group's verified email and phone before launch.
 */
const CONTACT_PHONE = "+919800000000";

const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=86`;

const images = {
  collageMain: unsplash("1757356657991-c3fd6e2e812e", 1100),
  collageDetail: unsplash("1496236436299-cde70e3587cf", 800),
  collageFacade: unsplash("1614595737476-42487331b8a1", 800),
  construction: unsplash("1608619769165-25647672335f", 900),
  projects: unsplash("1757359056339-22968344cce6", 900),
  partnerships: unsplash("1624204386084-dd8c05e32226", 900),
  enquiry: unsplash("1770756248866-00b8b7c1dd75", 1200),
};

type IconName = "building" | "phone" | "mail";

function ContactIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    building: (
      <>
        <path d="M4 21V6l8-3 8 3v15" />
        <path d="M2.5 21h19M9 21v-4h6v4M8 8.5h2M14 8.5h2M8 12.5h2M14 12.5h2" />
      </>
    ),
    phone: (
      <path d="M5.5 3.5h3l1.6 4.2-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4.2 1.6v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3.5 5.5a2 2 0 0 1 2-2Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="m3.5 6 8.5 7 8.5-7" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const actions: {
  icon: IconName;
  title: string;
  text: string;
  cta: string;
  href: string;
}[] = [
  {
    icon: "building",
    title: "Discuss a Project",
    text: "Share your vision for your next development.",
    cta: "Start Enquiry",
    href: "#enquiry-form",
  },
  {
    icon: "phone",
    title: "Connect With Us",
    text: "Speak with our team about your requirements.",
    cta: "Contact Us",
    href: `tel:${CONTACT_PHONE}`,
  },
  {
    icon: "mail",
    title: "Business Inquiries",
    text: "For partnerships, collaborations, and general inquiries.",
    cta: "Send Email",
    href: `mailto:${CONTACT_EMAIL}`,
  },
];

const helpCards: {
  label: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
  topic?: Topic;
}[] = [
  {
    label: "Construction",
    title: "Build With Ryan Group",
    text: "Have a construction project or development opportunity to discuss?",
    cta: "Discuss Construction",
    href: "#enquiry-form",
    image: images.construction,
    alt: "Concrete building under construction against an evening sky",
    topic: "Construction Project",
  },
  {
    label: "Projects",
    title: "Explore Our Work",
    text: "Interested in learning more about Ryan Group's completed projects?",
    cta: "Explore Projects",
    href: "/projects",
    image: images.projects,
    alt: "Contemporary residence with glazed facades lit at dusk",
  },
  {
    label: "Partnerships",
    title: "Partner With Us",
    text: "Looking to collaborate or explore a business partnership?",
    cta: "Start a Conversation",
    href: "#enquiry-form",
    image: images.partnerships,
    alt: "Residential tower balconies against an evening sky",
    topic: "Business Partnership",
  },
];

function ContactsPage() {
  const formRef = useRef<EnquiryFormHandle>(null);

  useEffect(() => {
    document.title = "Contact Ryan Group | Start a Conversation";
    // RevealPage resets scroll on mount; honour links such as /contacts#enquiry-form.
    const target = window.location.hash && document.querySelector(window.location.hash);
    if (target) target.scrollIntoView();
  }, []);

  return (
    <RevealPage>
      <div className="site contacts-page">
        <PageHeader active="Contacts" solid />
        <main>
          <section id="contacts-top" className="cp-hero">
            <div className="container cp-hero-grid">
              <div className="cp-hero-copy reveal">
                <div className="breadcrumb cp-breadcrumb">
                  <a href="/">Home</a>
                  <span>/</span>
                  <strong>Contacts</strong>
                </div>
                <div className="eyebrow">
                  <span />
                  GET IN TOUCH
                </div>
                <h1>
                  Let&apos;s build something
                  <br />
                  <em>meaningful.</em>
                </h1>
                <p className="cp-lead">
                  Have a project in mind or looking to collaborate with Ryan Group? Reach out to us
                  and let&apos;s explore how we can create something exceptional together.
                </p>
                <ul className="cp-actions">
                  {actions.map((action) => (
                    <li key={action.title}>
                      <a className="cp-action" href={action.href}>
                        <span className="cp-action-icon">
                          <ContactIcon name={action.icon} />
                        </span>
                        <span className="cp-action-copy">
                          <span className="cp-action-title">{action.title}</span>
                          <span className="cp-action-text">{action.text}</span>
                        </span>
                        <span className="cp-action-cta">
                          {action.cta} <Arrow />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cp-collage reveal">
                <figure className="cp-collage-main">
                  <img
                    src={images.collageMain}
                    alt="Modern residence with glazed facades and terraces at dusk"
                  />
                </figure>
                <figure className="cp-collage-top">
                  <img
                    src={images.collageDetail}
                    alt="Close-up of textured concrete architectural detailing"
                    loading="lazy"
                  />
                </figure>
                <figure className="cp-collage-bottom">
                  <img
                    src={images.collageFacade}
                    alt="Contemporary facade with timber-framed windows"
                    loading="lazy"
                  />
                </figure>
              </div>
            </div>
          </section>

          <section className="section cp-help">
            <div className="container">
              <div className="cp-help-head">
                <div className="section-title reveal">
                  <div className="eyebrow">
                    <span />
                    HOW CAN WE HELP?
                  </div>
                  <h2>
                    Every great project
                    <br />
                    starts with a <em>conversation.</em>
                  </h2>
                </div>
                <p className="reveal">
                  Whether you are exploring a development, discussing a partnership, or learning
                  more about our work, our team is ready to connect.
                </p>
              </div>
              <ul className="cp-help-grid">
                {helpCards.map((card, index) => (
                  <li className="cp-help-card reveal" key={card.label}>
                    <a href={card.href} onClick={() => formRef.current?.chooseTopic(card.topic)}>
                      <span className="cp-help-media">
                        <img src={card.image} alt={card.alt} loading="lazy" />
                      </span>
                      <span className="cp-help-body">
                        <span className="cp-help-label">
                          0{index + 1} <i /> {card.label}
                        </span>
                        <span className="cp-help-title">{card.title}</span>
                        <span className="cp-help-text">{card.text}</span>
                        <span className="cp-help-cta">
                          {card.cta} <Arrow />
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="enquiry-form" className="section cp-enquiry">
            <div className="container">
              <div className="cp-enquiry-shell reveal">
                <aside
                  className="cp-enquiry-visual"
                  style={{ backgroundImage: `url(${images.enquiry})` }}
                >
                  <div className="cp-enquiry-overlay" />
                  <div className="cp-enquiry-visual-copy">
                    <div className="eyebrow light">
                      <span />
                      LET&apos;S TALK
                    </div>
                    <h2>
                      Tell us about
                      <br />
                      <em>your vision.</em>
                    </h2>
                    <p>Share a few details about your project, and our team will get in touch.</p>
                    <ol className="cp-steps">
                      <li>
                        <span>01</span> Choose your inquiry type.
                      </li>
                      <li>
                        <span>02</span> Share your project details.
                      </li>
                      <li>
                        <span>03</span> Our team will connect with you.
                      </li>
                    </ol>
                  </div>
                </aside>

                <div className="cp-enquiry-panel">
                  <EnquiryForm ref={formRef} />
                </div>
              </div>
            </div>
          </section>

          <section className="contact-map-band">
            <div className="contact-map-lines" />
            <div className="container reveal">
              <span>RYAN GROUP · MUMBAI</span>
              <h2>
                Building relationships
                <br />
                <em>beyond structures.</em>
              </h2>
              <a
                href="https://maps.google.com/?q=Mumbai+India"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Open in Maps <Arrow diagonal />
              </a>
            </div>
          </section>
        </main>
        <PageFooter topId="contacts-top" />
      </div>
    </RevealPage>
  );
}

export default ContactsPage;
