"use client";

import { useRef, useState, type FormEvent } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const name = (nameRef.current?.value ?? "").trim();
    const email = (emailRef.current?.value ?? "").trim();
    const msg = (msgRef.current?.value ?? "").trim();

    if (!name) return setError("A name helps — even a first name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError("That email address does not look right.");
    if (msg.length < 8) return setError("Tell me a little more than that.");

    setError("");
    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setError("");
    if (nameRef.current) nameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (msgRef.current) msgRef.current.value = "";
  };

  if (sent) {
    return (
      <div className="form-sent">
        <span className="kicker-sm" style={{ marginBottom: 16 }}>
          Sent
        </span>
        <h3>Thanks — that reached me.</h3>
        <p>
          I reply within a day, usually sooner. If it is urgent, the phone number to the left works
          too.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={reset}
          style={{ alignSelf: "flex-start" }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <span className="kicker-sm" style={{ marginBottom: 0 }}>
        Or send a note
      </span>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input
          className="input"
          id="cf-name"
          name="name"
          type="text"
          ref={nameRef}
          autoComplete="name"
          placeholder="Your name"
        />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input
          className="input"
          id="cf-email"
          name="email"
          type="email"
          ref={emailRef}
          autoComplete="email"
          placeholder="you@company.com"
        />
      </div>
      <div className="field">
        <label htmlFor="cf-msg">What do you need built or kept running?</label>
        <textarea
          className="input"
          id="cf-msg"
          name="message"
          rows={4}
          ref={msgRef}
          placeholder="A sentence is enough."
        />
      </div>
      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary" data-magnetic="1" style={{ justifySelf: "start" }}>
        Send it
      </button>
    </form>
  );
}
