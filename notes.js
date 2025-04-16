import http from "http";
import fs from "fs";

//  we read data of notes.json file

const readNote = () => {
  const data = fs.readFileSync("notes.json");
  return JSON.parse(data);
};

// Now post, create, or write data into NOtes.json file
const writeNote = (notes) => {
  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));
};

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/notes" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body = body + chunk;
    });

    req.on("end", () => {
      const { title, content } = JSON.parse(body);
      const notes = readNote();
      const newNote = {
        id: (notes.length + 1).toString(),
        title,
        content,
      };

      notes.push(newNote);
      writeNote(notes);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newNote));
    });
  } else if (url.startsWith("/notes/") && method == "GET") {
    const id = url.split("/")[2];
    const notes = readNote();
    const note = notes.find((n) => n.id == id);

    if (note) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(note));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify("Sorry Data is not fount! "));
    }
  } else if (url === "/notes" && method == "GET") {
    const notes = readNote();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
  }
  // Old work
  
  



  // Update 




  else if (req.method === "PUT" && req.url.startsWith("/notes/")) {
    const parts = req.url.split("/");
    const idToUpdate = parts[2]; 
    
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
  
    req.on("end", () => {
      const { title, content } = JSON.parse(body);
  
      const notes = readNote();
      const noteIndex = notes.findIndex(note => note.id === idToUpdate); 
  
      if (noteIndex === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify("Note not found"));
      } else {
        // Update note with the new data
        if (title) notes[noteIndex].title = title;
        if (content) notes[noteIndex].content = content;
  
        writeNote(notes);
        res.end(JSON.stringify("Your note has been updated"));
      }
    });
  }
  





  // Delete
  else if (req.method === "DELETE" && req.url.startsWith("/notes/")) {
    const parts = req.url.split("/"); 
    const idToDelete = parts[2]; 
  
    const notes = readNote();
    const noteIndex = notes.findIndex(note => note.id === idToDelete); 
  
    if (noteIndex === -1) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify( "Note not found" ));
    } else {
      notes.splice(noteIndex, 1); 
      writeNote(notes);
  
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify("data deleted successfully"));
    }
  }
  





  
  
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify("Sorry no data"));
  }
});

server.listen(3000, () => {
  console.log("Server is Running!");
});
