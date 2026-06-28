'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();
    // 1. 현재 어떤 폼(로그인/회원가입)이 보이는지 상태 관리
    const [isLogin, setIsLogin] = useState(true);

    // 2. 입력 데이터 상태 관리
    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    // 3. 상태 메시지 (에러/성공) 관리
    const [status, setStatus] = useState({ type: '', message: '' });

    // 입력값 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. 로그인/회원가입 폼 제출 핸들러 (시뮬레이션)
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus({ type: '', message: '' }); // 메시지 초기화

        // (document.activeElement as HTMLElement).blur(); // (모바일 팁) 버튼 클릭 시 키보드 내리기

        // 회원가입일 때 비밀번호 확인 유효성 검사
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: '비밀번호가 일치하지 않습니다.' });
            return;
        }
        if (!isLogin && formData.password !== formData.password.replace(/\s/g, '')) {
            setStatus({ type: 'error', message: '비밀번호에 공백이 포함되어 있습니다.' });
            return;
        }
        if (!isLogin && formData.password.length < 8) {
            setStatus({ type: 'error', message: '비밀번호가 너무 짧습니다. 8자 이상 입력해주세요.' });
            return;
        }
        if (!isLogin && formData.password.length > 16) {
            setStatus({ type: 'error', message: '비밀번호가 너무 깁니다. 16자 이하로 입력해주세요.' });
            return;
        }
        if (!/^\d{5}$/.test(formData.studentId)) {
            setStatus({ type: 'error', message: '학번은 5자리 숫자여야 합니다.' });
            return;
        }
        if (!isLogin && !/^\d{10,11}$/.test(formData.phone)) {
            setStatus({ type: 'error', message: '전화번호 형식이 올바르지 않습니다.' });
            return;
        }
        if (isLogin) {
            const result = await signIn("credentials", {
                redirect: false,
                studentId: formData.studentId,
                password: formData.password
            });
            if (result?.error) {
                setStatus({ type: 'error', message: '로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요.' });
                return;
            }
        } else {
            const result = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await result.json();
            if (!result.ok) {
                setStatus({ type: 'error', message: data.error || '회원가입에 실패했습니다.' });
                return;
            }
        }

        setStatus({ type: 'success', message: `${isLogin ? '로그인' : '회원가입'}이 완료되었습니다!` });

        // 성공 시 2초 후 메인 페이지로 이동
        setTimeout(() => {
            if(isLogin){
                router.push("/");
                router.refresh();
            }else{
                router.push('/login');
                router.refresh();
            }
        }, 1000);
    };

    // 5. 탭(로그인/회원가입) 전환 시 폼 초기화
    const toggleForm = (toLogin: boolean) => {
        setIsLogin(toLogin);
        setFormData({ name: '', studentId: '', phone: '', password: '', confirmPassword: '' }); // 폼 초기화
        setStatus({ type: '', message: '' }); // 메시지 초기화
    };

    return (
        // [배치 핵심] min-h-screen 및 flex, items-center, justify-center로 화면 정중앙에 배치
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* 로고나 타이틀 */}
                <Link href="/" className="flex justify-center mb-6">
                    <h1 className="text-3xl font-extrabold text-blue-600">KSA 택배 관리기</h1>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">

                    {/* 6. 로그인/회원가입 전환 탭 UI */}
                    <div className="flex space-x-2 border-b border-gray-200 mb-6">
                        <button
                            onClick={() => toggleForm(true)}
                            className={`flex-1 pb-4 text-center font-semibold text-sm transition ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => toggleForm(false)}
                            className={`flex-1 pb-4 text-center font-semibold text-sm transition ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            회원가입
                        </button>
                    </div>

                    {/* 상태 메시지 출력 (성공/에러) */}
                    {status.message && (
                        <div className={`mb-5 p-3 rounded-lg text-sm font-medium ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {status.message}
                        </div>
                    )}

                    <form className="space-y-5" method="POST" onSubmit={handleSubmit} key={isLogin ? 'login' : 'signup'}>

                        {/* 회원가입 시에만 이름 입력 필드 노출 */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                                <input
                                    id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange}
                                    placeholder="홍길동"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1.5">학번 (ID)</label>
                            <input
                                id="studentId" name="studentId" type="text" required value={formData.studentId} onChange={handleInputChange}
                                placeholder="24113 ('-' 없이 숫자만)"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">전화번호</label>
                                <input
                                    id="phone" name="phone" type="text" required value={formData.phone} onChange={handleInputChange}
                                    placeholder="01012345678 ('-' 없이 숫자만)"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
                            <input
                                id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>

                        {/* 회원가입 시에만 비밀번호 확인 필드 노출 */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
                                <input
                                    id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">로그인 유지</label>
                                </div>
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">비밀번호 찾기</Link>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg mt-2 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isLogin ? '로그인' : '회원가입'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}