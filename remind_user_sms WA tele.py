from twilio.rest import Client
account_sid = 'ACe2b224e4761970ae4dbccaaf01f849b4'
auth_token = '1d3d80432f711600a18cf5c7f239abf2'
client = Client(account_sid, auth_token)

#sms
message = client.messages \
                .create(
                     body=text_body,
                     from_='+18022424685',
                     to=hp  '+6598398720'              )

#whatsapp
message = client.messages.create(
                              body=text_body,
                              from_='whatsapp:+14155238886',
                              to='whatsapp:'+hp
                          )

#tele
from twx.botapi import TelegramBot, ReplyKeyboardMarkup
bot = TelegramBot('706256156:AAFjCPB4IsmMxrh8u6GheEzAbNldb9Znhuo')
bot.update_bot_info().wait()

user_id = int(tele)

result = bot.send_message(user_id, text_body).wait()