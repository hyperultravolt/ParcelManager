'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerNoticeAction } from "@/app/actions";
import { register } from "module";
import { useSession } from "next-auth/react";

export default function ParcelNoticeInput() {
    const [orderNum, setOrderNum] = useState("");
    const router = useRouter();
    const { data: session, status} = useSession();

    if (status === "loading") {
        return <div>로딩중...</div>;
    }
    if (status === "unauthenticated" || !session) {
        return <div>알림 신청을 위해서는 <a href="/login" className="text-blue-500 hover:underline">로그인</a>이 필요합니다.</div>;
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (orderNum.trim() === "") {
            alert("주문번호를 입력해주세요.");
            return;
        }
        if (orderNum.length < 4) {
            alert("주문번호는 최소 4자리여야 합니다.");
            return;
        }
        if (!/^\d+$/.test(orderNum)) {
            alert("주문번호는 숫자로만 구성되어야 합니다.");
            return;
        }
        registerNoticeAction(orderNum, (session.user as any)?.studentId).then((result) => {
            if (result.success) {
                alert(result.message);
                setOrderNum("");
                window.location.reload();
            } else {
                alert(result.message);
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form className="lg:col-span-2 space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">주문번호 (기호 없이 숫자만)</label>
                    <input 
                        type="text" 
                        placeholder="예) 202412345671234" 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                        value={orderNum}
                        onChange={(e) => setOrderNum(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full bg-[#1e4ed8] hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg mt-4 transition shadow-md">
                    택배 알림 등록
                </button>
            </form>

            <div className="space-y-4">
                <div className="bg-[#f8fafc] border border-slate-100 p-5 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm">이용 안내</h3>
                    <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                        <li>주문한 택배의 주문번호를 입력해주세요.</li>
                        <li>해당 주문번호와 일치하는 택배가 도착했을 때, 문자로 알림을 받을 수 있습니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
