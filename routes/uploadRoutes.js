const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

const authenticate = require('@middleware/authenticate');
const { accessKeyId, secretAccessKey } = require('@config/keys');

const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4',
    region: 'ap-southeast-2'
});

module.exports = app => {
    app.get('/api/upload', authenticate, (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl(
            'putObject',
            {
                Bucket: 'my-blog-bucket-demo-123',
                Key: key,
                ContentType: 'image/jpeg'
            },
            (err, url) => res.send({ key, url })
        );
    });
};
