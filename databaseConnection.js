const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require('express-session');
const sharedsession = require("express-socket.io-session");
const bodyparser = require("body-parser");
const socketIO = require("socket.io");

mongoose.connect("mongodb://localhost:27017/VotingSystem").then(() => console.log("MongoDB Connected")).catch((err) => console.log(err));
app.use(express.static("./View"));
let sessionMiddleware = session({
    secret: "OnlineVotingWebsite",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 6000000
    }
});
app.use(sessionMiddleware);
app.use(bodyparser.urlencoded({extended: true}));

const server = app.listen(8000, () => {
    console.log("Listening Server at 8000");
});
const io = socketIO(server);

const schema = new mongoose.Schema(
    {
        FirstName: {
            type: String
        },
        LastName: {
            type: String
        },
        Gender: {
            type: String
        },
        VoterID: {
            type: String
        },
        Email: {
            type: String,
            unique: true
        },
        UserName: {
            type: String,
            unique: true
        },
        Password: {
            type: String
        },
        Address: {
            type: String
        },
        Constituency: {
            type: String
        },
        State: {
            type: String
        },
        Pincode: {
            type: String
        },
        Voted_Party: {
            type: String,
            default: null
        }
    }
);
const voter = mongoose.model("Voters", schema);
app.get("/", (req, res) => {
    res.sendFile("Signup.html", {root: "./View"});
});
app.post("/", async (req, res) => {
    console.log("Added: ", JSON.stringify(req.body));
    const result = await voter.create({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Gender: req.body.Gender,
        VoterID: req.body.VoterID,
        Email: req.body.email,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Address: req.body.Address,
        Constituency: req.body.Constituency,
        State: req.body.State,
        Pincode: req.body.PinCode,
    });
    res.redirect("/login");
});
app.get("/login", (req, res) => {
    res.sendFile("loginpage.html", {root: "./View"});
});

app.get("/update", (req, res) => {
    res.sendFile("ForgotPassword.html", {root: "./View"});
});
app.get("/dashboard", (req, res) => {
    if (req.session.email) {
        const email = req.session.email;
        res.sendFile("Dashboard.html", {root: "./View"});

    } else {
        res.send("you are not authorised")
    }
});
app.get("/castvote", (req, res) => {
    if (req.session.email) {
        const email = req.session.email;
        res.sendFile("Castvote.html", {root: "./View"});

    } else {
        res.send("you are not authorised")
    }
});
app.post("/castvote", async (req, res) => {
    const email = req.session.email;
    const result = await voter.updateOne({Email: email}, {$set: {Voted_Party: req.body.VotedParty}});
    res.redirect("/castvote");
});
app.get("/votingresult", (req, res) => {
    if (req.session.email) {
        const email = req.session.email;
        res.sendFile("votingresult.html", {root: "./View"});

    } else {
        res.send("you are not authorised")
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => { // Destroy the session
        res.redirect('/login'); // Redirect to login page
    });
});
app.get('/delete',(req,res)=>{
    if (req.session.email) {
        const email = req.session.email;
        res.sendFile("DeleteAccount.html", {root: "./View"});

    } else {
        res.send("you are not authorised")
    }
});
app.get('/password',(req,res)=>{
    if (req.session.email) {
        const email = req.session.email;
        res.sendFile("PasswordChange.html", {root: "./View"});

    } else {
        res.send("you are not authorised")
    }
});
io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}));
io.on("connection", (socket) => {
    socket.on("PassChange", async (data) => {
        const email = data.email;
        const pass = data.pass;
        const result = await voter.updateOne({Email: `${email}`}, {$set: {Password: `${pass}`}})
        if (result.modifiedCount === 1) {
            socket.emit("PassResponse", "Password Changed");
        } else {
            const demo = await voter.findOne({Email: email});
            if (demo && demo.Password === pass) {
                socket.emit("PassResponse", "Password is Same as Previous");
            } else {
                socket.emit("PassResponse", "User not found");
            }
        }

    });
    socket.on("Login", async (data) => {
        const email = data.email;
        const pass = data.pass;
        const result = await voter.findOne({Email: email});
        if (result && result.Password === pass) {
            socket.handshake.session.email = data.email;
            socket.handshake.session.save();
            socket.emit("Login", "login Successfull");
        } else {
            socket.emit("Login", "Email or Password is Wrong")
        }
    });
    socket.on("dashboard", async (data) => {
        console.log(data);
        const email = socket.handshake.session.email;
        const result = await voter.findOne({Email: email});
        let info = "You have not yet cast your vote<br> Navigate to \"Caste Vote\" section to cast your vote ";
        if (result.Voted_Party) {
            info = `<center>You have already cast your vote to the</center>
                <center style="color: #ED1B23;font-family: 'Britannic Bold';font-size: 40px">${result.Voted_Party}</center>`;
        }

        const details = {
            FirstName: result.FirstName,
            LastName: result.LastName,
            Gender: result.Gender,
            VoterID: result.VoterID,
            Email: result.Email,
            UserName: result.UserName,
            Address: result.Address,
            Constituency: result.Constituency,
            State: result.State,
            Pincode: result.Pincode,
            VoteInfo: info
        }

        socket.emit("dashboard", details);
    })
    socket.on("castvote", async (data) => {
        console.log(data);
        const email = socket.handshake.session.email;
        const result = await voter.findOne({Email: email});

        const status = {
            UserName: result.UserName,
            votedparty: result.Voted_Party,
            Name: result.FirstName + " " + result.LastName,
            constituency: result.Constituency,
            state: result.State
        }
        socket.emit("castvote",status);
    });
    socket.on("VotingResult", async (data) => {
        console.log(data);
        const email = socket.handshake.session.email;
        const user = await voter.findOne({Email: email});
        const BJP = await voter.find({Voted_Party: "BJP"});
        const AAP = await voter.find({Voted_Party: "AAP"});
        const Congress = await voter.find({Voted_Party: "Congress"});
        const BSP = await voter.find({Voted_Party: "BSP"});
        const CPI = await voter.find({Voted_Party: "CPI"});
        const NPP = await voter.find({Voted_Party: "NPP"});
        const result = {
            username: user.UserName,
            BJP : `${BJP.length}`,
            AAP : `${AAP.length}`,
            Congress : `${Congress.length}`,
            BSP : `${BSP.length}`,
            CPI : `${CPI.length}`,
            NPP : `${NPP.length}`
        };

        socket.emit("VotingResult", result);
    });
    socket.on("username",async (data)=>{
        const email = socket.handshake.session.email;
        const user = await voter.findOne({Email:email});
        console.log(user.UserName);
        socket.emit("username",user.UserName)
    });
    socket.on("delete", async (data)=>{

        const email = socket.handshake.session.email;
        const user = await voter.findOne({Email:email});
        const pass = data.pass;
        if(pass === user.Password){
            const result = await user.deleteOne({Email: email});
            socket.emit("delete","Deleted");
        }
        else{
            socket.emit("delete","Password Not Match");
        }
    });
    socket.on("PasswordChange",async (data)=>{
        console.log("Password Change");
        const email = socket.handshake.session.email;
        const user = await voter.findOne({Email: email});
        const prevPass = data.prevPass;
        const newPass = data.pass;
        console.log(data);
        if(prevPass!=user.Password){
            socket.emit("PasswordChange","Wrong Password");
        }
        else if(prevPass === user.Password && prevPass!=newPass) {
            const result = await voter.updateOne({Email: email},{$set:{Password:newPass}});
            socket.emit("PasswordChange", "Password Changed");
        }
        else if(prevPass === newPass && prevPass === user.Password){
            socket.emit("PasswordChange","Password is Same as Previous");
        }
    });
});