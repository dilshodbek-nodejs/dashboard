import { Router } from 'express';
import { listBlogs, getBlog, createBlogHandler, updateBlogHandler, deleteBlogHandler } from '../controllers/blog.controller';
import { upload } from '../middleware/multer';

const blogRouter = Router();

// Image upload endpoint
blogRouter.post('/upload-image', upload.single('image'), (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

blogRouter.get('/', listBlogs)
    .post('/', createBlogHandler)
    .get('/:id', getBlog)
    .put('/:id', updateBlogHandler)
    .delete('/:id', deleteBlogHandler);

export default blogRouter;
