// api/callback.js
import crypto from "crypto";

/**
 * 快手 Webhook 回调处理函数
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function handler(req, res) {
    // 1. 校验请求方法必须为 POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const payload = req.body;
    const kwaisign = req.headers["kwaisign"];
    const appId = payload.app_id; // 从 payload 中获取 appId

    console.log(`收到快手回调: event=${payload.event}, message_id=${payload.message_id}, app_id=${appId}`);
    console.log("完整 payload:", JSON.stringify(payload));

    // 2. 签名校验
    // 请确保在生产环境中替换为您的 AppSecret
    const appSecret = process.env.KUAISHOU_APP_SECRET || "YOUR_APP_SECRET";
    if (!verifySignature(payload, kwaisign, appSecret)) {
        console.error("签名校验失败", { kwaisign });
        return res.status(401).json({ error: "Invalid signature" });
    }
    console.log("签名校验成功");

    // 3. 幂等性处理
    // 开发者需要根据 message_id 或 data 中的业务幂等参数来保证接口的幂等性。
    // 例如，可以将 message_id 存入 Redis 或数据库，每次处理前检查是否存在。
    // const isProcessed = await checkMessageId(payload.message_id);
    // if (isProcessed) {
    //     console.log(`消息 ${payload.message_id} 已处理，跳过`);
    //     return res.status(200).json({ result: 1, message_id: payload.message_id });
    // }

    // 4. 事件分支处理
    switch (payload.event) {
        // 用于回调地址合法性校验的测试事件
        case "TEST":
            console.log("收到测试事件");
            break;
        case "UNBIND_PLC":
            console.log("用户解绑:", payload.data);
            // 在此处理解绑逻辑
            break;
        case "AUTHORIZE":
            console.log("用户授权:", payload.data);
            // 在此处理授权逻辑
            break;
        case "REFRESH_TOKEN":
            console.log("刷新token:", payload.data);
            // 在此处理刷新 token 逻辑
            break;
        default:
            console.log("收到未知事件:", payload.event);
    }

    // 5. 必须返回 200 状态码和指定的 JSON 结构
    return res.status(200).json({
        result: 1,
        message_id: payload.message_id,
    });
}

/**
 * 校验快手回调签名
 * @param {object} payload 请求体 body
 * @param {string} kwaisign 请求头中的 kwaisign 字段
 * @param {string} appSecret 你的应用的 AppSecret
 * @returns {boolean} 校验是否通过
 */
function verifySignature(payload, kwaisign, appSecret) {
    if (!kwaisign || !payload) {
        return false;
    }
    // 生产环境中，必须实现真实的签名校验逻辑
    // TODO: 按照快手附录1实现: https://mp.kuaishou.com/docs/develop/server/epay/appendix.html
    // 1. 将请求体（payload）转换为 JSON 字符串。
    const bodyString = JSON.stringify(payload);
    // 2. 拼接 AppSecret。格式为：bodyString + appSecret。
    const signString = bodyString + appSecret;
    // 3. 计算 MD5 哈希值。
    const calculatedSign = crypto.createHash('md5').update(signString).digest('hex');
    // 4. 比较计算出的签名和请求头中的 kwaisign 是否一致。
    console.log(`计算签名: ${calculatedSign}, 请求签名: ${kwaisign}`);
    return calculatedSign === kwaisign;

    // 在完成上述 TODO 之前，临时返回 true 以便调试
    // return true;
}