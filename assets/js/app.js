const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

const cursorWeb = $(".cursor-web");
window.addEventListener("pointermove", (event) => {
  cursorWeb.style.setProperty("--x", `${event.clientX}px`);
  cursorWeb.style.setProperty("--y", `${event.clientY}px`);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

$$(".reveal").forEach((element) => revealObserver.observe(element));

let countersStarted = false;
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || countersStarted) return;
    countersStarted = true;

    $$("[data-count]").forEach((counter) => {
      const target = Number(counter.dataset.count);
      const duration = 950;
      const suffix = target >= 100 ? "+" : "";
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        counter.textContent = `${value}${progress === 1 ? suffix : ""}`;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  });
}, { threshold: 0.35 });

const metrics = $(".metrics");
if (metrics) counterObserver.observe(metrics);

const codeMap = {
  controller: {
    title: "ProjectController.php",
    code: `final class ProjectController
{
    public function __construct(
        private ProjectService $service
    ) {}

    public function show(string $slug): array
    {
        return $this->service->findCaseStudy($slug);
    }
}`
  },
  service: {
    title: "ProjectService.php",
    code: `final class ProjectService
{
    public function __construct(
        private ProjectRepository $projects
    ) {}

    public function featured(): array
    {
        return array_filter(
            $this->projects->all(),
            fn(ProjectData $project) => $project->isProductionReady()
        );
    }
}`
  },
  repository: {
    title: "ProjectRepository.php",
    code: `final class ProjectRepository
{
    public function find(string $slug): ?ProjectData
    {
        return $this->database
            ->table('projects')
            ->where('slug', $slug)
            ->first();
    }
}`
  },
  dto: {
    title: "ProjectData.php",
    code: `final class ProjectData
{
    public function __construct(
        public readonly string $name,
        public readonly array $stack,
        public readonly array $impact
    ) {}
}`
  }
};

$$(".oop-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".oop-tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    const selected = codeMap[tab.dataset.code];
    $("#code-title").textContent = selected.title;
    $("#code-block").textContent = selected.code;
  });
});

const projectData = {
  civics: {
    title: "Civics Fundamentals Platform Modernization",
    description: "Modernized a WordPress/LearnDash production platform supporting structured educational content, LMS workflows, analytics, schema, redirects, caching, and release QA.",
    impact: ["128 structured modules", "137+ LMS course steps", "GA4/GTM tracking stabilization", "Production defect resolution", "Release documentation"],
    stack: ["WordPress", "LearnDash", "PHP", "MariaDB", "JavaScript", "WP Engine", "GA4", "GTM"]
  },
  portal: {
    title: "Internal Operations Workflow Portal",
    description: "Laravel-style internal operations prototype for request intake, approval routing, ticket triage, finance status tracking, RBAC, audit logs, and reporting.",
    impact: ["20+ REST endpoint design", "RBAC model", "Audit log concept", "Indexed reporting query design"],
    stack: ["Laravel", "PHP", "MySQL", "Blade", "Queues", "REST APIs", "Git"]
  },
  billing: {
    title: "Billing Reconciliation Dashboard",
    description: "Backend-oriented reconciliation dashboard for imported billing records, mismatch detection, retry handling, searchable exceptions, downloadable audit reports, and support runbooks.",
    impact: ["50k-row sample processing", "Exception dashboard", "Retry logic", "CSV import/export", "Runbook documentation"],
    stack: ["PHP", "SQL", "Scheduler", "CSV", "API Sync"]
  },
  react: {
    title: "Operational Dashboard Prototype",
    description: "React-oriented dashboard concept for internal workflows, API-driven records, status filters, employee support visibility, and operational reporting.",
    impact: ["API-driven UI", "Status filtering", "Internal workflow visibility", "React readiness"],
    stack: ["React", "JavaScript", "REST APIs", "Dashboard UI", "Filters"]
  }
};

const modal = $("#project-modal");
const modalBody = $("#modal-body");

$$(".details-button").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectData[button.dataset.project];
    modalBody.innerHTML = `
      <p class="eyebrow">Project Details</p>
      <h2>${project.title}</h2>
      <p>${project.description}</p>
      <h3>Impact</h3>
      <ul>${project.impact.map((point) => `<li>${point}</li>`).join("")}</ul>
      <div class="modal-tags">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div>
    `;
    modal.showModal();
  });
});

$(".modal-close").addEventListener("click", () => modal.close());

const menuButton = $(".menu-button");
const nav = $(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("mobile-open");
  if (isOpen) {
    nav.style.display = "flex";
    nav.style.position = "absolute";
    nav.style.top = "72px";
    nav.style.right = "20px";
    nav.style.flexDirection = "column";
    nav.style.background = "#101a35";
    nav.style.padding = "16px";
    nav.style.border = "1px solid rgba(255,255,255,0.14)";
    nav.style.borderRadius = "16px";
    nav.style.boxShadow = "0 24px 70px rgba(0,0,0,0.36)";
  } else {
    nav.removeAttribute("style");
  }
});


/* Enhanced spider cursor movement and click web burst */
const spiderCursor = document.querySelector(".spider-cursor");
const spiderThread = document.querySelector(".spider-thread");
let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;

function setSpiderPosition(x, y) {
  const dx = x - lastX;
  const dy = y - lastY;
  const angle = Math.max(-18, Math.min(18, dx * 0.18));
  const threadAngle = Math.max(-7, Math.min(7, dx * 0.04));

  document.documentElement.style.setProperty("--sx", `${x}px`);
  document.documentElement.style.setProperty("--sy", `${y}px`);
  document.documentElement.style.setProperty("--angle", `${angle}deg`);
  document.documentElement.style.setProperty("--thread-angle", `${threadAngle}deg`);

  lastX = x;
  lastY = y;
}

window.addEventListener("pointermove", (event) => {
  setSpiderPosition(event.clientX, event.clientY);
});

setSpiderPosition(window.innerWidth / 2, window.innerHeight / 2);

document.querySelectorAll("a, button, .project-card, .oop-tab, .arch-step, .impact-card").forEach((item) => {
  item.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
  item.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
});

window.addEventListener("click", (event) => {
  const burst = document.createElement("div");
  burst.className = "web-burst";
  burst.style.setProperty("--x", `${event.clientX}px`);
  burst.style.setProperty("--y", `${event.clientY}px`);

  for (let i = 0; i < 8; i++) {
    const strand = document.createElement("span");
    strand.style.setProperty("--i", i);
    burst.appendChild(strand);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 700);
});
