"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import Magnetic from "./motion/Magnetic";
import { EASE_OUT } from "./motion/easing";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const reduced = useReducedMotion();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const name = (nameRef.current?.value ?? "").trim();
    const email = (emailRef.current?.value ?? "").trim();
    const msg = (msgRef.current?.value ?? "").trim();

    if (!name) return setError("A name helps — even a first name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return setError("That email address does not look right.");
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
   * Entrance only — deliberately no `AnimatePresence` here.
   *
   * An exit animation would make the outgoing panel's removal depend on the
   * frame loop finishing it. In a throttled or backgrounded tab those frames
   * never arrive, and the reader would submit the form and keep staring at the
   * form. The incoming panel is what the eye actually reads, so animating only
   * that costs nothing and cannot strand the UI in the old state.
   */
  const panel = {
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.45, ease: EASE_OUT },
  };

  if (sent) {
    return (
      <motion.div className="form-sent" {...panel}>
        <span className="form-sent-mark" aria-hidden="true">
          ✓
        </span>
        <h3>That reached me.</h3>
        <p>I reply within a day, usually sooner. Urgent? The phone number works too.</p>
        <Magnetic strength={7}>
          <button type="button" className="btn btn-quiet" onClick={reset}>
            Send another
          </button>
        </Magnetic>
      </motion.div>
    );
  }

  return (
    <motion.form className="contact-form" onSubmit={submit} noValidate {...panel}>
      <p className="form-title">Send a note</p>

      <label className="field" htmlFor="v2-name">
        Name
        <input
          className="input"
          id="v2-name"
          name="name"
          type="text"
          ref={nameRef}
          autoComplete="name"
          placeholder="Your name"
        />
      </label>

      <label className="field" htmlFor="v2-email">
        Email
        <input
          className="input"
          id="v2-email"
          name="email"
          type="email"
          inputMode="email"
          ref={emailRef}
          autoComplete="email"
          placeholder="you@company.com"
        />
      </label>

      <label className="field" htmlFor="v2-msg">
        What needs building or keeping alive?
        <textarea
          className="input"
          id="v2-msg"
          name="message"
          rows={4}
          ref={msgRef}
          placeholder="A sentence is enough."
        />
      </label>

      {error ? (
        <motion.p
          key={error}
          role="alert"
          className="form-error"
          initial={{ opacity: 0, y: reduced ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT }}
        >
          {error}
        </motion.p>
      ) : null}

      <Magnetic strength={7} className="form-submit">
        <button type="submit" className="btn btn-accent">
          Send it <span aria-hidden="true">→</span>
        </button>
      </Magnetic>
    </motion.form>
  );
}
