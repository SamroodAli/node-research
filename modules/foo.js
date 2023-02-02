// importing
const { area, circumference } = require("./circle");
const circle = require("./circle");

console.log(circle, "circle module");

console.log(circle.area === area);

console.log(area("10"), "the value of area");

console.log(circle.area("10"), "the value of circle.area");

console.log(
  require("./circle").area("10"),
  "the value of require(circle).area"
);
