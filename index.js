require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const Contact = require("./models/contact.js");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json()); // Takes JSON data, transforms it into a JS object, attaches to `body` prop of `request` object
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms: :data")
);
app.use(cors());
app.use(express.static("dist"));

// let persons = [
//   // {
//   //   id: 1,
//   //   name: "Arto Hellas",
//   //   number: "040-123456",
//   // },
//   // {
//   //   id: 2,
//   //   name: "Ada Lovelace",
//   //   number: "39-44-5323523",
//   // },
//   // {
//   //   id: 3,
//   //   name: "Dan Abramov",
//   //   number: "12-43-234345",
//   // },
//   // {
//   //   id: 4,
//   //   name: "Mary Poppendieck",
//   //   number: "39-23-6423122",
//   // },
// ];

app.get("/", (request, response) => {
  response.send("<h1>Hello darkness my old friend</h1");
});

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people <br/> ${new Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const personExists = (name) => {
  const lowerCaseName = name.toLowerCase();
  const person = persons.filter(
    (person) => person.name.toLowerCase() === lowerCaseName
  );

  return person.length > 0;
};

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  console.log("body name", body.name);
  console.log("body number", body.number);

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "please include both a name and number" });
  }

  const contact = new Contact({
    name: String(body.name),
    number: Number(body.number),
  });

  contact.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
