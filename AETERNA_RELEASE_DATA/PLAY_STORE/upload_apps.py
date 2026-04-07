import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Пътища
KEY_FILE = 'Z:/AETERNA_RELEASE_DATA/keys/service-account.json'
APK_DIR = 'Z:/AETERNA_RELEASE_DATA/APK_DEPLOY'

apps = [
    { 'packageName': 'com.aeterna.deepshield', 'apkName': 'deepshield-release.apk' },
    { 'packageName': 'com.aeterna.mindforge', 'apkName': 'mindforge-release.apk' },
    { 'packageName': 'com.aeterna.wealthguard', 'apkName': 'wealthguard-release.apk' },
    { 'packageName': 'com.aeterna.netguard', 'apkName': 'netguard-release.apk' },
    { 'packageName': 'com.aeterna.aqualedger', 'apkName': 'aqualedger-release.apk' },
    { 'packageName': 'com.aeterna.codemedic', 'apkName': 'codemedic-release.apk' }
]

def run():
    print("--- СТАРТИРАНЕ НА ПРОЦЕСА (PYTHON) ---")

    # Оторизация
    scopes = ['https://www.googleapis.com/auth/androidpublisher']
    credentials = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=scopes)
    service = build('androidpublisher', 'v3', credentials=credentials)

    for app in apps:
        package_name = app['packageName']
        apk_path = os.path.join(APK_DIR, app['apkName'])

        print(f"\n📦 [{package_name}]")

        if not os.path.exists(apk_path):
            print(f"   ⚠️ APK файлът не е намерен: {apk_path}")
            continue

        try:
            # 1. Създаване на нов "Edit"
            edit = service.edits().insert(packageName=package_name, body={}).execute()
            edit_id = edit['id']

            # 2. Качване на APK
            print(f"   1. Качване на APK ({app['apkName']})...")
            media = MediaFileUpload(apk_path, mimetype='application/vnd.android.package-archive')
            apk_response = service.edits().apks().upload(
                editId=edit_id,
                packageName=package_name,
                media_body=media
            ).execute()

            version_code = apk_response['versionCode']
            print(f"   ✅ Качен! VersionCode: {version_code}")

            # 3. Добавяне в Internal Track
            print(f"   2. Добавяне в Internal Track...")
            service.edits().tracks().update(
                editId=edit_id,
                packageName=package_name,
                track='internal',
                body={
                    'releases': [{
                        'versionCodes': [str(version_code)],
                        'status': 'completed',
                        'name': 'Aeterna Automated Release'
                    }]
                }
            ).execute()

            # 4. Commit на промените
            print(f"   3. Записване (Commit)...")
            service.edits().commit(editId=edit_id, packageName=package_name).execute()

            print(f"🚀 УСПЕХ: {package_name} е активен!")

        except Exception as e:
            print(f"   ❌ ГРЕШКА: {str(e)}")

if __name__ == '__main__':
    run()
