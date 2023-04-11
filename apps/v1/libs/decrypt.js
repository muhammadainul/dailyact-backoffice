const crypto = require("crypto")
const algorithm = myConfig.crypto.algorithm
const key = crypto
    .createHash('sha256')
    .update(String(myConfig.crypto.key))
    .digest('base64')
    .substr(0, 32)

const decryptFile = encrypted => {
    // Get the iv: the first 16 bytes
    const iv = encrypted.slice(0, 16)
    // Get the rest
    encrypted = encrypted.slice(16)
    // Create a decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    // Actually decrypt it
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return result
}

module.exports = decryptFile