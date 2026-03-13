const express = require("express");
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const router = express.Router();
const prisma = new PrismaClient();

// ── GET USER CERTIFICATES ─────────────────────────────────
router.get("/:userId", async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: parseInt(req.params.userId) },
    });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ISSUE CERTIFICATE ─────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { userId, courseId, score } = req.body;
    const verifyId = crypto.randomUUID();
    const certificate = await prisma.certificate.create({
      data: { userId, courseId, score, verifyId }
    });
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── VERIFY CERTIFICATE ────────────────────────────────────
router.get("/verify/:verifyId", async (req, res) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { verifyId: req.params.verifyId },
    });
    if (!certificate) return res.status(404).json({ error: "Certificate not found" });
    res.json({ valid: true, certificate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;