// Martin Paulsen Lab 6
// server file
const express = require('express');
const axios = require('axios');
const app = express();
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
         let rate = USD.rate;
         console.log(USD);
         res.status(200).send(rate);
      })
      .catch(err => {
         res.send(err);
      });
});

// If you ever want to stop it...  clearInterval(requestLoop)


// search button was clicked fires get reqest for this page where
// the api call will be made and mongo will be populated
app.get('/populateDB/:keyW', (req, res) => { // :keyW is param passed in by the search bar
   // init variables for api call
   let dateObj = new Date();
   let accessKEY = "apiKey=bd7d9aae4fc84f289ca589f373df4315"
   let apiNews = ''
   let filename = __dirname + "/paulsg-newsapi.json";
   let s_key = req.params.keyW;
   // if user does not search anything get the top headlines
   if (s_key == 'headlines') {
      apiNews = 'http://newsapi.org/v2/top-headlines?' +
         'country=us&' + accessKEY;
   } else { // if user specifies a search term, query with the keyword with current day
      apiNews = 'http://newsapi.org/v2/everything?' +
         'q=' + s_key + '&' +
         'from=' + dateObj + '&' +
         'language=en' + '&' +
         'sortBy=popularity&pageSize=30&' + accessKEY;
   }

   // make api call using axios
   // console.log(apiNews);
   axios.get(apiNews).then(response => {
      let news = response.data;
      // insert query meta data
      mongoose.model('queries').create({query: s_key, totalResults: news.totalResults}, (err,docs) => {});
      // insert articles from search
      mongoose.model('articles').insertMany(news.articles, (err, docs) => {});
   });
   console.log('server msg: Collection populated with query: ' + s_key);
   res.status(200).send('success' );
});


//express recieves request for this page, makes mongo call
// and populate page with data from mongo
app.get('/displayDB', (req, res) => {
   let mongoData = {};
   mongoose.model('articles').find((err, articles) => {
      console.log("server msg: Collection read");
      mongoData.articles = articles;

      mongoose.model('queries').find((err, queries) =>{
         mongoData.queries = queries;
         res.send(mongoData);
      });
   });
});


// route to reset the datbase, the collection is dropped
app.get('/resetDB', (req, res) => {
   // Article.collection.drop();
   db.db.dropCollection('articles', (err, result) => {
      if (err) return console.log(err);
      else console.log("server msg: Collections dropped")
   });
   db.db.dropCollection('queries', (err, result) => {});
   res.status(200).send("Collection dropped");
});

// start server
app.listen(port, () => console.log(`Paulsg - Lab 6 on port ${port}`));
