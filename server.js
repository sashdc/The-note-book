// connetcing express and necessary librarries
const express = require('express');
const path = require('path');
const fs = require('fs');



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

app.listen(PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT} 🚀`)
);
