const { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } = require("../config.json");
const fs = require("fs");
const aws = require("aws-sdk");


const s3 = new aws.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_BUCKET_REGION,
});


module.exports.uploadToS3 = (file) => {
    const fileStream = fs.createReadStream(file?.path);

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
}

module.exports.downloadFromS3 = (key) => {
    const downloadParams = {
        Key: key,
        Bucket: AWS_BUCKET_NAME,
    };
    return s3.getObject(downloadParams).createReadStream();
}

