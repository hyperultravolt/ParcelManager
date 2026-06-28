'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderNumInput() {
    const [orderNum, setOrderNum] = useState("");
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (orderNum.trim() === "") {
            alert("주문번호를 입력해주세요.");
            return;
        }
        if (orderNum.length < 4){
            alert("주문번호는 최소 4자리여야 합니다.");
            return;
        }
        if (!/^\d+$/.test(orderNum)) {
            alert("주문번호는 숫자여야 합니다.");
            return;
        }
        router.push("/find?order_num=" + orderNum);
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
                    택배 찾기
                </button>
            </form>

            <div className="space-y-4">
                <div className="bg-[#f8fafc] border border-slate-100 p-5 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm">이용 안내</h3>
                    <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                        <li>주문번호 전부, 혹은 뒤 4자리를 입력해주세요.</li>
                        <li>현재 등록된 택배들과 목록을 비교하여 위치를 확인할 수 있습니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
