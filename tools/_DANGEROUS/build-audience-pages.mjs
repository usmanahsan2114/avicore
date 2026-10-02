import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const header = fs.readFileSync(path.join(root, "_partials/header.html"), "utf8");
const footer = fs.readFileSync(path.join(root, "_partials/footer.html"), "utf8");

const pages = [
  {
    file: "capabilities.html",
    title: "Capabilities | AviCore Simulation Technologies",
    description: "Explore AviCore product design, simulator electronics, interfaces, displays, software integration and validation capabilities.",
    eyebrow: "Capabilities",
    heading: "Design, test and integrate the module that matters.",
    lead: "AviCore brings product design, simulator interfaces, compact electronics and software workflows into one reviewable path for smaller aviation simulation projects.",
    image: "capabilities-engineering.jpg",
    imageWidth: 1586,
    imageHeight: 991,
    imageAlt: "Flight simulator controls, avionics display and interface panel on an engineering workbench",
    cards: [
      ["Product design", "Turn an aircraft reference, dimension set or training need into a practical control, panel, bezel or printed component."],
      ["Electronics and interfaces", "Plan USB HID, switches, encoders, sensors, harnesses and interface boundaries around the simulator platform."],
      ["Displays and software", "Shape soft gauges, instructor workflows and compact display modules around the information the user needs."],
    ],
    sectionEyebrow: "A connected workflow",
    sectionHeading: "From a useful brief to a module you can review.",
    sectionLead: "Each capability is tied to the same questions: what task is being trained, what must fit, what connects, and what evidence confirms the result.",
    checklist: ["Reference and requirements review", "Mechanical and interface planning", "Prototype or configuration preview", "Bench validation and setup guidance"],
    process: [
      ["01", "Define", "Capture the training task, aircraft reference, environment and constraints."],
      ["02", "Design", "Resolve control feel, layout, mounting, interfaces and user workflow."],
      ["03", "Validate", "Check fit, response, readability and the agreed simulator functions."],
      ["04", "Document", "Prepare the configuration and setup guidance needed for launch."],
    ],
  },
  {
    file: "flight-schools.html",
    title: "Flight School Simulator Modules | AviCore",
    description: "Compact flight simulation controls, displays and instructor tools planned for repeatable flight school training stations.",
    eyebrow: "Flight schools",
    heading: "Training stations that stay focused on the lesson.",
    lead: "Build a compact bench around the procedures students need to practise, with repeatable controls, readable displays and an instructor workflow that stays easy to run.",
    image: "flight-school-training.jpg",
    imageWidth: 1586,
    imageHeight: 991,
    imageAlt: "Instructor and adult student reviewing a compact flight simulator training station",
    cards: [
      ["Repeatable layout", "Keep control placement and display views consistent from one session or training station to the next."],
      ["Instructor workflow", "Plan scenario controls, repositioning and monitored-session tools around the lesson rather than the software."],
      ["Practical support", "Use clear mapping, calibration and reset guidance so staff can prepare the station with confidence."],
    ],
    sectionEyebrow: "Designed for teaching",
    sectionHeading: "One focused station, built around a clear outcome.",
    sectionLead: "A training bench does not need every aircraft system. It needs the right controls, cues and instructor actions for the task being taught.",
    checklist: ["Lesson and procedure definition", "Student control and display layout", "Instructor-side actions", "Session reset and setup guidance"],
    process: [
      ["01", "Select the lesson", "Define the procedure, student actions and cues that matter."],
      ["02", "Map the station", "Choose the controls, displays and instructor functions needed."],
      ["03", "Review usability", "Check reach, readability, reset steps and repeatability."],
      ["04", "Prepare launch", "Publish compatibility and included setup guidance before release."],
    ],
  },
  {
    file: "simulator-builders.html",
    title: "Modules for Simulator Builders | AviCore",
    description: "Compact simulator controls, panels, displays and interface modules prepared for integration into wider training systems.",
    eyebrow: "Simulator builders",
    heading: "Compact modules that fit the wider simulator architecture.",
    lead: "Add the missing control, display or software module without treating it as an isolated gadget. Interfaces, mounting, power, data and handover are considered together.",
    image: "simulator-builder-integration.jpg",
    imageWidth: 1586,
    imageHeight: 991,
    imageAlt: "Engineers integrating avionics displays and interface hardware into simulator frames",
    cards: [
      ["Interface boundaries", "Make power, USB, serial, network and simulator-data responsibilities explicit before integration."],
      ["Mechanical fit", "Review mounting points, rear clearance, service access and cable routing against the receiving structure."],
      ["Handover clarity", "Keep connector maps, configuration notes and validation expectations close to the delivered module."],
    ],
    sectionEyebrow: "Integration first",
    sectionHeading: "A smaller module should reduce system work, not create more.",
    sectionLead: "The build path starts with the surrounding simulator so each component has a defined place, connection and acceptance check.",
    checklist: ["Receiving-system constraints", "Power, data and mounting interfaces", "Integration and test checkpoints", "Configuration and handover notes"],
    process: [
      ["01", "Share boundaries", "Provide the mechanical envelope, interfaces and simulator stack."],
      ["02", "Resolve dependencies", "Confirm what AviCore supplies and what the wider system supplies."],
      ["03", "Bench check", "Validate the module against the agreed signals and functions."],
      ["04", "Integrate", "Use documented mounting, connections and configuration guidance."],
    ],
  },
  {
    file: "defense-training.html",
    title: "Procedure Training Modules | AviCore",
    description: "Procedure-focused simulator modules for professional aviation training environments, with controlled interfaces and documented validation.",
    eyebrow: "Professional procedure training",
    heading: "Focused modules for demanding training environments.",
    lead: "AviCore supports non-certified simulator controls, panels, displays and instructor workflows where repeatability, maintainability and documented interfaces matter.",
    image: "professional-procedure-training.jpg",
    imageWidth: 1586,
    imageHeight: 991,
    imageAlt: "Professional trainees using a fixed-wing procedure trainer with an instructor station",
    cards: [
      ["Controlled configuration", "Keep functions, interfaces and software assumptions tied to a reviewed project baseline."],
      ["Maintainable hardware", "Plan service access, connectors, replaceable modules and setup steps for simulator use."],
      ["Traceable checks", "Define the response, indication or workflow that demonstrates each approved function."],
    ],
    sectionEyebrow: "Professional use",
    sectionHeading: "Clear boundaries from configuration to validation.",
    sectionLead: "These products remain simulation-use systems. Project documentation must define the training purpose, supported functions and acceptance path.",
    checklist: ["Training-purpose definition", "Configuration and interface control", "Maintainability review", "Documented functional checks"],
    process: [
      ["01", "Scope", "Define the training task, environment and project boundaries."],
      ["02", "Control", "Review the approved hardware and software configuration."],
      ["03", "Verify", "Check each function against an agreed observable result."],
      ["04", "Support", "Keep setup, maintenance and change notes with the module."],
    ],
  },
  {
    file: "universities.html",
    title: "University Aviation Simulation Labs | AviCore",
    description: "Modular flight simulation hardware and software for university labs, teaching benches and engineering projects.",
    eyebrow: "Universities and institutes",
    heading: "Hands-on simulator labs that make systems visible.",
    lead: "Give students a platform they can inspect, map and extend—from USB controls and interface electronics to avionics displays and instructor-led exercises.",
    image: "university-aviation-lab.jpg",
    imageWidth: 1586,
    imageHeight: 991,
    imageAlt: "University engineering students collaborating around a modular flight simulator laboratory bench",
    cards: [
      ["Modular learning", "Separate controls, panels, displays and interfaces so students can understand how the station is assembled."],
      ["Project-ready access", "Support capstone work, HMI studies and integration exercises with documented boundaries."],
      ["Teaching workflow", "Prepare repeatable setup, reset and demonstration steps for instructors and lab staff."],
    ],
    sectionEyebrow: "Built to explore",
    sectionHeading: "A lab platform should invite questions and survive the semester.",
    sectionLead: "The right station balances visible system architecture, durable controls and enough flexibility for new lessons and student projects.",
    checklist: ["Course and lab outcomes", "Student access and safety boundaries", "Modular hardware and software plan", "Reusable setup documentation"],
    process: [
      ["01", "Define outcomes", "Choose the concepts, workflows or integrations students should learn."],
      ["02", "Configure modules", "Select controls, panels, displays and accessible interfaces."],
      ["03", "Prepare exercises", "Document the setup, expected behaviour and reset process."],
      ["04", "Extend", "Add future student projects without rebuilding the full station."],
    ],
  },
  {
    file: "maintenance-training.html",
    title: "Aviation Maintenance Training Benches | AviCore",
    description: "Simulation-focused avionics, panel and interface benches for aviation maintenance familiarisation and diagnostic training.",
    eyebrow: "Maintenance training",
    heading: "Bench tools for learning how avionics and panels work.",
    lead: "Create a safe simulation-focused environment for connector familiarisation, indication checks, switch logic and basic diagnostic workflows without representing certified aircraft equipment.",
    image: "maintenance-training-bench.jpg",
    imageWidth: 1568,
    imageHeight: 980,
    imageAlt: "Technician trainees diagnosing a simulator avionics display and switch panel at a training bench",
    cards: [
      ["Visible interfaces", "Use accessible connectors, harnesses and test points planned around the intended learning exercise."],
      ["Fault workflow", "Build controlled simulator faults and observable indications into a clear instructor-led sequence."],
      ["Reset and repeat", "Document safe setup and reset steps so each group begins from the same known state."],
    ],
    sectionEyebrow: "Learning by doing",
    sectionHeading: "Make the signal path easier to understand.",
    sectionLead: "A focused bench can connect switch inputs, display indications and diagnostic steps in a way that is visible, repeatable and easy to discuss.",
    checklist: ["Learning task and safe boundaries", "Harness and connector layout", "Expected indications and test steps", "Instructor reset procedure"],
    process: [
      ["01", "Choose the task", "Define the familiarisation or diagnostic workflow being taught."],
      ["02", "Expose the path", "Plan the controls, connectors and indications students must observe."],
      ["03", "Script the exercise", "Define expected results, instructor actions and reset points."],
      ["04", "Prepare guidance", "Publish setup and use notes before the product opens."],
    ],
  },
  {
    file: "hobbyists.html",
    title: "Home Cockpit Hardware for Hobbyists | AviCore",
    description: "Compact flight simulation controls, panels, cockpit parts and displays planned for enthusiast desk rigs and home cockpits.",
    eyebrow: "Home cockpit builders",
    heading: "Build the cockpit detail your desktop setup is missing.",
    lead: "Start with one control, bezel, switch panel or printed part and grow at your own pace. AviCore product families are being prepared for compact spaces and real enthusiast workflows.",
    image: "hobbyist-cockpit-room.jpg",
    imageWidth: 1586,
    imageHeight: 991,
    imageAlt: "Compact enthusiast flight simulator desk with controls, avionics panel and ultrawide display",
    cards: [
      ["Space-aware", "Plan around the desk, chair, monitor and mounting room you already have."],
      ["Simple interfaces", "Use practical USB mapping and clear setup guidance for compatible desktop simulators."],
      ["Expandable", "Add one useful module now and leave room for controls, displays or panels later."],
    ],
    sectionEyebrow: "Your build, your pace",
    sectionHeading: "Small upgrades can change the whole cockpit feel.",
    sectionLead: "The best next part is the one that improves reach, feedback or visibility without making the setup harder to use.",
    checklist: ["Available desk or cockpit space", "Simulator platform and aircraft", "Most-used controls and views", "Mounting and cable route"],
    process: [
      ["01", "Find the gap", "Choose the control, display or part that would improve every flight."],
      ["02", "Check the fit", "Measure the space and identify the simulator interface."],
      ["03", "Follow the launch", "Review the published compatibility and included items."],
      ["04", "Build outward", "Add future modules around a clean, documented setup."],
    ],
  },
];

function featureCards(cards) {
  return cards.map(([title, copy], index) => `<article class="info-card audience-info-card" data-parallax-card><div class="card-icon" aria-hidden="true">0${index + 1}</div><h3>${title}</h3><p>${copy}</p></article>`).join("");
}

function processCards(cards) {
  return cards.map(([number, title, copy]) => `<article class="process-card"><div class="step-number">${number}</div><h3>${title}</h3><p>${copy}</p></article>`).join("");
}

function pageHtml(page) {
  const canonical = `https://www.fsdcpak.com/avicore/${page.file}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${page.title}</title>
  <meta name="author" content="AviCore Simulation Technologies">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta name="description" content="${page.description}">
  <meta name="theme-color" content="#EDECEC">
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <link rel="stylesheet" href="assets/icon/icomoon/style.css">
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/swiper-bundle.min.css">
  <link rel="stylesheet" href="assets/css/animate.css">
  <link rel="stylesheet" href="assets/css/slick.css">
  <link rel="stylesheet" href="assets/css/slick.theme.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="stylesheet" href="assets/css/avicore.css">
  <link rel="stylesheet" href="assets/css/storefront.css">
  <link rel="stylesheet" href="assets/css/legacy-avicore.css">
  <link rel="shortcut icon" href="assets/images/logo/avicore-favicon.svg">
  <link rel="canonical" href="${canonical}">
</head>
<body data-page="${page.file.replace(".html", "")}">
<a class="skip-link" href="#main-content">Skip to content</a>
<nav class="sr-only" aria-label="Primary navigation"><a href="index.html">Home</a></nav>
${header}
<main id="main-content">
  <section class="detail-hero audience-detail-hero">
    <div class="container detail-hero-grid">
      <div class="hero-copy">
        <div class="eyebrow">${page.eyebrow}</div>
        <h1>${page.heading}</h1>
        <p class="lead">${page.lead}</p>
        <div class="chip-row"><span class="chip chip-accent">Coming Soon</span><span class="chip">Simulation use</span><span class="chip">FSDC partner</span></div>
        <div class="button-row"><a class="btn btn-primary" href="contact.html">Join launch updates</a><a class="btn btn-secondary" href="products.html">Explore products</a></div>
      </div>
      <div class="audience-stage" data-parallax-card>
        <img src="assets/images/generated/${page.image}" alt="${page.imageAlt}" width="${page.imageWidth}" height="${page.imageHeight}" loading="eager" decoding="async" fetchpriority="high">
        <span class="image-note">AviCore use-case preview</span>
      </div>
    </div>
  </section>
  <section class="section surface">
    <div class="container">
      <div class="section-heading"><div><div class="eyebrow">What matters here</div><h2>Focused around the people using the station.</h2></div><p>Compact systems work best when layout, interfaces and support are planned around a specific environment.</p></div>
      <div class="feature-grid">${featureCards(page.cards)}</div>
    </div>
  </section>
  <section class="section audience-workflow">
    <div class="container split">
      <div><div class="eyebrow">${page.sectionEyebrow}</div><h2>${page.sectionHeading}</h2><p class="lead">${page.sectionLead}</p></div>
      <aside class="info-card audience-check-card"><div class="card-kicker">Planning checklist</div><h3>Start with the details that change the result.</h3><ul class="list-check">${page.checklist.map((item) => `<li>${item}</li>`).join("")}</ul><a class="text-link" href="contact.html">Discuss your use case</a></aside>
    </div>
  </section>
  <section class="section surface">
    <div class="container">
      <div class="section-heading"><div><div class="eyebrow">How it comes together</div><h2>A clear four-step path.</h2></div><p>Product information moves from use case to compatible, documented launch scope.</p></div>
      <div class="process-grid">${processCards(page.process)}</div>
    </div>
  </section>
  <section class="section section-tight-top">
    <div class="container callout"><div class="callout-grid"><div><div class="eyebrow">Product availability</div><h2>All AviCore products are Coming Soon.</h2><p>Join the launch updates or explore the product families being prepared.</p></div><div class="button-row"><a class="btn btn-primary" href="contact.html">Join launch updates</a><a class="btn btn-secondary" href="products.html">View product lines</a></div></div></div>
  </section>
</main>
${footer}
</body>
</html>`;
}

for (const page of pages) {
  fs.writeFileSync(path.join(root, page.file), pageHtml(page));
}

console.log(`Built ${pages.length} complete audience and capability pages.`);
