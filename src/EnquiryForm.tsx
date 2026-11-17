import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type Ref,
} from "react";
import { Arrow } from "./PageChrome";
import { markEnquiryEngaged } from "./enquirySession";

/*
 * Shared enquiry form, used on the Contact page and in the site-wide enquiry popup.
 *
 * Placeholder contact email: the same dummy value used across the site.
 * Replace with Ryan Group's verified address before launch.
 */
export const CONTACT_EMAIL = "hello@ryangroup.example";

export const topics = [
  "Construction Project",
  "Existing Project Inquiry",
  "Business Partnership",
  "General Inquiry",
] as const;
export type Topic = (typeof topics)[number];

type Values = {
  name: string;
  email: string;
  phone: string;
  topic: Topic | "";
  location: string;
  details: string;
};
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;

const emptyValues: Values = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  location: "",
  details: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const fieldOrder: FieldName[] = ["name", "email", "phone", "topic"];

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Please enter a valid email address, e.g. name@company.com.";
  if (values.phone.trim()) {
    const digits = values.phone.replace(/\D/g, "");
    if (!/^[+\d\s().-]+$/.test(values.phone.trim()) || digits.length < 7 || digits.length > 15)
      errors.phone = "Please enter a valid phone number, or leave this blank.";
  }
  if (!values.topic) errors.topic = "Please choose what you would like to discuss.";
  return errors;
}

function Field({
  id,
  label,
  required = false,
  full = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  full?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`cp-field ${full ? "full" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="cp-req" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="cp-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export type EnquiryFormHandle = {
  /** Preselects a topic (used by the Contact page "How can we help?" cards). */
  chooseTopic: (topic?: Topic) => void;
};

type Props = {
  /** Prefix for element ids, so two instances never share ids. */
  idPrefix?: string;
  /** Shows the "Enquiry form / Start your enquiry" heading block. */
  showHead?: boolean;
  ref?: Ref<EnquiryFormHandle>;
};

function EnquiryForm({ idPrefix = "cp", showHead = true, ref }: Props) {
  const [values, setValues] = useState<Values>(emptyValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "invalid" | "sent">("idle");
  const successRef = useRef<HTMLHeadingElement>(null);
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  const errors = validate(values);
  const showError = (name: FieldName) => (touched[name] ? errors[name] : undefined);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const update = (name: FieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (status === "invalid" && Object.keys(validate({ ...values, [name]: value })).length === 0)
      setStatus("idle");
  };

  const inputProps = (name: Exclude<FieldName, "topic">) => {
    const id = fieldId(name);
    const error = showError(name);
    return {
      id,
      name,
      value: values[name],
      onChange: (event: { target: { value: string } }) => update(name, event.target.value),
      onBlur: () => setTouched((current) => ({ ...current, [name]: true })),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
    };
  };

  const chooseTopic = (topic?: Topic) => {
    if (topic) {
      update("topic", topic);
      setTouched((current) => ({ ...current, topic: true }));
    }
    if (status === "sent") setStatus("idle");
  };

  useImperativeHandle(ref, () => ({ chooseTopic }));

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, phone: true, topic: true });
    const firstInvalid = fieldOrder.find((name) => errors[name]);
    if (firstInvalid) {
      setStatus("invalid");
      const focusId =
        firstInvalid === "topic"
          ? fieldId(`topic-${values.topic || topics[0]}`)
          : fieldId(firstInvalid);
      document.getElementById(focusId)?.focus();
      return;
    }

    // No backend is connected: hand the enquiry to the visitor's email application.
    const subject = `Ryan Group enquiry: ${values.topic} from ${values.name.trim()}`;
    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phone.trim() || "Not provided"}`,
      `Topic: ${values.topic}`,
      `Project location: ${values.location.trim() || "Not provided"}`,
      "",
      "Details:",
      values.details.trim() || "Not provided",
    ].join("\n");
    markEnquiryEngaged();
    setStatus("sent");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const resetForm = () => {
    setValues(emptyValues);
    setTouched({});
    setStatus("idle");
  };

  const topicError = showError("topic");
  const titleId = fieldId("form-title");

  if (status === "sent") {
    return (
      <div className="cp-success" role="status">
        <span className="cp-success-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="cp-form-kicker">Enquiry prepared</span>
        <h3 ref={successRef} tabIndex={-1}>
          Your email is ready to send.
        </h3>
        <p>
          We&apos;ve opened your email application with your enquiry filled in. Press send there
          to reach our team.
        </p>
        <p>
          Nothing opened? Email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <div className="cp-success-actions">
          <button type="button" className="cp-text-button" onClick={() => setStatus("idle")}>
            Edit enquiry
          </button>
          <button type="button" className="cp-text-button" onClick={resetForm}>
            Start a new enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={submitEnquiry}
      onFocus={markEnquiryEngaged}
      aria-labelledby={showHead ? titleId : undefined}
      aria-label={showHead ? undefined : "Enquiry form"}
    >
      {showHead && (
        <div className="cp-form-head">
          <span className="cp-form-kicker">Enquiry form</span>
          <h3 id={titleId}>Start your enquiry</h3>
          <p>
            Fields marked <span className="cp-req">*</span> are required.
          </p>
        </div>
      )}

      <div className="cp-field-grid">
        <Field id={fieldId("name")} label="Full Name" required full error={showError("name")}>
          <input
            {...inputProps("name")}
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            aria-required="true"
          />
        </Field>
        <Field id={fieldId("email")} label="Email Address" required error={showError("email")}>
          <input
            {...inputProps("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Enter your email address"
            aria-required="true"
          />
        </Field>
        <Field id={fieldId("phone")} label="Phone Number" error={showError("phone")}>
          <input
            {...inputProps("phone")}
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
          />
        </Field>
      </div>

      <fieldset
        className={`cp-topics ${topicError ? "is-invalid" : ""}`}
        aria-describedby={topicError ? fieldId("topic-error") : undefined}
      >
        <legend>
          What would you like to discuss?
          <span className="cp-req" aria-hidden="true">
            {" "}
            *
          </span>
        </legend>
        <div className="cp-topic-grid">
          {topics.map((topic) => (
            <label className="cp-topic" key={topic}>
              <input
                type="radio"
                name={fieldId("topic")}
                id={fieldId(`topic-${topic}`)}
                value={topic}
                checked={values.topic === topic}
                onChange={() => chooseTopic(topic)}
                required
              />
              <span>{topic}</span>
            </label>
          ))}
        </div>
        {topicError && (
          <p className="cp-error" id={fieldId("topic-error")}>
            {topicError}
          </p>
        )}
      </fieldset>

      <div className="cp-field-grid">
        <Field id={fieldId("location")} label="Project Location" full>
          <input
            {...inputProps("location")}
            type="text"
            autoComplete="address-level2"
            placeholder="City or project location"
          />
        </Field>
        <Field id={fieldId("details")} label="Additional Details" full>
          <textarea
            {...inputProps("details")}
            rows={5}
            placeholder="Tell us about your project, requirements, or vision..."
          />
        </Field>
      </div>

      {status === "invalid" && (
        <p className="cp-form-alert" role="alert">
          Please check the highlighted fields and try again.
        </p>
      )}

      <div className="cp-form-foot">
        <button type="submit" className="button golden-button">
          Send Enquiry <Arrow />
        </button>
        <p>Sending opens your email application with these details prepared.</p>
      </div>
    </form>
  );
}

export default EnquiryForm;
