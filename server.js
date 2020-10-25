const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = 3010

const fs = require("fs");
const { get } = require("http");

var rootObj = {root: __dirname + "/public"};

app.use(bodyParser.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => res.sendFile("/index.html", rootObj));
app.get("/notes", (req, res) => res.sendFile("/notes.html", rootObj));

app.get("/api/notes", (req, res) => {
    console.log("/notes-get");
    let json = getJson();
    console.log(json);
    res.json(json);
});

app.post("/api/notes", (req, res) => {
    console.log("/notes-post");
    console.log(req.body);
    addNoteToJson(req.body);
    res.json(getJson());
});

app.delete("/api/notes/:id", (req, res) => {
    console.log("/notes-delete");
    deleteNoteFromJson(req.params.id);
    res.json(getJson());
});

app.listen(port, () => console.log("app listening " + (port)));

function getJson() {
    let data = fs.readFileSync(__dirname + "/db/db.json");
    let json = JSON.parse(data);

    return json;
}

function createNoteObject(data) {
    let obj = {title: data.title,
                text: data.text,
                complete: false,
                hidden: false}
    return obj
}

function addNoteToJson(note) {
    let json = getJson();
    let newNote = createNoteObject(note);
    json.push(newNote);
    saveJSON(json);
}

function saveJSON(jsonData) {
    let data = JSON.stringify(jsonData);
    fs.writeFileSync(__dirname + "/db/db.json", data);
}

function deleteNoteFromJson(id) {
    let json = getJson();
    getJson(id).hidden = true;
    saveJSON(json);
}


