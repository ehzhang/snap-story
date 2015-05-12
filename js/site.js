angular.module("snapSim", [])
  .controller("appController",
    function($scope){

      window.$s = $scope;

      // Get the foods as json data
      $.getJSON("foods.json", function(data){
        $scope.foods = data;
        $scope.$apply();
      });

      // Create a 'family' in scope
      $scope.createFamily = function(){
        $scope.family = createFamily();
      };

      // Reset the family in scope
      $scope.reset = function(){
        $scope.family = null;
        $scope.foods.forEach(function(food){food.qty = null});
        $scope.result = null;
      };

      $scope.moneyRemaining = function (){
        if ($scope.family){
          var total = 0;
          angular.forEach($scope.foods, function(food){
            if (food.qty){
              total += food.qty * food.price;
            }
          });
          return $scope.family.money + $scope.family.snap - total;
        }
      }

      $scope.checkout = function(){
        // Create a result
        if ($scope.moneyRemaining() > 0){
          var foods = $scope.foods.filter(function(food){return food.qty && food.qty > 0});

          var result = scoreFoods($scope.family, foods);

          $scope.result = result;
        } else {
          alert("You don't have enough money!");
        }
      };

      // Given a list of foods, return the results
      function scoreFoods(family, foods){
        // USDA
        var USDA = {
          calories: 2000,
          fat: 65,
          carbohydrates: 300,
          protein: 50
        };

        // Calculate the total amount of nutrients found
        var totals = {
          calories: 0,
          fat: 0,
          carbohydrates: 0,
          protein: 0
        };

        // Aggregate the macronutrients
        foods.forEach(function(food){
          totals.calories += parseFloat(food["calories"]) * food.qty;
          totals.fat += parseFloat(food["total fat"]) * food.qty;
          totals.carbohydrates += parseFloat(food["carbohydrates"]) * food.qty;
          totals.protein += parseFloat(food["protein"]) * food.qty;
        });

        // Add the recommended values, based on the family
        totals.score = 0.0;
        for (k in USDA){
          var recommended = USDA[k] * family.size * 7;
          totals[k + "Recommended"] = recommended;
          totals.score += 25 * Math.abs(totals[k] - recommended)/recommended;
        }

        // Modify the score so that 0 = bad, 100 = good. This may lose information, but it will
        // be more intuitive to the user.
        totals.score = 100 - totals.score;
        totals.score = Math.max(Math.min(totals.score, 100), 0);

        return totals;
      }


      // Return a random roll between 1-6
      function randomDice(){
        return Math.ceil(Math.random() * 6);
      }

      /**
        Create a family (makin' babies and such)

        {
          size: Number
          children: [Number] // Grade
          snap: Number
          money: Number
        }

      **/
      function createFamily(){
        var family = {};

        family.size = randomDice();

        if (family.size > 2){
          family.children = [];
          for (var i = 0; i < family.size - 2; i++){
            family.children.push(randomDice() * 2);
          }
        }

        // How much money you get, dawg?
        family.snap = 30;
        family.money = family.size * ((randomDice() * 10) + 10);
        // Cash rules everything around me

        return family;
      }


    });
