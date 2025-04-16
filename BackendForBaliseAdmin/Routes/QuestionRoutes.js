import express from "express";
import {
  getAllQuestions,
  addQuestion,
  getQuestionDetails,
  updateQuestion,
  deleteQuestion,
} from "../Controllers/QuestionController.js";

const QuestionRoutes = express.Router();

QuestionRoutes.get("/manage_question", getAllQuestions);
QuestionRoutes.get(
  "/get_edit_question_detail/:question_id",
  getQuestionDetails
);
QuestionRoutes.post("/add_question", addQuestion);
QuestionRoutes.post("/update_question/:question_id", updateQuestion);
QuestionRoutes.post("/delete_question", deleteQuestion);

export default QuestionRoutes;
