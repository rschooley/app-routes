'use strict';

var assert = require('assert'),
    routes = require('../routes.js');

var app = {
    _get: { },
    _post: { },
    _del: { },
    _put: { },
    get: function(uri, cb) {
        this._get[uri] = cb;
    },    
    post: function(uri, cb) {
        this._post[uri] = cb;
    },
    put: function(uri, cb) {
        this._put[uri] = cb;
    },
    del: function(uri, cb) {
        this._del[uri] = cb;
    },
};

describe('routes helper', function(){
    describe('existance', function(){
        it('exists', function(){
            assert.ok(routes);
        });
    });

    describe('init', function(){
        it('inits and returns methods', function(){
            routes = routes(__dirname, {
                controllerDir: '/',
                fileExtension: '',
            });

            assert.ok(routes.match);
            assert.ok(routes.resources);
            assert.ok(routes.root);
        });
    });

    describe('routes#root()', function(){
        it('creates a root route', function(){

            routes.root(app, 'controller#index');

            assert.ok(app._get['/']);
            assert.equal(typeof app._get['/'], typeof function() {});

        });
    });

    describe('routes#match()', function(){
        it('creates a route with leading /', function(){

            routes.match(app, 'post', '/homepage', 'controller#homepage');    

            assert.ok(app._post['/homepage']);
            assert.equal(typeof app._post['/homepage'], typeof function() {});

        });    
    });

    describe('routes#match()', function(){
        it('creates a route without leading /', function(){

            routes.match(app, 'get', 'foo', 'controller#homepage');    

            assert.ok(app._get['/foo']);
            assert.equal(typeof app._get['/foo'], typeof function() {});

        });    
    });

    describe('routes#resources()', function(){
        it('creates routes for resources', function(){
            routes.resources(app, 'insta');

            assert.ok(app._get['/insta']);
            assert.equal(typeof app._get['/insta'], typeof function() {});
            assert.ok(app._get['/insta/:id']);
            assert.equal(typeof app._get['/insta/:id'], typeof function() {});
            assert.ok(app._put['/insta/:id']);
            assert.equal(typeof app._put['/insta/:id'], typeof function() {});
            assert.ok(app._del['/insta/:id']);
            assert.equal(typeof app._del['/insta/:id'], typeof function() {});
            assert.ok(app._post['/insta']);
            assert.equal(typeof app._post['/insta'], typeof function() {});

        });    
    });
});
