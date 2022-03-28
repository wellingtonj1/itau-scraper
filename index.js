const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const path = require('path');

// Config
    // Template Engine
    app.engine('handlebars', engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.set('views', './resources/views');
    // Body Parser
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    // public
    app.use(express.static(path.join(__dirname, 'public')));

    
// Routes
app.use('/', routes);

// Outros
var server = app.listen(8080, () => {
    console.log('Server started on port 8080');
});

server.setTimeout(240000000);
