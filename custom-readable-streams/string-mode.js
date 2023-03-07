const { Readable } = require("stream");

class ArrayStreamer extends Readable {
  constructor(array) {
    super({
      // there's a couple of options here
      // put nothing here if want the default binary buffers
      // encoding utf-8 if we want strings
      encoding: "utf-8",
      // objectMode:true // put this if each chunk is an object
    });

    this.array = array;
    this.index = 0;
  }

  _read() {
    if (this.index < this.array.length) {
      const chunk = this.array[this.index];

      this.push(chunk);
      this.index += 1;
    } else {
      // this.push(null);
      this.push(null);
    }
  }
}

const array = ["one", "two", "three", "four", "five", "six"];

const streamInterface = new ArrayStreamer(array);

streamInterface.on("data", console.log);

streamInterface.on("end", () => console.log("array read streaming ended"));

module.exports = ArrayStreamer;
