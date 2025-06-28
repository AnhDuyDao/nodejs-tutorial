// console.log(arguments);
// console.log(require("module").wrapper);

const myCalculator = require("./test-module-1");

// module.exports
const calc1 = new myCalculator();
console.log(calc1.add(2, 5));

// exports
// const calc2 = require("./test-module-2");
const { add, multiply, divide } = require("./test-module-2");
console.log(multiply(2, 5));

// Caching
// First load the file only one
// Then call the function
// Hello from the module
// Log this beautiful text
// Log this beautiful text
// Log this beautiful text
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
