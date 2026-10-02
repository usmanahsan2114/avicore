import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const assetMap = new Map([
  ["assets/images/section/service-1.jpg", "assets/images/products/usb-flight-controls-1200.webp"],
  ["assets/images/section/service-2.jpg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/section/service-3.jpg", "assets/images/products/simulator-panel-1200.webp"],
  ["assets/images/section/service-4.jpg", "assets/images/products/ios-console-1200.webp"],
  ["assets/images/section/service-5.jpg", "assets/images/products/printed-cockpit-parts-1200.webp"],
  ["assets/images/section/service-6.jpg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/section/service-7.jpg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/section/service-8.jpg", "assets/images/products/ios-console-1200.webp"],
  ["assets/images/section/service-single-1.jpg", "assets/images/products/printed-cockpit-parts-1200.webp"],
  ["assets/images/section/service-single-2.jpg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/section/service-single-3.jpg", "assets/images/products/simulator-panel-1200.webp"],
  ["assets/images/section/service-single-4.jpg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/section/work-single-1.jpg", "assets/images/products/usb-flight-controls-1200.webp"],
  ["assets/images/section/work-single-2.jpg", "assets/images/products/simulator-panel-1200.webp"],
  ["assets/images/section/work-single-3.jpg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/section/work-single-4.jpg", "assets/images/products/ios-console-1200.webp"],
  ["assets/images/section/quotes-1.jpg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/section/tes-1.jpg", "assets/images/products/usb-flight-controls-1200.webp"],
  ["assets/images/section/tes-2.jpg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/section/tes-3.jpg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/section/contact-image-bg.jpg", "assets/images/section/aviation-cockpit-backdrop.jpg"],
  ["assets/images/team/team-1.jpg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/team/team-2.jpg", "assets/images/products/usb-flight-controls-1200.webp"],
  ["assets/images/team/team-3.jpg", "assets/images/products/printed-cockpit-parts-1200.webp"],
  ["assets/images/team/team-4.jpg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/team/team-5.jpg", "assets/images/products/ios-console-1200.webp"],
  ["assets/images/section/tool-1.svg", "assets/images/products/usb-flight-controls-1200.webp"],
  ["assets/images/section/tool-2.svg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/section/tool-3.svg", "assets/images/products/printed-cockpit-parts-1200.webp"],
  ["assets/images/section/tool-4.svg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/section/tool-5.svg", "assets/images/products/simulator-panel-1200.webp"],
  ["assets/images/section/tool-6.svg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/section/tool-center.svg", "assets/images/products/joystick-configurator-1200.webp"],
  ["assets/images/item/item-1.svg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/item/item-2.svg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/item/item-3.svg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/item/item-4.svg", "assets/images/products/usb-flight-controls-1200.webp"],
  ["assets/images/item/item-5.svg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/item/item-6.svg", "assets/images/products/printed-cockpit-parts-1200.webp"],
  ["assets/images/item/item-7.svg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/item/item-8.svg", "assets/images/products/simulator-panel-1200.webp"],
  ["assets/images/item/item-9.svg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/item/item-10.svg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/item/item-11.svg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/item/item-12.svg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/item/item-13.svg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/item/item-14.svg", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/item/item-15.svg", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/item/benefits-1.svg", "assets/images/products/custom-joystick-1200.webp"],
  ["assets/images/item/benefits-2.svg", "assets/images/products/simulator-panel-1200.webp"],
  ["assets/images/item/benefits-3.png", "assets/images/products/avionics-bezel-1200.webp"],
  ["assets/images/item/benefits-4.png", "assets/images/products/soft-gauges-1200.webp"],
  ["assets/images/item/earth.png", "assets/images/products/ios-console-1200.webp"]
]);

const textMap = [
  ["End-to-End AI Services", "Compact Flight Simulation Products"],
  ["Build Smarter with", "Build a Better Simulator with"],
  ["Full-Stack AI", "Compact Flight Hardware"],
  ["The Squad Shipping Your AI", "The Team Behind Your Simulator"],
  ["We work with powerful AI tools", "Built for the simulators you already use"],
  ["AI Strategy & Mapping", "USB Flight Controls"],
  ["AI UX & Product Design", "Custom Joystick Builds"],
  ["LLM / Agent Development", "Simulator Panels & Bezels"],
  ["Data Engineering & Pipelines", "Instructor Software & Soft Gauges"],
  ["AI-Driven Agency", "Compact Simulation Systems"],
  ["Your AI Sprint Team", "Hardware and software for focused simulators"],
  ["Human-Centered AI, <br> Built for Production", "Human-Centered Simulation, <br> Built for Training"],
  ["We turn ambiguous AI ideas into production features your users trust—combining strategy, design, engineering, and rigorous evaluation.", "We turn aircraft references and simulator requirements into dependable controls, panels, displays and software modules—combining design, engineering and careful testing."],
  ["AI Strategy <br> & Mapping", "USB Flight Controls"],
  ["AI UX <br> & Product Design", "Custom Joystick Builds"],
  ["LLM / Agent <br> Development", "Simulator Panels <br> & Avionics"],
  ["Data Engineering <br> & Pipelines", "Instructor Software <br> & Soft Gauges"],
  ["The Squad Shipping <br> Your AI", "The Team Behind <br> Your Simulator"],
  ["Tools", "Simulator Stack"],
  ["Team Members", "Engineering Team"],
  ["Innovation in AI", "Simulation Engineering"],
  ["Best AI Product Design", "Best Simulator Interface"],
  ["Data & AI Excellence", "Display & Integration"],
  ["AI UX & Product", "Simulator Interface"],
  ["Innovative AI UX & Product Design", "Simulator Interface & Display Design"],
  ["AI Strategy & Mapping", "Simulator Configuration & Integration"],
  ["Human-centered AI", "Human-centered simulation"],
  ["AI & Automation Integration", "Simulator Interface Integration"],
  ["Catalog Intelligence Engine", "Instructor Display Integration"],
  ["Support Copilot for SaaS", "USB controls for a compact training rig"],
  ["Underwriting Risk Copilot", "Aircraft-inspired custom joystick"],
  ["Clinical Note Summarizer", "Avionics bezel and display fit"],
  ["Catalog Intelligence Engine", "Instructor operating station"],
  ["Ava Collins", "Controls Engineering"],
  ["Noah Reed", "Embedded Interfaces"],
  ["Jordan Brooks", "Panel & Avionics Design"],
  ["Lucas Hayes", "Simulator Integration"],
  ["Erin Park", "Software & Display Systems"]
];

for (const file of files) {
  const target = path.join(root, file);
  let html = fs.readFileSync(target, "utf8");
  for (const [from, to] of assetMap) html = html.split(from).join(to);
  if (file === "index.html" || file === "index-v2.html" || file === "service.html" || file === "work.html" || file === "about.html") {
    for (const [from, to] of textMap) html = html.split(from).join(to);
  }
  html = html.replace(/AI services/gi, "flight-simulation products");
  html = html.replace(/AI solutions/gi, "simulation solutions");
  html = html.replace(/artificial intelligence/gi, "aviation simulation");
  html = html.replace(/AI stack/gi, "simulator stack");
  html = html.replace(/AI-powered/gi, "simulation-ready");
  if (["index.html", "index-v2.html", "service.html", "service-single.html", "work.html", "work-single.html", "about.html"].includes(file)) {
    html = html.replace(/\bAI\b/g, "simulation");
    html = html.replace(/copilot/gi, "simulator module");
    html = html.replace(/LLM|RAG|agentic/gi, "interface integration");
    html = html.replace(/SaaS|Fintech|Healthcare|Ecommerce(?:\/Retail)?/gi, "Aviation simulation");
    html = html.replace(/natural language processing, computer vision, and machine learning/gi, "simulator data interfaces and display logic");
  }
  html = html.replace(/Aigocy/gi, "AviCore");
  html = html.replace(/alt="Service 1"/g, 'alt="USB flight control set"')
    .replace(/alt="Team 1"/g, 'alt="Custom joystick engineering visual"')
    .replace(/alt="Team 2"/g, 'alt="USB control engineering visual"')
    .replace(/alt="Team 3"/g, 'alt="Printed cockpit parts engineering visual"')
    .replace(/alt="Team 4"/g, 'alt="Avionics bezel engineering visual"')
    .replace(/alt="Team 5"/g, 'alt="Instructor software engineering visual"')
    .replace(/alt="Tes 1"/g, 'alt="USB controls in a simulator stage"')
    .replace(/alt="Tes 2"/g, 'alt="Avionics bezel in a simulator stage"')
    .replace(/alt="Tes 3"/g, 'alt="Soft gauges in a simulator stage"');
  fs.writeFileSync(target, html, "utf8");
}
console.log(`Replaced flat template image references and refreshed legacy page copy in ${files.length} pages.`);
