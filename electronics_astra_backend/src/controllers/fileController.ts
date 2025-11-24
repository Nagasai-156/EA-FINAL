import { Request, Response } from 'express';
import prisma from '../prismaClient';
import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from '../services/storage';

export async function uploadProblemFile(req: Request, res: Response) {
  try {
    const { problemId } = req.params;
    const { type, language } = req.body;

    if (!type || !language) {
      return res.status(400).json({ error: 'type and language required' });
    }

    // Validate language enum server-side
    if (!['VERILOG', 'VHDL'].includes(language)) {
      return res.status(400).json({ error: 'language must be VERILOG or VHDL' });
    }

    // Validate type enum
    if (!['STUDENT_TEMPLATE', 'TESTBENCH', 'REFERENCE_SOLUTION'].includes(type)) {
      return res.status(400).json({ error: 'invalid file type' });
    }

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      return res.status(404).json({ error: 'problem not found' });
    }

    let filename: string | null = null;

    if (req.file) {
      // File uploaded via multipart
      filename = req.file.filename;
    } else if (req.body.content) {
      // Content provided as string
      const ext = language === 'VHDL' ? 'vhd' : 'v';
      const fname = `${Date.now()}_problem_${problemId}_${type}.${ext}`;
      const full = path.join(UPLOAD_DIR, fname);
      fs.writeFileSync(full, req.body.content, 'utf8');
      filename = fname;
    } else {
      return res.status(400).json({ error: 'file or content required' });
    }

    const created = await prisma.problemFile.create({
      data: {
        problemId,
        type,
        language,
        filename,
        content: req.body.content ?? null
      }
    });

    return res.json({ 
      fileId: created.id, 
      url: filename ? `/uploads/${filename}` : null 
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    return res.status(500).json({ error: 'upload failed' });
  }
}
