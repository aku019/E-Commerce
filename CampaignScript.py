from unicodedata import category
from pymongo import MongoClient
import requests,json
import sys
import atexit
import time

client = MongoClient('127.0.0.1', 27017)
all_db = "voice_call"
db=client[all_db]
# visitor_collection = db["phone_book"]
# cursor = visitor_collection.find({})
# for document in cursor:
#     print(document)

def upload_to_phonebook(category):
    phone_book_collection = db["phone_book"]
    phone_book = phone_book_collection.find({})
    for phone in phone_book:
        phone_category = phone['category']
        phoneNumbers = phone['phoneNumber']
        if category is not None and category == phone_category:
            return uploadPhoneNumbers(phoneNumbers,category)
        
def uploadPhoneNumbers(numbers,name):
    data = json.dumps({
        "phonebookname" : name,
        "numbers" : ",".join(numbers)
    })
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': 'AlZrlnRSbZ7l3l8YBIkT42WHwMavi84z2pydzX2G',
        'authorization': '339f82d8-45f5-4807-8d4d-5e4497fe7bc1'
    }
    r = requests.post("https://kpi.knowlarity.com/Basic/v1/account/contacts/phonebook",
        headers=headers, data = data)

    #print(r.text)
    if r.status_code == 200:
        data = r.json()
        return data["id"]
    
def launch_campaign(phoneId):

    data = json.dumps({
        "sound_id": "396447", 
        "phonebook": phoneId, 
        "timezone": "Asia/Kolkata", 
        "priority": "1",
        "order_throttling": "10",
        "retry_duration": "15",
        "start_time": "2022-09-10 11:05", 
        "end_time": "2022-09-10 11:35",
        "max_retry": "1",
        "call_scheduling": "[1, 1, 1, 1, 1, 1, 1]", 
        "call_scheduling_start_time": "10:55",
        "call_scheduling_stop_time": "21:00",
        "k_number": "+919986734558",
        "additional_number":"+919903840588",
        "is_transactional": "False"
    })

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': 'AlZrlnRSbZ7l3l8YBIkT42WHwMavi84z2pydzX2G',
        'authorization': '339f82d8-45f5-4807-8d4d-5e4497fe7bc1'
    }
    r = requests.post("https://kpi.knowlarity.com/Basic/v1/account/call/campaign",
        headers=headers, data = data)
    print(r.text)

    if r.status_code == 200:
        data = r.json()
        print(data)
    

def main():
    if len(sys.argv) < 1:
        print("Invalid Arguments passed")
        return
    category = sys.argv[1]
    id = upload_to_phonebook(category)
    print("Phone Book id generated", id)
    time.sleep(30)
    launch_campaign(id)

def clean_up():
	client.close()

if __name__ == "__main__":
	atexit.register(clean_up)
	main()

