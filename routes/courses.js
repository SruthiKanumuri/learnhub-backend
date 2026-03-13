const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// ── GET ALL COURSES ───────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET SINGLE COURSE ─────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE COURSE ─────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { title, description, category, duration, instructor } = req.body;
    const course = await prisma.course.create({
      data: { title, description, category, duration, instructor }
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE COURSE ─────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await prisma.course.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;