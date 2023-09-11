import CryptoJS from 'crypto-js';

const info = {
  // 请根据实际业务进行调整
  key: 'ceeei@2023',
  iv: 'dfwbw3i@2023',
  codeKey: '',
  codeIv: '',
};
info.codeKey = CryptoJS.enc.Utf8.parse(info.key);
info.codeIv = CryptoJS.enc.Utf8.parse(info.iv);


// 加密
export function encryptionHandler( secretStr ){
  let encrypted = CryptoJS.AES.encrypt( secretStr, info.codeKey, {
      iv: info.codeIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });
  encrypted = encrypted.toString();
  return encrypted;
}
 

// 解密
export function decryptedHandler( str ){
  let decrypted = CryptoJS.AES.decrypt( str, info.codeKey, {
    iv: info.codeIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
  return decrypted;
}
