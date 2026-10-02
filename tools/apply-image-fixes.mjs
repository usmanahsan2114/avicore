import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function updateFile(filename, updater) {
  const filePath = path.join(root, filename);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  const updated = updater(content);
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`Updated: ${filename}`);
  } else {
    console.log(`No changes made to: ${filename}`);
  }
}

// 1. index.html
updateFile("index.html", (html) => {
  // Title-icon banner pill
  html = html.replace(
    /<div class="title-icon">[\s\S]*?<\/div>\s*<\/div>/,
    `<div class="title-icon">
                                <div class="box"></div>
                                <div class="title-icon-wrap">
                                    <img class="img-1 img-transform-3" src="assets/images/products/custom-joystick-480.webp" alt="AviCore flight simulator joystick" width="120" height="120">
                                    <img class="img-2 img-transform-3" src="assets/images/products/avionics-bezel-480.webp" alt="AviCore glass cockpit avionics display" width="120" height="120">
                                    <img class="img-3 img-transform-3" src="assets/images/products/simulator-panel-480.webp" alt="AviCore cockpit toggle switch panel" width="120" height="120">
                                </div>
                            </div>`
  );

  // FSDC section in index.html
  html = html.replace(
    /src="assets\/images\/stock\/simulator-training-photo-1775751079981-\.jpg"[^>]*?>/,
    `src="assets/images/fsdc/events-indus-2026-pm-at-controls.webp" alt="Prime Minister at the controls of an FSDC simulator during the Indus RAS Expo 2026" width="1200" height="800">`
  );

  html = html.replace(
    /src="assets\/images\/stock\/joystick-controller-photo-1631896928983-\.jpg"[^>]*?>/,
    `src="assets/images/fsdc/home-services2.webp" alt="FSDC professional motion flight simulator with pilot at the controls" width="1200" height="800">`
  );

  // Services section image
  html = html.replace(
    /src="assets\/images\/generated\/hardware-launch-preview\.jpg"\s+alt="AviCore control and display products arranged together"/,
    `src="assets/images/generated/services-control-ecosystem.webp" alt="AviCore flight simulation control ecosystem with rudder pedals, yoke, throttle and joystick"`
  );

  // Documented Builds (Xbox controller on cyan)
  html = html.replace(
    /src="assets\/images\/stock\/joystick-controller-photo-1632312527375-\.jpg"[^>]*?>/,
    `src="assets/images/generated/joystick-assembly-workbench.webp" alt="AviCore flight simulator joystick gimbal bench assembly and oscilloscope calibration" width="800" height="800">`
  );

  return html;
});

// 2. about.html
updateFile("about.html", (html) => {
  // FSDC workbench image
  html = html.replace(
    /src="assets\/images\/stock\/flight-simulator-photo-1494264274944-\.jpg"[^>]*?>/,
    `src="assets/images/fsdc/home-about1.webp" alt="FSDC Aerosolutions full flight simulator manufacturing bays in Pakistan" width="1200" height="800">`
  );

  // FSDC quotes image
  html = html.replace(
    /src="assets\/images\/stock\/simulator-training-photo-1604499829644-\.jpg"[^>]*?>/,
    `src="assets/images/fsdc/home-services2.webp" alt="FSDC advanced motion flight simulator with pilot in cockpit" width="1200" height="800">`
  );

  // Simulator Stack diagram
  html = html.replace(
    /src="assets\/images\/stock\/joystick-controller-photo-1482855549413-\.jpg"[^>]*?>/,
    `src="assets/images/generated/custom-joystick-studio.webp" alt="AviCore custom USB flight simulator joystick on metal gimbal base" width="1000" height="669">`
  );

  return html;
});

// 3. capabilities.html
updateFile("capabilities.html", (html) => {
  html = html.replace(
    /src="assets\/images\/stock\/joystick-controller-photo-1542549237432-\.jpg"[^>]*?>/,
    `src="assets/images/generated/joystick-assembly-workbench.webp" alt="AviCore flight simulator controls precision assembly and bench testing" width="1586" height="991" loading="eager" decoding="async" fetchpriority="high">`
  );
  return html;
});

// 4. contact.html
updateFile("contact.html", (html) => {
  html = html.replace(
    /<div class="title-icon">[\s\S]*?<\/div>\s*<\/div>/,
    `<div class="title-icon">
                                <div class="box"></div>
                                <div class="title-icon-wrap">
                                    <img class="img-1 img-transform-3" src="assets/images/products/custom-joystick-480.webp" alt="AviCore flight simulator joystick" width="120" height="120">
                                    <img class="img-2 img-transform-3" src="assets/images/products/avionics-bezel-480.webp" alt="AviCore glass cockpit avionics display" width="120" height="120">
                                    <img class="img-3 img-transform-3" src="assets/images/products/simulator-panel-480.webp" alt="AviCore cockpit toggle switch panel" width="120" height="120">
                                </div>
                            </div>`
  );
  return html;
});

// 5. index-v2.html
updateFile("index-v2.html", (html) => {
  html = html.replace(
    /src="assets\/images\/stock\/joystick-controller-photo-1592840496694-\.jpg"/,
    `src="assets/images/products/custom-joystick-800.webp"`
  );
  html = html.replace(
    /src="assets\/images\/stock\/joystick-controller-photo-1593118247619-\.jpg"/,
    `src="assets/images/products/usb-flight-controls-800.webp"`
  );
  html = html.replace(
    /src="assets\/images\/stock\/joystick-controller-photo-1612287230202-\.jpg"/,
    `src="assets/images/generated/custom-joystick-studio.webp"`
  );
  return html;
});

console.log("Image fixes script complete.");
