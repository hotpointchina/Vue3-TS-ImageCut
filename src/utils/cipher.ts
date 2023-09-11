import CryptoJS from 'crypto-js';

export interface EncryptionParams {
  key: string;
  iv: string;
}

export class AesEncryption {
  private key;
  private iv;

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt;
    if (key) {
      this.key = CryptoJS.enc.Utf8.parse(key);
    }
    if (iv) {
      this.iv = CryptoJS.enc.Utf8.parse(iv);
    }
  }

  get getOptions() {
    return {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.pkcs7,
      iv: this.iv,
    };
  }

  encryptByAES(cipherText: string) {
    return CryptoJS.AES.encrypt(cipherText, this.key, this.getOptions).toString();
  }

  decryptByAES(cipherText: string) {
    return CryptoJS.AES.decrypt(cipherText, this.key, this.getOptions).toString(
      CryptoJS.enc.Utf8,
    );
  }

  get getPwdOptions() {
    return {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.key,
    };
  }

  pwdEncryptByAES(cipherText: string) {
    // const key = CryptoJS.enc.Latin1.parse(this.key);
    // return CryptoJS.AES.encrypt(data, key, {
    //   iv: key,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    //   // padding: CryptoJS.pad.ZeroPadding
    // }).toString();
    return CryptoJS.AES.encrypt(cipherText, this.key, this.getPwdOptions).toString();
  }

  pwdDecryptByAES(cipherText: string) {
    // const key = CryptoJS.enc.Latin1.parse(this.key);
    return CryptoJS.AES.decrypt(cipherText, this.key, this.getPwdOptions).toString(
      CryptoJS.enc.Utf8,
    );
  }
}

export function encryptByBase64(cipherText: string) {
  return CryptoJS.enc.Utf8.parse(cipherText).toString(CryptoJS.Base64);
}

export function decodeByBase64(cipherText: string) {
  return CryptoJS.Base64.parse(cipherText).toString(CryptoJS.enc.Utf8);
}

export function encryptByMd5(password: string) {
  return CryptoJS.MD5(password).toString();
}
export const cacheCipher = {
  key: 'zyxk@2022xsqjgpt',
  iv: 'zyxk@2022xsqjgpt',
};
