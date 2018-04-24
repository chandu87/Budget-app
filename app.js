var budgetController = (function(){
    return {
    }
})();
var UIController = (function(){
    //UI controller
    let DOMStrings = {
            inputType: '.add__type',
            inputDescription : '.add__description',
            inputValue : '.add__value',
            inputButton : '.add__btn'
    };
    return {
        getInput : function(){
            return {
                type :document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings : function(){
            return DOMStrings;
        }
    }

})();

var controller = (function(budgetCtrl,UICtrl){
    let DOMStrs = UICtrl.getDOMStrings();
    ctrlAddItem = function(event){
        // 1. add field input data
        let inputValues = UICtrl.getInput();
        console.log(inputValues);

        // 2. add item to budget controller
        //3. add item to UI
        //4. caluclate budget
        //5. update UI

    };
    document.querySelector(DOMStrs.inputButton).addEventListener('click',ctrlAddItem);

    document.addEventListener("keypress",function(event){
        if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
        }
    });
})(budgetController,UIController);