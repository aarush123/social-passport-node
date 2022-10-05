require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;


passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
	clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
	callbackURL:"http://localhost:8001/auth/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	return done(null, profile);
}
));

passport.use(new FacebookStrategy({
    clientID : process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:8001/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'], 
	
},
function (accessToken, refreshToken, profile, cb) {
	return cb (null, {
		profile: profile,
		accessToken : accessToken, 
	})
}
));

passport.use(new MicrosoftStrategy({
	clientID : process.env.MICROSOFT_CLIENT_ID,
	clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
	// clientID : "312821f4-050b-4b27-bf6a-3c09ed001a0b",
	// clientSecret : "kq78Q~m0GBQptWYDQTdT2gQV~P7p5ygSExvY5bNX",
	callbackURL : "http://localhost:8001/auth/microsoft/callback",
	scope: ["user.read"],
	// Microsoft specific options

        // [Optional] The tenant for the application. Defaults to 'common'. 
        // Used to construct the authorizationURL and tokenURL
        tenant: 'common',

        // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
        authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

        // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
        tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
}, 
function (accessToken, refreshToken, profile, cb) {
	return cb (null,profile)
}
))

module.exports = passport;