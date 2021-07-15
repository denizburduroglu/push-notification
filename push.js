// Install express server
const PORT = process.env.PORT || '8888';
const express = require('express');
const app = express();

// Swagger documentation
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Push notification details
const webpush = require('web-push');
const vapidPublicKey = 'BPFJMQ-YaJTkX99MBgc9tW9ov06LQ1-KcBzeR_5kkYPKZ-XY1Syy_7AT8awnL8GECYdslzfylMF2lUJpk-jHq50';
const vapidPrivateKey = 'k7gCqKEHSDWoQ26wZXqr8nmq_vMOfghAWvyKne8Rwoo';

// Hanlde push notifications from app to send to service worker
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req, res) => {
    return res.status(200).send({
        success: "true"
    });
});
app.post('/notification', (req, res) => {
    let sub = req.body;
    res.set('Content-Type', 'application/json');
    webpush.setVapidDetails(
        'mailto:daburduroglu@gmail.com',
        vapidPublicKey,
        vapidPrivateKey
    );
    let payload = JSON.stringify({
        "notification":{
            "title":"This is my notification",
            "body":"Your timer is up"
        }
    });
    console.log("Send Notification: ", sub);
    Promise.resolve(webpush.sendNotification(sub, payload))
        .then(() => res.status(200).json({
            message: 'Notification sent'
        }))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.listen(PORT, () => {
    console.log("server listening on port " + PORT + "!");
})