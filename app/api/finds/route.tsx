import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let order_num = searchParams.get("order_num");
  if (!order_num) {
    return NextResponse.json({ error: "주문번호가 필요합니다." }, { status: 400 });
  }
  if (order_num.length < 4) {
    return NextResponse.json({ error: "주문번호는 최소 4자리여야 합니다." }, { status: 400 });
  }
  order_num = order_num.slice(-4);

  try {
    const [rows] = await pool.query(
      "SELECT id, order_num, position, DATE_FORMAT(signed_time, '%Y-%m-%d %H:%i:%s') AS signed_time FROM parcels where status = 'waiting' AND order_num LIKE ?",
      [`%${order_num}`]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching parcels:", error);
    return NextResponse.json({ error: "택배 데이터 불러오기에 실패했습니다." }, { status: 500 });
  }
}