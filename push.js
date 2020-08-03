var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BLw3ZTUA_qzSp3fspeYGGZVKxUggSwqSsAz-O1RP_RcnlD9Wljp2uTrrvJmnxtFQKf5vJ4Zd7JLtverJ6jn3g98",
   "privateKey": "R3kb7j_s3DDGJWnJ-Ddii-HRYPhzbRIvoMicbZl297s"
};
 
 
webPush.setVapidDetails(
   'mailto:irhadykw@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/ff4V0M5oZsI:APA91bEtzOLMEa_TdlwRXHWXmjzxe2dVBDhye125PKDECSKj3Y1DI_omray-qTdnZ8NZX6ZoQdrQ5qB1UpmAboeqau2BhzomSMJSHYh0VmiYhyMInqUzpt_37gNgLr1_EV5EnjvcrZ4Z",
   "keys": {
       "p256dh": "BCQD/yE7+t1RQYLvihW6WDI+cv0lGectqC2w6zdIsYn8ifXI1qDF4Ggl1cY9LU9gLtqPrh1HntCz6fOspnwgRI4=",
       "auth": "CiWfdsZqZ+8Ns1FpHa7z/w=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '235129635210',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);