// Install express server
const PORT = process.env.PORT || '8888';
const express = require('express');
const path = require('path');
const app = express();


// Push notification details
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();

// Hanlde push notifications from app to send to service worker
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
app.post('/subscribe', (req, res) => {
    let sub = req.body;
    res.set('Content-Type', 'application/json');
    webpush.setVapidDetails(
        'mailto:daburduroglu@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
    let payload = JSON.stringify({
        "notification":{
            "title":"This is my notification",
            "body":"Your timer is up",
            "icon":"https://www.shareicon.net/data/256x256/2015/10/02/110808_blog_512x512.png",
            "vibrate":[100,50,100],
            "data":{
                "url":"https://the-boss-of-sauce.herokuapp.com"
            }
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