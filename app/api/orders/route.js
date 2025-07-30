import pool from '../../../lib/db'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      user_id,
      tailor_id,
      delivery_partner_id,
      service_id,
      address,
      status,
      placed_at,
      estimated_delivery,
      stitching_price,
      delivery_price,
      total_price,
      full_name,
      phone_number,
      instructions,
      clothing_style,
      created_at,
      updated_at
    } = body;

    const query = `
      INSERT INTO orders (
        user_id, tailor_id, delivery_partner_id,
        service_id, address, status, placed_at, estimated_delivery,
        stitching_price, delivery_price, total_price,
        full_name, phone_number, instructions, clothing_style,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3,
        $4, $5, $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17
      ) RETURNING *;
    `;

    const values = [
      user_id || null,
      tailor_id || null,
      delivery_partner_id || null,
      service_id || null,
      address,
      status,
      placed_at,
      estimated_delivery,
      stitching_price,
      delivery_price,
      total_price,
      full_name,
      phone_number,
      instructions,
      clothing_style,
      created_at,
      updated_at
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ message: 'Order placed successfully', order: result.rows[0] }, { status: 201 });

  } catch (error) {
    console.error('Error inserting order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
