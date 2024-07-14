const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: await bcrypt.hash(req.body.password, 10) // Hash the password
    }
    const existingUser = await collection.findOne({
        name: data.name
    });
    if (existingUser) {
        res.send("User already exists");
    } else {
        const userData = await collection.insertMany([data]);
        console.log(userData);
        res.redirect("/");
    }
});

app.post("/login", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    const existingUser = await collection.findOne({
        name: data.name
    });
    if (existingUser && await bcrypt.compare(data.password, existingUser.password)) {
        res.redirect("https://www.youtube.com");
    } else {
        res.send("Invalid username or password");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
