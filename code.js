//
//Global variables
//
var currentUser = "";
var theAmount="";
var paymentTypes=["Utilities Bill","House Payment","Insurance Bill","Water","Trash","Car Payment","Cell/TV/Wifi","Gasoline","Groceries","Misc."];
var depositTypes=["Payroll","PersonalCheck","Misc"];
var maxTransactionValue=1000;

var enterPassword1="";
var enterPassword2="";
var passwordHiddenCharacters1="";
var passwordHiddenCharacters2="";
var passwordLength1=0;
var passwordLength2=0;
var t;
var threeMinutes=180000;


//
//startup function call
//
emptyAllTextBoxes();





//
//Welcome Screen
//
onEvent("createAccountButton", "click", function(event) {
  console.log("createAccountButton clicked!");
  setText("welcomePagePopup","");
  hideElement("welcomePagePopup");
  setText("createAccountFailPopup","");
  hideElement("createAccountFailPopup");
  setScreen("createAccountScreen");
  
  enterPassword1="";
  enterPassword2="";
  passwordHiddenCharacters1="";
  passwordHiddenCharacters2="";
  passwordLength1="";
  passwordLength2="";
  
});

onEvent("loginButton", "click", function(event) {
  console.log("loginButton clicked!");
  setText("successFail","");
  hideElement("successFail");
  setText("welcomePagePopup","");
  hideElement("welcomePagePopup");
  setScreen("loginScreen");
  
  enterPassword1="";
  enterPassword2="";
  passwordHiddenCharacters1="";
  passwordHiddenCharacters2="";
  passwordLength1="";
  passwordLength2="";
  
});

//
//Create Account Screen
//
onEvent("createAcctButton", "click", function(event) {
  console.log("createAcctButton clicked!");
  setText("createAccountFailPopup","");
  hideElement("createAccountFailPopup");
  var username1 = getText("usernameIn1");
  var username2 = getText("usernameIn2");
  var password1 = enterPassword1;
  var password2 = enterPassword2;
  
  //checks to see if account already exists. 
  
  if (password1===password2){
    console.log("passwords match");
    if(username1===username2){
      console.log("usernames match");
      if(username2.length>5&&password2.length>5){
        console.log("both user and password are greater than 5");
        if(checkForSpaces(username2)==false&&checkForSpaces(password2)==false){
          console.log("both username a password do not have spaces");
          //add check step to see if username already exists. 
          var usernameExists=false;
          
          readRecords("members info", {}, function(records) {
            for (var i =0; i < records.length; i++) {
              if(records[i].username==username2){
                usernameExists=true;
                console.log("usernameExists: "+usernameExists);
                console.log("That username already exists");
              }
            }
            if (usernameExists==false){
            //it worked create record  
              var membersInfo ={};
              membersInfo.username=username1;
              membersInfo.password=password1;
              membersInfo.admin=false;
              createRecord("members info", {username: membersInfo.username,password: membersInfo.password,admin: membersInfo.admin, currentBalance: 0}, function(record) {
                console.log("Acount created for: "+membersInfo.username);
              });
              setText("welcomePagePopup","Account created! Please login.");
              showElement("welcomePagePopup");
              setScreen("welcomePage");
              
            }else{
              console.log("username already exists");
              //it didn't work error message for username already existing
              showElement("createAccountFailPopup");
              setText("createAccountFailPopup","Whoops! That username already exists, please try another username.  If you forgot your password please contact Mr. Baker.");
            }
          });
        }else{
          console.log("username or password has spaces");
          //it didn't work error message for spaces
          showElement("createAccountFailPopup");
          setText("createAccountFailPopup","Username or password are not allowed to contain a space.");
        }
      }else{
        console.log("username or password are less than 5 characters");
        //it didn't work error message for 5 or less characters
        showElement("createAccountFailPopup");
        setText("createAccountFailPopup","Username or password wasn't greater than 5 characters.");
      }
    }else{
      console.log("usernames don't match");
      //it didn't work error message for usernames not matching
      setText("createAccountFailPopup","Usernames don't match!");
      showElement("createAccountFailPopup");
    }
  } else{
    console.log("passwords don't match");
    //it didn't work error message for passwords not matching
      setText("createAccountFailPopup","Passwords don't match!");
      showElement("createAccountFailPopup");
  }
  enterPassword1="";
  enterPassword2="";
});

onEvent("createBackButton", "click", function(event) {
  console.log("createBackButton clicked!");
  setText("createAccountFailPopup","");
  hideElement("createAccountFailPopup");
  setScreen("welcomePage");
});

//
//Login screen
//
onEvent("loginSubmitButton", "click", function(event) {
  console.log("loginSubmitButton clicked!");
  var getUsername=getText("enterYourUsername");
  var pass =enterPassword1;
  
  
  readRecords("members info", {username:getUsername}, function(records) {
      console.log(records[0]);
      console.log("the length of records is "+records.length);
      if (records.length>0) {
        if(records[0].username===getUsername){
          console.log("Username matched a username on file");
          console.log("the password entered was: "+enterPassword1);
          if(records[0].password===pass){
            console.log("Password match the password on file");
            currentUser = getUsername;
            setText("welcomeMessage","Welcome \n"+currentUser);
            setText("balanceDescription","");
            if(records[0].admin==true){
              showElement("adminPageButton");
              countPendingDeposits();
            }else{
              hideElement("adminPageButton");
            }
            setScreen("homeScreen");
            setATimeout(threeMinutes);
            
          }
        }
        setText("successFail","Something didn't work. Try again!");
        showElement("successFail");
      }else {
        setText("successFail","Something didn't work. Try again!");
        showElement("successFail");
      } 
      
  });
});

onEvent("loginBackButton", "click", function(event) {
  console.log("loginBackButton clicked!");
  endATimeout(t);
  setScreen("welcomePage");
});

onEvent("passwordIn", "input", function(event) {
  
  passwordHiddenCharacters1="";
  var input = getText("passwordIn");
  console.log("input length: "+input.length);
  for(var i =0;i<input.length;i++){
      passwordHiddenCharacters1+="*";
    }
  if(passwordLength1<input.length){
    enterPassword1+=input.substring(passwordLength1,input.length); 
  }else if(passwordLength1>input.length){
    enterPassword1=enterPassword1.substring(0,input.length);
  }
  setText("passwordIn",passwordHiddenCharacters1);
  //console.log(JSON.stringify(event));
  //console.log(event.selectionStart);
  console.log("the password is: "+enterPassword1);
  console.log("the hidden password is: "+passwordHiddenCharacters1);
  passwordLength1=event.selectionStart;
  console.log("password length at end: "+passwordLength1);
});

onEvent("passwordIn2", "input", function(event) {
  
  passwordHiddenCharacters2="";
  var input = getText("passwordIn2");
  console.log("input length: "+input.length);
  for(var i =0;i<input.length;i++){
      passwordHiddenCharacters2+="*";
  }
  if(passwordLength2<input.length){
    enterPassword2+=input.substring(passwordLength2,input.length);  
  }else if(passwordLength2>input.length){
    enterPassword2=enterPassword2.substring(0,input.length);
  }
  setText("passwordIn2",passwordHiddenCharacters2);
  //console.log(JSON.stringify(event));
  //console.log(event.selectionStart);
  console.log("the password is: "+enterPassword2);
  console.log("the hidden password is: "+passwordHiddenCharacters2);
  passwordLength2=event.selectionStart;
  console.log("password length at end: "+passwordLength2);
});

onEvent("passInbox", "input", function(event) {
  
  passwordHiddenCharacters1="";
  var input = getText("passInbox");
  console.log("input length: "+input.length);
  for(var i =0;i<input.length;i++){
      passwordHiddenCharacters1+="*";
  }
  
  if(passwordLength1<input.length){
    enterPassword1+=input.substring(passwordLength1,input.length); 
  }else if(passwordLength1>input.length){
    enterPassword1=enterPassword1.substring(0,input.length);
  }
  
  
  setText("passInbox",passwordHiddenCharacters1);
  //console.log(JSON.stringify(event));
  //console.log(event.selectionStart);
  console.log("the password is: "+enterPassword1);
  console.log("the hidden password is: "+passwordHiddenCharacters1);
  passwordLength1=event.selectionStart;
  console.log("password length at end: "+passwordLength1);
});

//
//Home Screen
//
onEvent("adminPageButton", "click", function(event) {
  console.log("adminPageButton clicked!");
  
  setText("homeScreenSuccessMessageBox","");
  hideElement("homeScreenSuccessMessageBox");
  
  setScreen("adminPage");
  endATimeout(t);
});

onEvent("logoutButton", "click", function(event) {
  
  console.log("logoutButton clicked!");
  currentUser="";
  
  setText("homeScreenSuccessMessageBox","");
  hideElement("homeScreenSuccessMessageBox");
  
  //empties all text boxes
  emptyAllTextBoxes();
  endATimeout(t);
  setScreen("welcomePage");
});

onEvent("makeapayment", "click", function(event) {
  console.log("makeapayment clicked!");
  setPaymentDropdown("paymentDropdown");
  setText("homeScreenSuccessMessageBox","");
  hideElement("homeScreenSuccessMessageBox");
  
  endATimeout(t);
  setATimeout(threeMinutes);
  setScreen("paymentScreen");
  
});

onEvent("makeadeposit", "click", function(event) {
  console.log("makeadeposit clicked!");
  setDepositDropdown("depositDropdown");
  
  setText("homeScreenSuccessMessageBox","");
  hideElement("homeScreenSuccessMessageBox");
  
  endATimeout(t);
  setATimeout(threeMinutes);
  setScreen("depositScreen");
  
});

onEvent("checkbalance", "click", function(event) {
  console.log("checkbalance clicked!");
  
  setText("homeScreenSuccessMessageBox","");
  hideElement("homeScreenSuccessMessageBox");
  
  endATimeout(t);
  setATimeout(threeMinutes);
  setScreen("balanceScreen");
  displayData();
  
});

//
//Payment Screen
//
onEvent("paymentIn", "click", function(event) {
  console.log("paymentIn clicked!");
  var user = currentUser;
  var timestamp = getTime();
  var description=getText("paymentDropdown");
  var type = "Withdraw";
  var amount=0;
  
  if(isNaN(getNumber("amountIn"))){
    console.log("Value wasn't entered and defaulted to 0");
  }else{
    amount=-1*getNumber("amountIn");
  }
  
  //count bills
  var billCount = 0;
  var billEnteredNum = 1;
  var billDueDate=0;
  readRecords("billList", {Description:description}, function(records) {
    for (var i =0; i < records.length; i++) {
      billCount++;
    }
    billDueDate=records[records.length-1].dueDate;
    console.log("Bill Due Date: "+billDueDate);
    readRecords("BankingData", {Description:description,User:user}, function(records) {
      for (var i =0; i < records.length; i++) {
      billEnteredNum++;
      }
      console.log("Bill Count: "+billCount);
      console.log("Bill Entered Num: "+billEnteredNum);
      
      if(billCount===billEnteredNum){
        //right bill number still could be late
        if(getTime()<billDueDate){
            //bill is on time and the right number
            //create record
            createRecord("BankingData", {User: user, DateStamp: timestamp,Description: description,Type: type,Amount: amount}, function(record) {
              updateCurrentBalance(user,amount,description);
              setText("homeScreenSuccessMessageBox","Payment complete");
              showElement("homeScreenSuccessMessageBox");
              
              endATimeout(t);
              setATimeout(threeMinutes);
              setScreen("homeScreen");
            });
        }else{
            //fee (error message: the bill was late)
            createRecord("BankingData", {User: user, DateStamp: getTime(),Description: "Fee(Late Bill)",Type: "Withdraw",Amount: -13}, function(record) {
              updateCurrentBalance(user,-13,description);
            });
            
          }
      }else if (billEnteredNum<billCount){
        //its late
        createRecord("BankingData", {User: user, DateStamp: timestamp,Description: description,Type: type,Amount: amount}, function(record) {
              updateCurrentBalance(user,amount,description);
              setText("homeScreenSuccessMessageBox","Payment complete");
              showElement("homeScreenSuccessMessageBox");
              
              createRecord("BankingData", {User: user, DateStamp: getTime(),Description: "Fee(Late Bill)",Type: "Withdraw",Amount: -13}, function(record) {
                updateCurrentBalance(user,-13,description);
              });
              
              endATimeout(t);
              setATimeout(threeMinutes);
              setScreen("homeScreen");
            });
      }else{
        //its early (add some error message, that it can't be paid early)
        endATimeout(t);
        setATimeout(threeMinutes);
        setScreen("homeScreen");
        showElement("homeScreenSuccessMessageBox");
        setText("homeScreenSuccessMessageBox","At this time we do not take payments before they are assigned.\nPayment declined");
      }
    });
  });
});

onEvent("paymentScreenBackButton", "click", function(event) {
  console.log("paymentScreenBackButton clicked!");
  endATimeout(t);
  setATimeout(threeMinutes);
  setScreen("homeScreen");
  
});
  
onEvent("amountIn", "input", function(event) {
  var inputValue = getText("amountIn");
  if(validateCurrency(inputValue)===false){
    inputValue=inputValue.substring(0,(event.selectionStart-1));
    setText("amountIn",inputValue);
  }else{
    var theNumber = parseFloat(inputValue);
    if(theNumber>maxTransactionValue){
      inputValue=inputValue.substring(0,(event.selectionStart-1));
      setText("amountIn",inputValue);
    }
  }
});

//
//deposit screen
//
onEvent("depositBackButton", "click", function(event) {
  console.log("depositBackButton clicked!");
  endATimeout(t);
  setATimeout(threeMinutes);
  setScreen("homeScreen");
  
});

onEvent("depositSubmitButton", "click", function(event) {
  console.log("depositSubmitButton clicked!");
  
  var user = currentUser;
  var timestamp = getTime();
  var description=getText("depositDropdown");
  var type = "Deposit";
  var amount=0;
  
  
  
  if(isNaN(getNumber("depositAmountInBox"))){
    console.log("Value wasn't entered and defaulted to 0");
  }else{
    amount = getNumber("depositAmountInBox");
    
  }
  
  
  createRecord("pendingDeposits", {User: user, DateStamp: timestamp,Description: description,Type: type,Amount: amount}, function(record) {
    console.log("I'm executed after the record has been created.");
    console.log("Record id: " + record.id + " created!");
    
  });
  
  
  //success message
  setText("homeScreenSuccessMessageBox","Deposit complete");
  showElement("homeScreenSuccessMessageBox");
  endATimeout(t);
  setATimeout(threeMinutes);
  setScreen("homeScreen");
  
});
  
onEvent("depositAmountInBox", "input", function(event) {
  var inputValue = getText("depositAmountInBox");
  //This validates the currency 
  if(validateCurrency(inputValue)===false){
    inputValue=inputValue.substring(0,(event.selectionStart-1));
    setText("depositAmountInBox",inputValue);
  }else{
    var theNumber = parseFloat(inputValue);
    if(theNumber>maxTransactionValue){
      inputValue=inputValue.substring(0,(event.selectionStart-1));
      setText("depositAmountInBox",inputValue);
    }
  }
});
//
//check Balance Screen
//
onEvent("balanceScreenBackButton", "click", function(event) {
  console.log("balanceScreenBackButton clicked!");
  endATimeout(t);
  setATimeout(threeMinutes);
  setScreen("homeScreen");
});



//
//admin page
//
onEvent("adminBackButton", "click", function(event) {
  console.log("adminBackButton clicked!");
  
  setScreen("homeScreen");
  setATimeout(threeMinutes);
});
  //goes to admin page 2
onEvent("adminPage2Button", "click", function(event) {
  console.log("adminPage2Button clicked!");
  setScreen("adminPage2");
});
  //goes to admin page 3
onEvent("goToAdmin3PageButton", "click", function(event) {
  console.log("negativeBalanceButton clicked!");
  setScreen("adminPage3");
});
  //goes to admin page 4
onEvent("goToAdminPage4Button", "click", function(event) {
  console.log("goToAdminPage4Button clicked!");
  
  setUsernamesDropdown("adminPage4UsernameDropdown");
  setPaymentDropdown("adminPage4DescriptionDropdown");
  setScreen("adminPage4");
  
});
  //goes to admin page 5
onEvent("addBillButton", "click", function(event) {
  console.log("addBillButton clicked!");
  
  //populate dropdown menu
  setPaymentDropdown("descriptionDropdown");
  
  //populate billsList
  readRecords("billList", {}, function(records) {
    var theDisplay="";
    for (var i =0; i < records.length; i++) {
      theDisplay+=records[i].Description.substring(0,9)+" $"+ records[i].amount+" Due: "+timeConverter(records[i].dueDate).substring(0,6)+"\n";
    }
    setText("billsList",theDisplay);
  });
  
  
  setScreen("adminPage5");
});
  //goes to admin page 6
onEvent("deleteARecordButton", "click", function( ) {
	console.log("deleteARecordButton clicked!");
	setUsernamesDropdown("usernamesDropdownP6");
	setScreen("adminPage6");
});

//
//admin page2
//
onEvent("adminPage2BackButton", "click", function(event) {
  console.log("adminPage2BackButton clicked!");
  setScreen("adminPage");
  setText("adminPage2Display","");
  setText("currentBalanceDisplay","");
  setText("usernamesDropdown","Pick user...");
  
});

onEvent("adminPage2Button", "click", function(event) {
  console.log("adminPage2Button clicked!");
  
  setUsernamesDropdown("usernamesDropdown");
  
  setScreen("adminPage2");
  
});

onEvent("usernamesDropdown", "change", function(event) {
  console.log("Selected option: " + getText("usernamesDropdown"));
  //read records
  var theUser=getText("usernamesDropdown");
  var theDescription="";
  readRecords("BankingData", {User:theUser}, function(records) {
      console.log("trying to display records");
      if (records.length>0) {
        for (var i =0; i < records.length; i++) {
          var theTime;
          if(isNaN(records[i].dateStamp)){
              theTime = timeConverter(records[i].DateStamp);
          }else{
            theTime = records[i].dateStamp;
          }
          theDescription+=records[i].id+" "+theTime+" "+records[i].Description+" $"+records[i].Amount+"\n";
        }
        readRecords("members info", {username:theUser}, function(records) {
          setText("currentBalanceDisplay",records[0].currentBalance);
        });
      }
        else {
            console.log("length was not greater than 0 ");
       }      
    console.log("setting the display");
    setText("adminPage2Display",theDescription);
    
  });
});

onEvent("updateRecordButton", "click", function(event) {
  console.log("updateRecordButton clicked!");
  
  var oldAmount=0;
  
  readRecords("BankingData", {id:getNumber("updateId")}, function(records) {
    oldAmount=records[0].Amount;
  });
  
  updateRecord("BankingData", {id:getNumber("updateId"), User:getText("updateUser"),DateStamp: getNumber("updateDateStamp"), Description: getText("updateDescription"), Type: getText("updateType"), Amount: getNumber("updateAmount")}, function(record, success) {
    if(success){
      console.log("Yep it worked!");
      
      var difference = getNumber("updateAmount")-oldAmount;
      
      updateCurrentBalance(getText("updateUser"),difference,getText("updateDescription"));
    }else{
      console.log("it didn't work");
    }
  });
});

onEvent("lookUpById", "click", function(event) {
  console.log("lookUpById clicked!");
  
  var currentId = Number(getText("updateId"));
  console.log(currentId);
  readRecords("BankingData", {id:currentId}, function(records) {
    var theUser="";
    var theDateStamp="";
    var theDescription="";
    var theType="";
    
    for (var i =0; i < records.length; i++) {
      console.log(records[i].id + ': ' + records[i].User+' '+records[i].Description+' '+records[i].Type+' '+records[i].Amount);
      theUser=records[i].User;
      theDateStamp=records[i].DateStamp;
      theDescription=records[i].Description;
      theType=records[i].Type;
      theAmount=records[i].Amount;
    }
    setText("updateUser",theUser);
    setText("updateDateStamp",theDateStamp);
    setText("updateDescription",theDescription);
    setText("updateType",theType);
    setText("updateAmount",theAmount);
  });
});

//
//Admin Page 3
//

/*
onEvent("adminPage3BackButton", "click", function(event) {
  console.log("adminPage3BackButton clicked!");
  setScreen("adminPage");
  
});

onEvent("check4NegativeBalanceButton", "click", function(event) {
  console.log("check4NegativeBalanceButton clicked!");
  readRecords("members info", {}, function(records) {
    var theDisplay="Current negative balances \n";
    for (var i =0; i < records.length; i++) {
      console.log(records[i]);
      if(records[i].currentBalance<0){
        theDisplay+=records[i].username+"\n";
        console.log(records[i].username);
      }
    }
    setText("adminPage3Display",theDisplay);
  });
});

onEvent("Check4BalancesBelow0", "click", function(event) {
  console.log("Check4BalancesBelow0 clicked!");
  
  readRecords("errors", {}, function(records) {
    var theDisplay="";
    if(records.length>0){
      for (var i =0; i < records.length; i++) {
        console.log(records[i]);
        //console.log("username: "+ records[i].username + "dateStamp: " + records[i].dateStamp+" transactionId "+ records[i].transactionId+ " transactionName "+records[i].transactionName);
        theDisplay+=(i+1)+".) "+records[i].username+"\n Went below 0 on "+records[i].dateStamp.substring(0,5)+"\n Banking ID: "+records[i].transactionId+"\n For " + records[i].transactionName+"\n";
      }
      setText("adminPage3Display",theDisplay);
    }else{
      console.log("No records to read");
    }
  });
});
*/

//
//Admin Page 4: Input checks
//
onEvent("adminPage4BackButton", "click", function(event) {
  console.log("adminPage4BackButton clicked!");
  setScreen("adminPage");
  
  setText("adminPage4SuccessMessageText","");
  hideElement("adminPage4SuccessMessageText");
});

onEvent("paymentDepositDropdown", "change", function( ) {
	console.log("Selected option: " + getText("paymentDepositDropdown"));
	if(getProperty("adminPage4DescriptionDropdown","text")=="Payment"){
	  setPaymentDropdown("adminPage4DescriptionDropdown");
	}else{
	  setDepositDropdown("adminPage4DescriptionDropdown");
	}
});

onEvent("paymentDepositDropdown", "change", function(event) {
  console.log("Selected option: " + getText("paymentDepositDropdown"));
  if(getText("paymentDepositDropdown")=="Payment"){
    setPaymentDropdown("adminPage4DescriptionDropdown");
  }else{
    setDepositDropdown("adminPage4DescriptionDropdown");
  }
});

onEvent("adminPage4SubmitButton", "click", function(event) {
  console.log("adminPage4SubmitButton clicked!");
  //collect information and put in data table and
  var user=getText("adminPage4UsernameDropdown");
  var date=timeConverter(getTime());
  var type=getText("paymentDepositDropdown");
  var description=getText("adminPage4DescriptionDropdown");
  var amount=getNumber("admingPage4AmountInputBox");
  
  if(type=="Payment"){
    amount*=-1;
  }
  createRecord("BankingData", {User:user,DateStamp:date,Description:description,Type:type,Amount:amount}, function(record) {
    console.log("I'm executed after the record has been created.");
    console.log("Record id: " + record.id + " created!");
  
  
    setText("adminPage4SuccessMessageText","Check successfully input!");
    showElement("adminPage4SuccessMessageText");
    setProperty("admingPage4AmountInputBox","text","");
  });
  
  updateCurrentBalance(user,amount,description);
  
  
});

onEvent("admingPage4AmountInputBox","input", function(event){
  var inputValue = getText("admingPage4AmountInputBox");
  if(validateCurrency(inputValue)===false){
    inputValue=inputValue.substring(0,(event.selectionStart-1));
    setText("admingPage4AmountInputBox",inputValue);
  }else{
    var theNumber = parseFloat(inputValue);
    if(theNumber>maxTransactionValue){
      inputValue=inputValue.substring(0,(event.selectionStart-1));
      setText("admingPage4AmountInputBox",inputValue);
    }
  }   
});

//
//Admin Page 5: Input Bills
//


onEvent("adminPage5BackBtn", "click", function(event) {
  console.log("adminPage5BackBtn clicked!");
  setScreen("adminPage")
});

onEvent("billEnterButton", "click", function(event) {
  console.log("billEnterButton clicked!");
  
  var month = getText("monthDropdown");
  var year = getText("yearDropdown");
  var date = getNumber("dayDropdown");
  var hour = 1;
  var min = 0;
  var sec = 0;

  var startDate = toTimestamp(year,monthToNumber(month),date,hour,min,sec);
  //console.log("StartDate number: "+startDate);
  var endDate = (startDate+(8*86400*1000)-1);
  
  createRecord("billList", {assignDate:startDate,dueDate:endDate,Description:getText("descriptionDropdown"),amount:getNumber("billAmountTextbox"),AssignDate:timeConverter(startDate) ,DueDate:timeConverter(endDate)}, function(record) {
    console.log("Bill added: "+getText("descriptionDropdown"));
    console.log("Start Date: "+timeConverter(startDate));
    console.log("End Date: "+timeConverter(endDate));
    console.log("Amount: "+getNumber("billAmountTextbox"));
    var description = "";
    
    readRecords("billList", {}, function(records) {
      for (var i =0; i < records.length; i++) {
        description = description +records[i].Description+" Due: "+timeConverter(records[i].dueDate).substring(0,10)+"\n";
      }
      setText("billsList",description);
    });
  });
});

onEvent("billAmountTextbox", "input", function(event) {
  console.log("billAmountTextbox current text: " + getText("billAmountTextbox"));
  //make sure that a money value is put in here
  
});

//
//timeout screen
//
onEvent("restartButton", "click", function(event) {
  console.log("restartButton clicked!");
  setScreen("welcomePage");
});


//
//Admin Page 6 Delete Records
//


onEvent("adminPage6BackButton", "click", function( ) {
	console.log("adminPage6BackButton clicked!");
	setScreen("adminPage");
	setProperty("recordIdDropdown","options",[]);
	setText("adminPage6TextBox","");
	setProperty("usernamesDropdownP6","options",[]);
	setText("currentBalanceDisplay2","");
});

onEvent("usernamesDropdownP6", "change", function( ) {
	console.log("Selected option: " + getText("usernamesDropdownP6"));
	var theUser=getText("usernamesDropdownP6");
  var theDescription="";
  readRecords("BankingData", {User:theUser}, function(records) {
      console.log("trying to display records");
      var listOfIds = [];
      if (records.length>0) {
           for (var i =0; i < records.length; i++) {
              var theTime;
              if(isNaN(records[i].dateStamp)){
                theTime = timeConverter(records[i].DateStamp);
              }else{
                theTime = records[i].dateStamp;
              }
              theDescription+=records[i].id+" "+theTime+" "+records[i].Description+" $"+records[i].Amount+"\n";
              listOfIds.push(records[i].id);
             
           }
      }
        else {
            console.log("length was not greater than 0 ");
       }      
    console.log("setting the display");
    setText("adminPage6TextBox",theDescription);
    setProperty("recordIdDropdown","options",listOfIds);
    //when the usernames dropdown gets set. set this dropdown with a list of ids that can be deleted
    //remember to change the delete function to grab the number from the new id of record ID dropdown
    readRecords("members info", {username:theUser}, function(records) {
      setText("currentBalanceDisplay2",records[0].currentBalance);
    });
  });
});
onEvent("deleteRecordButton", "click", function( ) {
	console.log("deleteRecordButton clicked!");
	var theID = getNumber("recordIdDropdown");
	console.log(theID);
	var deleteThisAmount=0;
  var aDescription="";
  var theUser=getText("usernamesDropdownP6");
  console.log("The User: "+theUser);
  var currentBal = 0;
  
  readRecords("BankingData", {id:theID}, function(records) {
    
    deleteThisAmount=records[0].Amount;
    deleteThisAmount*=-1;
    console.log("Delete this amount: "+records[0].Amount);
    aDescription=records[0].Description;
    
    theUser = records[0].User;
    
    updateCurrentBalance(theUser,deleteThisAmount,aDescription);
  
  
    deleteRecord("BankingData", {id:theID}, function(success) {
	     console.log(success);
	     //resets the Admin Page 6 Text Box after the item gets deleted. 
      var theDescription="";
      var listOfIds = [];
      readRecords("BankingData", {User:theUser}, function(records) {
        console.log("trying to display records");
        if (records.length>0) {
          for (var i =0; i < records.length; i++) {
            var theTime;
            if(isNaN(records[i].dateStamp)){
              theTime = timeConverter(records[i].DateStamp);
            }else{
              theTime = records[i].dateStamp;
            }
            theDescription+=records[i].id+" "+theTime+" "+records[i].Description+" $"+records[i].Amount+"\n";
            listOfIds.push(records[i].id);
          }
        }else {
          console.log("length was not greater than 0 ");
        }      
        console.log("setting the display");
        setText("adminPage6TextBox",theDescription);
        setProperty("recordIdDropdown","options",listOfIds);
        readRecords("members info", {username:theUser}, function(records) {
          setText("currentBalanceDisplay2",records[0].currentBalance);
        });
      });
	  });
  });
});

//
//admin Page 7 Button
//

onEvent("goToApproveBillsPage", "click", function( ) {
	console.log("goToApproveBillsPage clicked!");
	setScreen("adminPage7");
	setPendingDepositsDropdown();
});

onEvent("adminPage7BackButton", "click", function( ) {
	console.log("adminPage7BackButton clicked!");
	countPendingDeposits();
	setScreen("adminPage");
});
onEvent("depositCountDropbox", "change", function( ) {
	console.log("Selected option: " + getText("depositCountDropbox"));
	var theId = Number(getText("depositCountDropbox"));
	var theDisplay = "";
	readRecords("pendingDeposits", {id:theId}, function(records) {
	  theDisplay+=records[0].id+" "+records[0].User+" made a  Deposit\n of $"+records[0].Amount+
	    " on "+timeConverter(records[0].DateStamp);
	  console.log("should display "+theDisplay);
	  setText("depositApprovalBox",theDisplay);
	});
	
});
onEvent("approvePaymentButton", "click", function( ) {
	console.log("approvePaymentButton clicked!");
	var theID = Number(getText("depositCountDropbox"))
	var user = "";
  var timeStamp = 0;
  var description="";
  var type = "Deposit";
  var amount=0;
  //create record in banking Data
	readRecords("pendingDeposits", {id:theID}, function(records) {
	  user=records[0].User;
	  timeStamp=records[0].DateStamp;
	  description=records[0].Description;
    amount=records[0].Amount;
    createRecord("BankingData", {User:user,DateStamp:timeStamp,Description:description,Type:type,Amount:amount}, function(record) {
       //update amount function call
	    updateCurrentBalance(user,amount,description);
	    //delete record in pendingDeposits
    });
	});
	
	deleteRecord("pendingDeposits", {id:theID}, function(success) {
	  if (success) {
      console.log("Record deleted with id:" + theID);
      setText("depositApprovalBox","");
      setPendingDepositsDropdown();
    }else {
      console.log("No record to delete with id:" + theID);
    }      
	 });
});


onEvent("declineDepositButton", "click", function( ) {
	console.log("declineDepositButton clicked!");
	var theID = Number(getText("depositCountDropbox"));
	var user = "";
  var timeStamp = 0;
  var description="";
  var type = "Notification";
  var amount=0;
  //create record in banking Data
	readRecords("pendingDeposits", {id:theID}, function(records) {
	  user=records[0].User;
	  timeStamp=records[0].DateStamp;
	  description="Deposit of $"+records[0].Amount+" declined";
    createRecord("BankingData", {User:user,DateStamp:timeStamp,Description:description,Type:type,Amount:amount}, function(record) {
      
    });
	});
	
	deleteRecord("pendingDeposits", {id:theID}, function(success) {
	  if (success) {
      console.log("Record deleted with id:" + theID);
      setText("depositApprovalBox","");
      setPendingDepositsDropdown();
    }else {
      console.log("No record to delete with id:" + theID);
    }      
	      
	 });
});

//
//adminPage8 Counts bills and determines if people have paid the right amounts. 
//

onEvent("billCounterButton", "click", function( ) {
	console.log("billCounterButton clicked!");
	setScreen("adminPage8");
	setUsernamesDropdown("usernamesListAP8");
	//counts the number of bills
	//sets the display of billCounterTextBox
	var utili = 0;
	var house = 0;
	var insur = 0;
	var water = 0;
	var trash = 0;
	var car = 0;
	var ceTvW = 0;
	var gasol = 0;
	var groce = 0;
	var misc  = 0;
	readRecords("billList", {}, function(records) {
	  var now = getTime();
	  for (var i =0; i < records.length; i++) {
	    if(records[i].dueDate<now){
	      if(records[i].Description=="Utilities Bill"){
	        utili++;
	      }else if(records[i].Description=="House Payment"){
	        house++;
	      }else if(records[i].Description=="Insurance Bill"){
	        insur++;
  	    }else if(records[i].Description=="Water"){
  	      water++;
  	    }else if(records[i].Description=="Trash"){
  	      trash++;
  	    }else if(records[i].Description=="Car Payment"){
  	      car++;
  	    }else if(records[i].Description=="Cell/TV/Wifi"){
  	      ceTvW++;
  	    }else if(records[i].Description=="Gasoline"){
  	      gasol++;
  	    }else if(records[i].Description=="Groceries"){
  	      groce++;
  	    }else if(records[i].Description=="Misc."){
  	      misc++;
	    }
	    }
	    setText("billCounterTextBox","Utili: "+utili+"\nHouse: "+house+
	    "\nInsur: "+insur+"\nWater: "+water+"\nTrash: "+trash+
	    "\nCar: "+car+"\nCeTvW: "+ceTvW+"\nGasol: "+gasol+
	    "\nGroce: "+ groce +"\nMisc.: "+misc);
	    
	  }
	});
	
});
onEvent("adminPage8BackButton", "click", function( ) {
	console.log("adminPage8BackButton clicked!");
	setScreen("adminPage");
});




onEvent("usernamesListAP8", "change", function( ) {
	console.log("Selected option: " + getText("usernamesListAP8"));
	//counts the bills of an individual user and displays them in usersBillPaidCounter
	var theUser = getProperty("usernamesListAP8","text");
	var utili = 0;
	var house = 0;
	var insur = 0;
	var water = 0;
	var trash = 0;
	var car = 0;
	var ceTvW = 0;
	var gasol = 0;
	var groce = 0;
	var misc  = 0;
	readRecords("BankingData", {User:theUser}, function(records) {
	  
	  for (var i =0; i < records.length; i++) {
	     if(records[i].Description=="Utilities Bill"){
  	     utili++;
  	   }else if(records[i].Description=="House Payment"){
  	     house++;
  	   }else if(records[i].Description=="Insurance Bill"){
  	     insur++;
    	 }else if(records[i].Description=="Water"){
    	   water++;
    	 }else if(records[i].Description=="Trash"){
    	   trash++;
    	 }else if(records[i].Description=="Car Payment"){
    	   car++;
    	 }else if(records[i].Description=="Cell/TV/Wifi"){
    	   ceTvW++;
    	 }else if(records[i].Description=="Gasoline"){
    	   gasol++;
    	 }else if(records[i].Description=="Groceries"){
    	   groce++;
    	 }else if(records[i].Description=="Misc."){
    	    misc++;
    	 }
	     
	     
	  }
	  
	  setText("usersBillPaidCounter",utili+"\n"+house+
	    "\n"+insur+"\n"+water+"\n"+trash+
	    "\n"+car+"\n"+ceTvW+"\n"+gasol+
	    "\n"+ groce +"\n"+misc);
	});
});	  













//
//helper functions
//
function emptyAllTextBoxes(){
  setText("enterYourUsername","");
  setText("passInbox","");
  setText("usernameIn1","");
  setText("usernameIn2","");
  setText("passwordIn","");
  setText("passwordIn2","");
  setText("amountIn","");
  setText("depositAmountInBox","");
}

function updateCurrentBalance(currentUser,amount,transaction){
  var total=0;
  var currentId=0;
  var currentPassword="";
  var currentAdminStatus=false;
  
  readRecords("members info", {username:currentUser}, function(records) {
    var isPositive = false;
    var isStillPositive = false;
    total=records[0].currentBalance;
    if(total>=0){
      isPositive=true;
    }
    console.log("the currentBalance is "+total);
    total = Math.round((total+amount)*1000)/1000;
    if(total>=0){
      isStillPositive=true;
    }
    //needs to fee if this dips below 0. $35 per occurance
    
    if(isPositive===true&&isStillPositive===false){
      createRecord("BankingData", {User: currentUser, DateStamp: getTime(),Description: "Fee(Overdraft)",Type: "Withdraw",Amount: -35}, function(record) {
              updateCurrentBalance(currentUser,-35,"Fee(Overdraft)");
       });
    }
  
    console.log("the currentBalance is "+total);
    currentId=records[0].id;
    currentPassword=records[0].password;
    currentAdminStatus=records[0].admin;
    
    /*
    if(total<0){
      //balancesThatWentBelowZero.push(currentUser+" on "+timeConverter(getTime()));
      createRecord("errors", {username:currentUser,dateStamp:timeConverter(getTime()),transactionName:transaction}, function(record) {
        console.log("I'm executed after the record has been created.");
        console.log("Record id: " + record.id + " created!");
      });
    }
    */
    updateRecord("members info", {id:currentId ,username:currentUser,password:currentPassword,admin: currentAdminStatus, currentBalance:total}, function(record, success) {
      if(success){
       console.log("It updated users current balance");
      }else{
       console.log("it didn't update users current balance");
      }
    });
  });
}

function displayData(){
  
  var theDescription="";
 
  readRecords("BankingData", {}, function(records) {
    console.log("trying to display records");
    if (records.length>0) {
      for (var i =0; i < records.length; i++) {
         //console.log(records[i].User+" "+records[i].Description +" "+records[i].Type+" "+records[i].Amount);
          var theTime;
          if(isNaN(records[i].dateStamp)){
            theTime = timeConverter(records[i].DateStamp);
          }else{
            theTime = records[i].dateStamp;
          }
            
          if(records[i].User==currentUser){
            theDescription+=theTime.substring(0,6)+" "+records[i].Description+"\t\t\t"+" $"+records[i].Amount+"\n";
          }
        }
      }else {
        console.log("length was not greater than 0 ");
      }     
      
    readRecords("members info", {username:currentUser}, function(records) {
      console.log(records[0]);
      setText("currentBalance","Current Balance: \n$"+records[0].currentBalance);
    });
    console.log("setting the display");
    setText("balanceDescription",theDescription);
    
  });
} 

function setPaymentDropdown(id){
  setProperty(id,"options",paymentTypes);
}

function setDepositDropdown(id){
  setProperty(id,"options",depositTypes);
}

function setUsernamesDropdown(id){
  readRecords("members info", {}, function(records) {
    var listOfMembers=[];
    for (var i =0; i < records.length; i++) {
      //console.log(records[i].id + ': ' + records[i].username);
      listOfMembers.push(records[i].username);
    }
    listOfMembers.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    listOfMembers.unshift("Pick user...");
    
    setProperty(id,"options",listOfMembers);
  });
}

function setPendingDepositsDropdown(){
  var dropdownOption = [""];
  readRecords("pendingDeposits", {}, function(records) {
    for (var i =0; i < records.length; i++) {
    console.log(records[i].id);
    dropdownOption.push(records[i].id);
  }
  setProperty("depositCountDropbox","options",dropdownOption);
});
}

function setrecordIdDropdown(){
  var dropdownOption = [""];
}


function checkForSpaces(x){
  var hasSpaces=false;
  for(var i =0;i<x.length;i++){
    if(x.charAt(i)==" "){
      hasSpaces = true;
      console.log("Username or Password had a space!");
    }
  }
  return hasSpaces;
}

function validateCurrency(amount) {
  //makes sure payment input is formatted like money.
  var regex = /^[0-9]\d*(?:\.\d{0,2})?$/;
  return regex.test(amount);
}

function endATimeout(theT){
  console.log("timer t: "+t+" will be cleared!");
  clearTimeout(theT);
  console.log("cleared");
  
}

function setATimeout(milis){
  t = setTimeout(function(){
    setScreen("timeoutScreen");
  },milis);
  console.log("timeout started for "+milis/1000+" seconds and the t is: "+t);
}

function timeConverter(UNIX_timestamp){
  //given a UNIX-timestamp number, this function returns a number
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = month +' '+ date + ', ' + year + ' @ ' + hour + ':' + min + ':' + sec ;
  return time;
}

function toTimestamp(year,month,day,hour,minute,second){
 //given several number input it returns a date object
 var datum = Date.UTC(year,month-1,day,hour+4,minute,second);
 console.log("UTC:" +datum);
 return (datum);
}

function monthToNumber(month){
  var monthNum=0;
  if(month=="Jan"){
    monthNum=1;
  }else if(month==="Feb"){
    monthNum=2;
  }else if(month==="Mar"){
    monthNum=3;
  }else if(month==="Apr"){
    monthNum=4;
  }else if(month==="May"){
    monthNum=5;
  }else if(month==="Jun"){
    monthNum=6;
  }else if(month==="Jul"){
    monthNum=7;
  }else if(month==="Aug"){
    monthNum=8;
  }else if(month==="Sep"){
    monthNum=9;
  }else if(month==="Oct"){
    monthNum=10;
  }else if(month==="Nov"){
    monthNum=11;
  }else if(month==="Dec"){
    monthNum=12;
  }
  return monthNum;
}

function countPendingDeposits(){
  console.log("Count Pending Deposit function called");
  var count =0;
  
  readRecords("pendingDeposits", {}, function(records) {
    count = records.length;
    
    if(count>0){
      showElement("alertIcon1");
      showElement("alertIcon2");
    }else{
      hideElement("alertIcon1");
      hideElement("alertIcon2");
    }
  });
}

