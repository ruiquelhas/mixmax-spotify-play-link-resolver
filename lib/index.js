'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Uri = require('urijs');

const internals = {};

internals.resolve = function (request, reply) {

    const url = new Uri(request.query.url);

    Joi.validate(url.domain(), Joi.string().valid('spotify.com'), (error) => {

        if (error) {
            const response = Boom.wrap(error, 400);
            response.output.payload.validation = { source: 'query', keys: ['url'] };

            return reply(response);
        }

        const track = url.segment().join(':');

        const widget = `<iframe src="https://embed.spotify.com/?uri=spotify:${track}&theme=${request.query.theme}&view=${request.query.view}" width="${request.query.width}" height="${request.query.height}" frameborder="0" allowtransparency="true"></iframe>`;

        return reply({ body: widget });
    });
};

exports.register = function (server, options, next) {

    // Valid and default options as specified in:
    // https://developer.spotify.com/technologies/widgets/spotify-play-button/

    server.route({
        config: {
            handler: internals.resolve,
            validate: {
                query: {
                    user: Joi.string().email().required(),
                    url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
                    theme: Joi.string().valid('black', 'white').default('black'),
                    view: Joi.string().valid('coverart', 'list').default('list'),
                    height: Joi.number().min(80).max(720).integer().default(380),
                    width: Joi.number().min(250).max(640).integer().default(300)
                }
            }
        },
        method: 'GET',
        path: '/resolve'
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
