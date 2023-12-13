Certainly! Below is a simple template for your README.md file. It provides a brief introduction, information on how to use the two routes, and examples.

---

# Simple DID API Documentation

## Introduction

Welcome to the Afya DID API! This API provides functionality for generating and checking encrypted Decentralized Identifiers (DIDs). DIDs are unique identifiers associated with a particular entity or user. The API utilizes secure 256-bit encryption `(AES-256-CBC)` to secure DIDs.

## API Base URL

The base URL for the API is `https://your-api-base-url.com`.

## Routes

### Generate Encrypted DID

Endpoint: `/gen-did`

**Method:** `GET`

**Description:** Generate an encrypted DID using a provided secret key.

**Parameters:**
- `secretKey` (Query Parameter): A 6-digit sequence serving as the secret key for encryption.

**Example Request:**
```bash
curl -X GET "https://your-api-base-url.com/gen-did?secretKey=123456"
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

## Error Handling

- If the provided secret key is not a 6-digit sequence, the API will return an HTTP 400 Bad Request response with an error message.
- If decryption fails, the API will return an HTTP 500 Internal Server Error response with an error message.

## Security

- Ensure that all communication with the API is done over HTTPS to protect sensitive information.

## Contributing

If you encounter any issues or have suggestions for improvements, please feel free to create an issue or submit a pull request.

---

You can customize this template further based on your specific details, including additional information about the API, authentication, error responses, and any other relevant details.
