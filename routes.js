
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

    function resources (app, resource) {
        var controller = createController(resource);

        beforeActions(app, controller, resource);
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
        Controller = require(baseDir + '/../controllers/' + resource + '-controller.js');

        if (typeof(Controller) === 'function') {
            controller = new Controller();
        }
        else {
            controller = Controller;
        }
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

function beforeActions (app, controller, resource) {
    if (!controller) return;
    if (!controller.beforeActions) return;
    if (!controller.beforeActions.length) return;

    controller.beforeActions.forEach(function (beforeAction) {
        if (!beforeAction.only) {
            app.get('/' + resource,             beforeAction.filter);
            app.get('/' + resource + '/:id',    beforeAction.filter);
            app.post('/' + resource,            beforeAction.filter);
            app.put('/' + resource + '/:id',    beforeAction.filter);
            app.del('/' + resource + '/:id',    beforeAction.filter);
        }
        else if (beforeAction.only) {
            if (beforeAction.only.indexOf('show') > -1) {
                app.get('/' + resource + '/:id',    beforeAction.filter);
            }
            else if (beforeAction.only.indexOf('update') > -1) {
                app.put('/' + resource + '/:id',    beforeAction.filter);
            }
            else if (beforeAction.only.indexOf('destroy') > -1) {
                app.del('/' + resource + '/:id',    beforeAction.filter);
            }
        }
    });
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
