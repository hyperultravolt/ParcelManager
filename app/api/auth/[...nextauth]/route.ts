import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";
// import db from "@/lib/db" // DB 연동 파일

const { handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        studentId: { label: "학번", type: "text", placeholder: "24113" },
        password: { label: "비밀번호", type: "password" }
      },
      // 로그인 요청이 들어왔을 때 실행되는 검증 로직
      async authorize(credentials) {
        if (!credentials?.studentId || !credentials?.password) {
          return null;
        }

        // 1. DB에서 이메일로 유저 찾기 (가상 코드)
        const result = await pool.query("SELECT * FROM users WHERE student_id = ?", [credentials.studentId]);
        const rows = (result as [RowDataPacket[], any])[0];
        const user = rows[0];

        if (!user) {
          return null; // 유저가 없으면 로그인 실패
        }

        // 2. 비밀번호 일치 여부 확인
        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password as string);

        if (!isPasswordValid) {
          return null; // 비밀번호가 틀리면 로그인 실패
        }

        // 3. 검증 성공 시 유저 객체 반환 (이 정보가 세션에 저장됨)
        return { phone: user.phone, name: user.name, studentId: user.student_id };
      }
    })
  ],
  // JWT 기반 세션 설정 (Credentials 방식은 JWT가 필수입니다)
  session: {
    strategy: "jwt",
  },
  // 커스텀 로그인 페이지 경로 지정
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // authorize에서 리턴한 정보를 토큰에 담기
        token.studentId = (user as any).studentId; 
        token.phone = (user as any).phone;
        token.name = (user as any).name;
      }
      if (trigger==="update" && session){
        if (session.name) token.name = session.name;
        if (session.phone) token.phone = session.phone;
      } 
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // 토큰에 있는 정보를 최종적으로 세션(브라우저에서 볼 수 있는 객체)에 담기
        session.user.studentId = token.studentId;
        session.user.phone = token.phone;
        session.user.name = token.name as string;
      }
      return session;
    }
  }
});

export const { GET, POST } = handlers;
