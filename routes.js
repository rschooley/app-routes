
//
// primary
//

var baseDir = '',
    defOpts = {
    controllerDir: '/../controllers/',
    fileExtension: '-controller.js',
};

function extendOpts(opts) {
    for (var k in opts) {
       defOpts[k] = opts[k];    
    };
    return defOpts;
}

var routes = function (dir, opts) {
    baseDir = dir;

    extendOpts(opts);
    
    function match (app, verb, path, to) {
        var controller  = {},
            to          = parseTo(to);

        controller = createController(to.resource);
        customAction(app, verb, controller[to.action], path);
    }

    function resources (app, resource) {
        var controller = createController(resource);

        defaultActions(app, controller, resource);
    }

    function root (app, to) {
        var controller  = {},
            to          = parseTo(to);

        controller = createController(to.resource);
        app.get('/', controller[to.action || 'index']);
    }

    return {
        match: match,
        resources: resources,
        root: root
    }
}

//
// helpers
//

function createController (resource) {
    var Controller  = {},
        controller  = {};

    try {
        Controller = require(baseDir + defOpts.controllerDir + resource + defOpts.fileExtension),
        controller = new Controller();
    }
    catch (err) {
        controller = null;
        console.error(err);
    }

    return controller;
}

function customAction (app, verb, action, path) {
    if (!action)    return;
    if (!app[verb]) return;

	path = path[0] == '/' ? path : '/'+path;

    app[verb](path,               action              || notFoundAction);
}

function defaultActions (app, controller, resource) {
    if (!controller) return;

    app.get('/' + resource,             controller.index    || notFoundAction);
    app.get('/' + resource + '/:id',    controller.show     || notFoundAction);
    app.post('/' + resource,            controller.create   || notFoundAction);
    app.put('/' + resource + '/:id',    controller.update   || notFoundAction);
    app.del('/' + resource + '/:id',    controller.destroy  || notFoundAction);
}

function notFoundAction (req, res, next) {
    var err = new Error('Could not locate resource');
    err.statusCode = 404;

    next(err);
}

function parseTo (to) {
    var parsed = {};

    if (to.indexOf('#') === -1) {
        parsed = {
            resource:   to,
            action:     ''
        };
    }
    else {
        to = to.split('#');

        parsed = {
            resource:   to[0],
            action:     to[1]
        };
    }

    return parsed; 
}

//
// module exports
// 

module.exports = routes;
