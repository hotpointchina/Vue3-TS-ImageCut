// URI编码转换
export function urlencode(str) {
  str = (str + '').toString();
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
}

// 表单参数序列化
export function JsonToUrl(data: any): string {
  const list: string[] = [];
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${urlencode(data[ele])}`);
  });
  return list.join('&');
}

/**
 *
 * @param data
 * @constructor
 */
export function UrlToJson(query: string): {} {
  const realQuery = {};
  const strs = query.split('&');
  for (let i = 0; i < strs.length; i++) {
    const [key, value] = strs[i].split('=');
    realQuery[key] = value;
  }
  return realQuery;
}
