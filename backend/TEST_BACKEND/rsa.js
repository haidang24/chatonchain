import crypto from "crypto";

const generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });
    return { publicKey, privateKey };
  };
  
  const { publicKey, privateKey } = generateKeyPair();
  // MA HOA DATA
  const data = 'xin chào các bạn';

  const encrypt = (data, publicKey) => {
    const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
    return encryptedData.toString('base64');
  };
  
  const encryptedData = encrypt(data, publicKey);
  console.log('Dữ liệu được mã hóa:', encryptedData);
  
//GIAIMA
  const decrypt = (encryptedData, privateKey) => {
  const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
  return decryptedData.toString();
};

const decryptedData = decrypt(encryptedData, privateKey);
console.log('Dữ liệu được giải mã:', decryptedData);
