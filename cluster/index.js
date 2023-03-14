const cluster = require("cluster");
const { availableParallelism } = require("os");

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();

  for (let i = 0; i < numCPUs; i++) {
    // the same script runs for each fork but cluster.isPrimary will be false for them.
    cluster.fork();
  }

  console.log("Primary");
} else {
  console.log("Secondary");
}
