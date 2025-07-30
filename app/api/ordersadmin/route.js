import pool from '@/lib/db';
import { NextResponse } from 'next/server';

const ALLOWED_STATUSES = ['placed','pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled','Ready_for_Delivery'];

const STATUS_TO_STEP = {
  pending: 'order_received',
  accepted: 'order_accepted',
  rejected: 'order_rejected',
  in_progress: 'production_started',
  completed: 'order_completed',
  cancelled: 'order_cancelled'
};

// ✅ GET all orders
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, user_id, full_name, clothing_style, status, placed_at, estimated_delivery, total_price,created_at
      FROM orders
      ORDER BY placed_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ✅ PATCH specific order status
export async function PATCH(req) {
  try {
    const data = await req.json();
    const { order_id, status } = data;
    
    if (!order_id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: order_id and status are required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if order exists
    const check = await pool.query('SELECT id FROM orders WHERE id = $1', [order_id]);
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await pool.query('BEGIN');

    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, order_id]
    );

    await pool.query(
      `INSERT INTO order_timeline (order_id, status, completed, timestamp) VALUES ($1, $2, false, NOW())`,
      [order_id, STATUS_TO_STEP[status]]
    );

    await pool.query('COMMIT');

    return NextResponse.json({
      success: true,
      order: result.rows[0],
      message: `Order status updated to ${status}`
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Order Update Error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
