const express = require("express");
const app = express();
const port = 3030;
const bodyParser = require("body-parser");
const multer = require("multer");
var fs = require("fs");
const path = require("path");
var dir = "./upload";

app.use(bodyParser.urlencoded({ extended: true }));

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, "upload");
  },
  filename: function (req, file, cb) {
    
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    let math = ["image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg.`;
    return cb(errorMess,cb)}
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // giới hạn kích thước tệp tin 1MB
  },
});
app.post("/upload", upload.single("file"), function (req, res) {
  res.send("File uploaded successfully");
});
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: "File too large" });
  } else {
    res.status(500).json({ error: err });
  }
});
const multerUpload = upload.fields([{ name: 'file2', maxCount: 8 }])
// //Uploading multiple files
app.post('/uploadfile',multerUpload,(req,res) =>{
if(req.files){
  console.log("files upload")
  console.log( req.files)
  res.send("Upload thanh cong")
}
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
