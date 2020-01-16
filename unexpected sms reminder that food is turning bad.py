from twilio.rest import Client
account_sid = 'ACe2b224e4761970ae4dbccaaf01f849b4' #dont change account specific
auth_token = '1d3d80432f711600a18cf5c7f239abf2' #dont change account specific
client = Client(account_sid, auth_token)

#sms
message = client.messages \
                .create(
                     body="test", #up to you
                     from_='+18022424685', #dont change. 1 acc, 1 unique phone number
                     to='+6598398720' #your registered phone number )