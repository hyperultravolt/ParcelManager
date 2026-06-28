import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
    try {
        const { studentId, name, phone, isPasswordChanged, password } = await request.json();
        if (!studentId || !name || !phone || !isPasswordChanged || (isPasswordChanged==='O' && !password)) {
            return NextResponse.json({ error: '모든 필드가 필요합니다.' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        var result;
        if (isPasswordChanged === 'O') {
            [result] = await pool.query("UPDATE users SET name = ?, phone = ?, password = ? WHERE student_id = ?",
            [name, phone, hashedPassword, studentId]) as unknown as [ResultSetHeader];
        } else {
            [result] = await pool.query("UPDATE users SET name = ?, phone = ? WHERE student_id = ?",
            [name, phone, studentId]) as unknown as [ResultSetHeader];
        }
        // Here you would typically save the user to a database
        if (result.affectedRows === 0) {
            throw new Error("해당 학번의 사용자를 찾을 수 없습니다.");
        }
        return NextResponse.json({ message: '회원정보가 성공적으로 수정되었습니다.' });
    } catch (error) {
        return NextResponse.json({ error: '회원정보 수정에 실패했습니다.' }, { status: 500 });
    }
}