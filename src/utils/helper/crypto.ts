import SM from 'sm-crypto';

interface theKeyModel{
  publicKey: string,
  privateKey: string,
}
type kModel = theKeyModel | '';
let sm2key:kModel = '';
// 获取 公钥 & 私钥
export const sm2GetKey = () => {
  sm2key = {
    privateKey: '919fd83c58316992893362354ec7d011f15a8d17d709aec17e368b522c205836',
    publicKey: '04f9b6af8b23f40c5c4db87f0f61238afb031bbf630f2d06cefddde6bf5a0838a0e5c341313d80611c3e9a2541444076a7293c9b17ef2a66c23569498862ca337a'
  };
  return sm2key
}
export const sm2Encrypt = ( str: string, encrypt:boolean=true  ) => {
  if( typeof(sm2key) == 'string' ){ sm2key = sm2GetKey(); }
  let res:string = '';
  if( encrypt ){
    res = SM.sm2.doEncrypt( str, (sm2key as theKeyModel).publicKey ); 
  }else{ res = SM.sm2.doDecrypt( str, (sm2key as theKeyModel).privateKey ); }
  return res;
}
// 请根据实际业务进行调整
const sm4DefaultKey = '58af'; 
export const sm4Encrypt = ( str: string, sm4Key:string=sm4DefaultKey, encrypt:boolean=true ) => {
  let res:string = '';
  if( encrypt ){
    res = SM.sm4.encrypt( str, sm4Key )
  }else{ res = SM.sm4.decrypt( str, sm4Key ); }
  return res
}
