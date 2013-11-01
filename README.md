app-routes
==========

Route mapping kinda like Rails

### install
``` npm install app-routes

### config/routes.js file
``` javascript
var appRoutes   = require('app-routes')(__dirname),
    match       = appRoutes.match,
    resources   = appRoutes.resources,
    root        = appRoutes.root;

var routes = {
    draw: function (app) {
        root(app, 'home#index');

        // alias
        match(app, 'get', 'signup', 'users#create');

        // standard REST actions
        resources(app, 'users');
    }
};

module.exports = routes;
```

### web.js (app.js, server.js)
``` javascript
var express         = require('express'),
    app             = express(),
    routes          = require('./config/routes');
...
routes.draw(app);
```

### controller
``` javascript
var _   = require('underscore'),
    Foo = require('../models/foo');

var fooController = {

    // add middleware
    beforeActions: [
        { filter: authorize },
        { filter: findFoo, only: ['update'] }
    ],

    index: function (req, res, next) {
        res.json([]);
    },

    update: function (req, res, next) {
        var foo = fooParams(req);

        Foo.findByIdAndUpdate(req.params.id, foo, function (err, doc) {
            if (err) return next(err);

            res.json(doc);
        });
    }
};

//
// helpers
//

function authorize (req, res, next) {
    // find user by some token/cookie/header
    if (!cool) {
        return next(new Error('not cool'));
    }

    next();
};

function findFoo () {
    Foo.findById(req.params.id, function (err, doc) {
        if (err) return next(err);

        req.foo = doc;
        next();
    });
};

// whitelist values from client (like Rails 4)
function fooParams (req) {
    return _.pick(req.body, 'bar', 'baz');
};

//
// exports
//

module.exports = feebackController;
