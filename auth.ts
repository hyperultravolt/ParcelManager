import NextAuth, { NextAuthConfig } from "next-auth"; // NextAuthConfig 추가
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

// 1. 설정 객체에 타입을 명시해줘
const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        studentId: { label: "학번", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.studentId || !credentials?.password) return null;

        const [rows] = await pool.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE student_id = ?",
          [credentials.studentId]
        );
        const user = rows[0];

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        // 여기서 반환하는 객체가 아래 jwt 콜백의 user 파라미터로 들어가
        return {
          id: user.student_id, // 기본 id 필드도 채워주는 게 좋아
          studentId: user.student_id,
          name: user.name,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    // 이제 타입 확장을 해둬서 'any' 없이도 studentId를 인식해!
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.studentId = user.studentId;
        token.phone = user.phone;
      }
      
      // update() 호출 시 데이터 갱신 로직
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.phone) token.phone = session.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.studentId = token.studentId;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};

// 2. NextAuth 함수에 설정 전달
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);