// my note, json parse will convert the str to object
// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs")

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("db"));


// ------HTML routes------
// getting / and returning it in index.html file
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// getting /notes and returning in notes.html file
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


// let notesArr = [];

// -------API routes-------
// get /api/notes read the db.json file and return all saved notes as json
// res is our call back to the front end
app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (error, data) {
        if (error) {
            return res.status(400);
        }
        const notesArr = JSON.parse(data);
        // this will send the notesArr to our database
        // res.json(JSON.parse(data));
        res.json(notesArr)
    });


})



// post api/notes , get a new note to save on the req body and add to db.json
// Create New Characters - takes in JSON input
app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newnote = req.body;

    // console.log(newnote);

    // We then add the json the user sent to the character array
    // notesArr.push(newnote);

    fs.readFile("./db/db.json","utf8",function(error,data){
        if(error){
            return res.status(400);
        }
        const pastnote = JSON.parse(data)

        if(pastnote.length === 0){
            newnote.id =1;
        }else{
            const lastnote = pastnote[pastnote.length-1]
            newnote.id = pastnote.id +1
        }
        pastnote.push(newnote);

        fs.writeFile("./db/db.json",JSON.stringify(pastnote),function(error,data){
            if (error) {
                return res.status(400)
            }
            // We then display the JSON to the users
            res.json(newnote);
        })
    })


});





// // ----delete-----
// app.delete("/api/notes/:id", function(req, res) {
//     const deleteID = parseInt(req.params.id)
//     // const id = req.params.id;
//     fs.readFile("./db/db.json", "utf8", function (error, data) {
//         if (error) {
//             return response.status(400);
//         }
//         const pastnote = JSON.parse(data)

//         for(let i = 0; i < pastnote.length; i++) {
//             if(pastnote[i].id === id) {
//                 pastnote.splice(i,1); 
//             }
//         }

//         // pastnote.forEach((note, index) => {
//         //     if (note.id === deleteID){
//         //         pastnote.splice(index,1)
//         //     }
//         // });
//         fs.writeFile("./db/db.json", JSON.stringify(pastnote), function(error, data) {
//             if (error) {
//                 return response.status(400);
//             }
//             // response.status(200);
//             res.json(req.params.id); 
//         })
//     })
// });





// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});