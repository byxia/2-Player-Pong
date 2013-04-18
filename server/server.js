// simpleExpressServer.js
// A simple Express server for 15-237.

var fs = require("fs");
var path = require("path");
var express = require("express");
var flash = require("connect-flash");

var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;

//======================================
//      init/main
//======================================

var app = express();

app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'change me!' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(app.router);
});

function serveStaticFile(request, response) {
    //notify the user they're logged in. Necessary because
    //  we use the same html for logging in and when they're
    //  logged in
    if (request.user !== undefined){
        response.cookie("user", request.user.id);
    }
    else {
        response.cookie("user", "none");
    }
    console.log("user:", request.user);
    response.sendfile("static/" + request.params.staticFilename);
}

app.get("/static/:staticFilename", serveStaticFile);

app.listen(8889);

process.on("uncaughtException", onUncaughtException);

//======================================
//      passport
//======================================

app.post('/login',
  passport.authenticate('local', { successRedirect: '/static/player.html',
                                   failureRedirect: '/static/loginFail.html',
                                   failureFlash: 'Login Failed' }));

//registering new users would be done by adding to these data structures
var idToUser = [
    { id: 0, username: 'luke', password: 'theforce'},
    { id: 1, username: 'vader', password: 'iamyourfather'},
    { id: 2, username: 'leia', password: 'onlyhope'}
];
var usernameToId = { 'luke': 0, 'vader' : 1, 'leia':2 };

passport.use(new PassportLocalStrategy(
    function(username, password, done) {
        var user = idToUser[usernameToId[username]];
        if (user === undefined)
            return done(null, false, { message: 'Unknown user ' + username });
        if (user.password !== password)
            return done(null, false, { message: 'Invalid password' });
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, idToUser[id]);
});

//======================================
//      handling uncaught exceptions
//======================================

function onUncaughtException(err) {
    var err = "uncaught exception: " + err;
    console.log(err);
}



