import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import date
import time 

#functions


# Use a service account
cred = credentials.Certificate('C:/Users/WilsonNg/Documents/School/Y3S2/FYP/unexpected-fyp-daec7d58f9d1.json')
default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

today_date = str(date.today())

#calls list of events happening
docs = db.collection(u'Catering_orders').where(u'Date', u'==', today_date).stream()


#infinite loop checking
# while True:
#     time.sleep(3)
#     t = time.localtime()
#     current_time = time.strftime("%H%M", t)
#     for doc in docs:
#         if (doc.to_dict()["Time"]) == int(current_time):
#             print("Send SMS")
#         print(current_time)

local_list = []
for doc in docs:
    local_list.append(doc.to_dict())


while True:
    time.sleep(30)
    t = time.localtime()
    current_time = time.strftime("%H%M", t)
    for item in local_list:
        if (item["Time"]) == int(current_time):
            print("Dear Customer, please kindly note that we will be clearing the buffet in 1 hour and consumption is not recommended beyond this time for your own safety. Thank you choosing Fresh Food Labs as your Catering Provider. ") #notification
        print(current_time)

# for doc in docs:
#     if (doc.to_dict()["Time"]) == 1000:
#         print("SmS")

# for doc in docs:
#     print(doc.id) #this is the event name 
#     print(doc.to_dict()) #this is the details of the event
