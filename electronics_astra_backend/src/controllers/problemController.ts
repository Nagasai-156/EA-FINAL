import { Request, Response } from 'express';
import prisma from '../prismaClient';
import path from 'path';

export async function createProblem(req: Request, res: Response) {
  try {
    const body = req.body;
    
    // Minimal validation
    if (!body.title || !body.slug || !body.description) {
      return res.status(400).json({ error: 'title, slug and description required' });
    }
    
    if (!Array.isArray(body.languages) || body.languages.length === 0) {
      return res.status(400).json({ error: 'at least one language required' });
    }
    
    // Points range validation
    const points = Number(body.points ?? 100);
    if (points < 10 || points > 1000) {
      return res.status(400).json({ error: 'points must be between 10 and 1000' });
    }

    // Check if slug already exists
    const existing = await prisma.problem.findUnique({
      where: { slug: body.slug }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'slug already exists' });
    }

    const created = await prisma.problem.create({
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category ?? 'VLSI',
        difficulty: body.difficulty ?? 'BEGINNER',
        description: body.description,
        points,
        languages: body.languages,
        tags: body.tags ?? [],
        diagramUrl: body.diagram_url ?? null,
        examples: body.examples ?? null,
        explanation: body.explanation ?? null,
        hints: body.hints ?? [],
        settings: body.settings ?? {},
        isActive: !!body.isActive
      }
    });

    return res.json({ problemId: created.id });
  } catch (err) {
    console.error('Error creating problem:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function listProblems(req: Request, res: Response) {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        difficulty: true,
        points: true,
        languages: true,
        tags: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(problems);
  } catch (err) {
    console.error('Error listing problems:', err);
    res.status(500).json({ error: 'internal server error' });
  }
}

export async function getProblemBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    
    const p = await prisma.problem.findUnique({
      where: { slug },
      include: { files: true }
    });
    
    if (!p) {
      return res.status(404).json({ error: 'problem not found' });
    }

    const files = p.files.map(f => ({
      id: f.id,
      type: f.type,
      language: f.language,
      content: f.content,
      url: f.filename ? `/uploads/${path.basename(f.filename)}` : null,
      createdAt: f.createdAt
    }));

    res.json({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      difficulty: p.difficulty,
      description: p.description,
      languages: p.languages,
      points: p.points,
      tags: p.tags,
      diagramUrl: p.diagramUrl,
      examples: p.examples,
      explanation: p.explanation,
      hints: p.hints,
      settings: p.settings,
      isActive: p.isActive,
      files
    });
  } catch (err) {
    console.error('Error getting problem:', err);
    res.status(500).json({ error: 'internal server error' });
  }
}


export async function updateProblem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const body = req.body;

    // Check if problem exists
    const existing = await prisma.problem.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'problem not found' });
    }

    // Update problem
    const updated = await prisma.problem.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        difficulty: body.difficulty,
        description: body.description,
        points: body.points,
        languages: body.languages,
        tags: body.tags,
        diagramUrl: body.diagram_url,
        examples: body.examples,
        explanation: body.explanation,
        hints: body.hints,
        settings: body.settings,
        isActive: body.isActive
      }
    });

    return res.json({ success: true, problem: updated });
  } catch (err) {
    console.error('Error updating problem:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function deleteProblem(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if problem exists
    const existing = await prisma.problem.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'problem not found' });
    }

    // Delete problem (cascade will delete files)
    await prisma.problem.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'problem deleted' });
  } catch (err) {
    console.error('Error deleting problem:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
}
