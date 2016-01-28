(function(angular) {
  'use strict';

var cryptoTester = angular.module('cryptoTester',[]);

cryptoTester.controller('mainCtrl', ['$scope', '$sce', function($scope, $sce) {
    
    $scope.text = '';
    
    $scope.log = function(text){
        $scope.output += $sce.trustAsHtml('<p>' + text + '</p>'); 
    };
    
    $scope.startBenchmark = function(){
        
        var Virgil = window.VirgilSDK;
        var virgil = new Virgil('NO_KEYS');
        
        var keyPair;
        
        $scope.log("Generating key pair...")
        
        virgil.crypto.generateKeyPairAsync().then(function(keys){
            keyPair = keys;
            console.log(keyPair);
            return virgil.crypto.encryptStringToBase64Async($scope.text, 'RecipientId', keyPair.publicKey);
        }).then(function(encryptedText){
            console.log(encryptedText);
            return virgil.crypto.decryptStringFromBase64Async(encryptedText, 'RecipientId', keyPair.privateKey)
        }).then(function(decryptedText){
            console.log(decryptedText);
        });
    };
}]);

})(window.angular);