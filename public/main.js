let app = angular.module('BitCoinTrackApp', []);

app.controller('ctrBitCoin', ($scope, $log, $http) => {
   $scope.changes = [];
   $scope.change_window = [];
   $scope.bitcoin = {};
   $scope.threshold = 0;
   $scope.timespan = 10;
   $scope.previousRate = 1;
   $scope.bitcoin.delta = 0;
   $scope.bitcoin.percent_change = 0;

   let checkRate = () => {
      let view_window = $scope.changes.length - $scope.timespan;
      $log.info('window', view_window);
      if(view_window < 0){ view_window = 0; }
      $log.info('after check', view_window);
      let first = $scope.changes[view_window];
      let last = $scope.changes[$scope.changes.length - 1];
      let long_delta = ((last - first) / first) * 100;
      $scope.bitcoin.percent_change = long_delta.toFixed(2);
      if(long_delta > $scope.threshold){
         let message = 'ALERT: ' + long_delta.toFixed(2) + '% crossed your ' + $scope.threshold + '% threshold';
         let notif_request = '/sendNotification/'+ encodeURI(message);
         let notif = $http.get(notif_request).then( resp => { $log.info(resp); }).catch();
         $log.info(message);
      }
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
