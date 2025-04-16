import Question from "../Models/Question.js";
// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { is_active: true },
      order: [["createtime", "DESC"]],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: {
        question_details: questions,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
    });
  }
};

// Add new question
export const addQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const newQuestion = await Question.create({
      question,
      answer,
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question_id: newQuestion.question_id,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({
      success: false,
      message: "Error adding question",
    });
  }
};

// Get question details for editing
export const getQuestionDetails = async (req, res) => {
  try {
    // Get and validate question_id
    const question_id = parseInt(req.params.question_id, 10);

    if (isNaN(question_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID - must be a number",
      });
    }

    const question = await Question.findOne({
      where: {
        question_id: question_id,
        is_active: true,
      },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question.get({ plain: true }), // Convert to plain object
    });
  } catch (error) {
    console.error("Error fetching question details:", {
      message: error.message,
      stack: error.stack,
      query: error.sql,
    });

    res.status(500).json({
      success: false,
      message: "Error fetching question details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// Update question
export const updateQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const [updatedRows] = await Question.update(
      { question, answer },
      { where: { question_id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Error updating question",
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { question_id } = req.body;

    const [updatedRows] = await Question.update(
      { is_active: false },
      { where: { question_id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting question",
    });
  }
};
