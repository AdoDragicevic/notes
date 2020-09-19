// DEPENDENCIES
const express = require("express");
const app = express();

// EXPRESS SETUP
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PORT SETUP
const port = process.env.PORT || 3000;


// ROUTES
app.get("/", function(req, res){
	res.render("index");
});

app.listen(port, function () {
  console.log("SERVER RUNNING...");
});