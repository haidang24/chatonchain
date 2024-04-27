import path from "path"; // path
import express from "express"; // express
import dotenv from "dotenv";  // env module
import cookieParser from "cookie-parser"; // cookie parser module
import session from "express-session"; // session module 
import authRoutes from "./routes/auth.routes.js"; //auth routes
import messageRoutes from "./routes/message.routes.js"; // message routes
import userRoutes from "./routes/user.routes.js";  //user routes
import friendsRoutes from "./routes/friends.routes.js";   //
import connectToMongoDB from "./db/connectToMongoDB.js";  //connect to MongoDB
import { app, server } from "./socket/socket.js"; //socket
import { HandshakeLogin } from "handshake-login";
import crypto from "crypto";
import cors from 'cors';

//CONFIG CORS
const corsOptions = {
  origin: 'http://localhost:3000/login_domain', // Chỉ chấp nhận yêu cầu từ domain này
  optionsSuccessStatus: 200 // Trả về mã trạng thái 200 cho các yêu cầu CORS
};


//config PORT
const PORT = process.env.PORT || 5000;


//config __dirname
const __dirname = path.resolve();
//config for views ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'backend/views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
//CONFIG ENV
dotenv.config();
//SETUP DOMAIN OPTIONS
const hLoginOptions = {
  useDoh: true,
  dohResolverUrl: 'https://easyhandshake.com:8053/dns-query',
};

//CONFIG SESSION
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'very secret; much wow',
  })
);
app.use(express.json()); //CONFIG JSON
app.use(cookieParser());  //CONFIG COOKIE
app.use(cors(corsOptions)); //CONFIG CORS
//CONFIG ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use( "/api/users", userRoutes );
app.use( "/api", friendsRoutes );
//LOGIN WITH HANDSHAKE DOMAIN
//API FOR LOGIN
app.post( '/login', async function ( req, res ) {
  // New instance of HandshakeLogin every time.
  const hLogin = new HandshakeLogin(hLoginOptions);
  const domain = req.body.domain;

  // Generate a random challenge and store in session (to verify later)
  const randomValues = new Uint8Array(16);
  crypto.webcrypto.getRandomValues(randomValues);
  const challenge = Buffer.from(randomValues).toString('base64url');
  console.log('Generated challenge', challenge);
  req.session.challenge = challenge;

  // Generate Request URL and redirect to it (will be to an ID manager)
  // Set the callback to own website
  try {
    const requestUrl = await hLogin.generateRequestUrl({
      domain: domain,
      challenge: challenge,
      // callbackUrl: 'http://localhost:3000/callback',
      callbackUrl: req.protocol + '://' + req.get('host') + '/callback',
    });
    console.log('Request URL:', requestUrl);
    return res.redirect(requestUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Error');
  }
} );
//API FOR CALLBACK
app.get('/callback', (req, res) => {
  res.render('callback');
});
//API FOR CALLBACK SERVER
app.get('/servercallback', async function (req, res) {
  const url =
    req.protocol +
    '://' +
    req.get('host') +
    req.originalUrl +
    '#' +
    req.query.data;

  try {
    // Create a new instance every time.
    const hLogin = new HandshakeLogin(hLoginOptions);

    // Parse response data
    const responseData = hLogin.parseResponseDataFromUrl(url);
    console.log('Response Data', responseData);

    // Verify everything (fingerprint with dns and public key,
    // signature with challenge and public key)
    const verified = await hLogin.verifyResponseData(req.session.challenge);
    console.log('verified:', verified);

    // If verified, store in session
    if (verified === true) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function () {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.domain = responseData.domain;
        console.log( "This is a SESSIONS request" );
        console.log( req.session);
        return res.redirect( 'http://localhost:3000/login_domain' );
        // return res.json( { "domain": req.session.domain } );        
      } );
    } else {
      // Couldn't log in
      return res.redirect('');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Error');
  }
} );
//GET RESULTS
//LOGOUT DOMAIN NAME

app.get( '/results', ( req, res ) => {
  const results=req.session.domain||"none";
  res.json(results);
});

//deploy for my application

// app.use(express.static(path.join(__dirname, "/frontend/src")));

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "frontend", "src", "index.html"));
// });


//START SERVER
server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
