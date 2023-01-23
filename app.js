require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mailchimp.setConfig({
  apiKey: process.env.SECTRET,
  server: process.env.SERVER
});

app.get("/", (_req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, _res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const listId = process.env.LISTID;

  async function addMember() {
    const response = await mailchimp.lists
      .addListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      })
      .then(
        (value) => {
          console.log("Successfully added contact as an audience member.");
          _res.sendFile(__dirname + "/success.html");
        },
        (reason) => {
          _res.sendFile(__dirname + "/failure.html");
        }
      );
  }
  addMember();
});

const newLocal = "/failure";
app.post(newLocal, (_req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server started");
});


