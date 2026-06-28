import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
    try {
        const { studentId, name, phone, password } = await request.json();
        if (!studentId || !name || !phone || !password) {
            return NextResponse.json({ error: '모든 필드가 필요합니다.' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query("INSERT INTO users (student_id, name, phone, password) VALUES (?, ?, ?, ?)",
            [studentId, name, phone, hashedPassword]) as unknown as [ResultSetHeader];
        // Here you would typically save the user to a database
        if (result.affectedRows === 0) {
            throw new Error("이미 존재하는 학번입니다.");
        }
        return NextResponse.json({ message: '회원가입이 성공적으로 완료되었습니다.' });
    } catch (error) {
        return NextResponse.json({ error: '이미 존재하는 학번입니다.' }, { status: 500 });
    }
}