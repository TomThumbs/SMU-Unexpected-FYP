//set constants for security
const client = require('twilio')(accountSid, authToken);
const admin = require('firebase-admin');


//firestore
let serviceAccount = require('C:/Users/WilsonNg/Documents/School/Y3S2/FYP/unexpected-fyp-daec7d58f9d1.json');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

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

function twillioSms(listItems){
    client.messages
    .create({
        body: "Please note these are the items that will be expiring today : " + listItems ,
        from: '+15', //CHANGE THIS
        to:  '+65'
    })
    .then(message => console.log(message.sid));
} ;



toExpiry = twoDaysExpiry();
arrayItems = [];

let itemsRef = db.collection('Ingredient_RFID');
let query = itemsRef.where('Date of expiry', '==', toExpiry).get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  
    snapshot.forEach(doc => {
      arrayItems.push(doc.data().Name);
    });
    //Manipulate from here
    twillioSms(arrayItems);
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
