let app = angular.module('BitCoinTrackApp', []);

app.controller('ctrBitCoin', ($scope, $log, $http) => {
   let threshold = 0;
   $scope.priceUSD = '$';
   // call to node to populate database
   $scope.populateDB = () => {
      let query = '/populateDB/';   // build query
      if($scope.keyW == null) { query += "headlines"; }
      else { query += encodeURI($scope.keyW); }
      $scope.queries = $http.get(query).then().catch(err => {});
   };

   $scope.setThreshhold = () => {
      threshold = $scope.threshold;
      $log.info("threshold set: ", threshold);
   }

   let reqloop = setInterval(() => {
      $scope.priceUSD = $http.get('/getBitCoinData')
         .then( response => {
            $log.info(response.data);
            console.log(response.data);
            $scope.priceUSD = response.data
         }

         ).catch(err => { $log.info(err)});
      $log.info($scope.priceUSD);
   }, 60000);

   // call to node to return page with data pullled from mongo
   $scope.displayDB = () => {
      let mongo_route = "/displayDB";
      $scope.news = $http.get(mongo_route).then(response => {
         $scope.news = response.data.articles; // store data in scoped varible
         $scope.queries = response.data.queries;
      }, reason => { // function does not fire log error
         $scope.error = reason.data;
         $log.info(reason);
      });
   };

   // reset db by making request to node which will run mongoose
   $scope.resetDB = () => {
      let mongo_drop = '/resetDB';
      $http.get(mongo_drop).then().catch(err => {});
   };
   let init = () => {
      $scope.priceUSD = $http.get('/getBitCoinData')
         .then( response => {
            $log.info(response.data);
            console.log(response.data);
            $scope.priceUSD = response.data
         }

         ).catch(err => { $log.info(err)});
      $log.info($scope.priceUSD);
   };
   init();
});
