import Image from "next/image";
import BackToTop from "@/components/BackToTop";
import ContactForm from "@/components/ContactForm";
import HeroMotion from "@/components/motion/HeroMotion";
import HeroScene from "@/components/motion/HeroScene";
import Marquee, { type Chip } from "@/components/motion/Marquee";
import Pipeline, { type PipelineStep } from "@/components/motion/Pipeline";
import WorkDeck from "@/components/motion/WorkDeck";
import portrait from "@/public/portrait.webp";

const ticker: Chip[] = [
  { label: "Kubernetes / k3s", hot: true },
  { label: "Docker" },
  { label: "GitHub Actions" },
  { label: "Terraform" },
  { label: "Ansible" },
  { label: "Cloudflare Zero Trust", hot: true },
  { label: "Prometheus" },
  { label: "Grafana" },
  { label: "Nginx" },
  { label: "Linux" },
  { label: "Node.js" },
  { label: "Redis" },
  { label: "OpenWRT" },
  { label: "Tailscale" },
];

const heroMeta = [
  { key: "Role", value: "Cloud / DevOps engineer" },
  { key: "Based", value: "Coimbatore, India — remote-ready" },
  { key: "Running", value: "Bare-metal k3s, 24/7" },
  { key: "Peak load", value: "1,000+ concurrent users" },
];

const stats = [
  {
    key: "Peak concurrency",
    to: 1000,
    suffix: "+",
    group: true,
    hot: true,
    label: "Concurrent users held on one bare-metal cluster",
  },
  {
    key: "Compute",
    to: 128,
    label: "Threads of dual Xeon Gold, 256GB ECC, hardware RAID",
  },
  {
    key: "Uptime owned",
    to: 3,
    suffix: " yrs",
    label: "Running a self-hosted Linux and Zero Trust edge",
  },
  {
    key: "Hackathons",
    to: 2,
    label: "Won or placed, out of fields of 600+ entrants",
  },
];

const pipeline: PipelineStep[] = [
  {
    num: "01",
    kicker: "Commit",
    title: "Every change arrives the same way",
    body: "Git as the single source of truth, branch protection, and infrastructure described in Terraform and Ansible instead of somebody's memory of what they clicked.",
    tags: ["Git", "Terraform", "Ansible"],
  },
  {
    num: "02",
    kicker: "Build",
    title: "Images, not surprises",
    body: "GitHub Actions builds and tags every service as a container, so what runs in production is the artifact that passed — not a rebuild that hopes to match it.",
    tags: ["GitHub Actions", "Docker"],
  },
  {
    num: "03",
    kicker: "Ship",
    title: "Scheduled onto real hardware",
    body: "k3s places workloads across bare-metal nodes with ingress routing, managed secrets and resource limits — grading jobs can spike without taking the platform with them.",
    tags: ["k3s", "Ingress", "Nginx"],
  },
  {
    num: "04",
    kicker: "Watch",
    title: "Dashboards before incidents",
    body: "Prometheus, Grafana, cAdvisor and Node Exporter go in before launch, so capacity and scheduling decisions come from measured load rather than a guess after an outage.",
    tags: ["Prometheus", "Grafana", "cAdvisor"],
  },
  {
    num: "05",
    kicker: "Recover",
    title: "Access, certs and DNS that fail loudly",
    body: "Zero Trust identity policies, Cloudflare Tunnel and SSL/TLS I manage myself — so when something breaks the failure is legible and the fix is a known path, not an archaeology project.",
    tags: ["Zero Trust", "Tunnel", "SSL/TLS"],
  },
];

/* A fixed profile, not random values: a server-rendered chart that re-rolls on
   the client is a hydration mismatch waiting to happen. */
const loadProfile = [22, 34, 29, 46, 58, 51, 72, 88, 96, 81, 64, 55, 42, 37, 48, 61];

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
    body: "AWS, Cloudflare, Workers and the Wrangler CLI, Tunnel, Zero Trust access policies.",
  },
  {
    span: "span-3",
    hot: true,
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
  { key: "Email", href: "mailto:kavinnandhakavin@gmail.com", text: "kavinnandhakavin@gmail.com" },
  { key: "GitHub", href: "https://github.com/kavinnandha", text: "github.com/kavinnandha" },
  { key: "LinkedIn", href: "https://linkedin.com/in/kavinnandha", text: "linkedin.com/in/kavinnandha" },
  { key: "Phone", href: "tel:+919345569707", text: "+91 93455 69707" },
];

export default function Home() {
  return (
    <>
      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section id="top" className="hero">
          <HeroScene />
          <span className="hero-grid" aria-hidden="true" />
          <span className="hero-vignette" aria-hidden="true" />

          <div className="hero-inner">
            <p className="hero-badge">Available — Coimbatore or remote</p>

            {/*
              The space before the break is load-bearing: SplitText builds the
              heading's accessible name from its text content, and without it
              the line break reads out as "Infrastructurethat".
            */}
            <h1 className="hero-title">
              Infrastructure{" "}
              <br />
              that stays <em>boring.</em>
            </h1>

            <div className="hero-split">
              <div>
                <p className="hero-lede">
                  I&rsquo;m Kavin — a cloud and DevOps engineer running a{" "}
                  <strong>bare-metal Kubernetes cluster</strong> for 1,000+ concurrent users, a
                  self-hosted Zero Trust edge, and the pipelines that ship to both. Uptime is the
                  product; everything else is detail.
                </p>

                <div className="hero-actions">
                  <a
                    className="btn btn-light"
                    href="#work"
                    data-magnetic="0.3"
                    data-cursor
                    data-cursor-label="View"
                  >
                    See the work <span aria-hidden="true">↓</span>
                  </a>
                  <a
                    className="btn btn-quiet"
                    href="mailto:kavinnandhakavin@gmail.com"
                    data-magnetic="0.3"
                    data-cursor
                  >
                    Email me
                  </a>
                </div>
              </div>

              <ul className="hero-meta">
                {heroMeta.map((item) => (
                  <li key={item.key}>
                    <span className="hero-meta-key">{item.key}</span>
                    <span className="hero-meta-value">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="hero-cue" aria-hidden="true">
            <span className="hero-cue-dot">↓</span>
            Scroll to begin
          </p>
        </section>

        <HeroMotion />

        <Marquee items={ticker} />

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <section className="shell stats">
          <div className="stats-grid" data-stagger="0.09">
            {stats.map((stat) => (
              <div className={`stat${stat.hot ? " is-hot" : ""}`} key={stat.key} data-item>
                <span className="stat-key">{stat.key}</span>
                <span
                  className="stat-num"
                  data-count={stat.to}
                  data-count-suffix={stat.suffix ?? ""}
                  {...(stat.group ? { "data-count-group": "" } : {})}
                >
                  0
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── About ────────────────────────────────────────────────────── */}
        <section className="shell about">
          <figure className="about-figure" data-anim="clip">
            <Image
              src={portrait}
              alt="Kavin Nandha M K"
              sizes="(max-width: 900px) 100vw, 40vw"
              placeholder="blur"
              priority
              data-parallax="-0.12"
            />
          </figure>

          <div>
            <span className="eyebrow" data-anim="fade">
              About
            </span>
            <h2 className="about-title" data-split="lines">
              I like the layer most people would rather not touch.
            </h2>
            <p className="about-body" data-anim="rise" data-delay="0.1">
              Final-year B.E. Computer Science (Cyber Security) at Sri Shakthi Institute of
              Engineering and Technology, Coimbatore — and since 2023, the person keeping a
              homelab-turned-production environment alive: Cloudflare Tunnel and Tailscale for
              access, OpenWRT for the network, Prometheus and Grafana for the truth about what is
              actually happening.
            </p>
            <p className="about-body" data-anim="rise" data-delay="0.16">
              At TeamMistake Technologies I worked both sides of the line — Dockerized CI/CD, DNS,
              SSL/TLS and Cloudflare traffic for production services, plus Node.js and MongoDB
              features shipped end to end.
            </p>
            <div className="about-links" data-stagger="0.06">
              <a
                className="pill-link"
                href="https://github.com/kavinnandha"
                target="_blank"
                rel="noopener"
                data-item
                data-magnetic="0.25"
                data-cursor
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                className="pill-link"
                href="https://linkedin.com/in/kavinnandha"
                target="_blank"
                rel="noopener"
                data-item
                data-magnetic="0.25"
                data-cursor
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a
                className="pill-link"
                href="https://kavinweb.info"
                target="_blank"
                rel="noopener"
                data-item
                data-magnetic="0.25"
                data-cursor
              >
                kavinweb.info <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Pipeline ─────────────────────────────────────────────────── */}
        <Pipeline id="pipeline" steps={pipeline} />

        {/* ── Work ─────────────────────────────────────────────────────── */}
        <section id="work" className="work">
          <div className="shell work-head">
            <div>
              <span className="eyebrow" data-anim="fade">
                Selected work
              </span>
              <h2 className="section-title" data-split="lines">
                Six builds, one obsession.
              </h2>
            </div>
            <p className="work-note" data-anim="fade" data-delay="0.2">
              Keep scrolling — the cards stack as you go.
            </p>
          </div>

          <WorkDeck>
            <div className="deck-slot" style={{ "--i": 0 } as React.CSSProperties}>
              <article className="deck-card is-hot" data-glow>
                <div className="case">
                  <div>
                    <p className="case-kicker">01 — Flagship</p>
                    <h3 className="case-title">Moodle LMS on a bare-metal k3s cluster</h3>
                    <p className="case-body">
                      A production learning platform with CodeRunner/Jobe grading on dual Intel Xeon
                      Gold 6430 servers, holding steady through classroom peaks of 1,000+ concurrent
                      users. Metrics-led capacity planning, isolated grading workloads, hardware
                      RAID and dual 10GbE underneath.
                    </p>
                    <ul className="case-tags">
                      <li>k3s</li>
                      <li>Prometheus</li>
                      <li>Grafana</li>
                      <li className="is-hot">1,000+ users</li>
                    </ul>
                  </div>

                  {/*
                    Reserved frame. Drop a Grafana board or rack photo at
                    public/case-shot.webp and swap this block for the same
                    <Image> treatment the portrait gets.
                  */}
                  <figure className="case-panel" aria-hidden="true">
                    <figcaption className="case-panel-head">
                      <span>Cluster load — 24h</span>
                      <span>k3s / prod</span>
                    </figcaption>
                    <div className="case-bars">
                      {loadProfile.map((height, i) => (
                        <span key={i} style={{ height: `${height}%` }} />
                      ))}
                    </div>
                    <p className="case-readout">
                      <span>peak 1,043 conc.</span>
                      <span>p95 412ms</span>
                    </p>
                  </figure>
                </div>
              </article>
            </div>

            <div className="deck-slot" style={{ "--i": 1 } as React.CSSProperties}>
              <article className="deck-card" data-glow>
                <div className="case-solo">
                  <p className="case-kicker">02 — Self-hosted edge</p>
                  <h3 className="case-title">Zero Trust homelab, run like production</h3>
                  <p className="case-body">
                    Cloudflare Tunnel and Tailscale for identity-based remote access with no inbound
                    ports, OpenWRT for routing, VPN and firewalling, Workers deployed with Wrangler
                    at the edge, and container-level observability across the fleet.
                  </p>
                  <ul className="case-tags">
                    <li>Cloudflare Tunnel</li>
                    <li>Tailscale</li>
                    <li>OpenWRT</li>
                    <li>Workers</li>
                  </ul>
                </div>
              </article>
            </div>

            <div className="deck-slot" style={{ "--i": 2 } as React.CSSProperties}>
              <article className="deck-card" data-glow>
                <div className="case-solo">
                  <p className="case-kicker">03 — Platform</p>
                  <h3 className="case-title">HR Connect — placement &amp; recruitment</h3>
                  <p className="case-body">
                    Containerized microservices behind a hardened API layer, JWT and role-based
                    access across recruiter, admin and candidate roles, Redis caching on the hot
                    endpoints and Nginx reverse proxy in front.
                  </p>
                  <ul className="case-tags">
                    <li>Node.js</li>
                    <li>MongoDB</li>
                    <li>Redis</li>
                    <li>RBAC</li>
                  </ul>
                </div>
              </article>
            </div>

            <div className="deck-slot" style={{ "--i": 3 } as React.CSSProperties}>
              <article className="deck-card" data-glow>
                <div className="case-solo">
                  <p className="case-kicker">04–06 — Also shipped</p>
                  <h3 className="case-title">Three more, briefly.</h3>
                  <div className="mini-grid">
                    <div className="mini-card">
                      <p className="mini-title">MobilityX 2.0</p>
                      <p className="mini-body">
                        RAG chatbot, GRU forecasting and a Solidity trust layer in 24 hours.
                        Runner-up and software track winner, 250+ participants.
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
              </article>
            </div>
          </WorkDeck>
        </section>

        {/* ── Toolkit ──────────────────────────────────────────────────── */}
        <section id="toolkit" className="shell toolkit">
          <div className="section-head">
            <span className="eyebrow" data-anim="fade">
              Toolkit
            </span>
            <h2 className="section-title" data-split="lines">
              Grouped by the job it does.
            </h2>
          </div>

          <div className="tool-grid" data-stagger="0.07">
            {toolkit.map((tool, i) => (
              <article
                className={`tool-card ${tool.span}${tool.hot ? " is-hot" : ""}`}
                key={tool.title}
                data-item
                data-glow
                data-tilt="4"
              >
                <span className="tool-index">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-body">{tool.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Record ───────────────────────────────────────────────────── */}
        <section id="record" className="shell record">
          <div className="section-head">
            <span className="eyebrow" data-anim="fade">
              Record
            </span>
            <h2 className="section-title" data-split="lines">
              Where it came from.
            </h2>
          </div>

          <div className="record-list" data-stagger="0.1">
            {record.map((row) => (
              <article className="record-row" key={row.title} data-item>
                <div>
                  <p className="record-when">{row.when}</p>
                  <p className="record-kind">{row.kind}</p>
                </div>
                <div>
                  <h3 className="record-title">{row.title}</h3>
                  <p className="record-body">{row.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="extras" data-stagger="0.08">
            <div className="extra-card is-hot" data-item>
              <p className="extra-kicker">Publication</p>
              <p className="extra-body">
                Sentinel AI: Cyber Bully Detection and Prevention —{" "}
                <em>Journal of Research in Artificial Neural Network Systems</em>, Vol. 2, No. 2, pp.
                1–5, April 2026.{" "}
                <a
                  href="http://hbrppublication.com/OJS/index.php/JRANNS/article/view/9606"
                  target="_blank"
                  rel="noopener"
                  data-cursor
                >
                  Read it ↗
                </a>
              </p>
            </div>
            <div className="extra-card" data-item>
              <p className="extra-kicker">Awards</p>
              <p className="extra-body">
                MobilityX 2.0 (2025) — runner-up and software track winner, 250+ participants. SRCAS
                2.0 (2025) — winner, 350+ participants. Presented an AI microlearning platform at TN
                Startup Meet 2025.
              </p>
            </div>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section id="contact" className="contact">
          <div className="contact-inner">
            <div>
              <span className="eyebrow" data-anim="fade">
                Contact
              </span>
              <h2 className="contact-title" data-split="lines">
                Got something that has to stay up?
              </h2>
              <p className="contact-lede" data-anim="rise" data-delay="0.1">
                Cloud, DevOps, platform or SRE — or a backend team that wants someone who also owns
                the deploy path.
              </p>

              <div className="contact-links" data-stagger="0.06">
                {contactLinks.map((link) => (
                  <a
                    className="contact-link"
                    key={link.href}
                    href={link.href}
                    data-item
                    data-cursor
                    data-cursor-label="Open"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener" }
                      : {})}
                  >
                    <span className="contact-link-key">{link.key}</span>
                    <span>{link.text}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-card" data-anim="rise" data-delay="0.12">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>Kavin Nandha M K — Cloud &amp; DevOps engineer, Coimbatore</span>
          <span>Built with Next.js + GSAP</span>
          <BackToTop />
        </div>
      </footer>
    </>
  );
}
