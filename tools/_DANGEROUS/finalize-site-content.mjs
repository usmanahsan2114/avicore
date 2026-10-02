import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html"));

const textReplacements = new Map([
  ["AgenAI", "AviCore"],
  ["ML/Agent Lead. Builds domain agents", "Controls Engineer. Builds reliable simulator interfaces"],
  ["Are model/API costs included in pricing?", "What will be included when products launch?"],
  ["Are hardware, software and integration included in pricing?", "What will be included when products launch?"],
  ["Value model & KPI definition", "Requirements and compatibility review"],
  ["Prompt UX patterns", "Control and display workflow"],
  ["Prompt  UX patterns", "Control and display workflow"],
  ["simulation strategy, simulation UX flows, <br> interface integration agent, interface integration", "simulation requirements, simulator workflow design, <br> hardware interface plan and validation"],
  ["Use-case mapping, Prompt & UI patterns", "Control mapping, panel and UI patterns"],
  ["Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum", "Good simulator hardware starts with a precise brief: aircraft reference, control feel, mounting, interfaces and the training task it must support."],
  ["Available for worldwide project", "Worldwide enquiries welcome"],
  ["Based in <span class=\"text-brand\">Montréal, Canada</span>", "Connected through <span class=\"text-brand\">FSDC in Pakistan</span>"],
  ["Based in Montréal, Canada, we build human-centered simulation for production. Our mission is to create intelligent systems that empower people and organizations. By uniting research, design, and engineering, we deliver scalable and reliable simulation solutions—technology that’s practical, trustworthy, and designed to make a meaningful impact in the real world.", "AviCore develops compact simulation controls, panels, displays and supporting software for enthusiasts, training teams and integrators. Through FSDC Aerosolutions in Rawalpindi, Pakistan, every enquiry is scoped around the actual aircraft reference, simulator platform, mounting, interfaces and intended training use."],
  ["From pilot to enterprise", "From one control to a complete module"],
  ["Pricing Plans", "Product Availability"],
  ["Build Paths", "Product Availability"],
  ["clear scope, transparent costs", "product previews and launch updates"],
  ["clear scope, written quotation", "product previews and launch updates"],
  ["&nbsp;annually.", "&nbsp;per project."],
  ["Starter Plan", "Component Build"],
  ["For startups", "For individual builders"],
  ["Enterprise Plan", "Integrated Module"],
  ["For organisations", "For labs and integrators"],
  ["$9,900", "Coming Soon"],
  ["$19,900", "Coming Soon"],
  ["Made to order", "Coming Soon"],
  ["Made to Order", "Coming Soon"],
  ["Scoped project", "Coming Soon"],
  ["Quote only", "Coming Soon"],
  ["Quote confirmed", "Coming Soon"],
  ["Small batch", "Coming Soon"],
  ["/ year", ""],
  ["per quote", ""],
  ["View Build Paths", "See What’s Coming"],
  ["Request a quote", "Join launch updates"],
  ["Before you request a quote", "Before launch"],
  ["Request a Quote", "Start a Project"],
  ["Build path", "Launch status"],
  ["Shop the range", "Explore the range"],
  ["dimensions, interface and finish are confirmed in the quote.", "dimensions, interfaces and included items will be published before launch."],
  ["Do you publish prices or stock status?", "When will AviCore products be available?"],
  ["Most products are made to order and quoted after the dimensions, interface, quantity and finish are understood. This site does not show invented prices or stock claims.", "All product lines are currently Coming Soon. Launch updates will be published after compatibility, included hardware and setup guidance are ready."],
  ["Can I order one small part?", "Will small parts be included?"],
  ["Yes. Small orders are welcome. Tell us the part, quantity, reference and destination so the team can confirm feasibility and shipping.", "Small cockpit parts are part of the planned range. Exact launch groups and included options will be published when they are ready."],
  ["Prove value in two weeks with a clickable UX, tech spike, and a clear go/no-go roadmap.", "Start with one clearly defined control, bezel, panel or printed component, then confirm interfaces and mounting before production."],
  ["Compliance-ready delivery for complex orgs—multi-env releases, canaries, and change management.", "Combine controls, panels, displays and software into a documented simulator module with staged validation and handover."],
  ["Discovery workshop", "Requirements review"],
  ["Opportunity brief", "Compatibility and mounting check"],
  ["Clickable UX", "Drawing or configuration review"],
  ["1 data source & 1 integration", "One approved component scope"],
  ["Everything in Starter", "Everything in Component Build"],
  ["CI/CD, tracing, alerts, guardrails", "Integrated controls and displays"],
  ["Full eval dashboard", "Calibration and validation record"],
  ["3 data source & 3 integration", "Documentation and handover support"],
  ["Align on problems, data reality, and success metrics. Opportunity brief, KPI model, phased roadmap, effort/cost ranges.", "Confirm the aircraft reference, simulator platform, functions, interfaces, mounting and the evidence needed to approve the build."],
  ["Align on problems, data reality, and success metrics. Compatibility and mounting check, KPI model, phased roadmap, effort/cost ranges.", "Confirm the aircraft reference, simulator platform, functions, interfaces, mounting and the evidence needed to approve the build."],
  ["Agent-Powered Workflows", "Configurable Flight Workflows"],
  ["Value model", "Compatibility review"],
  ["+1 (647) 555 0172", "+92 51 5177639"],
  ["tel: +1 (647) 555 0172", "tel:+92515177639"],
  ["tel: +92 51 5177639", "tel:+92515177639"],
  ["mailto:avicore@gmail.com", "mailto:info@fsdcpak.com"],
  ["avicore@gmail.com", "info@fsdcpak.com"],
  ["Get connected <br> with AviCore on social", "Connect with AviCore <br> through FSDC"],
  ["AviCore’s Design Lead", "Controls & Systems"],
  ["Solutions Architect. Connects simulation to your stack", "Simulator integration and interface planning"],
  ["Data Engineer. Secure access policies", "Panel, display and wiring design"],
  ["MLOps Engineer. Productionizes with CI/CD", "Calibration, deployment and documentation"],
  ["PII handling, SSO/SAML, RBAC, encryption, and audit trails -built in, not bolted on. Enterprise-ready from the start.", "Safe wiring, stable firmware, documented interfaces and clear setup notes are built into every approved configuration."],
  ["Make your docs, tickets, and wikis instantly useful with retrieval augmented generation—freshness, citations, and explainability built in.", "Keep manuals, wiring notes and simulator profiles close at hand with practical, versioned setup documentation."],
  ["PII handling, SSO/SAML, RBAC, secrets management, and compliance workflows—ship simulation that’s safe, auditable, and enterprise-ready.", "Safe wiring, stable firmware and documented support workflows keep every simulation build dependable and maintainable."],
  ["Identify high-ROI use cases and define a realistic, measurable simulation roadmap. Our USB Flight Controls process aligns technology with business goals through stakeholder discovery, KPI modeling, and data readiness assessment to ensure sustainable growth and measurable transformation outcomes.", "Choose the right control type, sensor approach, axis count, mounting and simulator mapping. The result is a practical USB control brief that can be reviewed before hardware work begins."],
  ["Reliable data flows from ingestion to features, built for scale and cost control. Our robust data engineering ensures clean, consistent, and efficient pipelines—enabling seamless integration, real-time analytics, and optimized performance that power scalable simulation systems and sustainable business growth.", "Define instructor actions, simulator data, display states and network constraints before implementation. Software scope is then demonstrated against the agreed training workflow."],
  ["Identify high-ROI use cases and define a realistic, measurable simulation roadmap. Our simulation Strategy & Mapping process aligns technology with business goals through stakeholder discovery, KPI modeling, and data readiness assessment to ensure sustainable growth and measurable transformation.", "Start with the aircraft reference, training task, simulator platform, functions, dimensions and interfaces. Those details become the configuration and validation plan for the build."],
]);

const partnerLabels = new Map([
  ["partner-7.svg", "Clear Scoping"],
  ["partner-8.svg", "Bench Testing"],
  ["partner-9.svg", "Setup Documentation"],
  ["partner-10.svg", "Direct Support"],
]);

for (const page of pages) {
  const file = path.join(root, page);
  let html = fs.readFileSync(file, "utf8");

  html = html.replace(
    /<img\b[^>]*src=["']assets\/images\/logo\/logo-footer\.png["'][^>]*>/gi,
    '<span class="footer-wordmark" aria-label="AviCore">AviCore</span>',
  );
  html = html.replace(
    /<img\b[^>]*class=["'][^"']*\bline-left\b[^"']*["'][^>]*>/gi,
    '<span class="line-left" aria-hidden="true"></span>',
  );
  html = html.replace(
    /<img\b[^>]*class=["'][^"']*\blight-top\b[^"']*["'][^>]*>/gi,
    '<span class="light-top" aria-hidden="true"></span>',
  );
  html = html.replace(
    /<img\b[^>]*class=["'][^"']*\blight-bot\b[^"']*["'][^>]*>/gi,
    '<span class="light-bot" aria-hidden="true"></span>',
  );

  for (const [filename, label] of partnerLabels) {
    const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(
      new RegExp(`<img\\b[^>]*src=["']assets/images/partner/${escaped}["'][^>]*>`, "gi"),
      `<span class="partner-label">${label}</span>`,
    );
  }

  for (const [from, to] of textReplacements) {
    html = html.split(from).join(to);
  }
  html = html.replace(
    /<input\s+type="checkbox"\s+id="pricingSwitch"[^>]*>\s*&nbsp;per project\./gi,
    '<span class="text-brand">Coming Soon.</span>',
  );
  html = html.replace(
    /<div class="d-flex align-items-center gap-24 flex-wrap">\s*<input\s+type="checkbox"\s+id="pricingSwitch"[^>]*>\s*(?:&nbsp;)?annually\.\s*<\/div>/gi,
    '<span class="text-brand">Coming Soon.</span>',
  );
  html = html.replace(
    /(<div class="price-number fw-bold")\s+data-month="[^"]*"\s+data-year="[^"]*"/gi,
    "$1",
  );

  fs.writeFileSync(file, html);
}

console.log(`Finalized shared branding and legacy copy in ${pages.length} pages.`);
