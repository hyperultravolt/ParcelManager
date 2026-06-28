'use client'

import React from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Sidebar({ session }: { session: any }) {
    const pathname = usePathname();
    const style1 = "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition";
    const style2 = "flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2563EB] text-white shadow-md";
    var styles = [style1, style1, style1, style1, style1]
    if (pathname === "/") styles[0] = style2;
    else if (pathname === "/register") styles[1] = style2;
    //else if (pathname === "/order") styles[2] = style2;
    else if (pathname === "/notice") styles[3] = style2;
    else if (pathname === "/guide") styles[4] = style2;
    return (
        <aside className="w-64 bg-[#0a1930] text-white flex flex-col justify-between hidden md:flex h-screen sticky top-0">
            <div>
                {/* 로고 영역 */}
                <Link href="/">
                    <div className="p-6 flex items-center gap-3 mb-4">
                        <i className="fa-solid fa-cube text-2xl"></i>
                        <h1 className="text-sm font-bold leading-snug">
                            KSA 택배 관리기
                        </h1>
                    </div>
                </Link>

                {/* 네비게이션 메뉴 */}
                <nav className="flex flex-col px-4 gap-2 text-sm font-medium">
                    <Link href="/" className={styles[0]}>
                        <i className="fa-solid fa-house w-5"></i> 홈
                    </Link>
                    <Link href="/register" className={styles[1]}>
                        <i className="fa-solid fa-box w-5"></i> 택배 등록
                    </Link>
                    <Link href="/notice" className={styles[3]}>
                        <i className="fa-regular fa-bell w-5"></i> 알림 신청
                    </Link>
                    <Link href="/guide" className={styles[4]}>
                        <i className="fa-solid fa-circle-info w-5"></i> 이용 안내
                    </Link>
                </nav>
            </div>

            {/* 로그아웃 (하단) */}
            {!session ? (
                <div className="p-4 mb-4">
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition text-sm">
                        <i className="fa-solid fa-right-to-bracket w-5"></i> 로그인
                    </Link>
                </div>
            ) : (
                <div className="p-4 mb-4">
                    <Link href="/mypage" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition text-sm">
                        <i className="fa-solid fa-user w-5"></i> 마이페이지
                    </Link>
                </div>
            )}
        </aside>
    );
}