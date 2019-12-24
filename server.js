/* eslint-disable */
const auth = require('basic-auth');
const enforce = require('express-sslify');
const express = require('express');
const compression = require('compression');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT ? process.env.PORT : 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const protect_username = process.env.PROTECT_USERNAME ? process.env.PROTECT_USERNAME : false;
const protect_password = process.env.PROTECT_PASSWORD ? process.env.PROTECT_PASSWORD : false;
const protect_credentials = (protect_username && protect_password) ? { [protect_username]: { password: protect_password }, } : false;

app.prepare()
  .then(() => {
    const server = express();
    if (!dev) {
      server.use(enforce.HTTPS({ trustProtoHeader: true }));
      server.use(compression());
    }

    if(protect_credentials){
      server.use(function (request, response, next) {
        var user = auth(request);
        if (!user || !protect_credentials[user.name] || protect_credentials[user.name].password !== user.pass) {
          response.set('WWW-Authenticate', 'Basic realm="example"');
          return response.status(401).send();
        }
        return next();
      });
    }

    server.use(express.static('static'))

    server.get('/find-medication/results', (req, res) => {
      const actualPage = '/find-medication';
      const queryParams = { showResults: true };

      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, '0.0.0.0', (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:' + port);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
