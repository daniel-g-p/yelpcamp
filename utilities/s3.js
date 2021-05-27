require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey
});

const uploadPromises = (files) => {
    const promises = [];
    for (let file of files) {
        const fileStream = fs.createReadStream(file.path);
        const filetype = file.originalname.split(".");
        file.type = filetype[filetype.length - 1];
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: `${file.filename}.${file.type}`,
            ACL: "public-read"
        };
        const promise = new Promise((res, rej) => s3.upload(uploadParams, (err, data) => {
            if (err) {
                console.log("Error", err);
                rej("Error");
            } else {
                res(data);
            }
        }));
        promises.push(promise);
    };
    return promises;
};

module.exports.upload = uploadPromises;