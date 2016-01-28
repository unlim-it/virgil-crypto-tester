(function(angular) {
  'use strict';

var cryptoTester = angular.module('cryptoTester',[]);

cryptoTester.controller('mainCtrl', ['$scope', function($scope) {
    
    $scope.text = '';
    $scope.logs = [];  
    
    var startTime;
    
    var startWatch = function(){
        startTime = performance.now();
    };
    
    var stopWatch = function(){        
        var t = startTime;
        startTime = 0;
        return Math.round(performance.now() - t);
    };
    
    var outputLog = function(log){
        $scope.$apply(function() {
            $scope.logs.push(log);                        
        });
    };    
    
    $scope.startBenchmark = function(){
        
        var Virgil = window.VirgilSDK;
        var virgil = new Virgil('NO_KEYS');
        
        var keyPair;
        var cipherData;
        var signData;
        
        // clear logs before start benchmark
        $scope.logs.length = 0;                
        $scope.logs.push({ desc: "Benchmark started..." }); 
        
        startWatch();
                
        // Key Pair generation
        virgil.crypto.generateKeyPairAsync().then(function(keys){            
            keyPair = keys;
            outputLog({ desc: "Public/Private key pair generation", result: stopWatch() + 'ms' });
            startWatch();
            return virgil.crypto.encryptAsync($scope.text, 'RecipientId', keyPair.publicKey);
        // Encryption
        }).then(function(encryptedData){
            outputLog({ desc: "Encryption", result: stopWatch() + 'ms' });     
            cipherData = encryptedData;
            startWatch();
            return virgil.crypto.signAsync(encryptedData, keyPair.privateKey);
        // Signing           
        }).then(function(signDigest){
            outputLog({ desc: "Signing", result: stopWatch() + 'ms' });            
            signData = signDigest;           
            startWatch();                                
            return virgil.crypto.verifyAsync(cipherData, keyPair.publicKey, signData);
        // Virification 
        }).then(function(isValid){          
            outputLog({ desc: "Verification", result: stopWatch() + 'ms' });     
            startWatch();         
            return virgil.crypto.decryptAsync(cipherData, 'RecipientId', keyPair.privateKey);
        // Decryption  
        }).then(function(decryptedText){      
            outputLog({ desc: "Decryption", result: stopWatch() + 'ms' });
        }).catch(function(ex){
            $scope.error = ex.message;
            alert(ex.message);
        });
    };
}]);

})(window.angular);