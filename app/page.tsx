import Image from "next/image";
import BackToTop from "@/components/BackToTop";
import ContactForm from "@/components/ContactForm";
import SiteMotion from "@/components/SiteMotion";
import portrait from "@/public/portrait.webp";

const stats = [
  { value: "1,000+", label: "Concurrent users on one k3s cluster" },
  { value: "128", label: "Threads of dual Xeon Gold, 256GB ECC, operated bare metal" },
  { value: "3 yrs", label: "Running a self-hosted Linux and Zero Trust edge" },
  { value: "2", label: "Hackathons won or placed, from 600+ entrants" },
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
      <SiteMotion />

      <nav className="nav">
        <a className="nav-brand" href="#top">
          Kavin Nandha M K
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#case">Case study</a>
          <a href="#toolkit">Toolkit</a>
          <a href="#record">Record</a>
        </div>
        <a className="btn btn-primary" href="#contact" data-magnetic="1">
          Get in touch
        </a>
      </nav>

      <section id="top" className="hero">
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          <span>Cloud / DevOps engineer</span>
          <span className="hero-place">Coimbatore, IN</span>
        </div>
        <h1 className="hero-title">
          <span className="line">
            <span className="lineup" style={{ animationDelay: "0.05s" }}>
              Production
            </span>
          </span>
          <span className="line">
            <span className="lineup" style={{ animationDelay: "0.16s" }}>
              infrastructure,
            </span>
          </span>
          <span className="line">
            <span className="lineup accent" style={{ animationDelay: "0.27s" }}>
              owned end to end.
            </span>
          </span>
        </h1>
        <p className="hero-lede">
          I run a bare-metal Kubernetes (k3s) cluster serving 1,000+ concurrent users, a self-hosted
          Cloudflare Zero Trust edge, and the CI/CD that ships to both. Container orchestration, DNS
          and SSL, networking, observability — I own the whole path from commit to production.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work" data-magnetic="1">
            Selected work
          </a>
          <a className="btn btn-secondary" href="mailto:kavinnandhakavin@gmail.com" data-magnetic="1">
            kavinnandhakavin@gmail.com
          </a>
          <a className="btn btn-ghost" href="https://kavinweb.info" target="_blank" rel="noopener">
            kavinweb.info
          </a>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <span className="rule-in" />
        </div>
      </section>

      <hr className="hr" />

      <section className="stats reveal" data-reveal="1">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.value}>
              <p className="stat-num">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="hr" />

      <section className="section split split-about reveal" data-reveal="1">
        <div className="split-figure">
          <span className="kicker" style={{ marginBottom: 14 }}>
            About
          </span>
          <figure className="grayscale">
            <div className="figure-4x5">
              <Image
                src={portrait}
                alt="Kavin Nandha M K"
                sizes="(max-width: 900px) 100vw, 40vw"
                placeholder="blur"
                priority
              />
            </div>
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
          <blockquote className="pullquote">
            Deploys are easy. Staying up under 1,000 people at once is the engineering.
          </blockquote>
        </div>
      </section>

      <hr className="hr" />

      <section id="work" className="section reveal" data-reveal="1">
        <div className="section-head">
          <span className="kicker">Selected work</span>
          <span className="meta">Six builds — infrastructure, backend, applied AI</span>
        </div>

        <div className="bento">
          <article className="bento-card span-4" data-magnetic="1">
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
          </article>

          <article className="bento-card span-2 invert" data-magnetic="1">
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
          </article>

          <article className="bento-card span-2" data-magnetic="1">
            <div className="bento-index">
              <span className="num">03</span>
              <span className="cat">Platform</span>
            </div>
            <h3 className="bento-h-sm">HR Connect</h3>
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
          </article>

          <article className="bento-card span-2" data-magnetic="1">
            <div className="bento-index">
              <span className="num">04</span>
              <span className="cat">Applied AI · 24h build</span>
            </div>
            <h3 className="bento-h-sm">MobilityX 2.0</h3>
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
          </article>

          <article className="bento-card span-2" data-magnetic="1">
            <div className="bento-index">
              <span className="num">05</span>
              <span className="cat">Infrastructure</span>
            </div>
            <h3 className="bento-h-sm">Virtual Assessment Platform</h3>
            <p className="bento-p">
              Deployment and monitoring for concurrent online evaluations — backend communication
              tuned for low latency, bottlenecks traced and cleared during live sessions.
            </p>
            <div className="bento-tags">
              <span className="tag tag-neutral">Linux</span>
              <span className="tag tag-neutral">Monitoring</span>
            </div>
          </article>

          <article className="bento-row" data-magnetic="1">
            <div className="bento-row-head">
              <span className="num">06</span>
              <h3>Institution Management System</h3>
            </div>
            <p>
              Centralized academic platform for student, faculty and admin roles — access-controlled
              APIs and schemas built for concurrent multi-role use.
            </p>
            <span className="meta">Multi-role · MySQL</span>
          </article>
        </div>
      </section>

      <hr className="hr" />

      <section id="case" className="section reveal" data-reveal="1">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <span className="kicker">Case study 01</span>
          <span className="meta">Moodle LMS · k3s · dual Xeon Gold 6430</span>
        </div>
        <h2 className="case-title">A classroom platform that cannot go down at 9am.</h2>

        <div className="case-grid">
          <div className="case-cell">
            <span className="kicker-sm">Problem</span>
            <p>
              An entire institution&rsquo;s coursework, quizzes and automated code grading had to run
              on hardware in the building — not a managed cloud — and survive a thousand students
              logging in at the same minute.
            </p>
          </div>
          <div className="case-cell">
            <span className="kicker-sm">Approach</span>
            <p>
              A k3s cluster on dual Xeon Gold 6430 servers, hardware RAID and dual 10GbE. Moodle,
              CodeRunner and Jobe split into a containerized service topology with ingress routing
              and managed secrets, then Prometheus, Grafana, cAdvisor and Node Exporter wired in
              before the first class, not after the first outage.
            </p>
          </div>
          <div className="case-cell">
            <span className="kicker-sm">Outcome</span>
            <p>
              1,000+ concurrent users held through peak sessions. Metrics drove scheduling and
              resource allocation decisions instead of guesswork, and grading workloads stayed
              isolated from the platform serving the pages.
            </p>
          </div>
        </div>

        <div className="split split-case">
          {/* Drop a Grafana board or rack photo at public/case-shot.webp and swap
              this placeholder for the same <Image> treatment as the portrait. */}
          <figure className="grayscale split-figure">
            <div className="figure-16x10 figure-empty">Grafana · cluster overview</div>
          </figure>
          <table className="table">
            <tbody>
              {caseSpec.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="hr" />

      <section id="toolkit" className="section reveal" data-reveal="1">
        <div className="section-head">
          <span className="kicker">Toolkit</span>
          <span className="meta">Grouped by the job it does</span>
        </div>
        <div className="toolkit-grid">
          {toolkit.map((t) => (
            <div key={t.title} className="toolkit-item">
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="hr" />

      <section id="record" className="section reveal" data-reveal="1">
        <span className="kicker" style={{ marginBottom: 40 }}>
          Record
        </span>

        {record.map((r) => (
          <div key={r.title} className="record-row">
            <p className="record-date">{r.when}</p>
            <div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </div>
          </div>
        ))}

        <div className="record-extra">
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
        </div>
      </section>

      <section id="contact" className="contact reveal" data-reveal="1">
        <div className="contact-inner split split-contact">
          <div>
            <h2 className="contact-title">
              <span>Got infrastructure</span>
              <span>that needs owning?</span>
            </h2>
            <div className="contact-links">
              {contactLinks.map((l) => (
                <a
                  key={l.label}
                  className="contact-link"
                  href={l.href}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                >
                  <span>{l.text}</span>
                  <span className="label">{l.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-card">
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>Kavin Nandha M K — Cloud / DevOps engineer, Coimbatore</span>
        <BackToTop />
      </footer>
    </>
  );
}
