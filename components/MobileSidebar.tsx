'use client'

import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileSidebar({ session }: { session: any }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <>
            <header className="md:hidden flex items-center justify-between p-4 bg-[#0a1930] text-white border-b border-gray-200">
                <div className="p-2 flex items-center gap-3">
                    <i className="fa-solid fa-cube text-2xl"></i>
                    <h1 className="text-sm font-bold leading-snug">
                        KSA 택배 관리기
                    </h1>
                </div>

                {/* 햄버거 버튼 */}
                <button
                    onClick={() => { console.log('changed!'); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                    className="bg-blue-500 hover:bg-blue-600 text-gray-900 py-1 px-3 rounded-md transition"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </header>

            {/* 모바일용 드롭다운 메뉴 (버튼을 눌렀을 때만 보임) */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-white border-b border-gray-200 flex flex-col p-4 space-y-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded hover:bg-gray-100"><i className="fa-solid fa-house w-5"></i> 홈</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded hover:bg-gray-100"><i className="fa-solid fa-box w-5"></i> 택배 등록</Link>
                    <Link href="/notice" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded hover:bg-gray-100"><i className="fa-regular fa-bell w-5"></i> 알림 신청</Link>
                    <Link href="/guide" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded hover:bg-gray-100"><i className="fa-solid fa-circle-info w-5"></i> 이용 안내</Link>
                    {!session ? (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded hover:bg-gray-100"><i className="fa-solid fa-right-to-bracket w-5"></i> 로그인</Link>
                    ) : (
                        <Link href="/mypage" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded hover:bg-gray-100"><i className="fa-solid fa-user w-5"></i> 마이페이지</Link>
                    )}
                </nav>
            )}
        </>
    );
}