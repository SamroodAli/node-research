const { PI } = Math;

// exporting stuff
exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;

console.log(
  "is module.exports the same as exports",
  module.exports === exports,
  module.exports
);

// what else is there in module ?

console.log("what else is there in a module", module);
