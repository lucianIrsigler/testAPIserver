const express = require('express');

const app = express();
const port = process.env.PORT || 3000;


app.get("/endpoint", (req, res) => {
    res.json({ message: "Hello, world!" });
});

app.get("/", (req, res) => {
    res.send("Hello")
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});