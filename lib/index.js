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
        const widget = `<iframe src="https://embed.spotify.com/?uri=spotify:${track}" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>`;

        return reply({ body: widget });
    });
};

exports.register = function (server, options, next) {

    server.route({
        config: {
            handler: internals.resolve,
            validate: {
                query: {
                    user: Joi.string().email().required(),
                    url: Joi.string().uri({ scheme: ['http', 'https'] }).required()
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
