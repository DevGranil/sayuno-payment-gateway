const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const stripeDev = require("stripe")(functions.config().stripe.secret_key)



exports.stripeCheckout = functions.https.onCall(async(data, context) => {
    const plan = data['plan']

    const session = await stripeDev.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            // name: name,
            // description: description,
            // amount: Math.round(price * 100),
            // currency: 'gbp',
            // quantity: 1
            price: data['id'],
            // For metered billing, do not pass quantity
            quantity: 1,
    

        }],
        mode: data['mode'],
        success_url: 'http://localhost:4200/app/stripe-redirect?action=success&session_id={CHECKOUT_SESSION_ID}&plan='+plan,
        cancel_url: 'http://localhost:4200/app/stripe-redirect?action=cancel&session_id={CHECKOUT_SESSION_ID}'
    })

    return session;
})

exports.stripeCheckoutProd = functions.https.onCall(async(data, context) => {
    const plan = data['plan']
    const session = await stripeDev.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: data['id'],
          // For metered billing, do not pass quantity
          quantity: 1,

        }],
        mode: data['mode'],
        success_url: 'https://sayuno-app.web.app/app/stripe-redirect?action=success&session_id={CHECKOUT_SESSION_ID}&plan='+plan,
        cancel_url: 'https://sayuno-app.web.app/app/stripe-redirect?action=cancel&session_id={CHECKOUT_SESSION_ID}'
    })

    return session;
})