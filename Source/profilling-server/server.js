'use latest';

// import express from 'express';
// import { fromExpress } from 'webtask-tools';
// import bodyParser from 'body-parser';
// import cookieSession from 'cookie-session';
// import csurf from 'csurf';
// import moment from 'moment';
// import jwt from 'jsonwebtoken';
// import ejs from 'ejs';
// import _ from 'lodash';

const express = require('express');
//const fromExpress = require('webtask-tools');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
var _ = require('lodash');
var port = process.env.port || 8080;

const app = express();

app.use(cookieSession({
  name: 'session',
  secret: 'shhh...',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const AUTH0_DOMAIN = 'https://dev--pizza42.auth0.com/';
const AUTH0_ISSUER = 'https://dev--pizza42.auth0.com/';
const AUTH0_AUDIENCE = 'https://pizza42/rules';
const TOKEN_SECRET = 'pizza42';

const csrfProtection = csurf();

app.get('/checkserver', (req, res) => {
  res.json({
    message: 'This API is working...'
  });
});

app.get('/', verifyInputToken, csrfProtection, (req, res) => {
  // get required fields from JWT passed from Auth0 rule
  const requiredFields = req.tokenPayload[`${AUTH0_DOMAIN}/claims/required_fields`];
  // store data in session that needs to survive the POST
  req.session.subject = req.tokenPayload.sub;
  req.session.requiredFields = requiredFields;
  req.session.state = req.query.state;

  // render the profile form
  const data = { 
    subject: req.tokenPayload.sub,
    csrfToken: req.csrfToken(),
    fields: {},
    action: req.originalUrl.split('?')[0]
  };
  requiredFields.forEach((field) => {
    data.fields[field] = {};
  });

  const html = renderProfileView(data);

  res.set('Content-Type', 'text/html');
  res.status(200).send(html);
});

const parseBody = bodyParser.urlencoded({ extended: false });

app.post('/', parseBody, csrfProtection, validateForm, (req, res) => {
  if (req.invalidFields.length > 0) {
    // render the profile form again, showing validation errors
    const data = { 
      subject: req.session.subject,
      csrfToken: req.csrfToken(),
      fields: {},
      action: ''
    };
    req.session.requiredFields.forEach((field) => {
      data.fields[field] = { 
        value: req.body[field],
        invalid: req.invalidFields.includes(field)
      };
    });

    const html = renderProfileView(data);

    res.set('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  // render form that auth-posts back to Auth0 with collected data
  const formData = _.omit(req.body, '_csrf');
  const HTML = renderReturnView({
    action: `${AUTH0_DOMAIN}continue?state=${req.session.state}`,
    formData
  });

  // clear session
  req.session = null;

  res.set('Content-Type', 'text/html');
  res.status(200).send(HTML);
});

//module.exports = fromExpress(app);

// middleware functions

function verifyInputToken(req, res, next) {
  const options = {
    issuer: `${AUTH0_ISSUER}`,
    audience: `${AUTH0_AUDIENCE}`
  }
  
  try {
    req.tokenPayload = jwt.verify(req.query.token, TOKEN_SECRET, options);
  } catch (err) {
    return next(err);
  }
  return next();
}

function validateForm(req, res, next) {
  const requiredFields = req.session.requiredFields;

  const validation = {
    gender: value => value && value.trim().length > 0
  }
  
  req.invalidFields = [];
  requiredFields.forEach((field) => {
    if (!validation[field](req.body[field])) {
      req.invalidFields.push(field);
    }
  });

  next();
}

// view functions
function renderProfileView(data) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>User Profile</title>
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    </head>

    <body>
      <div class="jumbotron">
        <div class="container">
          <div class="row" style="padding-top: 20px;">
            <div class="col-md-6 col-sm-offset-2">
              <p class="lead">Hello <strong><%= subject %></strong>, we just need a couple more things from you to complete your profile:</p>
            </div>
          </div>
          
          <form class="form-horizontal" method="post" action="<%= action %>">
            <input type="hidden" name="_csrf" value="<%= csrfToken %>">
          
            <% if (fields.gender) { %>
            <div class="form-group<% if (fields.gender.invalid) { %> has-error<% } %>">
              <label for="gender" class="col-sm-2 control-label">Sex</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="gender" name="gender" placeholder="M or F" value="<%= fields.gender.value %>">
              </div>
            </div>
            <% } %>
           
            <div class="form-group">
              <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return ejs.render(template, data);
}

function renderReturnView (data) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>

    <body>
      <form id="return_form" method="post" action="<%= action %>">
        <% Object.keys(formData).forEach((key) => { %>
        <input type="hidden" name="<%= key %>" value="<%= formData[key] %>">
        <% }); %>
      </form>
      <script>
        // automatically post the above form
        var form = document.getElementById('return_form');
        form.submit();
      </script>
    </body>
    </html>
  `;
  
  return ejs.render(template, data);  
}


app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on ${port}`);
  }
});