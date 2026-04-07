import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_FILE = 'Z:/AETERNA_RELEASE_DATA/keys/service-account.json'

def check():
    with open(KEY_FILE, 'r') as f:
        info = json.load(f)
    scopes = ['https://www.googleapis.com/auth/androidpublisher']
    credentials = service_account.Credentials.from_service_account_info(info, scopes=scopes)
    service = build('androidpublisher', 'v3', credentials=credentials)

    pkg = 'com.aeterna.sovereign' # Това, което видях на снимката ти
    print(f"Проверка на права за ОСНОВНОТО приложение: {pkg}")
    try:
        edit = service.edits().insert(packageName=pkg, body={}).execute()
        print(f"✅ УСПЕХ! Имаш достъп до {pkg}!")
    except Exception as e:
        print(f"❌ ГРЕШКА ПРИ {pkg}: {e}")

if __name__ == '__main__':
    check()
