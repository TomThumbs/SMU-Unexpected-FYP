from twilio.rest import Client
client = Client(account_sid, auth_token)

#sms
message = client.messages \
                .create(
                     body=text_body,
                     from_='+1',
                     to=hp  '+65'              )

#whatsapp
message = client.messages.create(
                              body=text_body,
                              from_='whatsapp:+1',
                              to='whatsapp:'+hp
                          )

#tele
from twx.botapi import TelegramBot, ReplyKeyboardMarkup
bot = TelegramBot('706256156:AAFjCPB4IsmMxrh8u6GheEzAbNldb9Znhuo')
bot.update_bot_info().wait()

user_id = int(tele)

result = bot.send_message(user_id, text_body).wait()
