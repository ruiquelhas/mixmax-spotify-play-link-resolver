'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Qs = require('qs');
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

        server.inject('/resolver', (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.include('user', 'url');

            done();
        });
    });

    lab.test('returns an error if the query does not contain the user email address', (done) => {

        const query = Qs.stringify({ url: 'https://www.foo.com' });

        server.inject(`/resolver?${query}`, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('user');

            done();
        });
    });

    lab.test('returns an error if the query does not contain the url', (done) => {

        const query = Qs.stringify({ user: 'foo@bar.com' });

        server.inject(`/resolver?${query}`, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('url');

            done();
        });
    });

    lab.test('returns an error if the url is not from Spotify', (done) => {

        const query = Qs.stringify({ url: 'https://foo.bar.com', user: 'foo@bar.com' });

        server.inject(`/resolver?${query}`, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('url');

            done();
        });
    });

    lab.test('returns a valid mixmax resolver response containing a widget with the default style', (done) => {

        const query = Qs.stringify({
            url: 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V',
            user: 'foo@bar.com'
        });

        server.inject(`/resolver?${query}`, (response) => {

            const mixmax = { body: '<iframe src="https://embed.spotify.com/?uri=spotify:track:2TpxZ7JUBn3uw46aR7qd6V&theme=black&view=list" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>' };

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal(mixmax);

            done();
        });
    });

    lab.test('returns error if the custom widget theme is not valid', (done) => {

        const query = Qs.stringify({
            url: 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V',
            user: 'foo@bar.com',
            theme: 'yellow'
        });

        server.inject(`/resolver?${query}`, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('theme');

            done();
        });
    });

    lab.test('returns error if the custom widget view is not valid', (done) => {

        const query = Qs.stringify({
            url: 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V',
            user: 'foo@bar.com',
            view: 'single'
        });

        server.inject(`/resolver?${query}`, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('view');

            done();
        });
    });

    lab.test('returns error if the custom widget height is not valid', (done) => {

        const query = Qs.stringify({
            url: 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V',
            user: 'foo@bar.com',
            height: 10
        });

        server.inject(`/resolver?${query}`, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('height');

            done();
        });
    });

    lab.test('returns error if the custom widget width is not valid', (done) => {

        const query = Qs.stringify({
            url: 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V',
            user: 'foo@bar.com',
            width: 10
        });

        server.inject(`/resolver?${query}`, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result).to.include('validation');
            Code.expect(response.result.validation).to.include('source', 'keys');
            Code.expect(response.result.validation.source).to.equal('query');
            Code.expect(response.result.validation.keys).to.only.include('width');

            done();
        });
    });

    lab.test('returns a valid mixmax resolver response containing a widget with a custom style', (done) => {

        const query = {
            url: 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V',
            user: 'foo@bar.com',
            theme: 'white',
            view: 'coverart',
            height: 400,
            width: 400
        };

        server.inject(`/resolver?${Qs.stringify(query)}`, (response) => {

            const mixmax = { body: '<iframe src="https://embed.spotify.com/?uri=spotify:track:2TpxZ7JUBn3uw46aR7qd6V&theme=white&view=coverart" width="400" height="400" frameborder="0" allowtransparency="true"></iframe>' };

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal(mixmax);

            done();
        });
    });
});
