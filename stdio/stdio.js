const stdout = process.stdout;

stdout.write("Hello world");

stdout.write("This is from a node program");

const stderr = process.stderr;

stderr.write("Some error");

const stdin = process.stdin;

stdin.on("data", (data) => {
  data = data.toString().toUpperCase();
  process.stdout.write("data:", data + "\n");
});
