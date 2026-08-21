import Image from "next/image";
import BackToTop from "@/components/BackToTop";
import ContactForm from "@/components/ContactForm";
import SiteNav from "@/components/SiteNav";
import { CardStack, CardStackItem } from "@/components/motion/CardStack";
import ContactSection from "@/components/motion/ContactSection";
import Counter from "@/components/motion/Counter";
import HeroInner from "@/components/motion/HeroInner";
import HeroStage from "@/components/motion/HeroStage";
import Magnetic from "@/components/motion/Magnetic";
import Marquee, { type Chip } from "@/components/motion/Marquee";
import Parallax from "@/components/motion/Parallax";
import PinnedPipeline, { type PipelineStep } from "@/components/motion/PinnedPipeline";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import TextMask from "@/components/motion/TextMask";
import portrait from "@/public/portrait.webp";

const ticker: Chip[] = [
  { label: "Kubernetes (k3s)" },
  { label: "Docker", tone: "accent" },
  { label: "GitHub Actions" },
  { label: "Terraform" },
  { label: "Ansible" },
  { label: "Cloudflare Zero Trust" },
  { label: "Prometheus", tone: "ink" },
  { label: "Grafana" },
  { label: "Nginx" },
  { label: "Linux" },
  { label: "Node.js" },
  { label: "Redis" },
];

const stats = [
  {
    to: 1000,
    suffix: "+",
    group: true,
    accent: true,
    label: "Concurrent users held on one cluster",
  },
  { to: 128, group: false, label: "Threads of dual Xeon Gold, 256GB ECC, bare metal" },
  { to: 3, suffix: " yrs", group: false, label: "Operating a self-hosted Linux & Zero Trust edge" },
  { to: 2, group: false, ink: true, label: "Hackathons won or placed, from 600+ entrants" },
];

const pipeline: PipelineStep[] = [
  {
    num: "01 — Commit",
    title: "Every change arrives the same way",
    body: "Git as the single source of truth, branch protection, and infrastructure described in Terraform and Ansible instead of somebody's memory of what they clicked.",
    tags: ["Git", "Terraform", "Ansible"],
  },
  {
    num: "02 — Build",
    title: "Images, not surprises",
    body: "GitHub Actions builds and tags every service as a container, so what runs in production is the artifact that passed, not a rebuild that hopes to match.",
    tags: ["GitHub Actions", "Docker"],
  },
  {
    num: "03 — Ship",
    title: "Scheduled onto real hardware",
    body: "k3s places workloads across bare-metal nodes with ingress routing, managed secrets and resource limits — grading jobs can spike without taking the platform with them.",
    tags: ["k3s", "Ingress", "Nginx"],
  },
  {
    num: "04 — Watch",
    title: "Dashboards before incidents",
    body: "Prometheus, Grafana, cAdvisor and Node Exporter go in before launch, so capacity and scheduling decisions come from measured load rather than a guess after an outage.",
    tags: ["Prometheus", "Grafana", "cAdvisor"],
  },
  {
    num: "05 — Recover",
    title: "Access, certs and DNS that fail loudly",
    body: "Zero Trust identity policies, Cloudflare Tunnel, and SSL/TLS I manage myself — so when something breaks, the failure is legible and the fix is a known path, not an archaeology project.",
    tags: ["Zero Trust", "Tunnel", "SSL/TLS"],
    accent: true,
  },
];

const toolkit = [
  {
    span: "span-4",
    title: "Containers & orchestration",
    body: "Docker, Kubernetes (k3s), ingress and service topology, secrets management, Nginx reverse proxy and load balancing.",
  },
  {
    span: "span-4",
    title: "CI/CD & automation",
    body: "GitHub Actions pipelines, Dockerized build and release flows, Terraform, Ansible, Bash and Python tooling.",
  },
  {
    span: "span-4",
    title: "Cloud & edge",
    body: "AWS, Cloudflare, Workers and Wrangler CLI, Tunnel, Zero Trust access policies.",
  },
  {
    span: "span-3",
    ink: true,
    title: "Observability",
    body: "Prometheus, Grafana, cAdvisor, Node Exporter — container and node metrics driving capacity calls.",
  },
  {
    span: "span-3",
    title: "Networking",
    body: "DNS, routing and switching, VLANs, NAT, subnetting, DHCP, VPNs, OpenWRT, live troubleshooting.",
  },
  {
    span: "span-3",
    title: "Security & access",
    body: "Zero Trust, identity-based auth, JWT and RBAC, firewall management, SSL/TLS configuration.",
  },
  {
    span: "span-3",
    title: "Code & data",
    body: "Python, Bash, TypeScript, Node.js and Express; MongoDB schema and query optimization, MySQL, Redis.",
  },
];

const record = [
  {
    when: "Oct 2025 — Mar 2026",
    kind: "Internship",
    title: "DevOps & SDE Intern — TeamMistake Technologies",
    body: "CI/CD workflows, containerized deployments and infrastructure automation with Docker and GitHub Actions. Owned DNS, domain routing, SSL/TLS and Cloudflare traffic for production services, and debugged deployment, certificate and networking failures across production and intranet environments. Backend side: Node.js and Express features end to end, MongoDB query optimization, JWT-based RBAC from scratch.",
  },
  {
    when: "2023 — present",
    kind: "Independent",
    title: "Infrastructure & homelab engineer",
    body: "A self-hosted Linux environment with Cloudflare Tunnel and Tailscale access, Zero Trust identity policies, OpenWRT networking, edge functions on Workers, and full container-level observability. Documented and reproducible.",
  },
  {
    when: "2023 — 2027",
    kind: "Education",
    title: "B.E. Computer Science & Engineering (Cyber Security)",
    body: "Sri Shakthi Institute of Engineering and Technology, Coimbatore — CGPA 8.61/10. Certified in Claude Code in Action (Anthropic, 2026) and Intel Unnati Industrial Training (2025).",
  },
];

const contactLinks = [
  { href: "mailto:kavinnandhakavin@gmail.com", text: "kavinnandhakavin@gmail.com" },
  { href: "https://github.com/kavinnandha", text: "github.com/kavinnandha" },
  { href: "https://linkedin.com/in/kavinnandha", text: "linkedin.com/in/kavinnandha" },
  { href: "tel:+919345569707", text: "+91 93455 69707" },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main>
        <section id="top" className="hero">
          <span className="hero-wash" aria-hidden="true" />
          <span className="hero-noise" aria-hidden="true" />
          <HeroStage />

          <HeroInner>
            <h1 className="hero-title">
              <TextMask
                delay={0.12}
                stagger={0.1}
                lines={[
                  <span className="hero-step" key="a">
                    Infrastructure
                  </span>,
                  <span className="hero-step" key="b">
                    that stays
                  </span>,
                  <span className="hero-step" key="c">
                    boring.
                  </span>,
                ]}
                lineClassNames={["hero-line-a", "hero-line-b", "hero-line-c hero-accent"]}
              />
            </h1>

            <Reveal delay={0.6} y={18}>
              <p className="hero-lede">
                Bare-metal Kubernetes for 1,000+ concurrent users, a self-hosted Zero Trust edge and
                the pipelines that ship to both — built so the interesting part is never the outage.
              </p>
            </Reveal>

            <Reveal className="hero-actions" delay={0.72} y={18}>
              <Magnetic>
                <a className="btn btn-hero" href="#work">
                  See the work
                  <span className="btn-wedge" aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-quiet" href="mailto:kavinnandhakavin@gmail.com">
                  Email me
                </a>
              </Magnetic>
            </Reveal>
          </HeroInner>
        </section>

        <Marquee items={ticker} />

        <section className="shell stats">
          <RevealGroup className="bento" stagger={0.07}>
            {stats.map((s) => (
              <RevealItem key={s.label} className={`stat-card${s.ink ? " is-ink" : ""}`}>
                <p className={`stat-num${s.accent ? " is-accent" : ""}`}>
                  <Counter to={s.to} suffix={s.suffix} group={s.group} />
                </p>
                <p className="stat-label">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section className="shell about">
          <Reveal>
            <figure className="grayscale about-figure">
              <Parallax className="figure-4x5" amount={6}>
                <Image
                  src={portrait}
                  alt="Kavin Nandha M K"
                  sizes="(max-width: 960px) 100vw, 40vw"
                  placeholder="blur"
                  priority
                />
              </Parallax>
            </figure>
          </Reveal>

          <Reveal>
            <span className="eyebrow">About</span>
            <h2 className="about-title">I like the layer most people would rather not touch.</h2>
            <p className="about-body">
              Final-year B.E. Computer Science (Cyber Security) at Sri Shakthi Institute of
              Engineering and Technology, Coimbatore — and since 2023, the person keeping a
              homelab-turned-production environment alive: Cloudflare Tunnel and Tailscale for
              access, OpenWRT for the network, Prometheus and Grafana for the truth about what is
              actually happening.
            </p>
            <p className="about-body">
              At TeamMistake Technologies I worked both sides of the line — Dockerized CI/CD, DNS,
              SSL/TLS and Cloudflare traffic for production services, plus Node.js and MongoDB
              features shipped end to end.
            </p>
            <div className="about-links">
              <Magnetic>
                <a
                  className="pill-link"
                  href="https://github.com/kavinnandha"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  className="pill-link"
                  href="https://linkedin.com/in/kavinnandha"
                  target="_blank"
                  rel="noopener"
                >
                  LinkedIn
                </a>
              </Magnetic>
              <Magnetic>
                <a className="pill-link" href="https://kavinweb.info" target="_blank" rel="noopener">
                  kavinweb.info
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </section>

        <PinnedPipeline id="pipeline" steps={pipeline} />

        <section id="work" className="shell work">
          <Reveal className="work-head">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="section-title">Six builds, one obsession.</h2>
            </div>
            <p className="work-note">Keep scrolling — the cards stack as you go.</p>
          </Reveal>

          <CardStack total={4}>
            <CardStackItem index={0} className="is-ink">
              <div className="case-split">
                <div>
                  <span className="stack-kicker">01 · Flagship</span>
                  <h3 className="stack-title">Moodle LMS on a bare-metal k3s cluster</h3>
                  <p className="stack-body">
                    A production learning platform with CodeRunner/Jobe grading on dual Intel Xeon
                    Gold 6430 servers, holding steady through classroom peaks of 1,000+ concurrent
                    users. Metrics-led capacity planning, isolated grading workloads, hardware RAID
                    and dual 10GbE underneath.
                  </p>
                  <div className="stack-tags">
                    <span className="stack-tag">k3s</span>
                    <span className="stack-tag">Prometheus</span>
                    <span className="stack-tag">Grafana</span>
                    <span className="stack-tag is-hot">1,000+ users</span>
                  </div>
                </div>
                {/* Reserved frame. Drop a Grafana board or rack photo at
                    public/case-shot.webp and swap this for the same <Image>
                    treatment the portrait gets. */}
                <figure className="grayscale case-figure">
                  <div className="figure-empty">Grafana · cluster overview</div>
                </figure>
              </div>
            </CardStackItem>

            <CardStackItem index={1} className="is-soft">
              <div className="stack-pad">
                <span className="stack-kicker">02 · Self-hosted edge</span>
                <h3 className="stack-title">Zero Trust homelab, run like production</h3>
                <p className="stack-body">
                  Cloudflare Tunnel and Tailscale for identity-based remote access with no inbound
                  ports, OpenWRT for routing, VPN and firewalling, Workers deployed with Wrangler at
                  the edge, and container-level observability across the fleet.
                </p>
                <div className="stack-tags">
                  <span className="stack-tag">Cloudflare Tunnel</span>
                  <span className="stack-tag">Tailscale</span>
                  <span className="stack-tag">OpenWRT</span>
                  <span className="stack-tag">Workers</span>
                </div>
              </div>
            </CardStackItem>

            <CardStackItem index={2} className="is-accent">
              <div className="stack-pad">
                <span className="stack-kicker">03 · Platform</span>
                <h3 className="stack-title">HR Connect — placement &amp; recruitment</h3>
                <p className="stack-body">
                  Containerized microservices behind a hardened API layer, JWT and role-based access
                  across recruiter, admin and candidate roles, Redis caching on the hot endpoints and
                  Nginx reverse proxy in front.
                </p>
                <div className="stack-tags">
                  <span className="stack-tag">Node.js</span>
                  <span className="stack-tag">MongoDB</span>
                  <span className="stack-tag">Redis</span>
                  <span className="stack-tag">RBAC</span>
                </div>
              </div>
            </CardStackItem>

            <CardStackItem index={3} className="is-soft">
              <div className="stack-pad">
                <span className="stack-kicker">04–06 · Also shipped</span>
                <h3 className="stack-title">Three more, briefly.</h3>
                <div className="bento" style={{ marginTop: 28 }}>
                  <div className="mini-card">
                    <p className="mini-title">MobilityX 2.0</p>
                    <p className="mini-body">
                      RAG chatbot, GRU forecasting and a Solidity trust layer in 24 hours. Runner-up
                      and software track winner, 250+ participants.
                    </p>
                  </div>
                  <div className="mini-card">
                    <p className="mini-title">Virtual Assessment Platform</p>
                    <p className="mini-body">
                      Deployment and monitoring for concurrent evaluations, tuned for low-latency
                      delivery during live sessions.
                    </p>
                  </div>
                  <div className="mini-card">
                    <p className="mini-title">Institution Management System</p>
                    <p className="mini-body">
                      Centralized academic platform with access-controlled APIs across student,
                      faculty and admin roles.
                    </p>
                  </div>
                </div>
              </div>
            </CardStackItem>
          </CardStack>
        </section>

        <section id="toolkit" className="shell toolkit">
          <Reveal className="section-head">
            <span className="eyebrow">Toolkit</span>
            <h2 className="section-title">Grouped by the job it does.</h2>
          </Reveal>

          <RevealGroup className="bento" stagger={0.06}>
            {toolkit.map((t) => (
              <RevealItem
                key={t.title}
                className={`tool-card lift ${t.span}${t.ink ? " is-ink" : ""}`}
              >
                <h3 className="tool-title">{t.title}</h3>
                <p className="tool-body">{t.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section id="record" className="shell record">
          <Reveal className="section-head">
            <span className="eyebrow">Record</span>
            <h2 className="section-title">Where it came from.</h2>
          </Reveal>

          <RevealGroup className="record-list" stagger={0.08}>
            {record.map((r) => (
              <RevealItem key={r.title} className="record-row">
                <div>
                  <p className="record-when">{r.when}</p>
                  <p className="record-kind">{r.kind}</p>
                </div>
                <div>
                  <h3 className="record-title">{r.title}</h3>
                  <p className="record-body">{r.body}</p>
                </div>
              </RevealItem>
            ))}

            <RevealItem className="record-extra">
              <div className="extra-card is-ink">
                <p className="extra-kicker">Publication</p>
                <p className="extra-body">
                  Sentinel AI: Cyber Bully Detection and Prevention —{" "}
                  <em>Journal of Research in Artificial Neural Network Systems</em>, Vol. 2, No. 2,
                  pp. 1–5, April 2026.{" "}
                  <a
                    href="http://hbrppublication.com/OJS/index.php/JRANNS/article/view/9606"
                    target="_blank"
                    rel="noopener"
                  >
                    Read it ↗
                  </a>
                </p>
              </div>
              <div className="extra-card">
                <p className="extra-kicker">Awards</p>
                <p className="extra-body">
                  MobilityX 2.0 (2025) — runner-up and software track winner, 250+ participants.
                  SRCAS 2.0 (2025) — winner, 350+ participants. Presented an AI microlearning
                  platform at TN Startup Meet 2025.
                </p>
              </div>
            </RevealItem>
          </RevealGroup>
        </section>

        <ContactSection id="contact">
          <Reveal>
            <span className="eyebrow on-accent">Contact</span>
            <h2 className="contact-title">Got something that has to stay up?</h2>
            <p className="contact-lede">
              Cloud, DevOps, platform or SRE — or a backend team that wants someone who also owns the
              deploy path.
            </p>
            <div className="contact-links">
              {contactLinks.map((l) => (
                <Magnetic key={l.href}>
                  <a
                    className="contact-link"
                    href={l.href}
                    {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    <span>{l.text}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </Magnetic>
              ))}
            </div>
          </Reveal>

          <Reveal className="contact-card" delay={0.1}>
            <ContactForm />
          </Reveal>
        </ContactSection>
      </main>

      <footer className="footer">
        <span>Kavin Nandha M K — Cloud &amp; DevOps engineer, Coimbatore</span>
        <BackToTop />
      </footer>
    </>
  );
}
