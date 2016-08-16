'use strict';

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/resolve',
        handler(request, reply) {

            reply({ body: '' });
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
