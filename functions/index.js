const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const stripe = require("stripe")(functions.config().stripe.secret_key)

exports.stripeCheckout = functions.https.onCall(async(data, context) => {

    var db = admin.firestore();
    var productId = data['id'];
    console.log(productId)
    var doc = await db.collection('price-plans').doc(productId).get();
   
    var price = doc.data().price;
    var name = doc.data().name;
   
 


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            name: name,
            description: 'description',
            amount: Math.round(price * 100),
            currency: 'gbp',
            quantity: 1

        }],
        mode: 'payment',
        success_url: 'http://localhost:4200/app/plans?action=success',
        cancel_url: 'http://localhost:4200/app/plans?action=cancel'
    })

    return session.id;
})