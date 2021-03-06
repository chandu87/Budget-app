var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calculatePercent = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = (this.value / totalIncome) * 100;
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercent = function() {
    return this.percentage;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculate = function(type) {
    let sum = 0;
    data.allItems[type].forEach(element => {
      sum += element.value;
    });
    data.totals[type] = sum;
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
    budget: 0,
    percent: 0
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
    calculateBudget: function() {
      // calculate total income and expenses
      calculate("exp");
      calculate("inc");
      // calculate total budget
      data.budget = data.totals.inc - data.totals.exp;
      // calculate percentage of change
      if (data.totals.inc > 0) {
        data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percent = -1;
      }
    },
    calculatePercentages: function() {
      data.allItems.exp.forEach(current => {
        current.calculatePercent(data.totals.inc);
      });
    },
    getPercentages: function() {
      let allPercents;
      allPercents = data.allItems.exp.map(current => {
        return current.getPercent();
      });
      return allPercents;
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp,
        percentage: data.percent
      };
    },
    deleteItem: function(type, id) {
      let ids;
      ids = data.allItems[type].map(item => {
        return item.id;
      });
      deleteIdIndex = ids.indexOf(id);
      //console.log(ids);
      //      console.log(deleteIdIndex);
      if (deleteIdIndex !== -1) {
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
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    expensesPercentLabel: ".budget__expenses--percentage",
    containerMain: ".container",
    expensesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };
  function formatNumber(num, type){
    let numSplit, int, dec, sign;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    int = numSplit[0];
    if(int.length > 3){
      int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3,3);
    }
    dec = numSplit[1];
    type === 'exp' ? sign = '-' : sign = '+';

    return sign + ' ' + int + '.' + dec; 

  };
  function nodeListForEach(list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      let html, element;
      //Create HTML text with place holder texts
      if (type == "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type == "exp") {
        element = DOMStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace place holder with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      // Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearInputFields: function() {
      let fields = document.querySelectorAll(
        DOMStrings.inputDescription + "," + DOMStrings.inputValue
      );
      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach(element => {
        element.value = "";
      });
      fieldsArray[0].focus();
    },
    displayBudget: function(obj) {
      let type;
      obj.value >0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent =
        formatNumber(obj.totalIncome, 'inc');
      document.querySelector(DOMStrings.expensesLabel).textContent =
        formatNumber(obj.totalExpenses, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.expensesPercentLabel).textContent =
          obj.percentage.toFixed(1) + "%";
      } else {
        document.querySelector(DOMStrings.expensesPercentLabel).textContent =
          "---";
      }
    },
    deleteListItem: function(deleteItemId) {
      let elem = document.getElementById(deleteItemId);
      elem.parentNode.removeChild(elem);
    },
    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(
        DOMStrings.expensesPercentageLabel
      );
      nodeListForEach(fields, function(element, index) {
        element.textContent = percentages[index].toFixed(1) + "%";
      });
    },
    displayMonth: function(){
      let dateToday, year, month, monthNames;
      monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      dateToday = new Date();
      year = dateToday.getFullYear();
      month = dateToday.getMonth();
      document.querySelector(DOMStrings.dateLabel).textContent = monthNames[month] + ' '+ year;
    },
    changeType: function(){
      let fields;
      fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
      nodeListForEach(fields, function(current){
        current.classList.toggle("red-focus");
      });
      document.querySelector(DOMStrings.inputButton).classList.toggle('red');
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
    document
      .querySelector(DOMStrs.containerMain)
      .addEventListener("click", ctrlDeleteItem);
   document.querySelector(DOMStrs.inputType).addEventListener('change', UICtrl.changeType); 
  };
  let updateBudget = function() {
    //1. caluclate budget
    budgetCtrl.calculateBudget();

    //2. Return the budget
    let budget = budgetCtrl.getBudget();

    //3. update UI
    UIController.displayBudget(budget);
    // console.log("budget", budget);
  };

  let updatePercentages = function() {
    //1. calculate Percentages
    budgetCtrl.calculatePercentages();
    //2. Read Pecentage from budget controller
    let percentages = budgetCtrl.getPercentages();
    // console.log(percentages);
    //3. Update Percentages in UI
    UICtrl.displayPercentages(percentages);
  };

  let ctrlAddItem = function(event) {
    var inputValues, newItem;
    // 1. add field input data
    inputValues = UICtrl.getInput();
    if (
      inputValues.description !== "" &&
      !isNaN(inputValues.value) &&
      inputValues.value > 0
    ) {
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

      //6. calculate Percentages
      updatePercentages();

    }
  };
  let ctrlDeleteItem = function(event) {
    let itemId, itemsArr, type, id;

    //find ItemID ex: inc-0, inc-1
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      itemsArr = itemId.split("-");
      type = itemsArr[0];
      id = parseInt(itemsArr[1]);

      //delete Item form data structure
      budgetCtrl.deleteItem(type, id);

      //Delete Item from UI
      UICtrl.deleteListItem(itemId);

      //Update Budget
      updateBudget();
    }
  };
  return {
    init: function() {
      console.log("Initialization");
      UIController.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpenses: 0,
        percentage: -1
      });
      setupEventListeners();
      //. display year
      UICtrl.displayMonth();

    }
  };
})(budgetController, UIController);

controller.init();
