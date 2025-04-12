import Blog from "../Models/BlogModel.js";

export const createBlog = async(req, res) => {
    try {
        const { categoryName, title, description } = req.body;
        const bannerImage = req.file ? req.file.filename : null;

        const blog = await Blog.create({
            categoryName,
            title,
            description,
            bannerImage,
        });

        res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const fetchAllBlogs = async(req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const fetchBlogById = async(req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};