'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Resolver = require('../');

const lab = exports.lab = Lab.script();

lab.experiment('mixmax-spotify-play-link-resolver', () => {

    let server;

    lab.before((done) => {

        server = new Hapi.Server();
        server.connection();
        server.register(Resolver, done);
    });

    lab.test('returns a valid mixmax resolver response', (done) => {

        server.inject('/resolve', (response) => {

            const mixmax = { body: '' };

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal(mixmax);

            done();
        });
    });
});
