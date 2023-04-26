"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-05-12T17:01:17.194Z",
    "2022-05-20T23:36:17.929Z",
    "2022-05-21T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

//display date for movments
const formarMovementDate = function (date, locale) {
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  const calcDaysPassed = (date) => {
    const x = Math.round(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
    if (x === 0) return "Today";
    if (x === 1) return "yesterday";
    if (x <= 10) return `${x} days ago`;
    if (x < 10) return false;
  };

  // return calcDaysPassed(date) ?? `${day}/${month}/${year}`
  return calcDaysPassed(date) ?? new Intl.DateTimeFormat(locale).format(date);
};

//display Currency and Numbers
const format = (acc, value) =>
  new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(value);

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  // check if we want to display sorted array or orginal one
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    // display Date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formarMovementDate(date, acc.locale);

    const html = `
<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${format(acc, mov)}</div>
        </div>
`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// creating user names
const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
creatUserNames(accounts);

//display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, v) => acc + v, 0);
  labelBalance.textContent = format(acc, acc.balance);
};

// display summary
const calcDisplaySummary = function (acc) {
  const movs = acc.movements;
  const incomes = movs.filter((val) => val > 0).reduce((acc, val) => acc + val);
  labelSumIn.textContent = format(acc, incomes);

  const out = movs.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = format(acc, Math.abs(out));

  const interest = movs
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = format(acc, interest);
};

// display cuurent date
const displayCurrentDate = function (acc) {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const mounth = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = now.getHours();
  const min = now.getMinutes();
  // labelDate.textContent = `${day}/${mounth}/${year}, ${hour}:${min}`

  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric", // also ['numeric' , 'long' , '2-digit']
    year: "numeric", // also ['numeric' , '2-digit']
    // weekday:'long'   // also ['long' , 'short' , 'narrow']
  };

  const locale = navigator.language; // to get from browser
  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, options).format(
    now
  );
};

// update UI
const updateUI = function (acc) {
  //display movments
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  //display date
  displayCurrentDate(acc);
};

// Timer
const startLogOutTimer = function () {
  const tick = function () {
    // in each call, print the remaining time to UI
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds stop timer and loug out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = "0";
    }
    //Decrese is
    time--;
  };
  //set time to 5 minutes
  let time = 120;
  tick();
  //call the timer every secon
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers

let currentAccount, timer;

// TO FAKE ALWAYS LOGGED IN
// currentAccount= account1;
// updateUI(currentAccount)
// containerApp.style.opacity = '100';

btnLogin.addEventListener("click", function (e) {
  console.log(e);
  e.preventDefault(); //__________preven form from press submiting

  currentAccount = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === +inputLoginPin.value
  );

  if (currentAccount) {
    // Display UI and message
    containerApp.style.opacity = "100";
    labelWelcome.textContent = `Welcome back ! ${
      currentAccount.owner.split(" ")[0]
    }`;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // to made the input lose its focuse

    //timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //ipdate UI
    updateUI(currentAccount);
  }
});

// transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount?.value;
  const reciver = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = "";

  if (
    reciver &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.userName !== reciver?.userName
  ) {
    currentAccount?.movements.push(-amount);
    reciver?.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    reciver?.movementsDates.push(new Date().toISOString());

    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    //update UI
    updateUI(currentAccount);
  }
});

// loan money
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  inputLoanAmount.value = "";

  if (
    amount > 0 &&
    currentAccount?.movements
      .filter((mov) => mov > 0)
      ?.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
  }

  // reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

//close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  const accountIndex = accounts.findIndex(
    (acc) =>
      acc.userName === inputCloseUsername.value &&
      acc.pin === +inputClosePin.value
  );

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    accounts.splice(accountIndex, 1);
    containerApp.style.opacity = "0";
  }
});

//sorting movments
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

console.log(`_____________remainder operator_________`);
// means the remainder of the divison
console.log(5 % 2); // => 1
console.log(5 / 2); // 2.5 => 2 * 2 + 1

console.log(8 % 3); // => 2
console.log(8 / 3); // 3 * 2 + 2

// use  case for check if the number is even or odd even means number / 2 => remainder = 0
// also this allow us to check if any number divisble by and other number
const isEven = (n) => n % 2 === 0;
console.log(isEven(6));
console.log(isEven(5));
console.log(isEven(0));

// document.querySelector('.balance__label').addEventListener('click',e=>{

//   Array.from(document.querySelectorAll('.movements__row'), (elemnt , index)=>{
//     if(index % 2 === 0)return elemnt.style.backgroundColor = 'orangered'
//   });

//   Array.from(document.querySelectorAll('.movements__row'), (elemnt , index)=>{
//     if(index % 4 === 0)return elemnt.style.backgroundColor = 'blue'
//   });

// } )

const tryColor = function (color = false) {
  Array.from(document.querySelectorAll(".movements__row"), (elemnt, index) => {
    if (index % 2 === 0)
      return (elemnt.style.backgroundColor = color ? "orangered" : "");
  });
};

let color = false;
document.querySelector(".balance__label").addEventListener("click", (e) => {
  tryColor(!color);
  color = !color;
});

console.log(`__________Numeric separators________`);
// this feature to format numbers in a way that is easier for us and for other develobers to read and to to understand
//and its an 'underscore' which u can put wherever u want in num such like thouthand sperators

//287,460,000,000 => thousand sperator
const diameter = 287_460_000_000; //=> numeric separator
console.log(diameter);

// it give meaning to certain parts
const price1 = 15_00;
const price2 = 1_500; // same num

// const pi = _3_._1415_; and it not allow in all this places
Number("230_00"); //will not work => NaN
Number.parseInt("230_00"); //will not pars => 230

console.log(`________Bigint______`);
// its a primitive data type and its a special type of integers

//in js num are represent internally as 64 bits for any number
//in 64 => 53 are used to actually store the digits
//     => the rest for store position of decimal point and the sign
// which means that there is a limit

console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 - 1);
// ABOVE OF THAT WE MIGHT LOSE PERSISIONS and some times good and other bad

console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(46546546546546546544655646546n);
console.log(BigInt(8888888888888888));

// operations
console.log(100006565656565656565656565n * 10000n);

const huge = 2332233223322332233223322332233n;
const numm = 23;
console.log(huge * BigInt(numm)); //we should convert to bigint
// console.log(Math.sqrt(46464444654654484844654n)) math operation does't work also

//exeptions
console.log(20n > 15);
console.log(20n === 15); //does not work cause of strict equality
console.log(20n == 15); // with lose equal work
console.log(20n == "15"); // with lose equal work
console.log(huge + " is REALY BIG");

//with divisions
console.log(10n / 3n); // it cut decimals off
console.log(11n / 3n); // same results
console.log(11 / 3);

console.log(`__________Date_________`);

// ______ creating dates
const now = new Date(); // date constructor function
console.log(now);

console.log(new Date(`Fri May 20 2022 12:43:56`));
console.log(new Date(`December 24, 2015`)); //Js is parsing out the string

console.log(new Date(account1.movementsDates[0]));

//year ...month ...day ...hour ...miniut ...sec
console.log(new Date(2037, 10, 19, 15, 20, 5)); //month is zero based
console.log(new Date(2037, 10, 32)); //JS has automatically autocorrection for days nov 32 = dec 2th

// we can pass amount of milliseconds passed since the begining of the unix time which is   =>>  january 1,1970
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); //this how to convert from days to milli seconds
// and that means 3 days passd from the Unix time

// 3 * 24 * 60 * 60 * 1000 = 259200000 and this called the 'timestamp'of the day number three
console.log(new Date(2142249780000)); // based on milliseconed pass since unix time jan,1,1970

//__________ working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth()); // zero based
console.log(future.getDate()); //day of month
console.log(future.getDay()); //day of week => zero based sun=0
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); //get a nicly formated string to use to save some where
console.log(future.getTime()); // to get the timestamp
console.log(new Date(2142249780000)); // based on milliseconed pass since unix time jan,1,1970

console.log(Date.now()); //give us the timstamp for now

future.setFullYear(2022);
console.log(future);

//______operation with date
// while convert the date to num the result is the timeStamp

console.log(new Date(2014, 5, 15));
const x = new Date(2015, 5, 15) - new Date(2014, 5, 15);
console.log(x / 1000 / 60 / 60 / 24);

const calcDaysPassed2 = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

console.log(calcDaysPassed2(new Date(2037, 3, 14), new Date(2037, 3, 24)));

console.log(calcDaysPassed2(new Date(), new Date(2022, 4, 21)));
// to more results like time changes due to daylight saving changes and other cases we should use a date library like moment.js

let gg;
switch (gg) {
  case 10:
    gg = "today";
    break;
  case 15:
    gg = "today 15";
    break;
  case 20:
    gg = "today 20";
    break;
  case 30:
    gg = "today 30";
    break;
  default:
    gg = "yesterday";
}
console.log(gg);

//internationalize numbers
const num = 65231755.215;

const options = {
  style: "unit", //[unit , percent , currency]
  unit: "mile-per-hour", //and more for units to ['celsius'....]
  currency: "USd",
  // we should dtermine unit and currence because thier are't determined by the locale
  // useGrouping: false
};

console.log("US:    ", new Intl.NumberFormat("en-US", options).format(num));
console.log("Germany: ", new Intl.NumberFormat("de-DE", options).format(num));
console.log("EG:    ", new Intl.NumberFormat("ar-EG", options).format(num));

console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
); // locale store from browser

console.log(`__________timers_________`);

//______setTimeout

const ingrediants = ["Olives", "spinach"];
const pizzaTimer = setTimeout(
  (a, b) => console.log(`Here is your pizza with ${a} and ${b} 🍕`),
  3000,
  ...ingrediants
);

console.log("Waiting ...");

// we can cancel this timer at least until the delay has actually passed before this three sec
if (ingrediants.includes("spinach")) clearTimeout(pizzaTimer);

//____setInterval
//to execute code every interval time  for ever untill we stop it

setInterval(function () {
  const now = new Date();
  console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
}, 100000);

// setInterval(function(){
//   const now = new Date().getTime() + (10*60*1000);
//   console.log(`${new Date(now).getHours()}:${new Date(now).getMinutes()}:${new Date(now).getSeconds()}`);
// }, 1000)

// console.log(new Date().getTime() + (10*60*1000))

setInterval((a, b) => console.log(a + b), 2000, 5, 10);
