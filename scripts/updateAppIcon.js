const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_ICON = path.resolve(__dirname, "../src/assets/icon.png");
const ANDROID_RES_DIR = path.resolve(__dirname, "../android/app/src/main/res");
const IOS_APPICONSET_DIR = path.resolve(
    __dirname,
    "../ios/MobileAppBase/Images.xcassets/AppIcon.appiconset"
);
const IOS_CONTENTS_PATH = path.join(IOS_APPICONSET_DIR, "Contents.json");

if (!fs.existsSync(SOURCE_ICON)) {
    console.error(`Source icon not found at ${SOURCE_ICON}`);
    process.exit(1);
}

if (!fs.existsSync(IOS_CONTENTS_PATH)) {
    console.error(`Unable to locate iOS Contents.json at ${IOS_CONTENTS_PATH}`);
    process.exit(1);
}

const androidTargets = [
    { dir: "mipmap-mdpi", size: 48 },
    { dir: "mipmap-hdpi", size: 72 },
    { dir: "mipmap-xhdpi", size: 96 },
    { dir: "mipmap-xxhdpi", size: 144 },
    { dir: "mipmap-xxxhdpi", size: 192 },
];

const androidFiles = [
    "ic_launcher.png",
    "ic_launcher_round.png",
    "ic_launcher_foreground.png",
];

/**
 * Load the iOS icon specs from Contents.json.
 * Files may appear multiple times, so we dedupe by filename
 * while keeping the largest requested size per filename.
 */
function loadIosTargets() {
    const contents = JSON.parse(fs.readFileSync(IOS_CONTENTS_PATH, "utf8"));
    const map = new Map();
    let updated = false;

    contents.images.forEach((image) => {
        if (!image.filename) {
            image.filename = `AppIcon-${image.size}@${image.scale}.png`;
            updated = true;
        }
        const expected =
            image["expected-size"] && !Number.isNaN(Number(image["expected-size"]))
                ? Number(image["expected-size"])
                : computePxFromSizeAndScale(image.size, image.scale);
        if (!expected) {
            return;
        }
        const previous = map.get(image.filename) || 0;
        map.set(image.filename, Math.max(previous, expected));
    });

    if (updated) {
        fs.writeFileSync(IOS_CONTENTS_PATH, JSON.stringify(contents, null, 2), "utf8");
    }

    return Array.from(map.entries()).map(([filename, size]) => ({
        filename,
        size,
    }));
}

function computePxFromSizeAndScale(sizeText, scaleText = "1x") {
    if (!sizeText) {
        return null;
    }
    const [w] = sizeText.split("x").map(Number);
    const scale = Number((scaleText || "1x").replace("x", "")) || 1;
    if (!w) {
        return null;
    }
    return Math.round(w * scale);
}

async function ensureSourceResolution(minSize) {
    const metadata = await sharp(SOURCE_ICON).metadata();
    const minDimension = Math.min(metadata.width || 0, metadata.height || 0);
    if (minDimension < minSize) {
        console.warn(
            `Warning: source icon (${metadata.width}x${metadata.height}) is smaller than the largest required size (${minSize}px). The image will be upscaled and may appear blurry.`
        );
    }
}

async function generateAndroidIcons() {
    for (const target of androidTargets) {
        const folder = path.join(ANDROID_RES_DIR, target.dir);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        // Remove legacy .webp assets so Android only picks up the new PNG resources.
        fs.readdirSync(folder)
            .filter(
                (file) =>
                    file.startsWith("ic_launcher") && path.extname(file).toLowerCase() === ".webp"
            )
            .forEach((file) => fs.rmSync(path.join(folder, file)));

        for (const filename of androidFiles) {
            const dest = path.join(folder, filename);
            await sharp(SOURCE_ICON)
                .resize(target.size, target.size, { fit: "cover" })
                .png()
                .toFile(dest);
        }
    }
}

async function generateIosIcons(iosTargets) {
    for (const target of iosTargets) {
        const dest = path.join(IOS_APPICONSET_DIR, target.filename);
        await sharp(SOURCE_ICON)
            .resize(target.size, target.size, { fit: "cover" })
            .png()
            .toFile(dest);
    }
}

async function run() {
    const iosTargets = loadIosTargets();
    const largestSize = Math.max(
        ...iosTargets.map((t) => t.size),
        ...androidTargets.map((t) => t.size)
    );

    await ensureSourceResolution(largestSize);
    await generateAndroidIcons();
    await generateIosIcons(iosTargets);

    console.log("✅ App icons regenerated from", SOURCE_ICON);
}

run().catch((error) => {
    console.error("Failed to update app icons:", error);
    process.exit(1);
});