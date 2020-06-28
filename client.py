#Mockup input script

import hashlib
import requests
import json
import urllib3
urllib3.disable_warnings()  #Disable urllib warnings

config = {}     #Load configuration.
with open('config.json', 'r') as f:
    config = json.load(f)
#Configure ip
ip = 'http://' + config["ip"] if config["ip"] != 'localhost' else 'http://127.0.0.1'
ip += ':' + str(config["port"]) + '/'

print("ip: " + ip)

#Payload
data1 = b'{"test": "e"}'
#data2 = bytes(', "name": "' + name + '", "password": "' + pwd + '"}', encoding='utf8')

while True:     #Command handler
    r = None

    op = input("Operation: (post/exit) ")
    if op == "post":  #Send a POST to sign in
        r = requests.post(ip + 'post', data=data1)
    elif op == "exit":  #Exit
        exit()

    print(r)
    print(r.text)