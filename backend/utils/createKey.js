
import crypto from "crypto";

const generateKeyPair = () => {
    try {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
        });
        return { publicKey, privateKey };
    } catch (error) {
        console.error("Error generating key pair:", error);
    }
};

export default generateKeyPair;