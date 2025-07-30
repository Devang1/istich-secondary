import { requireAuth } from '@/lib/middleware';

export default requireAuth(async (req, res) => {
  return res.status(200).json({ user: req.user });
});
