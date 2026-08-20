"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap, initGsap, prefersReduced } from "@/lib/gsap";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  /*
   * Entrance only — deliberately no exit animation.
   *
   * An exit would make the outgoing panel's removal depend on the frame loop
   * finishing it. In a throttled or backgrounded tab those frames never
   * arrive, and the reader would submit the form and keep staring at the form.
   * The incoming panel is what the eye reads, so animating only that costs
   * nothing and cannot strand the UI in the old state.
   */
  useEffect(() => {
    initGsap();
    const el = panel.current;
    if (!el || prefersReduced()) return;
    const tween = gsap.fromTo(
      el.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "hop" },
    );
    return () => {
      tween.kill();
    };
  }, [sent]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = (nameRef.current?.value ?? "").trim();
    const email = (emailRef.current?.value ?? "").trim();
    const message = (msgRef.current?.value ?? "").trim();

    if (!name) return setError("A name helps — even a first name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return setError("That email address does not look right.");
    if (message.length < 8) return setError("Tell me a little more than that.");

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
      <div className="form-sent" ref={panel}>
        <span className="form-sent-mark" aria-hidden="true">
          ✓
        </span>
        <h3>That reached me.</h3>
        <p>I reply within a day, usually sooner. Urgent? The phone number works too.</p>
        <button type="button" className="btn btn-quiet" onClick={reset} data-magnetic="0.2">
          Send another
        </button>
      </div>
    );
  }

  return (
    <div ref={panel}>
      <form className="contact-form" onSubmit={submit} noValidate>
        <p className="form-title">Send a note</p>

        <label className="field" htmlFor="cf-name">
          Name
          <input
            className="input"
            id="cf-name"
            name="name"
            type="text"
            ref={nameRef}
            autoComplete="name"
            placeholder="Your name"
          />
        </label>

        <label className="field" htmlFor="cf-email">
          Email
          <input
            className="input"
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            ref={emailRef}
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>

        <label className="field" htmlFor="cf-msg">
          What needs building or keeping alive?
          <textarea
            className="input"
            id="cf-msg"
            name="message"
            rows={4}
            ref={msgRef}
            placeholder="A sentence is enough."
          />
        </label>

        {error ? (
          <p role="alert" className="form-error">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-accent form-submit" data-magnetic="0.2" data-cursor>
          Send it <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
