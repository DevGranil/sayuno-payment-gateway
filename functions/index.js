const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const stripeDev = require("stripe")(functions.config().stripe.secret_key)



exports.stripeCheckout = functions.https.onCall(async(data, context) => {
    const plan = data['plan'];
    const mode = data['mode'];
    const userId = data['stripeUId'];
    const productId = data['id'];
    const paymentRef = data['paymentRef'];

    const session = await stripeDev.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            // name: name,
            // description: description,
            // amount: Math.round(price * 100),
            // currency: 'gbp',
            // quantity: 1
            price: productId,
            // For metered billing, do not pass quantity
            quantity: 1,
    

        }],
        client_reference_id: paymentRef,
        customer: userId,
        mode: mode,
        success_url: 'http://localhost:4200/app/stripe-redirect?action=success&plan='+plan+'&paymentid='+paymentRef,
        cancel_url: 'http://localhost:4200/app/stripe-redirect?action=cancel&paymentid='+paymentRef
    })

    return session;
})

exports.stripeCheckoutProd = functions.https.onCall(async(data, context) => {
    const plan = data['plan'];
    const mode = data['mode'];
    const userId = data['stripeUId'];
    const productId = data['id'];
    const paymentRef = data['paymentRef'];

    const session = await stripeDev.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            // name: name,
            // description: description,
            // amount: Math.round(price * 100),
            // currency: 'gbp',
            // quantity: 1
            price: productId,
            // For metered billing, do not pass quantity
            quantity: 1,
    

        }],
        client_reference_id: paymentRef,
        customer: userId,
        mode: mode,
        success_url: 'https://sayuno-app.web.app/app/stripe-redirect?action=success&plan='+plan+'&paymentid='+paymentRef,
        cancel_url: 'https://sayuno-app.web.app/app/stripe-redirect?action=cancel&paymentid='+paymentRef
    })

    return session;
})


exports.stripeCreateCustomer = functions.https.onCall(async(data, context) => {
    const customer = await stripeDev.customers.create();

    return customer
})

exports.stripeCreateCustomerProd = functions.https.onCall(async(data, context) => {
    const customer = await stripeDev.customers.create();

    return customer
})


exports.stripeGetSession = functions.https.onCall(async(data, context) => {
    const paymentId = data['paymentId'];
    const session = await stripeDev.checkout.sessions.retrieve(
        paymentId
      );

      return session;
})


exports.stripeGetSessionProd = functions.https.onCall(async(data, context) => {
    const paymentId = data['paymentId'];
    const session = await stripeDev.checkout.sessions.retrieve(
        paymentId
      );

      return session;
})

exports.stripeSubscriptionPortal = functions.https.onCall(async(data, context) => {
    const userId = data['stripeUId'];
    const paymentId = data['paymentId']

    const portalSession  = await stripeDev.billingPortal.sessions.create({
        customer: userId,
        return_url: 'http://localhost:4200/app/stripe-redirect?action=subscription&paymentid='+paymentId+'&stripeuid='+userId
    })

    return portalSession
})

exports.stripeSubscriptionPortalProd = functions.https.onCall(async(data, context) => {
    const userId = data['stripeUId'];
    const paymentId = data['paymentId']

    const portalSession  = await stripeDev.billingPortal.sessions.create({
        customer: userId,
        return_url: 'https://sayuno-app.web.app/app/stripe-redirect?action=subscription&paymentid='+paymentId+'&stripeuid='+userId
    })

    return portalSession
})



exports.stripeSubscriptionList = functions.https.onCall(async(data, context) => {
    const userId = data['stripeUId'];

    const subscription = await stripeDev.subscriptions.list({
        customer: userId
    })


    return subscription
})

exports.stripeSubscriptionListProd = functions.https.onCall(async(data, context) => {
    const userId = data['stripeUId'];

    const subscription = await stripeDev.subscriptions.list({
        customer: userId
    })


    return subscription
})