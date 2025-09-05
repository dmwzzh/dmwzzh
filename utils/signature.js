import crypto from "crypto";

/**
 * 快手签名校验
 * @param {Object} payload - 回调请求体
 * @param {string} kwaisign - 请求头中的签名
 * @param {string} appSecret - 你在快手开放平台应用里的 AppSecret
 * @returns {boolean} 是否验证通过
 */
export function verifySignature(payload, kwaisign, appSecret) {
    if (!payload || !kwaisign) return false;

    // 1. 按 key 排序
    const sortedKeys = Object.keys(payload).sort();

    // 2. 拼接 key=value
    const paramStr = sortedKeys
        .map((key) => `${key}=${JSON.stringify(payload[key])}`)
        .join("&");

    // 3. 拼接 appSecret
    const strToSign = paramStr + appSecret;

    // 4. md5
    const md5 = crypto.createHash("md5");
    md5.update(strToSign, "utf8");
    const sign = md5.digest("hex");

    // 5. 比对（忽略大小写）
    return sign.toLowerCase() === kwaisign.toLowerCase();
}
