'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Qs = require('qs');
const Uri = require('urijs');
const Url = require('url');

const internals = {};

internals.parseQuery = function (request, reply) {

    const uri = request.raw.req.url;
    const parsed = Url.parse(uri, false);
    parsed.query = Qs.parse(parsed.query);
    request.setUrl(parsed);

    return reply.continue();
};

internals.resolve = function (request, reply) {

    const url = new Uri(request.query.url);

    Joi.validate(url.domain(), Joi.string().valid('spotify.com'), (error) => {

        if (error) {
            const response = Boom.wrap(error, 400);
            response.output.payload.validation = { source: 'query', keys: ['url'] };

            return reply(response);
        }

        const track = url.segment().join(':');
        const options = request.query.options;

        const widget = `<iframe src="https://embed.spotify.com/?uri=spotify:${track}&theme=${options.theme}&view=${options.view}" width="${options.width}" height="${options.height}" frameborder="0" allowtransparency="true"></iframe>`;

        return reply({ body: widget });
    });
};

exports.register = function (server, options, next) {

    // Add support for querystring objects.
    server.ext('onRequest', internals.parseQuery);

    // Valid and default options as specified in:
    // https://developer.spotify.com/technologies/widgets/spotify-play-button/

    const schema = Joi.object().keys({
        user: Joi.string().email().required(),
        url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
        options: Joi.object().keys({
            theme: Joi.string().valid('black', 'white'),
            view: Joi.string().valid('coverart', 'list'),
            height: Joi.number().min(80).max(720).integer(),
            width: Joi.number().min(250).max(640).integer()
        }).default({
            theme: 'black',
            view: 'list',
            height: 380,
            width: 300
        })
    });

    server.route({
        config: {
            handler: internals.resolve,
            validate: { query: schema }
        },
        method: 'GET',
        path: '/resolver'
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
