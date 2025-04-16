import ContentModel from "../Models/Content.js";

export const getContent = async (req, res) => {
  try {
    const { content_type } = req.query;

    // Validate content type
    const validTypes = [0, 1, 2, 3, 4];
    if (!validTypes.includes(Number(content_type))) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type",
      });
    }

    const content = await ContentModel.findOne({
      where: { content_type },
    });

    if (!content) {
      return res.json({
        success: true,
        data: [{ content: "" }], // Return empty content if not found
      });
    }

    res.json({
      success: true,
      data: [content],
    });
  } catch (error) {
    console.error("Error getting content:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { contentType, content } = req.body;

    // Validate input
    if (typeof contentType === "undefined" || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check valid content type
    const validTypes = [0, 1, 2, 3, 4];
    if (!validTypes.includes(Number(contentType))) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type",
      });
    }

    // Update or create content
    const [updatedContent] = await ContentModel.upsert({
      content_type: contentType,
      content: content,
    });

    res.json({
      success: true,
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
