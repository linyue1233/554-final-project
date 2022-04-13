require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');

const bucketName = "benchmoon-554";
const region = 'us-east-1';
const accessKeyId = "AKIA3KXHEOTYPLOQZLNZ";
const secretAccessKey = "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";

AWS.config.update({
    region: region,
    apiVersion: 'latest',
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
    }
  })

const s3 = new AWS.S3(
    region,
    accessKeyId,
    secretAccessKey
)

// upload a file to S3
function uploadFile(file){
    const fileStream = fs.createReadStream(file.path);
    console.log(file.filename);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    console.log(file.filename);
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// download from s3
function getFileStream(fileKey){
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;