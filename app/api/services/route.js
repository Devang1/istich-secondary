import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM services');
    return Response.json({ services: result.rows });
  } catch (error) {
    console.error('Error fetching services:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch services' }), {
      status: 500,
    });
  }
}
