from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

# Прочитаме DER файла
with open("Z:/AETERNA_RELEASE_DATA/keys/private.der", "rb") as f:
    der_data = f.read()

try:
    # Зареждаме бинарните данни като частен ключ (PKCS#8 или PKCS#1)
    # Повечето сервизни акаунти използват PKCS#8
    try:
        key = serialization.load_der_private_key(der_data, password=None)
    except:
        # Опитваме като PKCS#1 ако PKCS#8 се провали
        from cryptography.hazmat.primitives.serialization import load_der_private_key
        key = load_der_private_key(der_data, password=None)

    # Записваме в PEM формат
    pem = key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    with open("Z:/AETERNA_RELEASE_DATA/keys/final_private.pem", "wb") as f:
        f.write(pem)
    print("✅ PEM ключът е генериран успешно в final_private.pem!")

except Exception as e:
    print(f"❌ ГРЕШКА при превръщане: {str(e)}")
