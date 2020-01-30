//set constants for security
const accountSid = 'ACe2b224e4761970ae4dbccaaf01f849b4';
const authToken = '1d3d80432f711600a18cf5c7f239abf2';
const client = require('twilio')(accountSid, authToken);
const admin = require('firebase-admin');

//twillo functions
// client.messages
//   .create({
//      body: 'Testing please reply',
//      from: '+18022424685',
//      to: '+6598398720'
//    })
//   .then(message => console.log(message.sid));

//firestore
let serviceAccount = require('C:/Users/WilsonNg/Documents/School/Y3S2/FYP/unexpected-fyp-daec7d58f9d1.json');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

// getting user phone number

function retrievePhoneNumber() { 
    db.collection('Catering_orders').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
        var docdata = doc.data().Customer;
        //capture Customer from here
        let customersRef = db.collection('Customers').doc(docdata._path.segments[1]);
        let getDoc = customersRef.get()
        .then(doc => {
            if (!doc.exists) {
            console.log('No such document!');
            } else {
                twillioSms(doc.data().HP);
                console.log(doc.data().HP); //this directly extracts the phone number
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
} ;

// sms function (twillo)
function twillioSms(number){
    client.messages
    .create({
        body: 'Testing please reply',
        from: '+18022424685',
        to:  '+65'+ number
    })
    .then(message => console.log(message.sid));
} ;

function todayDate() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return(date);
} ;

function timeNow() {
    var d = new Date();
    var min = d.getMinutes();
    var hour = d.getHours();
    if (String(hour).length < 2) {
        var hour = "0" + String(hour)
    };
    if (String(min).length < 2){
        var min = "0" + String(min)
    } ;
    var newTime = String(hour) + String(min);
    return (String(newTime));
} ;

function timeMin(timeIn){ //convert to minute
    var timeSplit = timeIn.split("");
    var hour = timeSplit[0] + timeSplit[1];
    var minutes = (Number(hour) * 60) + Number(timeSplit[2] + timeSplit[3]);
    return minutes;
};

function timeMinEvent(timeIn){ //for 3 hours event
    var timeSplit = timeIn.split("");
    var hour = timeSplit[0] + timeSplit[1];
    var minutes = (Number(hour) * 60) + Number(timeSplit[2] + timeSplit[3]) + 180;
    return minutes;
};


function smsCustomer(listEvents){
    listEvents.forEach(
        event => {
            let cateringRef = db.collection('Catering_orders').doc(event);
            let getDoc = cateringRef.get()
            .then(doc => {
                if (!doc.exists) {
                console.log('No such document!');
                } else {
                    var timeEvent = doc.data().Time;
                    if (timeMinEvent(timeEvent) - timeMin(timeNow()) < 30 ){ //change
                        console.log(timeMinEvent(timeEvent) - timeMin(timeNow()));
                        var docdata = doc.data().Customer;
                        let customersRef = db.collection('Customers').doc(docdata._path.segments[1]);
                        let getDoc = customersRef.get()
                        .then(doc => {
                            if (!doc.exists) {
                            console.log('No such document!');
                            } else {
                            // console.log(doc.data().HP); //this directly extracts the phone number. Can swap out to Twillo SMS function
                            twillioSms(doc.data().HP);
                            }
                        })
                        .catch(err => {
                            console.log('Error getting document', err);
                        });
                        listEvents.splice(listEvents.indexOf(event), 1);
                    }
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
        }
    )
};

arrayEvents = [];
todayDate = todayDate();

let ordersRef = db.collection('Catering_orders');
let query = ordersRef.where('DateOnly', '==', todayDate).get() //get the orders for today
    .then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        }  
        snapshot.forEach(doc => {
            arrayEvents.push(doc.id);
        });
        //console.log (arrayEvents); //arrayEvents only work here. Need to find a workaround.
        setInterval(() => smsCustomer(arrayEvents), 10000); //change timing
    })
    .catch(err => {
        console.log('Error getting documents', err);
});