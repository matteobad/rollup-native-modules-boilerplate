const express = require('express');
const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const path = require('path');
const uaParser = require('ua-parser-js');
const pkg = require('./package.json');

nunjucks.configure({
  noCache: process.env.NODE_ENV !== 'production',
});

const app = express();

app.use(express.static(pkg.config.publicDir));

app.get('/', function(request, response) {
  // Parse the UA string to determine modulepreload support.
  const ua = uaParser(request.headers['user-agent']);

  const manifest = fs.readJsonSync(
      path.join(pkg.config.publicDir, 'manifest.json'));

  const modulepreload = fs.readJsonSync(
      path.join(pkg.config.publicDir, 'modulepreload.json'));

  const templateData = {
    manifest,
    modulepreload,
    browserSupportsModulePreload: ua.engine.name === 'Blink',
    ENV: process.env.NODE_ENV || 'development',
  };

  response.send(nunjucks.render('views/index.html', templateData));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running:\nhttp://localhost:${listener.address().port}`);
});
