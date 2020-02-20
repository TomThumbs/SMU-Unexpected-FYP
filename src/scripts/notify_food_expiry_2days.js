//set constants for security
const accountSid = 'ACe2b224e4761970ae4dbccaaf01f849b4';
const authToken = '1d3d80432f711600a18cf5c7f239abf2';
const client = require('twilio')(accountSid, authToken);
const admin = require('firebase-admin');


//firestore
// let serviceAccount = require('C:/Users/WilsonNg/Documents/School/Y3S2/FYP/unexpected-fyp-daec7d58f9d1.json');

// admin.initializeApp({
// credential: admin.credential.cert(serviceAccount)
// });

var firebaseConfig = {
  apiKey: "AIzaSyDiAYUx42Ns97Hpl8zoxZ6_HNuHquVLOSE",
  authDomain: "unexpected-fyp.firebaseapp.com",
  databaseURL: "https://unexpected-fyp.firebaseio.com",
  projectId: "unexpected-fyp",
  storageBucket: "unexpected-fyp.appspot.com",
  messagingSenderId: "901726295810",
  appId: "1:901726295810:web:2a7d13c77bf56ff227d41b",
  measurementId: "G-4YK051Z3Y5"
};

admin.initializeApp(firebaseConfig);


let db = admin.firestore();

/////////
function twoDaysExpiry() {
    var someDate = new Date();
    var numberOfDaysToAdd = 2;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 

    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear();

    var someFormattedDate = y + '-'+ mm + '-'+ dd;

    return(someFormattedDate)
};

function list_food(list1, list2){
    full_list = []
    var i;
    for (i = 0; i < arrayId.length; i++) {
        var sentence = "ID " + list1[i] + ": "+ list2[i] + " ";
        full_list.push(sentence);
    }
    return(full_list)
}

function twillioSms(listItems){
    client.messages
    .create({
        body: "Please note these are the items that will be expiring today : " + listItems ,
        from: '+18022424685',
        to:  '+6598398720'
    })
    .then(message => console.log(message.sid));
} ;



toExpiry = twoDaysExpiry();
arrayItems = [];
arrayId = [];

let itemsRef = db.collection('Ingredient_RFID');
let query = itemsRef.where('Date_of_expiry', '==', toExpiry).get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  
    snapshot.forEach(doc => {
      arrayId.push(doc.id);
      arrayItems.push(doc.data().Name);
    });
    //Manipulate from here
    var itemslist = list_food(arrayId,arrayItems);
    twillioSms(itemslist); //Change it to include the ID
    //console.log(itemslist);
    
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });