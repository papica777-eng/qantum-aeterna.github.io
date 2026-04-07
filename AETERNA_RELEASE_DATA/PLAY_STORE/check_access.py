import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_FILE = 'Z:/AETERNA_RELEASE_DATA/keys/service-account.json'
packages = [
    'com.aeterna.aqualedger', 'com.aeterna.codemedic', 'com.aeterna.deepshield',
    'com.aeterna.mindforge', 'com.aeterna.netguard', 'com.aeterna.wealthguard'
]

def check():
    with open(KEY_FILE, 'r') as f:
        info = json.load(f)

    scopes = ['https://www.googleapis.com/auth/androidpublisher']
    credentials = service_account.Credentials.from_service_account_info(info, scopes=scopes)
    service = build('androidpublisher', 'v3', credentials=credentials)

    print(f"Проверка за акаунт: {info['client_email']}")

    for pkg in packages:
        try:
            # Опитваме само да прочетем информация за приложението
            app_info = service.applications().get(packageName=pkg).execute()
            print(f"✅ Достъп до {pkg}: ИМА")
        except Exception as e:
            print(f"❌ Достъп до {pkg}: НЯМА ({e})")

if __name__ == '__main__':
    check()
