const express = require("express");
const app = express();
const route = require("./routes");
require("dotenv").config();
const port = process.env.PORT || 5000;


const cors = require("cors");


app.use(
    cors({
        // origin: (process.env.CLIENT_URL || "").split(","),
    })
); // Use this after the variable declaration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
route(app);

app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});
app.listen(port, () => {
    console.log(`server running on port: http://localhost:${port}`);
});