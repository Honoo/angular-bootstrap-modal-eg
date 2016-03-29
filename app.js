var modal_app = angular.module('modal_app',[
  //Application dependencies here
])

.controller('ModalController', function($scope){
  $scope.items = [];

  // Update the text displayed when the selected items change
  $scope.updateModalButton = function (){
    angular.element("#modalButton").html($scope.items.length.toString()+" Item(s) Selected");
  }

  // Get previously-selected items from localStorage
  var items = JSON.parse(localStorage.getItem('items'));
  if(typeof items !== 'undefined'){
    for(item in items){
      $scope.items.push(items[item]);
    }
    $scope.updateModalButton();
  }

  // Check items to see if they are already selected
  angular.element(".select-btn").each(function(){
    for(var i = 0; i < $scope.items.length; i++){
      if(this.dataset.id == $scope.items[i].id){
        angular.element(this).find(".select-text").html('Selected');
      }
    }
  });

  $scope.toggleSelection = function($event){
    if(angular.element($event.currentTarget).find(".select-text").html() == 'Not Selected'){
      $scope.addToSelected($event);
    }
    else {
      $scope.removeFromSelected($event);
    }
  }

  $scope.addToSelected = function($event){
    var item = {};
    item.id = $event.currentTarget.dataset.id;

      if(!localStorage['items']){ // User has not stored items before
        items = {};
        items[item.id] = item; // Stored as a key-value pair of ID:ItemObject

        localStorage.setItem('items',angular.toJson(items));
        $scope.items.push(item);
        $scope.updateModalButton();
        angular.element($event.currentTarget).find(".select-text").html('Selected');
      }
      else {
        items = JSON.parse(localStorage.getItem('items'));
        var duplicate = false;

        // If the item has been selected before, don't add it
        for (var oldItem in items){
          if(items[oldItem].id == item.id){
            duplicate = true;
            break;
          }
        }

        if(!duplicate){
          items[item.id] = item;
          localStorage.setItem('items',angular.toJson(items));
          $scope.items.push(item);
          $scope.updateModalButton();
          angular.element($event.currentTarget).find(".select-text").html('Selected');
        }
      }
  };

  $scope.removeFromSelected = function($event){
    localStorage.removeItem('items');
    var item = $event.currentTarget;
    var updatedItems = {};
    var index;
  
    for(var i = 0; i < $scope.items.length; i++){
      if(item.dataset.id != $scope.items[i].id){
        updatedItems[$scope.items[i].id] = $scope.items[i];
      }
      else {
        index = i;
      }
    }

    localStorage.setItem('items',angular.toJson(updatedItems));
    $scope.items.splice(index,1);
    $scope.updateModalButton();

    // Update the items on the page
    angular.element(".select-btn").each(function(){
      if(this.dataset.id == item.dataset.id){
        angular.element(this).find(".select-text").html('Not Selected');
      }
    });
  };
});
