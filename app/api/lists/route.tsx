import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, order_num, position, DATE_FORMAT(signed_time, '%Y-%m-%d %H:%i:%s') AS signed_time FROM parcels where status = 'waiting'");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching parcels:", error);
    return NextResponse.json({ error: "택배 데이터 불러오기에 실패했습니다." }, { status: 500 });
  }
}