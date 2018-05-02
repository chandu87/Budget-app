var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
  return {
    addItem: function(type, des, val){
      var newItem, ID;
      ID = data.allItems[type][data.allItems[type].length-1].id + 1;
      if(type === 'exp'){
        newItem = new Expense(ID, des, val);
      }else if(type === 'inc'){
        newItem = new Income(ID, des, val)
      }
      data.allItems[type].push(newItem);
      return newItem;
    }
  };
})();
var UIController = (function() {
  //UI controller
  let DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

var controller = (function(budgetCtrl, UICtrl) {
  let setupEventListeners = function() {
    let DOMStrs = UICtrl.getDOMStrings();
    document
      .querySelector(DOMStrs.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  let ctrlAddItem = function(event) {
    // 1. add field input data
    let inputValues = UICtrl.getInput();
    // 2. add item to budget controller
    //3. add item to UI
    //4. caluclate budget
    //5. update UI
  };
  return {
    init: function() {
      console.log("Initialization");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
