console.log(process.argv);

const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Contact = mongoose.model("Contact", contactSchema);

const password = process.argv[2];
const url = `mongodb+srv://dylanspyer:${password}@cluster0.sxy7z94.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

if (process.argv.length === 3) {
  console.log("phonebook:");
  Contact.find({}).then((contacts) => {
    contacts.forEach((contact) => console.log(contact));
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4].replace(/[^0-9]/g, "");

  const contact = new Contact({
    name: name,
    number: number,
  });

  contact.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
