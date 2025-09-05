import crypto from "crypto";

// Vercel Edge / Node.js API
export const config = {
    api: {
        bodyParser: false, // 必须禁用内置 bodyParser 才能拿到原始 body
    },
};

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        // 读取原始 body
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const rawBody = Buffer.concat(buffers).toString("utf8");

        const secret = process.env.KS_APP_SECRET; // 在 Vercel 的环境变量里配置
        const kwaiSignature = req.headers["x-kwai-signature"];

        // 计算签名
        const hmac = crypto.createHmac("sha256", secret)
            .update(rawBody, "utf8")
            .digest("hex");

        console.log("rawBody:", rawBody);
        console.log("快手传来的签名:", kwaiSignature);
        console.log("我本地算的签名:", hmac);

        if (hmac === kwaiSignature) {
            return res.status(200).json({ message: "签名验证成功" });
        } else {
            return res.status(401).json({ message: "签名验证失败" });
        }
    } catch (err) {
        console.error("签名校验错误:", err);
        return res.status(500).json({ message: "内部错误" });
    }
}
