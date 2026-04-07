import os
import json
import re
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_FILE = 'Z:/AETERNA_RELEASE_DATA/keys/service-account.json'
APK_DIR = 'Z:/AETERNA_RELEASE_DATA/APK_DEPLOY'

def fix_key():
    with open(KEY_FILE, 'r') as f:
        data = json.load(f)

    # Почистваме ключа от всякакви излишни интервали и грешни ескейпвания
    key = data['private_key']
    # Ако има двойни наклонени черти \\n, ги правим единични \n
    key = key.replace('\\n', '\n')
    # Премахваме интервали в началото и края на всеки ред
    lines = [line.strip() for line in key.split('\n') if line.strip()]
    fixed_key = '\n'.join(lines)
    if not fixed_key.endswith('\n'):
        fixed_key += '\n'

    data['private_key'] = fixed_key

    with open(KEY_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    print("✅ Ключът е почистен и преформатиран!")

apps_config = {
    'com.aeterna.aqualedger': 'aqualedger-release.apk',
    'com.aeterna.codemedic': 'codemedic-release.apk',
    'com.aeterna.deepshield': 'deepshield-release.apk',
    'com.aeterna.mindforge': 'mindforge-release.apk',
    'com.aeterna.netguard': 'netguard-release.apk',
    'com.aeterna.wealthguard': 'wealthguard-release.apk'
}

def run():
    fix_key()

    scopes = ['https://www.googleapis.com/auth/androidpublisher']
    credentials = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=scopes)
    service = build('androidpublisher', 'v3', credentials=credentials)

    for package_name, apk_filename in apps_config.items():
        apk_path = os.path.join(APK_DIR, apk_filename)
        print(f"\n📦 [{package_name}]")

        try:
            edit = service.edits().insert(packageName=package_name, body={}).execute()
            edit_id = edit['id']

            media = MediaFileUpload(apk_path, mimetype='application/vnd.android.package-archive')
            service.edits().apks().upload(editId=edit_id, packageName=package_name, media_body=media).execute()

            print(f"   ✅ Качен!")
            service.edits().commit(editId=edit_id, packageName=package_name).execute()
        except Exception as e:
            print(f"   ❌ Грешка: {str(e)}")

if __name__ == '__main__':
    run()
