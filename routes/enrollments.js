const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// ── GET USER ENROLLMENTS ──────────────────────────────────
router.get("/:userId", async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: { course: true }
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ENROLL IN COURSE ──────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const existing = await prisma.enrollment.findFirst({
      where: { userId, courseId }
    });
    if (existing) return res.status(400).json({ error: "Already enrolled" });
    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId }
    });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── UPDATE PROGRESS ───────────────────────────────────────
router.patch("/:id/progress", async (req, res) => {
  try {
    const { progress } = req.body;
    const status = progress === 100 ? "completed" : "in-progress";
    const enrollment = await prisma.enrollment.update({
      where: { id: parseInt(req.params.id) },
      data: { progress, status }
    });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;