const HMS = require('@100mslive/server-sdk');

const hmsServer = new HMS.SDK(
    process.env.HMS_ACCESS_KEY,
    process.env.HMS_APP_SECRET
);

module.exports = hmsServer;
