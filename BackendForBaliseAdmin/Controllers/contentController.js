import Content from "../Models/Content.js";

export const getContent = async (req, res) => {
  try {
    const { content_type } = req.query;

    if (!content_type) {
      return res
        .status(400)
        .json({ success: false, message: "content_type is required" });
    }

    const content = await Content.findAll({
      where: { content_type },
      limit: 1,
    });

    res.json({ success: true, data: content });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { contentType, content } = req.body;

    if (!contentType || !content) {
      return res.status(400).json({
        success: false,
        message: "contentType and content are required",
      });
    }

    const [updated] = await Content.update(
      { content },
      { where: { content_type: contentType } }
    );

    if (updated === 0) {
      // Create new if not existing
      await Content.create({ content_type: contentType, content });
    }

    res.json({ success: true, message: "Content updated successfully" });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
