import winston from 'winston';
const log = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      colorize: true
    })
  ]
});

export default module.exports = {
  env: 'development',
  port: 9000,
  log
};
