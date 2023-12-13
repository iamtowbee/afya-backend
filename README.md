# Afya DID API Documentation

## Introduction

Welcome to the Afya DID API! This API provides functionality for generating and checking encrypted Decentralized Identifiers (DIDs). DIDs are unique identifiers associated with a particular entity or user. The API utilizes secure 256-bit encryption, `AES-256-CBC`, to secure DIDs.

## API Base URL

The base URL for the API is `https://your-api-base-url.com`.

## Routes

### Generate Encrypted DID

Endpoint: `/gen-did`

**Method:** `GET`

**Description:** Generate an encrypted DID using a provided secret key.

**Parameters:**
- `secretKey` (Query Parameter): A 6-digit sequence serving as the secret key for encryption.
- `email` (Query Parameter): Email address for uniqueness

**Example Request:**
```bash
curl -X GET "https://your-api-base-url.com/gen-did?secretKey=123456&email=example@mail.com"
```

**Example Response:**
```json
{
  "encryptedDID": "aA12sDeR..."
}
```

### Check Decrypted DID

Endpoint: `/check-did`

**Method:** `GET`

**Description:** Decrypt an encrypted DID using the initial secret key.

**Parameters:**
- `secretKey` (Query Parameter): The 6-digit sequence used for initial encryption.
- `encryptedDID` (Query Parameter): The encrypted DID to be decrypted.

**Example Request:**
```bash
curl -X GET "https://your-api-base-url.com/check-did?secretKey=123456&encryptedDID=aA12sDeR..."
```

**Example Response:**
```json
{
  "decryptedDID": "your-decrypted-did"
}
```

## TODO (Afya DID API v2)

In `v2`, we'll be creating an endpoint that will enable users to create their DID using just an email and secet key (6 digit PIN) and encrypt it, then store the encrypted DID alongside the auth credentials into a MongoDB datastore.

The API will be more robust and will form a core feature in our decentralized EHR solution. The preview is available on the `beta` branch of this repo.

## Error Handling

- If the provided secret key is not a 6-digit sequence, the API will return an HTTP 400 Bad Request response with an error message.
- If decryption fails, the API will return an HTTP 500 Internal Server Error response with an error message.

## Security

- Ensure that all communication with the API is done over HTTPS to protect sensitive information.

## Contributing

If you encounter any issues or have suggestions for improvements, please feel free to create an issue or submit a pull request.

---
