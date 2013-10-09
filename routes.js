
//
// primary
//

var baseDir = '';

var routes = function (dir) {
    baseDir = dir;

    function match (app, verb, path, to) {
        var controller  = {},
            to          = parseTo(to);

        controller = createController(to.resource);
        customAction(app, verb, controller[to.action], path);
    }

    function resources (app, resource, middleware) {
        var controller = createController(resource);

        defaultActions(app, controller, resource, middleware);
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
        Controller = require(baseDir + '/controllers/' + resource + '.js'),
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

    app[verb]('/' + path,               action              || notFoundAction);
}

function defaultActions (controller, resource, middleware) {
    if (!controller) return;

    var path        = '/'  + resource,
        pathWithId  = path + '/:id';

    var indexAction         = controller.index || null,
        showAction          = controller.show || null,
        createAction        = controller.create || null,
        updateAction        = controller.update || null,
        destroyAction       = controller.destroy || null;

    if (indexAction) {
        if (middleware && typeof middleware === 'function') indexAction = [middleware, indexAction];
        app.get(path, indexAction);
    }

    if (showAction) {
        if (middleware && typeof middleware === 'function') showAction = [middleware, showAction];
        app.get(pathWithId, showAction);
    }

    if (createAction) {
        if (middleware && typeof middleware === 'function') createAction = [middleware, createAction];
        app.post(path, createAction);
    }

    if (updateAction) {
        if (middleware && typeof middleware === 'function') updateAction = [middleware, updateAction];
        app.put(pathWithId, updateAction);
    }

    if (destroyAction) {
        if (middleware && typeof middleware === 'function') destroyAction = [middleware, destroyAction];
        app.del(pathWithId, destroyAction);
    }
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
