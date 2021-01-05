// Martin Paulsen Lab 6
// server file
const express = require('express');
const axios = require('axios');
const app = express();
const notifier = require('node-notifier');
const port = 3000;


// express serve all the static webpages and js files
app.use(express.static('public'));
// server route handler push page to index
app.get('/', (req, res) => { res.sendFile(__dirname + '/public/index.html'); });

app.get('/getBitCoinData', (req,res) => {
   let apicall = 'https://api.coindesk.com/v1/bpi/currentprice.json'
   axios.get(apicall)
      .then(response => {
         let USD = response.data.bpi.USD;
         console.log(USD);
         res.status(200).send(USD);
      })
      .catch(err => {
         res.send(err);
      });
});

app.get('/sendNotification/:message', (req,res) => {
   console.log('Sending notificaiton...');
   // Object
   let message = '' + req.params.message;
   notifier.notify({
     title: 'Bitcoin Tracker',
     message: '' + message
   });
   res.status(200).send('Notifcation sent');
});

// If you ever want to stop it...  clearInterval(requestLoop)

// start server
app.listen(port, () => console.log(`Bitcoin Tracker running on ${port}`));
