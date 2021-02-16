require('dotenv/config');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk/global');
let S3 = require('aws-sdk/clients/s3');
let bodyParser = require('body-parser')



const app = express();
const port = 8080;

let urlencodedParser = bodyParser.urlencoded({ extended: false });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
})

const upload = multer({ storage }).single('image');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));


app.post('/upload', function (req, res) {

    let base64 = req.body.uri;

    const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = base64.split(';')[0].split('/')[1]
    let params = {

        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.body.name,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    }

    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error);
        }

        res.status(200).send(data);
    })

})

app.get('/gallery', (req, res) => {

    var params = {
        Bucket: process.env.AWS_BUCKET_NAME
    };

    listAllKeys();
    function listAllKeys() {
        s3.listObjects(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                var allKeys = [];

                var contents = data.Contents;
                contents.forEach(function (content) {
                    allKeys.push(content.Key);
                });
                res.send(JSON.stringify({ "keys": allKeys }));

            }
        });
    }
});




app.listen(port, () => {
    console.log(`Server is up at ${port}`)
});

