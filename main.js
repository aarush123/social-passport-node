const express = require("express");
const passport = require("./passport.js");
const app = express();
const port = 8001
const cors = require("cors");
const session = require("express-session");
app.use(cors())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla'
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send(`
     <button><a href="/auth">Login with google</a></button>
     <button><a href="/auth/facebook">Login with Facebook </a></button>
     <button><a href="/auth/microsoft">Login with Microsoft</a></button>
    `)

})
//show google login page
app.get("/auth", passport.authenticate('google', {
    scope: ['email', 'profile']
}
));
// show facebook login page
app.get("/auth/facebook",
    passport.authenticate('facebook', {
        authType: 'reauthenticate',
        scope: ['public_profile', 'email', 'user_friends', 'manage_pages']
    })
)
app.get("/auth/microsoft", 
    passport.authenticate("microsoft", {
        prompt : "select_account"
    })
)
// after google login redirect to either success or failure
app.get("/auth/callback",
    passport.authenticate("google", {
        successRedirect: "/auth/callback/success",
        failureRedirect: "/auth/callback/failure"
    })
)
// after login to facebook redirect to either success or failure
app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "callback/success",
        failureRedirect: "callback/failure"
    })
)
app.get("/auth/microsoft/callback", 
    passport.authenticate("microsoft", {
        successRedirect: "callback/success",
        failureRedirect: "callback/failure"
    })    
)
// success link after google login 
app.get("/auth/callback/success", (req, res) => {
    const { _json } = req.user;
    console.log(_json)
    if (!req.user) res.redirect("/auth/callback/failure");
    res.send(`Welcome ${req.user.email}`)
})
// failure link after google login
app.get("/auth/callback/failure", (req, res) => {
    res.send("could not sign in ");
})

app.get("/auth/facebook/callback/success", (req, res) => {
    console.log(req.user);
    // res.send(`welcome ${req.user.displayName}`)
    res.send(`welcome  ${req.user.email}`)
})
app.get("/auth/facebook/callback/failure", (req, res) => {
    res.send("could not sign in with facebook")
})
app.get("/auth/microsoft/callback/success", (req, res)=> {
    console.log(req.user);
    res.send(`Welcome user from microsoft  ${req.user._json.mail}`)
})
app.get("/auth/microsoft/callback/failure", (req, res) => {
    res.send("could not sign in from facebook");
})
app.listen(port, () => console.log(`server is listening on port ${port}`));