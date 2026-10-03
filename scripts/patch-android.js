// Runs in the cloud build after "cap add android": adds permissions and a version number.
const fs = require("fs");
const manifestPath = "android/app/src/main/AndroidManifest.xml";
let m = fs.readFileSync(manifestPath, "utf8");
const perms = ["android.permission.POST_NOTIFICATIONS", "android.permission.RECEIVE_BOOT_COMPLETED", "android.permission.WAKE_LOCK"];
for (const p of perms) {
  if (!m.includes(p)) m = m.replace("</manifest>", `    <uses-permission android:name="${p}" />\n</manifest>`);
}
fs.writeFileSync(manifestPath, m);
const gradlePath = "android/app/build.gradle";
let g = fs.readFileSync(gradlePath, "utf8");
const run = parseInt(process.env.RUN_NUMBER || "1", 10);
g = g.replace(/versionCode\s+\d+/, `versionCode ${run}`).replace(/versionName\s+"[^"]*"/, `versionName "1.0.${run}"`);
fs.writeFileSync(gradlePath, g);
console.log(`Patched manifest and set version 1.0.${run}`);
