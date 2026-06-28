'use client'

import { useRouter } from "next/navigation";
import ParcelAreas from "@/components/ParcelAreas";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MyPage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Redirect unauthenticated users on the client
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Initialize local state from session only when session changes
    // and only if the input fields are still empty — this prevents
    // overwriting user edits while typing.
    useEffect(() => {
        if (session?.user) {
            const sName = ((session.user as any)?.name as string) || "";
            const sPhone = ((session.user as any)?.phone as string) || "";
            if (!name) setName(sName);
            if (!phone) setPhone(sPhone);
        }
    }, [session]);

    if (status === "loading") {
        return <div>로딩중...</div>;
    }

    const studentId = (session?.user as any)?.studentId;
    
    const handleLogout = () => {
        if (confirm('정말 로그아웃 하시겠습니까?')) {
            signOut({ callbackUrl: '/' });
        }
    };

    const handleUpdateProfile = async () => {
        if (!name.trim() || !phone.trim()) {
            alert("이름이나 전화번호가 입력되지 않았습니다.");
            return;
        }
        if (password && password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (password && (password.length < 8 || password.length > 16)) {
            alert("비밀번호는 8자 이상 16자 이하로 입력해주세요.");
            return;
        }
        if (password && password !== password.replace(/\s/g, '')) {
            alert("비밀번호에 공백이 포함되어 있습니다.");
            return;
        }
        if (!/^\d{10,11}$/.test(phone)) {
            alert("전화번호 형식이 올바르지 않습니다.");
            return;
        }
        // 여기에 프로필 업데이트 API 호출 로직 추가
        const result = await fetch('/api/user-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId : studentId,
                name : name,
                phone : phone,
                isPasswordChanged: password ? 'O' : 'X',
                password : password
            })
        });
        if (result.ok) {
            await update({
                name: name,
                phone: phone
            });
            alert("회원정보가 성공적으로 수정되었습니다.");
            router.refresh();
        }else{
            alert("회원정보 수정에 실패했습니다.");
            router.push('/mypage');
        }
    };

    return (
        <>
            <div className="min-h-screen flex justify-center py-12 sm:px-6 lg:px-8 text-gray-900">
                <div className="w-full max-w-md">

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">내 정보 관리</h2>
                        <p className="text-sm text-gray-500 mt-2">회원 정보를 확인하고 수정할 수 있습니다.</p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow-md sm:rounded-xl border border-gray-100">

                        {/* 정보 수정 폼 */}
                        <form className="space-y-5">

                            {/* 학번 (수정 불가 - readOnly) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">학번</label>
                                <input
                                    type="text"
                                    value={studentId}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg cursor-not-allowed outline-none"
                                />
                            </div>

                            {/* 이름 */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                                <input
                                    id="name" name="name" type="text" required
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="ex) 홍길동"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            {/* 전화번호 */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">전화번호</label>
                                <input
                                    id="phone" name="phone" type="tel" required
                                    value={phone} onChange={(e) => setPhone(e.target.value)}
                                    placeholder="ex) 01012345678"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <hr className="border-gray-100 my-6" />

                            {/* 비밀번호 변경 */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">새 비밀번호 (변경 시에만 입력)</label>
                                <input
                                    id="password" name="password" type="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="새로운 비밀번호 (8~16자)"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            {/* 비밀번호 확인 */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">새 비밀번호 확인</label>
                                <input
                                    id="confirmPassword" name="confirmPassword" type="password"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="새로운 비밀번호 확인"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            {/* 정보 수정 버튼 */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleUpdateProfile}
                                    className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    정보 수정하기
                                </button>
                            </div>
                        </form>

                    </div>

                    {/* 3. 로그아웃 버튼 (폼 바깥에 완전히 분리하여 배치) */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-6 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <i className="fa-solid fa-right-from-bracket w-5"></i> 로그아웃
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
