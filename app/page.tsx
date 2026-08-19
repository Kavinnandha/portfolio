import Image from "next/image";
import BackToTop from "@/components/BackToTop";
import ContactForm from "@/components/ContactForm";
import SiteNav from "@/components/SiteNav";
import { CardStack, CardStackItem } from "@/components/motion/CardStack";
import Counter from "@/components/motion/Counter";
import HeroBackdrop from "@/components/motion/HeroBackdrop";
import Magnetic from "@/components/motion/Magnetic";
import Marquee from "@/components/motion/Marquee";
import Parallax from "@/components/motion/Parallax";
import { Reveal, RevealGroup, RevealItem, RuleDraw } from "@/components/motion/Reveal";
import ScrollWords from "@/components/motion/ScrollWords";
import TextMask from "@/components/motion/TextMask";
import portrait from "@/public/portrait.webp";

const stats = [
  { to: 1000, suffix: "+", group: true, label: "Concurrent users on one k3s cluster" },
  { to: 128, group: false, label: "Threads of dual Xeon Gold, 256GB ECC, operated bare metal" },
  { to: 3, suffix: " yrs", group: false, label: "Running a self-hosted Linux and Zero Trust edge" },
  { to: 2, group: false, label: "Hackathons won or placed, from 600+ entrants" },
];

const ticker = [
  "Kubernetes",
  "k3s",
  "Docker",
  "Cloudflare Zero Trust",
  "Terraform",
  "Ansible",
  "GitHub Actions",
  "Prometheus",
  "Grafana",
  "Nginx",
  "OpenWRT",
  "Tailscale",
  "Redis",
  "MongoDB",
  "Linux",
];

const caseSpec = [
  ["Orchestration", "k3s, single-cluster multi-service"],
  ["Compute", "2× Xeon Gold 6430 · 128 threads"],
  ["Memory", "256GB ECC"],
  ["Storage / network", "Hardware RAID · dual 10GbE"],
  ["Observability", "Prometheus · Grafana · cAdvisor · Node Exporter"],
  ["Load held", "1,000+ concurrent users"],
];

const toolkit = [
  {
    title: "Containers & orchestration",
    body: "Docker, Kubernetes (k3s), ingress and service topology, secrets management, Nginx reverse proxy and load balancing.",
  },
  {
    title: "CI/CD & automation",
    body: "GitHub Actions pipelines, Dockerized build and release flows, Terraform, Ansible, Bash and Python tooling.",
  },
  {
    title: "Cloud & edge",
    body: "AWS, Cloudflare, Cloudflare Workers and Wrangler CLI, Tunnel, Zero Trust access policies.",
  },
  {
    title: "Observability",
    body: "Prometheus, Grafana, cAdvisor, Node Exporter — container and node level metrics, capacity and scheduling decisions.",
  },
  {
    title: "Networking",
    body: "DNS, routing and switching, VLANs, NAT, subnetting, DHCP, VPNs, OpenWRT, Tailscale, live troubleshooting.",
  },
  {
    title: "Security & access",
    body: "Cloudflare Zero Trust, identity-based authentication, JWT and RBAC, firewall management, SSL/TLS configuration.",
  },
  {
    title: "Languages",
    body: "Python, Bash, TypeScript, JavaScript, Java — plus Node.js and Express on the backend side.",
  },
  {
    title: "Data",
    body: "MongoDB schema design and query optimization, MySQL, Redis caching.",
  },
];

const record = [
  {
    when: "Oct 2025 — Mar 2026",
    title: "DevOps & SDE Intern — TeamMistake Technologies",
    body: "CI/CD workflows, containerized deployments and infrastructure automation with Docker and GitHub Actions. Owned DNS, domain routing, SSL/TLS and Cloudflare traffic management for production services, and debugged deployment, certificate and networking failures across production and intranet environments. On the product side: Node.js and Express features from data model to rollout, MongoDB query optimization, and JWT-based RBAC built from scratch.",
  },
  {
    when: "2023 — present",
    title: "Independent infrastructure & homelab engineer",
    body: "A self-hosted Linux environment with Cloudflare Tunnel and Tailscale access, Zero Trust identity policies, OpenWRT networking, edge functions on Workers, and full container-level observability. Everything documented, everything reproducible.",
  },
  {
    when: "2023 — 2027",
    title: "B.E. Computer Science & Engineering (Cyber Security)",
    body: "Sri Shakthi Institute of Engineering and Technology, Coimbatore — CGPA 8.61/10. Certified in Claude Code in Action (Anthropic, 2026) and Intel Unnati Industrial Training (2025).",
  },
];

const contactLinks = [
  { href: "mailto:kavinnandhakavin@gmail.com", text: "kavinnandhakavin@gmail.com", label: "Email" },
  { href: "https://github.com/kavinnandha", text: "github.com/kavinnandha", label: "Code" },
  { href: "https://linkedin.com/in/kavinnandha", text: "linkedin.com/in/kavinnandha", label: "LinkedIn" },
  { href: "https://kavinweb.info", text: "kavinweb.info", label: "Web" },
  { href: "tel:+919345569707", text: "+91 93455 69707", label: "Phone" },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main>
        <section id="top" className="hero">
          <HeroBackdrop />

          <div className="hero-inner">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              <span>Cloud / DevOps engineer</span>
              <span className="hero-place">Coimbatore, IN</span>
            </div>

            <h1 className="hero-title">
              <TextMask
                delay={0.75}
                lines={["Production", "infrastructure,", "owned end to end."]}
                lineClassNames={[undefined, undefined, "accent"]}
              />
            </h1>

            <p className="hero-lede">
              I run a bare-metal Kubernetes (k3s) cluster serving 1,000+ concurrent users, a
              self-hosted Cloudflare Zero Trust edge, and the CI/CD that ships to both. Container
              orchestration, DNS and SSL, networking, observability — I own the whole path from commit
              to production.
            </p>

            <div className="hero-actions">
              <Magnetic>
                <a className="btn btn-primary" href="#work">
                  Selected work
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-secondary" href="mailto:kavinnandhakavin@gmail.com">
                  kavinnandhakavin@gmail.com
                </a>
              </Magnetic>
              <Magnetic strength={10}>
                <a
                  className="btn btn-ghost"
                  href="https://kavinweb.info"
                  target="_blank"
                  rel="noopener"
                >
                  kavinweb.info
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="hero-foot">
            <div className="hero-scroll">
              <span>Scroll</span>
              <span className="scrollpulse" />
            </div>
            <span className="hero-load">k3s · 1,000+ concurrent</span>
          </div>
        </section>

        <hr className="hr" />

        <RevealGroup as="section" className="stats" stagger={0.09}>
          <div className="stats-grid">
            {stats.map((s) => (
              <RevealItem key={s.label}>
                <p className="stat-num">
                  <Counter to={s.to} suffix={s.suffix} group={s.group} />
                </p>
                <p className="stat-label">{s.label}</p>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>

        <hr className="hr" />

        <Marquee items={ticker} />

        <hr className="hr" />

        <Reveal as="section" className="section split split-about">
          <div className="split-figure">
            <span className="kicker" style={{ marginBottom: 14 }}>
              About
            </span>
            <figure className="grayscale">
              <Parallax className="figure-4x5" amount={7}>
                <Image
                  src={portrait}
                  alt="Kavin Nandha M K"
                  sizes="(max-width: 900px) 100vw, 40vw"
                  placeholder="blur"
                  priority
                />
              </Parallax>
            </figure>
          </div>

          <div>
            <h2 className="section-title">I like the layer most people would rather not touch.</h2>
            <p className="body about-body">
              Final-year B.E. Computer Science (Cyber Security) at Sri Shakthi Institute of Engineering
              and Technology, Coimbatore — and, since 2023, the person who keeps a
              homelab-turned-production environment alive: Cloudflare Tunnel and Tailscale for access,
              OpenWRT for the network, Prometheus and Grafana for the truth about what is happening.
            </p>
            <p className="body about-body">
              At TeamMistake Technologies I worked both sides of the line — Dockerized CI/CD, DNS,
              SSL/TLS and Cloudflare traffic for production services, plus Node.js and MongoDB backend
              features shipped end to end. I am looking for a cloud, DevOps or platform engineering
              role where reliability is the product.
            </p>
            <ScrollWords
              as="blockquote"
              className="pullquote"
              text="Deploys are easy. Staying up under 1,000 people at once is the engineering."
            />
          </div>
        </Reveal>

        <hr className="hr" />

        <section id="work" className="section">
          <Reveal className="section-head">
            <span className="kicker">Selected work</span>
            <span className="meta">Six builds — infrastructure, backend, applied AI</span>
          </Reveal>

          <CardStack total={6}>
            <CardStackItem index={0}>
              <div className="bento-index">
                <span className="num">01</span>
                <span className="cat">Kubernetes · bare metal</span>
              </div>
              <h3 className="bento-h-lg">Moodle LMS on a bare-metal k3s cluster</h3>
              <p className="bento-p-lg">
                A production learning platform with CodeRunner/Jobe grading services on dual Intel Xeon
                Gold 6430 servers, holding steady through real classroom load of 1,000+ concurrent
                users.
              </p>
              <div className="bento-tags wide">
                <span className="tag tag-outline">k3s</span>
                <span className="tag tag-outline">Ingress</span>
                <span className="tag tag-outline">Secrets</span>
                <span className="tag tag-outline">Prometheus</span>
                <span className="tag tag-outline">Grafana</span>
                <span className="tag tag-accent">Case study below</span>
              </div>
            </CardStackItem>

            <CardStackItem index={1} className="invert">
              <div className="bento-index">
                <span className="num">02</span>
                <span className="cat">Self-hosted edge</span>
              </div>
              <h3 className="bento-h-md">Zero Trust homelab, run like production</h3>
              <p className="bento-p">
                Cloudflare Tunnel and Tailscale for identity-based remote access, OpenWRT for VPN
                routing and firewalling, Workers deployed with Wrangler at the edge.
              </p>
              <div className="bento-when">2023 — present</div>
            </CardStackItem>

            <CardStackItem index={2}>
              <div className="bento-index">
                <span className="num">03</span>
                <span className="cat">Platform</span>
              </div>
              <h3 className="bento-h-md">HR Connect</h3>
              <p className="bento-p">
                Placement and recruitment platform: containerized microservices behind a hardened API,
                JWT and role-based access, Redis caching on the hot endpoints, Nginx reverse proxy in
                front.
              </p>
              <div className="bento-tags">
                <span className="tag tag-neutral">Docker</span>
                <span className="tag tag-neutral">Node.js</span>
                <span className="tag tag-neutral">MongoDB</span>
                <span className="tag tag-neutral">Redis</span>
              </div>
            </CardStackItem>

            <CardStackItem index={3}>
              <div className="bento-index">
                <span className="num">04</span>
                <span className="cat">Applied AI · 24h build</span>
              </div>
              <h3 className="bento-h-md">MobilityX 2.0</h3>
              <p className="bento-p">
                A RAG chatbot, GRU and regression forecasting, and a Solidity trust layer, shipped
                cross-platform in twenty-four hours. Runner-up and software track winner among 250+
                participants.
              </p>
              <div className="bento-tags">
                <span className="tag tag-neutral">RAG</span>
                <span className="tag tag-neutral">React Native</span>
                <span className="tag tag-neutral">Hardhat</span>
              </div>
            </CardStackItem>

            <CardStackItem index={4}>
              <div className="bento-index">
                <span className="num">05</span>
                <span className="cat">Infrastructure</span>
              </div>
              <h3 className="bento-h-md">Virtual Assessment Platform</h3>
              <p className="bento-p">
                Deployment and monitoring for concurrent online evaluations — backend communication
                tuned for low latency, bottlenecks traced and cleared during live sessions.
              </p>
              <div className="bento-tags">
                <span className="tag tag-neutral">Linux</span>
                <span className="tag tag-neutral">Monitoring</span>
              </div>
            </CardStackItem>

            <CardStackItem index={5}>
              <div className="bento-index">
                <span className="num">06</span>
                <span className="cat">Multi-role · MySQL</span>
              </div>
              <h3 className="bento-h-md">Institution Management System</h3>
              <p className="bento-p">
                Centralized academic platform for student, faculty and admin roles — access-controlled
                APIs and schemas built for concurrent multi-role use.
              </p>
            </CardStackItem>
          </CardStack>
        </section>

        <hr className="hr" />

        <section id="case" className="section">
          <Reveal className="section-head" style={{ marginBottom: 0 }}>
            <span className="kicker">Case study 01</span>
            <span className="meta">Moodle LMS · k3s · dual Xeon Gold 6430</span>
          </Reveal>

          <ScrollWords
            as="h2"
            className="case-title"
            text="A classroom platform that cannot go down at 9am."
          />

          <RevealGroup className="case-grid" stagger={0.1}>
            <RevealItem className="case-cell">
              <span className="kicker-sm">Problem</span>
              <p>
                An entire institution&rsquo;s coursework, quizzes and automated code grading had to run
                on hardware in the building — not a managed cloud — and survive a thousand students
                logging in at the same minute.
              </p>
            </RevealItem>
            <RevealItem className="case-cell">
              <span className="kicker-sm">Approach</span>
              <p>
                A k3s cluster on dual Xeon Gold 6430 servers, hardware RAID and dual 10GbE. Moodle,
                CodeRunner and Jobe split into a containerized service topology with ingress routing
                and managed secrets, then Prometheus, Grafana, cAdvisor and Node Exporter wired in
                before the first class, not after the first outage.
              </p>
            </RevealItem>
            <RevealItem className="case-cell">
              <span className="kicker-sm">Outcome</span>
              <p>
                1,000+ concurrent users held through peak sessions. Metrics drove scheduling and
                resource allocation decisions instead of guesswork, and grading workloads stayed
                isolated from the platform serving the pages.
              </p>
            </RevealItem>
          </RevealGroup>

          <div className="split split-case">
            {/* Drop a Grafana board or rack photo at public/case-shot.webp and swap
                this placeholder for the same <Image> treatment as the portrait. */}
            <figure className="grayscale split-figure case-figure">
              <div className="figure-16x10 figure-empty">Grafana · cluster overview</div>
            </figure>

            <div className="case-spec">
              <table className="table">
                <RevealGroup as="tbody" stagger={0.06}>
                  {caseSpec.map(([k, v]) => (
                    <RevealItem as="tr" key={k} y={16}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </table>
            </div>
          </div>
        </section>

        <hr className="hr" />

        <section id="toolkit" className="section">
          <Reveal className="section-head">
            <span className="kicker">Toolkit</span>
            <span className="meta">Grouped by the job it does</span>
          </Reveal>

          <RevealGroup className="toolkit-grid" stagger={0.06}>
            {toolkit.map((t) => (
              <RevealItem key={t.title} className="toolkit-item">
                <RuleDraw className="rule" />
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <hr className="hr" />

        <section id="record" className="section">
          <Reveal>
            <span className="kicker" style={{ marginBottom: 40 }}>
              Record
            </span>
          </Reveal>

          <RevealGroup stagger={0.12}>
            {record.map((r) => (
              <RevealItem key={r.title} className="record-row">
                <RuleDraw className="rule rule-full" />
                <p className="record-date">{r.when}</p>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="record-extra">
            <div>
              <span className="kicker-sm">Publication</span>
              <p>
                Sentinel AI: Cyber Bully Detection and Prevention —{" "}
                <em>Journal of Research in Artificial Neural Network Systems</em>, Vol. 2, No. 2, pp.
                1–5, April 2026.{" "}
                <a
                  href="http://hbrppublication.com/OJS/index.php/JRANNS/article/view/9606"
                  target="_blank"
                  rel="noopener"
                >
                  Read it
                </a>
              </p>
            </div>
            <div>
              <span className="kicker-sm">Awards</span>
              <p>
                MobilityX 2.0 (2025) — runner-up and software track winner, 250+ participants. SRCAS
                2.0 (2025) — winner, 350+ participants. Presented an AI microlearning platform at TN
                Startup Meet 2025.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="contact">
          <div className="contact-inner split split-contact">
            <div>
              <h2 className="contact-title">
                <TextMask
                  trigger="view"
                  lines={["Got infrastructure", "that needs owning?"]}
                />
              </h2>

              <RevealGroup className="contact-links" stagger={0.07}>
                {contactLinks.map((l) => (
                  <RevealItem key={l.label} y={14}>
                    <a
                      className="contact-link"
                      href={l.href}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                    >
                      <span>{l.text}</span>
                      <span className="label">{l.label}</span>
                    </a>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal className="contact-card" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Kavin Nandha M K — Cloud / DevOps engineer, Coimbatore</span>
        <BackToTop />
      </footer>
    </>
  );
}
