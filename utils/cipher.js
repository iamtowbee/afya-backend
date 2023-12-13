const crypto = require('crypto');

// Server secret stored in the env variables
const serverSecretKey = process.env.SERVER_SECRET_KEY;

// Function to encrypt the DID
exports.encryptDID = (did, userSecretKey) =>
{
  // Concatenate the server's key and the user's key to form the composite key
  const compositeKey = Buffer.concat([Buffer.from(serverSecretKey, 'utf-8'), Buffer.from(userSecretKey, 'utf-8')]);
  console.log("Composite Key", compositeKey)

  // Create a SHA-256 hash of the server's secret key and take the first 32 characters as the encryption key
  let encryptionKey = crypto.createHash('sha256').update(String(compositeKey)).digest('base64').slice(0, 32);
  console.log("Encrypted Composite Key", encryptionKey)

  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16).toString('hex').slice(0, 16);

  // Encryption
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encryptedDID = cipher.update(did, 'utf-8', 'hex');
  encryptedDID += cipher.final('hex');

  // Concatenate IV with the encrypted data
  return {"finalCipher": iv + encryptedDID};
}

// Function to decrypt the DID
exports.decryptDID = (encryptedDID, userSecretKey) =>
{
  // Concatenate the server's key and the user's key to form the composite key
  const compositeKey = Buffer.concat([Buffer.from(serverSecretKey, 'utf-8'), Buffer.from(userSecretKey, 'utf-8')]);
  console.log("Composite Key", compositeKey)

   // Extract the IV and encrypted data from the input
  const iv = encryptedDID.slice(0, 16);
  const encryptedData = encryptedDID.slice(16);

  // Create a SHA-256 hash of the server's secret key and take the first 32 characters as the encryption key
  const encryptionKey = crypto.createHash('sha256').update(String(compositeKey)).digest('base64').slice(0, 32);
  console.log("Combined User and Server Keys", encryptionKey)

  // Decryption
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  let decryptedDID = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedDID += decipher.final('utf-8');

  return decryptedDID;
}