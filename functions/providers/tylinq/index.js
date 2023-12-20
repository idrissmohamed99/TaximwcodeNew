const functions = require('firebase-functions');
const tylinqcheckout = require('./checkout');

exports.link = functions.https.onRequest(tylinqcheckout.render_checkout);
exports.process = functions.https.onRequest(tylinqcheckout.process_checkout);