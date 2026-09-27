import express from "express";
import { chatController } from "../controllers/chatController.js";
import { storeService } from "../services/storeService.js";

const router = express.Router();

router.post("/chat", chatController);

// Conversation management endpoints for sidebar history
router.get("/chats", async (req, res) => {
    try {
        const { userId = "guest-user", search = "" } = req.query;
        const chats = await storeService.getChats({ userId, search });
        return res.status(200).json({ success: true, count: chats.length, chats });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

router.get("/chats/:id", async (req, res) => {
    try {
        const chat = await storeService.getChatById(req.params.id);
        if (!chat) return res.status(404).json({ success: false, error: "Conversation not found." });
        const messages = await storeService.getMessages(req.params.id);
        return res.status(200).json({ success: true, chat, messages });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

router.delete("/chats/:id", async (req, res) => {
    try {
        const deleted = await storeService.deleteChat(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, error: "Conversation not found." });
        return res.status(200).json({ success: true, message: "Conversation deleted successfully." });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
