import { verifySignature } from "../utils/signature.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const payload = req.body;
    const kwaisign = req.headers["kwaisign"];
    const appSecret = process.env.KWAI_APP_SECRET; // 在 Vercel 环境变量配置

    if (!verifySignature(payload, kwaisign, appSecret)) {
        return res.status(401).json({ error: "Invalid signature" });
    }

    console.log("✅ 验证成功，事件:", payload.event);

    return res.status(200).json({
        result: 1,
        message_id: payload.message_id,
    });
}
