var budgetController = (function(){
    var x = 23;
    var add = function(a){
        return x+a;
    }
    return {
        publicTest : function(b){
                    return add(b);
        }
    }
})();
var UIController = (function(){
    //UI controller
})();

var controller = (function(budgetCtrl,UICtrl){
    // var x = budgetCtrl.publicTest(5);
    return {
        publicController : function(x){
            console.log(budgetCtrl.publicTest(x));
        }
    }

})(budgetController,UIController);