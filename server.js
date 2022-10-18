// connetcing express and necessary librarries
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid')


// establishing port for app to run through
const PORT = 3001;
// establishing express as app
const app = express();

// connecting middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting route for public pages
app.use(express.static('public'));

// post route
app.post('/api/notes', (req, res) => {
  
  let newNote = req.body;
  // adds id for deletion
  newNote.id=uuid()

  fs.readFile('./db/db.json', (err, data) => {
    console.log('data',JSON.parse(data))
    let jsonFile = JSON.parse(data);

    jsonFile.push(newNote)


    fs.writeFile('./db/db.json', JSON.stringify(jsonFile), err =>{
      if(err) throw err
      console.log('Data saved');
    })
  })

  res.redirect('/notes')

})

// adds delete route and functionailty
app.delete("/api/notes/:id", (req, res)=>{
  let id = req.params.id; 
  // let oldNotes = JSON.parse(data);
  fs.readFile("./db/db.json", (err, data)=>{
      let oldNotes = JSON.parse(data);
      const newNotes = oldNotes.filter((note)=>!(id === note.id)); 
      fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err)=>{ 
          err ? console.log(err) : console.log(`Deleted note:  ${id}.`); 
      });
  });
  res.json("Item deleted");
});

// setting route for main page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// setting route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// settign route to get previous notes json
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'))
});

// initializes the app
app.listen(PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT} 🚀`)
);
