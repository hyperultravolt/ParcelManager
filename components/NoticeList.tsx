'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteNoticeAction } from "@/app/actions";

function NoticeSize({ size }: { size: number }) {
    if (size === 0) return <p className="text-gray-500 mb-8 text-sm">등록된 알림이 없습니다.</p>;
    else return <p className="text-gray-500 mb-8 text-sm">등록된 알림이 {size}개 있습니다.</p>
}

export default function NoticeList({data=[]}: {data?: any[]}) {
    const [noticeID, setNoticeID] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    function handleOpenModal(id: number) {
        setNoticeID(id);
        setIsModalOpen(true);
    }
    async function handleConfirmSubmit(){
        const result = await deleteNoticeAction(noticeID);
        if (result.success){
            alert(result.message);
            window.location.reload();
        }else{
            alert(result.message);
            setNoticeID(0);
            setIsModalOpen(false);
        }
    }
    return (
        <>
            <NoticeSize size={data.length} />
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm font-semibold">
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4">주문 번호</th>
                            <th className="px-6 py-4">등록 시간</th>
                            <th className="px-6 py-4">수령 횟수</th>
                            <th className="px-6 py-4 text-center">삭제</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                        {data.map((notice, index) => (
                            <tr key={notice.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                                <td className="px-6 py-4 text-xs font-mono text-gray-400">{notice.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{notice.order_num}</td>
                                <td className="px-6 py-4 text-gray-500">{notice.signed_time}</td>
                                <td className="px-6 py-4 text-gray-500">{notice.matched}회</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleOpenModal(notice.id)} className="bg-red-200 hover:bg-red-400 text-red-800 py-1 px-3 rounded-md text-sm transition">
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                <i className="fa-solid fa-circle-question text-xl text-blue-600"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{noticeID}번 알림을 삭제하시겠습니까?</h3>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}