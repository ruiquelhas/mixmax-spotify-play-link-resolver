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

    lab.test('returns an error if no query is provided', (done) => {

        server.inject('/resolve', (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.include('user', 'url');

            done();
        });
    });

    lab.test('returns an error if the query does not contain the user email address', (done) => {

        server.inject('/resolve?url=https://foo.bar.com', (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('user');

            done();
        });
    });

    lab.test('returns an error if the query does not contain the url', (done) => {

        server.inject('/resolve?user=foo@bar.com&foo=bar', (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('url');

            done();
        });
    });

    lab.test('returns an error if the url is not from Spotify', (done) => {

        server.inject('/resolve?user=foo@bar.com&url=https://foo.bar.com', (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('url');

            done();
        });
    });

    lab.test('returns a valid mixmax resolver response', (done) => {

        server.inject('/resolve?user=foo@bar.com&url=http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V', (response) => {

            const mixmax = { body: '<iframe src="https://embed.spotify.com/?uri=spotify:track:2TpxZ7JUBn3uw46aR7qd6V" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>' };

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal(mixmax);

            done();
        });
    });
});
