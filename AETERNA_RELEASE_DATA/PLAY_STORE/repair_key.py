import base64
import os

key_b64 = (
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/W2y+vnG/EbIF"
    "2ZsAYrXFDFtWFRE79OcEYV2Gwb3JQITv35DxRZMkns8R3ByTyipy6EhFh4sjqOBK"
    "eZhZJXr7WwA2gKPXQAsG121IgiLih59eSqOGV/t8IAp+702mlpnoUkp3tznsjQZY"
    "N39AQWNaQ8F1HW69wNxUVh90rrHcBd5gvSRqJAm+q57iRXL0Jw819tpWkRp/zt6K"
    "2Xo3oJkqOjJ0jbfijToreHzCvVQI2QzGPrla66LngSZPV7B2tFPZwED/IxyeftOK"
    "qqoAgdjcygUIF5TRVENvXr6lhsKzdrJARGt4WCJrxoQXauz/nsD0s/mUGqHZYpHC"
    "NGqKtBIJAgMBAAECggEATjKQulP+DJwxGTXnIx2zdS5LBt7+F3fJjh8xxpdWtK7S"
    "hGnig84wRrdFHGHMJdLoTOPCYPN2dyCUY6rUCJ4J5zy1VhB0o8pOl0GirY5MrjDI"
    "/hHXSFec9Ajt8RherZR+mZNDTi/IknPA43zuWfY+oQzuOitIbW+qOialnRukoCnq"
    "zAeKyjYJvzetez7yBerft6tX1GupVGz/qboUXjz6UjUMemwR8UK6WXkN/hMeoa6Y"
    "ld0JpTrsJ/HJZ1YjV5sBYhACrZ3PN2H8RJqrNsnhexpRFmNdOwsaLGgVoGKfTGCK"
    "5iKLUeEAkdUP7AUb3LpaYR7a9OriFMOWzqHZpr2WjwKBgQDkpQBnjEzVjzYfpY3T"
    "KH/mlQE/vQgCkUDf3zfilqGy5dutGKJjzWom4DIe6yC9rnTcQ9gkm9X3M3Rv16wO"
    "SIvM0PuwyL5BBA1Tg7LE0WYgY4qARvdbytmi9WHf8C9gGWTgB4y9Lj/eCM0w4/Bx"
    "RgMvCM1noML93DecuPIVZhfvDwKBgQDWQF9YSTsljGGTEo8I6RwIh55LInYPN9gK"
    "yF2+Q2dX9eyUIZP2/Mbqmj9L9MHF4enrgasH/GWUkv4RitrS8EBYI1rvoploFRl"
    "k7pEMcnjvLFDG2yD9nNP8XdLYNf4CP8lNa2nboQCk1rO8bkQ7jQA9kPVv7AbjeMQ"
    "gZMfBR7tZwKBgQDS5MK/v/Aq12KDxC9Rwjxe0beKM/CMdbASDpE8hdX17gA24879"
    "IT41R3vTeusDKkQN2uIlujucPLC8bID917pjG6vbvv2FeJhWHNaqpb5+R3I7qbmE"
    "yFD/9zfk12TLTgD2huAwqtUsFpA09ToVMQ/EtWjImcbhYttEym44gKe4zwKBgQC8"
    "xYT8VbGOWMzT96MdF77CaTN4QcnBiNOKMEEdAT0UrxBuJPLiRApEEvZkNhH6CqpU"
    "fEmWuKJ0bthOzQyOgfVxEDAqgXyRJB2YTfvs/+1BAc0xMmV/M9LP2hHg0VgYS1z6"
    "3Pu/LOmVF14IPgRwPWCGhHSqTTWOYYpxzajhyPJB+wKBgDcyCaBeLqoIsy3vQUTL"
    "fGw66e0FFguJTb/ogVKmlzFD8otbZBhD4bfk7q+7RN9tOPeKWhDMSUAQeWSDG9yM"
    "Vnx5ilKt7Glj2bZ7k1aEPz6ZgdSCn6PI56CAPyI2x17YI2kN74pJGddMR7R98oBv"
    "DyywcPfP8vCK86bO8mUbpq1e"
)

try:
    # Опитваме се да декодираме Base64 с добавяне на padding автоматично
    missing_padding = len(key_b64) % 4
    if missing_padding:
        key_b64 += '=' * (4 - missing_padding)

    decoded = base64.b64decode(key_b64)
    print("✅ Base64 декодирането е успешно!")

    # Сега го записваме в DER формат (бинарно)
    with open("Z:/AETERNA_RELEASE_DATA/keys/private.der", "wb") as f:
        f.write(decoded)
    print("✅ Ключът е записан в private.der")

except Exception as e:
    print(f"❌ ПРОВАЛ: {str(e)}")
