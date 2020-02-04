from twilio.rest import Client
client = Client(account_sid, auth_token)

#sms
message = client.messages \
                .create(
                     body="test", #up to you
                     from_='+1', #dont change. 1 acc, 1 unique phone number
                     to='+65' #your registered phone number )
