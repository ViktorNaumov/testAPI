const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    console.log(req.headers.authorization);
    const name =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;

    callback(null, name);
  },
});

fileFilter = (req, file, callback) => {
  callback(null,true)
};

module.exports = multer({
  storage,
  fileFilter,
});
