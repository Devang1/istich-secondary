import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// Generate random 5-digit user ID
function generateRandomUserId() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Ensure unique user_id
async function generateUniqueUserId() {
  let userId;
  let exists = true;

  while (exists) {
    userId = generateRandomUserId();
    const check = await pool.query(
      'SELECT 1 FROM delivery_partners WHERE user_id = $1',
      [userId]
    );
    exists = check.rows.length > 0;
  }

  return userId;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      name,
      email,
      phone_no,
      vehicle_type,
      city,
      is_available = true,
      rating = 0.0
    } = data;

    // Hash the phone number as password
    const passwordHash = await bcrypt.hash(phone_no, 10);

    // Insert user into users table
    const userResult = await pool.query(
      `INSERT INTO users (full_name, email, phone_number, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [name, email, phone_no, passwordHash, 'delivery_partner']
    );

    const user_id = userResult.rows[0].id;

    // Generate 5-digit custom delivery partner ID (if needed)
    const delivery_user_id = await generateUniqueUserId();

    // Insert into delivery_partners table
    const partnerResult = await pool.query(
      `INSERT INTO delivery_partners (user_id, vehicle_type, city, is_available, rating, phone_number,email,name)
       VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING *`,
      [user_id, vehicle_type, city, is_available, rating, phone_no,email,name]
    );

    return NextResponse.json(partnerResult.rows[0], { status: 201 });

  } catch (err) {
    console.error('Add Delivery Partner Error:', err);
    return NextResponse.json({ error: 'Failed to add delivery partner' }, { status: 500 });
  }
}
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('delivery_partner_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'delivery_partner_id parameter is required' },
        { status: 400 }
      );
    }

    // Verify user exists and is a delivery partner
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [userId, 'delivery_partner']
    );
    const deliveryId=await pool.query(
      'SELECT id FROM delivery_partners WHERE user_id = $1 ',
      [userId]
    );
    const delivery_partnerId=deliveryId.rows[0].id;
    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Delivery partner user not found' },
        { status: 404 }
      );
    }
    const query = `
      SELECT 
       *
      FROM orders o
      WHERE o.delivery_partner_id = $1
      ORDER BY o.created_at DESC
    `;


    const result = await pool.query(query, [delivery_partnerId]);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    }, { status: 200 });

  } catch (err) {
    console.error('Get Delivery Partner Orders Error:', err);
    return NextResponse.json(
      { 
        error: 'Failed to fetch delivery partner orders',
        details: err.message 
      },
      { status: 500 }
    );
  }
}
export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
    const id = searchParams.get('order_id');
    const delivery_partner_id = searchParams.get('delivery_partner_id');
  try {
    const result = await pool.query(`
      UPDATE orders
      SET 
        accepted_for_delivery =true
        WHERE id = $1
      RETURNING *;
    `, [ id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error('Error updating order:', err);
    return NextResponse.json(
      { error: 'Failed to update order', details: err.message },
      { status: 500 }
    );
  }
}
