import webbrowser

barcode = 123123

url = "https://unexpected-fyp.firebaseapp.com/new-ingredient" + "?id=" + str(barcode)

webbrowser.open(url, new=2)
