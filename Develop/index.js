// json parse will convert the str to object

// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs")

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


let notesArr = [];


app.get("/api/notes", function (req, res) {
    // res is our call back to the front end
    fs.readFile("./db/db.json", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        notesArr = JSON.parse(data);
        // this will send the notesArr to our database
        res.json(notesArr)
    });


})




// Create New Characters - takes in JSON input
app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newnote = req.body;

    console.log(newnote);

    // We then add the json the user sent to the character array
    notesArr.push(newnote);

fs.writeFile("./db/db.json",notesArr,function(error,data){
    if (error) {
        return console.log(error);
    }
    // We then display the JSON to the users
    res.json(newnote);
})

});



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});