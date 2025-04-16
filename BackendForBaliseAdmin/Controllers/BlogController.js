import Blog from "../Models/BlogModel.js";
import Category from "../Models/Category.js";
import fs from "fs";
import path from "path";

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, CategoryName } = req.body;

    // Check if required fields are present
    if (!title || !description || !CategoryName) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Validate category
    const category = await Category.findOne({
      where: { CategoryName },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (blog.image) {
        const oldImagePath = path.join("uploads", blog.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      blog.image = req.file.filename;
    }

    // Update blog fields
    blog.title = title;
    blog.description = description;
    blog.CategoryName = CategoryName;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, CategoryName } = req.body;

    // Validate required fields
    if (!title || !description || !CategoryName || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields including image are required",
      });
    }

    // Validate category exists
    const category = await Category.findOne({
      where: { CategoryName },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    const newBlog = await Blog.create({
      title,
      description,
      CategoryName,
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "CategoryName", "CategoryImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get single blog
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "CategoryName", "CategoryImage"],
        },
      ],
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete associated image
    const imagePath = path.join("uploads", blog.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await blog.destroy();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
