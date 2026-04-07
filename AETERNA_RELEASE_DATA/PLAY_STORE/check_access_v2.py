import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_FILE = 'Z:/AETERNA_RELEASE_DATA/keys/service-account.json'
packages = ['com.aeterna.aqualedger', 'com.aeterna.codemedic', 'com.aeterna.deepshield']

def check():
    with open(KEY_FILE, 'r') as f:
        info = json.load(f)

    scopes = ['https://www.googleapis.com/auth/androidpublisher']
    credentials = service_account.Credentials.from_service_account_info(info, scopes=scopes)
    service = build('androidpublisher', 'v3', credentials=credentials)

    print(f"--- ПРОВЕРКА НА ПРАВА ЗА: {info['client_email']} ---")

    for pkg in packages:
        try:
            # Опитваме да създадем празен Edit - това е най-добрият тест за права
            edit = service.edits().insert(packageName=pkg, body={}).execute()
            print(f"✅ УСПЕХ: Имаш достъп до {pkg}!")
        except Exception as e:
            if "404" in str(e):
                print(f"❌ 404: Приложението {pkg} не е намерено или акаунтът няма права!")
            else:
                print(f"⚠️ ДРУГА ГРЕШКА ПРИ {pkg}: {e}")

if __name__ == '__main__':
    check()
