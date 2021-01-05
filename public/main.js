let app = angular.module('BitCoinTrackApp', []);

app.controller('ctrBitCoin', ($scope, $log, $http) => {
   $scope.changes = []
   $scope.bitcoin = {};
   $scope.threshold = 0;
   $scope.previousRate = 1;
   $scope.bitcoin.delta = 0;
   $scope.bitcoin.percent_change = 0;

   let checkRate = () => {
      let first = $scope.changes[0];
      let last = $scope.changes[$scope.changes.length - 1];
      let long_delta = ((last - first) / first) * 100;
      $scope.bitcoin.percent_change = long_delta.toFixed(2);
      if($scope.changes.length >= 10){ $scope.changes.shift() }
      if(long_delta > $scope.threshold){ $log.info('Big changes are afoot ', long_delta, ' ganger this'); }
   }

   let reqloop = setInterval(() => {
      $scope.bitcoin = $http.get('/getBitCoinData')
         .then( response => {
            let priceRay = response.data.rate.split("");
            priceRay.splice(-2,2);
            let price = "$";
            price += priceRay.join("");
            price += ' USD';
            $scope.bitcoin.priceUSD = price;
            $scope.rate = response.data.rate_float;
            $scope.bitcoin.delta = (($scope.rate - $scope.previousRate) / $scope.previousRate) * 100;
            $scope.previousRate = $scope.rate;
            $scope.changes.push($scope.rate);
            checkRate();
            $log.info($scope.bitcoin);
         })
         .catch(err => { $log.info(err)});
   }, 60000);

   let init = () => {
      $scope.bitcoin.priceUSD = $http.get('/getBitCoinData')
      .then( response => {
         let priceRay = response.data.rate.split("");
         priceRay.splice(-2,2);
         let price = "$";
         price += priceRay.join("");
         price += ' USD';
         $scope.bitcoin.priceUSD = price;
         $scope.rate = response.data.rate_float;
         $scope.previousRate = $scope.rate;
         $scope.changes.push($scope.rate);
         $log.info($scope.bitcoin);
      })
      .catch(err => { $log.info(err)});
   };
   init();
});
