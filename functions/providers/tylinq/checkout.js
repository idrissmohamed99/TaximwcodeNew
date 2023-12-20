const fetch = require('node-fetch');
const templateLib = require('./template');
const admin = require('firebase-admin');
const { Console } = require('console');
const addToWallet = require('../../common').addToWallet;
const request = require('request');
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;
const config = require('../../config.json').paymentMethods.tylinq;
const API_URL = "https://wla3xiw497.execute-api.eu-central-1.amazonaws.com/payment/initiate";
const ACCOUNT_NO = config.STORE_ID;
const API_KEY = config.API_TOKEN;
const ejs = require('ejs');

module.exports.render_checkout = async function (req, res) {
    const order_id = req.body.order_id;
    const amount = parseFloat(req.body.amount).toFixed(2);
    const refr = req.get('Referrer');
    const server_url =
        refr && (refr.includes('bookings') || refr.includes('userwallet'))
            ? refr.substring(0, refr.length - (refr.includes('bookings') ? 8 : 10))
            : req.protocol + "://" + req.get('host') + "/";

    console.log(req.body);

    const requestData = {
        "id": ACCOUNT_NO,
        "amount": amount,
        "phone": '920000000', // Remove country code
        "email": req.body.email,
        "backend_url": `${server_url}tylinq-process`,
        "frontend_url": `${server_url}success?order_id=${order_id}&amount=${req.body.amount}`,
        "custom_ref": order_id
    };

    console.log(requestData);

    const formBodyParams = new URLSearchParams(requestData).toString();

    try {
        // Show loader
        // res.send(ejs.render(getTemplate(true, null)));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: formBodyParams
        });

        const json = await response.json();

        if (json.url) {
            // Hide loader
            return res.send(ejs.render(templateLib.getTemplate(true, json.url)));
        } else {
            console.log(json);
            return res.redirect('/cancel');
        }
    } catch (error) {
        console.log(error);

         // Hide loader
         return res.redirect('/cancel');
     }
};



module.exports.process_checkout = function (req, res) {

    console.log("requset", req);
    console.log("response", res);
    const order_id = req.body.custom_ref;
    const transaction_id = req.body.our_ref;
    const amount = req.body.amount;

    admin.database().ref('bookings').child(order_id).once('value', snapshot => {
        if (snapshot.val()) {
            const bookingData = snapshot.val();
            UpdateBooking(bookingData, order_id, transaction_id, 'TLYNC');
            res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
        } else {
            if (order_id.startsWith("wallet")) {
                addToWallet(order_id.substr(7, order_id.length - 12), amount, order_id, transaction_id);
                res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
            } else {
                res.redirect('/cancel');
            }
        }
    });
};

