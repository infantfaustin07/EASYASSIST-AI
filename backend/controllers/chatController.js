import { aiService } from "../services/aiService.js";
import { storeService } from "../services/storeService.js";

export const chatController = async (req, res) => {
    try {
        const { message, mode = "simple", history = [], chatId, userId = "guest-user" } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a message."
            });
        }

        const normMode = (mode === "elaborate" || mode === "detailed") ? "elaborate" : "simple";

        let effectiveHistory = Array.isArray(history) ? [...history] : [];
        if (effectiveHistory.length === 0 && chatId) {
            try {
                const storedMessages = await storeService.getMessages(chatId);
                if (storedMessages && storedMessages.length > 0) {
                    effectiveHistory = storedMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    }));
                }
            } catch (histErr) {
                console.warn("Could not retrieve stored history for context:", histErr.message);
            }
        }

        const result = await aiService.generateResponse({
            message: message.trim(),
            mode: normMode,
            history: effectiveHistory,
        });

        // Store chat and messages for persistent history
        let chat = null;
        let userMessage = null;
        let assistantMessage = null;

        try {
            if (chatId) {
                chat = await storeService.getChatById(chatId);
            }
            if (!chat) {
                const title = message.trim().replace(/[^\w\s]/gi, '').split(/\s+/).slice(0, 5).join(' ');
                chat = await storeService.createChat({ userId, title: title || 'New Conversation' });
            }

            userMessage = await storeService.addMessage({
                chatId: chat._id,
                role: 'user',
                content: message.trim(),
                mode: normMode,
            });

            assistantMessage = await storeService.addMessage({
                chatId: chat._id,
                role: 'assistant',
                content: result.content,
                mode: normMode,
            });
        } catch (storeErr) {
            userMessage = { _id: `u-${Date.now()}`, role: 'user', content: message.trim(), mode: normMode };
            assistantMessage = { _id: `a-${Date.now()}`, role: 'assistant', content: result.content, mode: normMode };
            chat = chat || { _id: chatId || `c-${Date.now()}`, title: 'Conversation' };
        }

        return res.status(200).json({
            success: true,
            data: result,
            chat,
            userMessage,
            assistantMessage,
            meta: {
                latencyMs: result.latency,
                provider: result.provider,
                mode: normMode,
            }
        });
    } catch (error) {
        console.error("Chat Controller Error:", error);

        return res.status(500).json({
            success: false,
            error: error.message || "Something went wrong while processing your message.",
            message: error.message || "Something went wrong while processing your message."
        });
    }
};