import os
import json
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_FILE = 'Z:/AETERNA_RELEASE_DATA/keys/service-account.json'
APK_DIR = 'Z:/AETERNA_RELEASE_DATA/APK_DEPLOY'

apps_config = {
    'com.aeterna.aqualedger': 'aqualedger-release.apk',
    'com.aeterna.codemedic': 'codemedic-release.apk',
    'com.aeterna.deepshield': 'deepshield-release.apk',
    'com.aeterna.mindforge': 'mindforge-release.apk',
    'com.aeterna.netguard': 'netguard-release.apk',
    'com.aeterna.wealthguard': 'wealthguard-release.apk'
}

def get_clean_credentials():
    with open(KEY_FILE, 'r') as f:
        info = json.load(f)

    # Махаме всякакви интервали, които може да са се появили при копирането
    clean_key = info['private_key'].strip()
    if '\\n' in clean_key:
        clean_key = clean_key.replace('\\n', '\n')

    info['private_key'] = clean_key
    scopes = ['https://www.googleapis.com/auth/androidpublisher']
    return service_account.Credentials.from_service_account_info(info, scopes=scopes)

def run():
    print("--- СТАРТ (2026 EDITION) ---")

    try:
        credentials = get_clean_credentials()
        service = build('androidpublisher', 'v3', credentials=credentials)
        print("✅ Ключът е зареден и изчистен!")
    except Exception as e:
        print(f"❌ Грешка при зареждане на ключа: {e}")
        return

    for package, apk in apps_config.items():
        path = os.path.join(APK_DIR, apk)
        if not os.path.exists(path):
            print(f"⚠️ Липсва: {apk}")
            continue

        print(f"\n🚀 Качвам {package}...")
        try:
            edit = service.edits().insert(packageName=package, body={}).execute()
            edit_id = edit['id']

            media = MediaFileUpload(path, mimetype='application/vnd.android.package-archive')
            up = service.edits().apks().upload(editId=edit_id, packageName=package, media_body=media).execute()
            vc = up['versionCode']

            # Пращаме в Internal Track
            track_body = {'track': 'internal', 'releases': [{'versionCodes': [str(vc)], 'status': 'completed'}]}
            service.edits().tracks().update(editId=edit_id, packageName=package, track='internal', body=track_body).execute()

            service.edits().commit(editId=edit_id, packageName=package).execute()
            print(f"✅ УСПЕХ! Версия {vc}")

        except Exception as e:
            print(f"❌ ГРЕШКА: {e}")

if __name__ == '__main__':
    run()
