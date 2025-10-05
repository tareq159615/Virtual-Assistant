import multer from 'multer'

// multer.js - সংশোধন করুন
const storage = multer.diskStorage({
  destination: (req, file, cb) => { // cd থেকে cb তে পরিবর্তন করুন
    cb(null, "./public"); // path সঠিক করুন
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage})
export default upload;