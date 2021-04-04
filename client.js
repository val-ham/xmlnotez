var xmlrpc = require("xmlrpc");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);
// Creates an XML-RPC client. Passes the host information on where to
// make the XML-RPC calls.
var client = xmlrpc.createClient({
  host: "localhost",
  port: 9090,
  path: "/",
});

var instr =
  "Instructions:\nTo send data use: send///topic///note///text\nTo search a topic: get///topic\nQuit the client: /quit\n";
console.log(instr);
rl.on("line", (line) => {
  if (line === "/quit") {
    rl.close();
  } else if (
    line.split("///")[0] === "send" &&
    line.split("///").length === 4
  ) {
    client.methodCall(
      "addNote",
      [line.split("///")[1], line.split("///")[2], line.split("///")[3]],
      function (error, value) {
        // Results of the method response
        console.log("\n" + value);
      }
    );
  } else if (line.split("///")[0] === "get" && line.split("///").length === 2) {
    client.methodCall(
      "getContent",
      [line.split("///")[1]],
      function (error, value) {
        // Results of the method response
        console.log(
          "\nNotes on topic," + line.split("///")[1] + ":\n\n" + value
        );
      }
    );
  } else {
    console.log("Incorrect user input\n" + instr);
  }
});
