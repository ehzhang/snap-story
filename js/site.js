angular.module("story", [])
  .controller("storyController",
    function($scope){

      window.s = $scope;

      // Keep the step number
      $scope.step = 0;

      // Store the cart
      $scope.cart = [];

      // Get the foods as json data
      $.getJSON("data/story.json", function(data){
        $scope.bio = data.bio;
        $scope.story = data.story;
        $scope.steps = [data.story[0]];
        $scope.$apply();
      });


      $scope.nextStep = function(){
        $scope.step++;
        $scope.steps.push($scope.story[$scope.step]);
        $("body").animate({ scrollTop: $('body')[0].scrollHeight}, 1000);
      }

      // Calculate the total
      $scope.total = function(){
        return $scope.cart
            .filter(function(item){
              return item.price && item.qty;
            })
            .reduce(function(prev, next){
              prev + (next.price * next.qty);
            }, 0)
      }

    });
