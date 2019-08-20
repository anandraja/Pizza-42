const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
var config = require('./config');
require('dotenv').config();
var port = process.env.port || 8080;

if (!config.AUTH0_DOMAIN || !config.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

const corsOptions =  {
  //origin: `http://localhost:${port}`
  origin: 'https://pizza42.azurewebsites.net'
};

app.use(cors(corsOptions));

const checkJwt = jwt({
  // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev--pizza42.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://pizza42/api',
    issuer: 'https://dev--pizza42.auth0.com/',
    algorithms: ['RS256']
});

const checkScopes = jwtAuthz(['read:messages']);

app.get('/checkserver', function(req, res) {
  res.json({
    message: 'This API is working...'
  });
});

app.get('/api/suggestPizzaPlace', function(req, res) {
  res.json({
    message: 'Feeling hungry...Please visit Pizza-42'
  });
});

app.get('/api/getPastOrders', checkJwt, function(req, res) {
  res.json({
    'Last Week': parseInt(Math.random() * 100),
    'This Week': parseInt(Math.random() * 100)
  });
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on ${port}`);
  }
});
