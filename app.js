const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/ee1ced60f5";

  const options = {
    method: "POST",
    auth: "yordan:0051bd72c7900d3baa65948448d52285-us14"
  }

  const request = https.request(url, options, function (response) {

    if (response.statusCode === 200) {
      // res.send("Successfully subscribed!");
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.")
});

//API KEY
//0051bd72c7900d3baa65948448d52285-us14

//List ID
//ee1ced60f5




// app.get("/", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

// app.post("/", function (req, res) {
//   const query = req.body.cityName;
//   const unit = "metric";
//   const apiKey = "978897e25f1a5a9fc888f8ddd5258b7f";

//   const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
//   https.get(url, function (response) {
//     console.log(response.statusCode);

//     response.on("data", function (data) {
//       const weatherData = JSON.parse(data)
//       const temp = weatherData.main.temp
//       const weatherDescription = weatherData.weather[0].description
//       const icon = weatherData.weather[0].icon
//       const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
//       res.write("<p>The weather is currently " + weatherDescription + "</p>");
//       res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
//       res.write("<img src=" + imageURL + ">");
//       res.send();
//     });
//   });
// });