// utils/imageHelper.js
const fs = require("fs");
const path = require("path");

const renameImageFile = (file, userId) => {
  if (!file) return null;

  const fileExt = path.extname(file.originalname);  // Get file extension
  const newFileName = `${userId}${fileExt}`;        // New filename with userId

  const oldPath = path.join("../src/uploads", file.filename);
  const newPath = path.join("../src/uploads", newFileName);

  // Rename the file in the filesystem
  fs.renameSync(oldPath, newPath);

  return newFileName;
};

module.exports = {
  renameImageFile,
};
