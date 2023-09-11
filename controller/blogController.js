const blogSchema = require('../models/blogSchema');
const commentSchema = require('../models/commentSchema');
const userSchema = require('../models/userSchema');
const blogLogger = require('../utils/blogLogger');
const { mailOptions } = require('../services/emailService');

module.exports = {
    createBlog: async (req, res) => {
        try {
            const userId = req.params.id
            id = userId
            const blogData = new blogSchema(req.body);
            const userData =await userSchema.findByPk(id); 
            const blogImage = req.file ? `/upload/userProfile${req.file.filename}` : undefined
            blogData.blogImage = blogImage
            blogData.userId = userId
            await blogData.save();
            blogLogger.log('info',"Blog Created Successfully .")
            res.status(201).send({
                success: true,
                message: "Blog Created Successfully .",
                data : blogData
            });
        } catch (error) {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error Occurs .",
                error: error.message
            });
        }
    },

    updateBlog: async (req, res) => {
        try {
            const blogID = req.params.id;
            const blogData = await blogSchema.update(blogID, {
                where: {
                  id: blogID,
                },
                returning: true, 
              });
            blogLogger.log('info',"Your blog updated Successfully .")
            res.status(200).send({
                success: true,
                message: 'Your blog updated Successfully .'
            })
        }
        catch (error) {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            })
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const blogID = req.params.id;
            const blogData = await blogSchema.delete(blogID, {
                where: {
                  id: blogID,
                },
                returning: true, 
              });
            blogLogger.log('info',"Your blog Deleted Successfully .")
            res.status(200).send({
                success: true,
                message: 'Your blog Deleted Successfully .'
            })
        }
        catch {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            })
        }
    },

    blogSearch: async (req, res) => {
        try {
            const letter = req.params.letter;
            const blogSearch = blogSchema.findAll({
                where: {
                  blogTopic: {
                    [Op.iLike]: `${letter}%`,
                  },
                },
                attributes: ['blogTopic'],
              })
            blogLogger.log('info',"Blogs Founded.")
            res.status(200).json({
                success: true,
                message: 'Blogs Which Found.',
                blogTopic: blogSearch
            });
        } catch (err) {
            blogLogger.log('error', `Error: ${err.message}`)
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    blogDetails: async (req, res) => {
        const id = req.params.id;
        try {
            const blogData =  await blogSchema.findOne({
                where: { id },
                attributes: ['blogTopic', 'blogDescription', 'blogLikes'], 
                include: [
                  {
                    model: userSchema,
                    as: 'userId', 
                    attributes: ['userName'], 
                  },
                ],
              });
            if (!blogData) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }
            const commentData = await commentSchema.findAll({
                where: { blogId: id }, // Find comments by the blogId
                include: [
                  {
                    model: userSchema, // Include the 'userSchema' model
                    as: 'userId', // Define the alias for the association (if not already defined)
                    attributes: ['userName'], // Select the 'userName' column
                  },
                ],
              });
            blogLogger.log('info',"Blog Detail.")
            res.status(200).json({
                success: true,
                message: 'Blog Detail.',
                blog: blogData,
                comments: commentData
            });
        } catch (err) {
            blogLogger.log('error', `Error: ${err.message}`)
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: err.message
            });
        }
    },

    trendingBlogs: async (req, res) => {
        try {
            const topBlogs = await blogSchema.findAll({
                order: [['blogLikes', 'DESC']], 
              });
             
                    blogLogger.log('info', "Trending Blogs Found!")
            res.status(200).send({
                success: true,
                message: "Trending Blogs!!",
                topBlogs: topBlogs
            })
        } catch (error) {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                error: `Error occur : ${error.message}`,
            });
        }
    },

    allBlogs: async (req,res) => {
        try {
            const allBlogs = await blogSchema.findAll()
            blogLogger.log('info', "All blogs")
            res.status(200).send({
                success: true,
                message: "All blogs!",
                allBlogs: allBlogs
            })
        } catch (error) {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    },

    likeBlog: async (req, res) => {
        try {
            const blogData = await blogSchema.findByPk(id);
            const userData = await userSchema.findByPk(id)
            const userEmail = userData.userEmail
            if (blogData.likedBy.includes(userEmail)) {
                const userIndex = blogData.likedBy.indexOf(userEmail);
                blogData.blogLikes--;
                blogData.likedBy.splice(userIndex, 1);
                await blogData.save();
                return res.status(400).json({
                    success: false,
                    message: "You remove the like"
                });
            }
            blogData.blogLikes++;
            blogData.likedBy.push(userEmail); 
            await blogData.save();
            blogLogger.log('info', "You liked the blog!");
            res.status(200).send({
                success: true,
                message: "You liked the blog!"
            });
        } catch (error) {
            blogLogger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    }
}
