const express = require("express");
const router = express.Router();
const questionService = require("../services/questionService");

//Get questions
router.get("/", async (req, res, next) => {
  try {
    const {
      pageSize = 100,
      useOffset = false,
      assignedTo,
      properties,
    } = req.query;

    // Convert query parameters to appropriate types
    const options = {
      pageSize: parseInt(pageSize),
      useOffset: useOffset === "true",
      assignedTo,
      properties: properties ? JSON.parse(properties) : undefined,
    };

    const result = await questionService.getQuestions(options);

    // Add pagination metadata
    const response = {
      data: result.records,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        hasMore: result.hasMore,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create question
router.post("/", async (req, res, next) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.json(question);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const questionId = req.params.id;
    const updatedQuestion = await questionService.updateQuestion(
      questionId,
      req.body,
    );
    res.json(updatedQuestion);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
