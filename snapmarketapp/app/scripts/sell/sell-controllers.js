angular.module('sell.controllers', [])
//controller for default state when clicking on sell tab
.controller('SellCameraCtrl', function($rootScope, $scope , $state, Camera) {

  $scope.getPhoto = function() {
    console.log('running on init',Camera.cameraExists());
    //for development if the camera does not exists redirect to a static image
    if(!Camera.cameraExists()){
      $rootScope.lastPhoto='../img/IMG_1379.JPG';
      $state.go('tab.sellCreateListing');
    } else{
      Camera.getPicture().then(function(imageURI) {
        $rootScope.lastPhoto=imageURI;
        $state.go('tab.sellCreateListing');
      }, function(err) {
        console.err(err);
      }, {
        quality: 100,
        sourceType : 1,
        targetWidth: 750,
        targetHeight: 1334,
        saveToPhotoAlbum: true
      });
    }
  };

})

.controller('SellCreateListingCtrl', function($rootScope , $scope , $ionicModal ) {
  $scope.lastPhoto = $rootScope.lastPhoto;

  //this is the newItem for the modal to use. It is set to the tap.

  $scope.newItem = {};

  //array of tagged items will be synced with DB on submit

  $scope.items=[];

  $ionicModal.fromTemplateUrl('templates/sell-tagModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.openModal = function() {
    $scope.modal.show();
  };
  
  $scope.closeModal = function(save) {
    //this is triggered by clicking the x
    if(!save){
      $scope.newItem = {};
    } 
    $scope.modal.hide();
  };

  $scope.$on('modal.hidden', function() {
    //the new tag is empty because modal was exited
    //else
    if($scope.newItem.price && $scope.newItem.text){
      $scope.items.push($scope.newItem);
      $scope.newItem={};
    }
  });


  var headerBarOffset = 44;
  var getTap = function(event){
    var tap = { x:0, y:0 };
    if(event.gesture.touches.length>0){
      tt = event.gesture.touches[0];
      tap.x = tt.clientX || tt.pageX || tt.screenX ||0;
      tap.y = tt.clientY || tt.pageY || tt.screenY ||0;  
    }
    return {x : tap.x , y : tap.y-headerBarOffset};
  }
  $scope.position = function(tap){
    return {position: 'absolute',
            left: tap.x+'px',
            top: tap.y+'px'};
  };


  $scope.addItem = function(){
    var tagTouchRadius = 100;
    var tap = getTap(event);
    var existing = false;
    for(var i = 0; i < $scope.items.length; i++){
      if(Math.sqrt( (tap.x-$scope.items[i].x)*(tap.x-$scope.items[i].x) + (tap.y-$scope.items[i].y)*(tap.y-$scope.items[i].y)) <= tagTouchRadius){
        $scope.newItem = $scope.items.splice(i,1)[0];
        existing=true;
        console.log('ALL items',$scope.items,'EXISTING TAG',$scope.newItem);
      }
    }
    if(!existing){
      $scope.newItem=tap;
    }
    $scope.openModal();
  };
})

.controller('SellTagItemCtrl', function($scope) {})