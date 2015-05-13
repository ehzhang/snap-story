angular.module("story", [])
  .controller("storyController",
    function($scope){

      window.s = $scope;

      window.c = startCheckout;

      // Mount the story onto this
      var mount,
          bio,
          story,
          checkout;

      // Keep the step number
      var step = 0;

      // Snap allocations
      var snap = 86.20;

      // Store the cart
      $scope.cart = [];

      // Get the foods as json data
      $.getJSON("data/story.json", function(data){
        bio = data.bio;
        story = data.story;
        initStory();
      });

      // Get the checkout story
      $.getJSON("data/story_cart_2.json", function(data){
        checkout = data.story;
      });

      $scope.start = function(){
        $scope.started = true;
        // Add the first bit of text.
        addParagraph(story[0].description);
        $scope.choices = story[0].items;
        scrollDown();
      }

      $scope.nextStep = function(){
        clearSelection();

        step++;

        if (step < story.length){
          setStep(step);
        } else {
          startCheckout();
        }
        scrollDown();
      }

      $scope.selectChoice = function(choice){
        $scope.selectedChoice = choice;
        scrollDown();
      }

      $scope.selectOption = function(option){
        selectOption(option);
        scrollDown();
      }

      $scope.removeItem = function(item, i){
        item.qty -= 1;
        if (item.qty == 0){
          $scope.cart.splice(i,1);
        }
      }

      $scope.addToCart = function(choice){
        // If already in cart, increast qty++
        for (var i = 0; i < $scope.cart.length; i++){
          if ($scope.cart[i].name == choice.name){
            $scope.cart[i].qty++;
            // addParagraph("You put another " + choice.name.toLowerCase() + " into your cart.");
            return;
          }
        }
        choice.qty = 1;
        $scope.cart.push(choice);
        // addParagraph("You put " + choice.name.toLowerCase() + " in your cart.")
      }

      // Calculate the total
      $scope.total = function(){
        return $scope.cart
            .filter(function(item){
              return item.price && item.qty;
            })
            .reduce(function(prev, next){
              return prev + next.price * next.qty;
            }, 0);

      }

      $scope.pay = function(){
        $scope.readyToPay = false;
        $scope.options = false;
        addParagraph("You pay for your groceries.");
      }

      $scope.leftover = function(){
        return snap - $scope.total();
      }

      function clearSelection(){
        $scope.selectedChoice = false;
      }

      function setStep(n){
        $scope.choices = false;
        // Selection of steps
        var statements = [
          "You keep moving through the store.",
          "You've still got a lot of shopping to do.",
          "You continue through the store.",
          "You hurry through the store.",
        ];
        addParagraph(statements[n % statements.length]);
        setTimeout(function(){
          addParagraph(story[n].description);
          $scope.choices = story[n].items;
          $scope.$apply();
        }, 2000);
      }

      function scrollDown(){
        $("body").animate({ scrollTop: $('body')[0].scrollHeight}, 3000);
      }

      function initStory(){
        mount = $('#mount');
        introduce();
      }

      function introduce(){
        addParagraph(bio);
      }

      function addParagraph(content){
        var el = ["<p class='animated fadeIn'>", content, "<p>"].join("");
        mount.append(el);
      }

      function startCheckout(){
        $scope.checkout = true;
        addParagraph(checkout.intro.text);
        $scope.options = checkout.intro.options;
      }

      function selectOption(option){
        if (option.section == "paying" && $scope.leftover() >= 0){
          addParagraph("The cashier rings up your groceries, and it looks like " +
            "you're under budget this week. As you pack up the groceries, you begin " +
            "to wonder. Is what you bought enough?");
          $scope.options = [];
        } else {
          addParagraph(checkout[option.section].text);
          $scope.options = checkout[option.section].options;
          if (option.section == "shopping-cart"){
            $scope.cart.forEach(function(item){
              addParagraph(item.qty + " &times; " + item.name + " ($" + item.price.toFixed(2) + " ea)");
            });
            addParagraph("You have $" + snap.toFixed(2));
            $scope.readyToPay = true;
          }
        }
      }

    });
