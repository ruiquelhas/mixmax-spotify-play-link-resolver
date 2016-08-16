#! /usr/bin/env node

'use strict';

const Hapi = require('hapi');
const Resolver = require('../');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(Resolver, (err) => {

    if (err) {
        throw err;
    }

    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log(`Server running at: ${server.info.uri}`);
    });
});
