#! /usr/bin/env node

'use strict';

const Fs = require('fs');
const Hapi = require('hapi');
const Package = require('../package.json');
const Program = require('commander');
const Resolver = require('../');

const server = new Hapi.Server();

Program
  .version(Package.version)
  .option('-k, --key [key]', 'TLS key')
  .option('-c, --cert [cert]', 'TLS certificate')
  .parse(process.argv);

if (!Program.key || !Program.cert) {
    server.connection({ port: 3000 });
}
else {
    server.connection({
        port: 3000,
        tls: {
            key: Fs.readFileSync(Program.key),
            cert: Fs.readFileSync(Program.cert)
        }
    });
}

server.register(Resolver, (err) => {

    if (err) {
        return callback(err);
    }

    server.start((err) => {

        if (err) {
            return callback(err);
        }

        console.log(`Server running at: ${server.info.uri}`);
    });
});
