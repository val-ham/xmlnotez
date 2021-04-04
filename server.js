var xmlrpc = require("xmlrpc");
const jsdom = require("jsdom");

// Creates an XML-RPC server to listen to XML-RPC method calls
var server = xmlrpc.createServer({ host: "localhost", port: 9090 });
// Handle methods not found
server.on("NotFound", function (method, params) {
  console.log("Method " + method + " does not exist");
});

var xmlString =
  '<data><topic name="Animal Things"><note name="Dogs are better than cats 03"><text> Dogs respond when you call their name (unlike cats, who just ignore you) </text><timestamp> 03/16/21 - 14:03:04 </timestamp></note></topic></data>';

const dom = new jsdom.JSDOM(xmlString);

//Get contents from the XML database with the given topic
server.on("getContent", (err, params, callback) => {
  const notes = dom.window.document.querySelectorAll(
    "topic[name='" + params + "'] note"
  );
  var returnMsg = "";
  notes.forEach((note) => {
    returnMsg =
      returnMsg +
      note.querySelector("text").textContent +
      "\ndate:" +
      note.querySelector("timestamp").textContent +
      "\n\n";
  });
  callback(null, returnMsg);
});

server.on("addNote", async (err, params, callback) => {
  var parent;
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  if (
    dom.window.document.querySelectorAll("topic[name='" + params[0] + "']")
      .length === 0
  ) {
    console.log("asd");
    parent = dom.window.document.createElement("topic");
    const parentName = dom.window.document.createAttribute("name");
    parentName.value = params[0];
    parent.setAttributeNode(parentName);
    const root = dom.window.document.querySelector("data");
    root.append(parent);
  } else {
    parent = dom.window.document.querySelector(
      "topic[name='" + params[0] + "']"
    );
  }
  const note = dom.window.document.createElement("note");
  const noteName = dom.window.document.createAttribute("name");
  noteName.value = params[1];
  note.setAttributeNode(noteName);
  const textEl = dom.window.document.createElement("text");
  textEl.append(params[2]);
  const timestamp = dom.window.document.createElement("timestamp");
  var d = new Date();
  timestamp.append(d);
  note.append(textEl);
  note.append(timestamp);

  parent.append(note);

  console.log("new content added to topic: " + params[0]);

  callback(null, "Note added");
});

console.log("XML-RPC server listening on port 9090");
