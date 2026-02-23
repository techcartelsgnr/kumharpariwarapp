const fs = require("fs");
const path = require("path");

// Read version from package.json
const pkg = require("../package.json");
const version = pkg.version;

// ================= ANDROID =================
const gradlePath = path.join(
  __dirname,
  "../android/app/build.gradle"
);

let gradle = fs.readFileSync(gradlePath, "utf8");

// Read current versionCode
const codeMatch = gradle.match(/versionCode\s+(\d+)/);
const currentCode = codeMatch ? parseInt(codeMatch[1], 10) : 1;
const newCode = currentCode + 1;

// Replace values
gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${version}"`);
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);

fs.writeFileSync(gradlePath, gradle);

console.log("✅ Android updated:");
console.log("   versionName =", version);
console.log("   versionCode =", newCode);

// ================= iOS =================
const iosDir = path.join(__dirname, "../ios");
const appFolder = fs.readdirSync(iosDir).find(f =>
  fs.existsSync(path.join(iosDir, f, "Info.plist"))
);

if (!appFolder) {
  console.error("❌ iOS Info.plist not found");
  process.exit(1);
}

const plistPath = path.join(iosDir, appFolder, "Info.plist");
const execSync = require("child_process").execSync;

execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" "${plistPath}"`);
execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${newCode}" "${plistPath}"`);

console.log("✅ iOS updated:");
console.log("   CFBundleShortVersionString =", version);
console.log("   CFBundleVersion =", newCode);

console.log("🎉 Release sync done");