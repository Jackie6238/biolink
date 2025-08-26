import { Router, Request, Response } from 'express';
import Link from '../models/Link';

const router = Router();

// GET /api/links
router.get('/', async (req: Request, res: Response) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
});

// POST /api/links
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, url } = req.body;
    const newLink = new Link({ title, url });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT /api/links/:id
// @desc   Update a link by its ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, url } = req.body;
    const updatedLink = await Link.findByIdAndUpdate(
      req.params.id,
      { title, url },
      { new: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ msg: 'Link not found' });
    }
    res.json(updatedLink);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/links/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);
    if (!link) {
      return res.status(404).json({ msg: 'Link not found' });
    }
    res.json({ msg: 'Link removed' });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
});

export default router;