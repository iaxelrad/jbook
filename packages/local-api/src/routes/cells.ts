import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}
export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf8' });

      res.send(JSON.parse(result));
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(fullPath, '[]', 'utf8');
        res.send([]);
      } else {
        throw error;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cell from the request object
    // Serialize them
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf8');

    res.send({ status: 'ok' });
  });

  return router;
};
