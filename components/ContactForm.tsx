"use client";

import { useRef, useState, type FormEvent } from "react";
import Magnetic from "./motion/Magnetic";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "./motion/gsap";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const scope = useRef<HTMLDivElement>(null);
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

  /*
   * Entrance only, and deliberately so.
   *
   * An exit animation would make the outgoing panel's removal depend on the
   * frame loop finishing it. In a throttled or backgrounded tab those frames
   * never arrive, and the reader would submit the form and keep staring at the
   * form. The incoming panel is what the eye actually reads, so animating only
   * that costs nothing and cannot strand the UI in the old state.
   *
   * `revertOnUpdate` matters here: without it, swapping panels would leave the
   * previous panel's tweens recorded in the same context, and each pass would
   * add another.
   */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const panel = scope.current?.firstElementChild;
      if (!panel) return;

      gsap.from(panel, { opacity: 0, y: 16, duration: 0.55, ease: EASE });
      gsap.from(panel.querySelectorAll(".field, .form-submit, .form-sent-action"), {
        opacity: 0,
        y: 12,
        duration: 0.5,
        stagger: 0.07,
        ease: EASE,
        delay: 0.08,
      });
    },
    { scope, dependencies: [sent], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!error || prefersReducedMotion()) return;
      gsap.from(scope.current?.querySelector(".form-error") ?? [], {
        opacity: 0,
        y: -6,
        duration: 0.35,
        ease: EASE,
      });
    },
    { scope, dependencies: [error], revertOnUpdate: true },
  );

  return (
    <div ref={scope}>
      {sent ? (
        <div className="form-sent">
          <span className="kicker-sm" style={{ marginBottom: 16 }}>
            Sent
          </span>
          <h3>Thanks — that reached me.</h3>
          <p>
            I reply within a day, usually sooner. If it is urgent, the phone number to the left works
            too.
          </p>
          <Magnetic strength={10} className="form-sent-action">
            <button type="button" className="btn btn-secondary" onClick={reset}>
              Send another
            </button>
          </Magnetic>
        </div>
      ) : (
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
              inputMode="email"
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

          <Magnetic strength={12} className="form-submit">
            <button type="submit" className="btn btn-primary">
              Send it
            </button>
          </Magnetic>
        </form>
      )}
    </div>
  );
}
