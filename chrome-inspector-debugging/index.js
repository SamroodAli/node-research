// for inspecting, go to chrome://inspect
// run the node process with --inspect flag like this 'node --inspect file'

let i = 0;

debugger;
setTimeout(() => {
  throw new Error("Some error");
}, 10000);
