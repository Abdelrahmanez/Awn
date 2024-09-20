const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Function to ensure directory exists
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

// Function to save, compress, and rename image

const findPath = (type) => {
  if (type === "profile") {
    return "../uploads/profileImages";
  } else if (type === "logo") {
    return "../uploads/logos";
  } else if (type === "problem") {
    return "../uploads/problems";
  }
};

// type is profile or logo or problem
const processImage = async (file, Id, type) => {
  const savePath = await findPath(type);
  // const ext = path.extname(file.originalname);
  const ext = ".png";
  const fileName = `${Id}${ext}`;
  const tempPath = path.join(__dirname, savePath, fileName);

  // Ensure directory exists
  ensureDirectoryExistence(tempPath);

  // Compress and save image
  await sharp(file.buffer)
    .resize({ width: 800 }) // Resize to desired width (adjust as needed)
    .jpeg({ quality: 80 }) // Compress to JPEG with desired quality
    .toFile(tempPath);

  return `${fileName}`;
};

module.exports = processImage;
