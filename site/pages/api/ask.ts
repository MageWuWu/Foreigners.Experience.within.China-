import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(501).json({ ok: false, message: 'RAG /api/ask not implemented (placeholder)' })
}