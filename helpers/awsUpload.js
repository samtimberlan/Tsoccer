const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  accessKeyId: "AKIAJVTD6XJ73V7BSTQQ",
  secretAccessKey: "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 ",
  region: "eu-west-2"
});

const S0 = new aws.S3({});
const upload = multer({
  storage: multerS3({
    s3: S0,
    bucket: "tsoccer",
    acl: "public-read",
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    },
    rename(fieldName, fileName) {
      return fileName.replace(/\W+/g, "-");
    }
  })
});

exports.Upload = upload;
