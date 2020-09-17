// DEPENDENCIES
const express = require("express");
const app = express();

// EXPRESS SETUP
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// ROUTES

app.get("/", function(req, res){
	res.render("index");
});

app.listen(3000, function(){
	console.log("Notes app running on 3000");
});