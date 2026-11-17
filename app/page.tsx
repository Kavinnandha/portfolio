import Image from "next/image";
import BackToTop from "@/components/BackToTop";
import ContactForm from "@/components/ContactForm";
import SiteNav from "@/components/SiteNav";
import { CardStack, CardStackItem } from "@/components/motion/CardStack";
import Counter from "@/components/motion/Counter";
import Divider from "@/components/motion/Divider";
import HeroBackdrop from "@/components/motion/HeroBackdrop";
import HeroStage from "@/components/motion/HeroStage";
import Magnetic from "@/components/motion/Magnetic";
import Marquee from "@/components/motion/Marquee";
import Parallax from "@/components/motion/Parallax";
import { Reveal, RevealGroup, RevealItem, RuleDraw } from "@/components/motion/Reveal";
import ScrollWords from "@/components/motion/ScrollWords";
import TextMask from "@/components/motion/TextMask";
import shotLmsEndpoint from "@/public/grafana/lms-endpoint.webp";
import shotLmsMysql from "@/public/grafana/lms-mysql.webp";
import shotLmsServer from "@/public/grafana/lms-server.webp";
import shotCyberlab from "@/public/grafana/server-cyberlab.webp";
import shotUser06 from "@/public/grafana/server-user-06.webp";
import portrait from "@/public/portrait.webp";

const stats = [
  { to: 2500, suffix: "+", group: true, label: "Concurrent users at peak on a bare-metal k3s cluster" },
  { to: 128, group: false, label: "Threads of dual Xeon Gold, 256GB ECC, operated bare metal" },
  { to: 3, suffix: " yrs", group: false, label: "Running a self-hosted Linux and Zero Trust edge" },
  { to: 4, group: false, label: "Competitions won or made the final, incl. Samsung Solve for Tomorrow" },
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
  "MySQL",
  "MongoDB",
  "Sophos",
  "FortiGate",
  "Synology NAS",
  "Linux",
];

const caseSpec = [
  ["Before", "One server, MySQL, serial jobs · fell over at ~400 users"],
  ["Orchestration", "k3s · one server node + worker nodes"],
  ["Server node", "2× Xeon Gold 6430 · 128 threads · 256GB ECC"],
  ["Code grading", "CodeRunner / Jobe moved to separate machines"],
  ["Database", "MySQL · connection limits and buffer pool tuned"],
  ["Storage / network", "Hardware RAID · dual 10GbE"],
  ["Backups", "Compressed, incremental · 40TB Synology NAS"],
  ["Observability", "Prometheus · Grafana · cAdvisor · Node Exporter"],
  ["Load held", "2,500+ concurrent users at peak"],
];

const monitoringShots = [
  {
    src: shotLmsMysql,
    href: "/grafana/lms-mysql.webp",
    caption: "LMS MySQL · queries, threads, connections",
    alt: "Grafana dashboard for the Moodle MySQL database: status, uptime, connections, queries per second, threads and network throughput over seven days",
  },
  {
    src: shotLmsEndpoint,
    href: "/grafana/lms-endpoint.webp",
    caption: "LMS endpoint · Blackbox uptime and latency",
    alt: "Grafana Blackbox Exporter dashboard for the LMS endpoint: status, HTTP code, response time, availability and latency by phase",
  },
  {
    src: shotUser06,
    href: "/grafana/server-user-06.webp",
    caption: "Server node user-06 · 48 threads, 128GB",
    alt: "Grafana Node Exporter dashboard for the user-06 server: CPU, memory, network and disk over seven days",
  },
  {
    src: shotCyberlab,
    href: "/grafana/server-cyberlab.webp",
    caption: "Cyber security lab server",
    alt: "Grafana Node Exporter dashboard for the cyber security lab server: CPU, memory, network and disk over seven days",
  },
];

const incidents = [
  {
    title: "The database ran out of connections",
    body: "At peak, MySQL hit its connection limit and logins failed with “Too many connections”, or queries slowed to a crawl. I raised max_connections and tuned the InnoDB buffer pool, and moving compilation off the database server in the k3s rebuild took the rest of the pressure off.",
  },
  {
    title: "PHP-FPM workers hung and took the site down",
    body: "The PHP-FPM pool reached its worker limit and some workers hung indefinitely. Once every worker was stuck, the site stayed unreachable until the service restarted. The lasting fix was to detect and kill unresponsive workers before they could exhaust the pool, alongside other pool changes.",
  },
  {
    title: "Backups filled the disk",
    body: "A cron job dumped the Moodle database and copied it to another machine, but the dumps were uncompressed. As the data grew the disk ran out and the backup job crashed. I compressed the dumps (about 70% smaller), switched to incremental backups, and moved every backup to a dedicated 40TB Synology NAS. Servers now keep only a few days locally; the NAS holds the history, including the CTF server and institute backups.",
  },
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
    body: "Cloudflare Zero Trust, identity-based authentication, JWT and RBAC, firewall management, SSL/TLS, CIS Benchmarks and system hardening.",
  },
  {
    title: "Firewalls & hardware",
    body: "Sophos, Fortinet FortiGate 60F, MikroTik and Ubiquiti; Lenovo ThinkSystem servers, hardware RAID, Synology NAS backups.",
  },
  {
    title: "Languages",
    body: "Python, Bash, PowerShell, SQL, TypeScript, JavaScript — plus Node.js, Express and FastAPI on the backend side.",
  },
  {
    title: "Data",
    body: "MySQL, PostgreSQL, MongoDB schema design and query optimization, Redis caching, compressed and incremental backups.",
  },
];

const record = [
  {
    when: "Oct 2025 — Mar 2026",
    title: "DevOps Intern — TeamMistake Technologies",
    body: "CI/CD workflows, containerized deployments and infrastructure automation with Docker and GitHub Actions. Owned DNS, domain routing, SSL/TLS and Cloudflare traffic management for production services, and debugged deployment, certificate and networking failures across production and intranet environments. On the product side: Node.js and Express features from data model to rollout, MongoDB query optimization, and JWT-based RBAC built from scratch.",
  },
  {
    when: "2025 — mid 2026",
    title: "College infrastructure & IT operations — Sri Shakthi Institute",
    body: "Ran the college's entire firewall and network alongside my studies: Sophos firewalls, Fortinet FortiGate 60F for the cyber security labs, MikroTik and Ubiquiti routers and access points. Operated the Lenovo ThinkSystem servers behind the Moodle k3s cluster and the 40TB Synology NAS that holds institute backups. In all, worked on the infrastructure of three institutions — managed one end to end, supported two.",
  },
  {
    when: "2023 — present",
    title: "Independent infrastructure & homelab engineer",
    body: "A self-hosted Linux environment with Cloudflare Tunnel and Tailscale access, Zero Trust identity policies, OpenWRT networking, edge functions on Workers, and full container-level observability. Everything documented, everything reproducible.",
  },
  {
    when: "2023 — 2027",
    title: "B.E. Computer Science & Engineering (Cyber Security)",
    body: "Sri Shakthi Institute of Engineering and Technology, Coimbatore — CGPA 8.67/10.",
  },
];

const contactLinks = [
  { href: "mailto:kavinnandhakavin@gmail.com", text: "kavinnandhakavin@gmail.com", label: "Email" },
  { href: "https://github.com/kavinnandha", text: "github.com/kavinnandha", label: "Code" },
  { href: "https://linkedin.com/in/kavinnandha", text: "linkedin.com/in/kavinnandha", label: "LinkedIn" },
  { href: "https://kavin.codegarage.dev", text: "kavin.codegarage.dev", label: "Web" },
  { href: "tel:+919345569707", text: "+91 93455 69707", label: "Phone" },
  { href: "/Kavin_Nandha_MK_Resume_DevOps.pdf", text: "Download résumé (PDF)", label: "CV" },
];

const publications = [
  {
    title: "Sentinel AI: Cyber Bully Detection and Prevention",
    venue: "JRANNS, Vol. 2 Issue 2, April 2026",
    href: "http://hbrppublication.com/OJS/index.php/JRANNS/article/view/9606",
  },
  {
    title:
      "Cellular Maze: A Cellular Network-Aware Routing System Using Machine Learning-Based Signal Quality Prediction",
    venue: "IJRTI, Vol. 11 Issue 10, October 2026",
  },
  {
    title: "Reinforcement Learning-Based Content Triage Agent for Intelligent Social Media Moderation",
    venue: "First author",
  },
  {
    title:
      "Automated CIS Benchmark Auditing and Remediation Tool: A Windows System Security Assessment Solution",
    venue: "IEEE",
  },
  { title: "Smart Health Monitoring and Recommendation System", venue: "IRJMETS" },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main>
        <HeroStage>
          <HeroBackdrop />

          <div className="hero-inner">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              <span>Cloud / DevOps engineer</span>
              <span className="hero-place">India · Open to relocation</span>
            </div>

            <h1 className="hero-title">
              {/* Driven by the hero's master timeline rather than its own, so
                  the headline is part of one composition instead of an
                  animation that happens to start at the same moment. */}
              <TextMask
                trigger="external"
                lines={["Production", "infrastructure,", "owned end to end."]}
                lineClassNames={[undefined, undefined, "accent"]}
              />
            </h1>

            <p className="hero-lede">
              I run a bare-metal Kubernetes (k3s) cluster serving 2,500+ concurrent users at peak, a
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
              <Magnetic>
                <a className="btn btn-secondary" href="/Kavin_Nandha_MK_Resume_DevOps.pdf" download>
                  Résumé (PDF)
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="hero-foot">
            <div className="hero-scroll">
              <span>Scroll</span>
              <span className="scrollpulse" />
            </div>
            <span className="hero-load">k3s · 2,500+ concurrent at peak</span>
          </div>
        </HeroStage>

        <Divider />

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

        <Divider />

        <Marquee items={ticker} />

        <Divider />

        <Reveal as="section" className="section split split-about">
          <div className="split-figure">
            <span className="kicker" style={{ marginBottom: 14 }}>
              About
            </span>
            {/* The portrait prints in full colour — the one photograph on the
                page exempt from the black-and-white treatment. */}
            <figure className="about-figure">
              <Parallax className="figure-4x5" amount={7}>
                <Image
                  src={portrait}
                  alt="Kavin Nandha M K"
                  sizes="240px"
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
              For about 16 months I also ran my college&rsquo;s entire firewall and network, including
              the servers behind its Moodle platform.
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
              text="Deploys are easy. Staying up under 2,500 people at once is the engineering."
            />
          </div>
        </Reveal>

        <Divider />

        <section id="work" className="section">
          <Reveal className="section-head">
            <span className="kicker">Selected work</span>
            <span className="meta">Seven builds — infrastructure, platform, security</span>
          </Reveal>

          <CardStack total={7}>
            <CardStackItem index={0}>
              <div className="bento-index">
                <span className="num">01</span>
                <span className="cat">Kubernetes · bare metal</span>
              </div>
              <h3 className="bento-h-lg">Moodle LMS on a bare-metal k3s cluster</h3>
              <p className="bento-p-lg">
                The college LMS used to fall over at about 400 users. I moved it to a k3s cluster, split
                CodeRunner/Jobe grading onto separate machines and tuned MySQL for the load. It now
                holds 2,500+ concurrent users at peak.
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
                <span className="cat">Platform · Samsung Top 5</span>
              </div>
              <h3 className="bento-h-md">MicroLearning</h3>
              <p className="bento-p">
                WhatsApp training for factory workers in 15 Indian languages. Multi-tenant FastAPI
                backend shipped with Docker Compose and GitHub Actions CI/CD (214 backend tests),
                exposed through a Cloudflare Tunnel. Top 5 in the AI Living category of Samsung Solve
                for Tomorrow 2026.
              </p>
              <div className="bento-tags">
                <span className="tag tag-neutral">Docker Compose</span>
                <span className="tag tag-neutral">GitHub Actions</span>
                <span className="tag tag-neutral">Cloudflare Tunnel</span>
                <span className="tag tag-neutral">FastAPI</span>
              </div>
            </CardStackItem>

            <CardStackItem index={3}>
              <div className="bento-index">
                <span className="num">04</span>
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

            <CardStackItem index={4} className="invert">
              <div className="bento-index">
                <span className="num">05</span>
                <span className="cat">Live traffic · payments</span>
              </div>
              <h3 className="bento-h-md">College tech-event platform</h3>
              <p className="bento-p">
                Ran the event-management application and its whole technical side for the
                college&rsquo;s tech events: 1,000+ concurrent users, with the PhonePe payment gateway
                handling registrations against a fixed launch date.
              </p>
            </CardStackItem>

            <CardStackItem index={5}>
              <div className="bento-index">
                <span className="num">06</span>
                <span className="cat">Security automation · IEEE</span>
              </div>
              <h3 className="bento-h-md">CIS Benchmark auditing and remediation</h3>
              <p className="bento-p">
                Python, PowerShell and Bash tooling that audits Windows and Linux systems against CIS
                Benchmarks, reports compliance gaps and automates the fixes. Published as an IEEE paper.
              </p>
              <div className="bento-tags">
                <span className="tag tag-neutral">Python</span>
                <span className="tag tag-neutral">PowerShell</span>
                <span className="tag tag-neutral">Bash</span>
              </div>
            </CardStackItem>

            <CardStackItem index={6}>
              <div className="bento-index">
                <span className="num">07</span>
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

        <Divider />

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
                Moodle ran on a single bare-metal server with MySQL. At about 400 concurrent users it
                crashed: code compilation and other heavy work ran one job at a time, with nothing in
                parallel.
              </p>
            </RevealItem>
            <RevealItem className="case-cell">
              <span className="kicker-sm">Decision</span>
              <p>
                Full Kubernetes was overkill for one application and would have eaten resources of its
                own. k3s gave the same orchestration in a lightweight package that fit the job.
              </p>
            </RevealItem>
            <RevealItem className="case-cell">
              <span className="kicker-sm">Approach</span>
              <p>
                One machine as the k3s server node, the others as workers. CodeRunner/Jobe compilation
                moved to separate machines so grading runs in parallel and can&rsquo;t starve the pages.
                MySQL tuned for the load, and Prometheus, Grafana, cAdvisor and Node Exporter wired in
                before go-live.
              </p>
            </RevealItem>
            <RevealItem className="case-cell">
              <span className="kicker-sm">Outcome</span>
              <p>
                From falling over at about 400 users to 2,500+ concurrent at peak. The lesson I keep:
                Kubernetes is not automatic high availability, and a single server node is still a
                single point of failure.
              </p>
            </RevealItem>
          </RevealGroup>

          <Reveal className="section-head" style={{ marginTop: 72, marginBottom: 0 }}>
            <span className="kicker">What broke, and what I changed</span>
            <span className="meta">Three incidents</span>
          </Reveal>

          <RevealGroup className="case-grid" stagger={0.1}>
            {incidents.map((i) => (
              <RevealItem key={i.title} className="case-cell">
                <span className="kicker-sm">{i.title}</span>
                <p>{i.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="split split-case">
            <figure className="split-figure case-figure">
              <a href="/grafana/lms-server.webp" target="_blank" rel="noopener" className="figure-shot">
                <Image
                  src={shotLmsServer}
                  alt="Grafana Node Exporter dashboard for the Moodle server over seven days: CPU, memory, network and disk"
                  sizes="(max-width: 900px) 100vw, 60vw"
                  placeholder="blur"
                />
              </a>
              <figcaption className="figure-caption">
                Grafana · Moodle server node (sietlms), last 7 days
              </figcaption>
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

          <Reveal className="section-head" style={{ marginTop: 72 }}>
            <span className="kicker">Monitoring, across every server</span>
            <span className="meta">Prometheus · Grafana · Blackbox</span>
          </Reveal>

          <RevealGroup className="shot-grid" stagger={0.08}>
            {monitoringShots.map((s) => (
              <RevealItem key={s.href} as="figure" className="shot-item">
                <a href={s.href} target="_blank" rel="noopener" className="figure-shot">
                  <Image src={s.src} alt={s.alt} sizes="(max-width: 900px) 100vw, 50vw" placeholder="blur" />
                </a>
                <figcaption className="figure-caption">{s.caption}</figcaption>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <Divider />

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

        <Divider />

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
            <div className="record-extra-wide">
              <span className="kicker-sm">Publications</span>
              <ul className="pub-list">
                {publications.map((p) => (
                  <li key={p.title}>
                    {p.title} — <em>{p.venue}</em>.
                    {p.href ? (
                      <>
                        {" "}
                        <a href={p.href} target="_blank" rel="noopener">
                          Read it
                        </a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="kicker-sm">Awards</span>
              <p>
                Samsung Solve for Tomorrow 2026 — Top 5 in the AI Living category, one of 20 national
                finalists. SRCAS 2.0 (2025) — winner, 350+ participants. MobilityX 2.0, IEEE VTS
                (2025) — runner-up and Software Track winner, 250+ participants. MAHE Mobility
                Challenge 2026 — AI Track finalist. Presented an AI microlearning platform at TN
                Startup Meet 2025.
              </p>
            </div>
            <div>
              <span className="kicker-sm">Certifications</span>
              <p>
                Claude Code in Action (Anthropic, 2026). AWS Cloud Practitioner Essentials (AWS Skill
                Builder, 2026). NPTEL Demystifying Networking (2026). Aspire Leaders Program (2026).
                Intel Unnati Industrial Training (2025).{" "}
                <a
                  href="https://drive.google.com/drive/folders/1LxJ57Xye420axeNnlkJy1O5LkC5YRG9I?usp=sharing"
                  target="_blank"
                  rel="noopener"
                >
                  View certificates
                </a>
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
        <span>Kavin Nandha M K — Cloud / DevOps engineer, India</span>
        <BackToTop />
      </footer>
    </>
  );
}
