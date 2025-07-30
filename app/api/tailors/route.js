import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// Generate random 5-digit user ID
function generateRandomUserId() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Ensure unique user_id in tailors table
async function generateUniqueUserId() {
  let userId;
  let exists = true;

  while (exists) {
    userId = generateRandomUserId();
    const check = await pool.query(
      'SELECT 1 FROM tailors WHERE user_id = $1',
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
      address,
      experience_years,
      city,
      specializations,
      rating = 0.0,
      is_available = true
    } = data;

    // Hash the phone number as password
    const passwordHash = await bcrypt.hash(phone_no, 10);

    // Insert user into users table
    const userResult = await pool.query(
      `INSERT INTO users (full_name, email, phone_number, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id`,
      [name, email, phone_no, passwordHash, 'tailor']
    );

    const user_id = userResult.rows[0].id;

    // Generate a custom 5-digit user_id for tailors if needed
    const tailor_user_id = await generateUniqueUserId();

    // Insert into tailors table
    const result = await pool.query(
      `INSERT INTO tailors (user_id, address, experience_years, city, specializations, rating, is_available, phone_number, email, name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [user_id, address, experience_years, city, specializations, rating, is_available, phone_no, email, name]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (err) {
    console.error('Add Tailor Error:', err);
    return NextResponse.json({ 
      error: 'Failed to add tailor',
      details: err.message 
    }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { userId, availability } = await req.json();

    if (!userId || typeof availability !== 'boolean') {
      return NextResponse.json(
        { error: 'userId (number) and availability (boolean) are required' },
        { status: 400 }
      );
    }

    // First check if user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update tailor availability
    const result = await pool.query(
      `UPDATE tailors 
       SET is_available = $1
       WHERE user_id = $2 
       RETURNING *`,
      [availability, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tailor record not found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Availability updated successfully'
    }, { status: 200 });

  } catch (err) {
    console.error('Update Tailor Availability Error:', err);
    return NextResponse.json(
      { 
        error: 'Failed to update tailor availability',
        details: err.message 
      },
      { status: 500 }
    );
  }
}