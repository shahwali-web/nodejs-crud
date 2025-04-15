import http from "http";
import fs from "fs";

const readData = () => {
  const joinData = fs.readFileSync("testing.json", "utf-8");
  const nowData = JSON.parse(joinData);
  return nowData;
};

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url == "/notes") {
    const data = readData();
    res.end(JSON.stringify(data, null, 2));
  } else {
    res.end(JSON.stringify("Not Found! "));
  }
});
server.listen(3000, ()=>{
    console.log("Server is running! ")
})

// const result = readData()

// console.log(result.id)
