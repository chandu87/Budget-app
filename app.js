var budgetController = (function(){
    return {
    }
})();
var UIController = (function(){
    //UI controller
})();

var controller = (function(budgetCtrl,UICtrl){

    ctrlAddItem = function(event){
        // 1. add field input data
        // 2. add item to budget controller
        //3. add item to UI
        //4. caluclate budget
        //5. update UI

    };
    document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);

    document.addEventListener("keypress",function(event){
        if(event.keyCode === 97 || event.which === 97){
                ctrlAddItem();
        }
    });
})(budgetController,UIController);