import bunyan from 'bunyan';
var bunyanOpts = {
    name: 'API',
    streams: [
        {
            level: 'info',
            path: process.env.PWD + '/logs/logs.json'
        },
        {
            level: 'error',
            path: process.env.PWD + '/logs/logs.json'
        }
    ]
};
var logger = bunyan.createLogger(bunyanOpts);

export default logger;