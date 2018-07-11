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
  var calculate = function(type){
    let sum = 0;
    data.allItems[type].forEach(element =>{
      sum += element.value;
    })
    data.totals[type]= sum;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget:0,
    percent:0
  };
  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function(){
      // calculate total income and expenses
      calculate('exp');
      calculate('inc');
      // calculate total budget
      data.budget = data.totals.inc - data.totals.exp;
      // calculate percentage of change
      if(data.totals.inc >0){
      data.percent = Math.round((data.totals.exp/ data.totals.inc) * 100);
    }else{
      data.percent = -1;
    }
    },
    getBudget: function(){
      return {
        budget : data.budget,
        totalIncome : data.totals.inc,
        totalExpenses : data.totals.exp,
        percentage: data.percent
      }
    },
    deleteItem: function(type, id){
      let ids;
      ids = data.allItems[type].map(item =>{
        return item.id;
      });
      deleteIdIndex = ids.indexOf(id);
      //console.log(ids);
//      console.log(deleteIdIndex);
      if(deleteIdIndex !== -1){
      data.allItems[type].splice(deleteIdIndex, 1);
    } 
  //    console.log(data);
    },
    testing: function() {
      console.log(data);
    }
  };
})();
var UIController = (function() {
  //UI controller
  let DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer:".expenses__list",
    budgetLabel:".budget__value",
    incomeLabel:".budget__income--value",
    expensesLabel:".budget__expenses--value",
    expensesPercentLabel:".budget__expenses--percentage",
    containerMain: ".container"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      let html,element;
      //Create HTML text with place holder texts
      if (type == "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type == "exp") {
        element = DOMStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace place holder with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    clearInputFields: function(){
      let fields = document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue);
      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach(element => { element.value = ""; });
      fieldsArray[0].focus();
    },
    displayBudget: function(obj){
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
      document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;
      if(obj.percentage > 0){ 
      document.querySelector(DOMStrings.expensesPercentLabel).textContent = obj.percentage+'%';
    }else{
      document.querySelector(DOMStrings.expensesPercentLabel).textContent = '---';
    }
    },
    deleteListItem: function(){

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
    document.querySelector(DOMStrs.containerMain).addEventListener('click', ctrlDeleteItem);
  };
  let updateBudget = function(){
    //1. caluclate budget
    budgetCtrl.calculateBudget();
  
    //2. Return the budget
    let budget = budgetCtrl.getBudget();

    //3. update UI
    UIController.displayBudget(budget);
    // console.log("budget", budget);   

  };

  let ctrlAddItem = function(event) {
    var inputValues, newItem;
    // 1. add field input data
    inputValues = UICtrl.getInput();
    if(inputValues.description !== "" && !isNaN(inputValues.value) && inputValues.value >0){
    // 2. add item to budget controller
    newItem = budgetCtrl.addItem(
      inputValues.type,
      inputValues.description,
      inputValues.value
    );
    //3. add item to UI
    UICtrl.addListItem(newItem, inputValues.type);
   
    //4. Clear Input fields
    UICtrl.clearInputFields();

    //5. Calculate and Update Budget
    updateBudget();
  }
  };
  let ctrlDeleteItem = function(event){
    let itemId, itemsArr, type, id;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemId){
    
    itemsArr = itemId.split('-');
    type = itemsArr[0];
    id = parseInt(itemsArr[1]); 
    // console.log(type, id);
    budgetCtrl.deleteItem(type, id);
  } 

  };
  return {
    init: function() {
      console.log("Initialization");
      UIController.displayBudget({
        budget : 0,
        totalIncome : 0,
        totalExpenses : 0,
        percentage: -1
      });      
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
