'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { receiveParcelAction } from "@/app/actions";
import { useSession } from "next-auth/react";

function ParcelSize({ size }: { size: number }) {
    if (size === 0) return <p className="text-gray-500 mb-8 text-sm">대응되는 택배가 없습니다.</p>;
    else return <p className="text-gray-500 mb-8 text-sm">대응되는 택배가 {size}개 있습니다.</p>
}

export default function ParcelList({ parcels }: { parcels: any[] }) {
    const [data, setData] = useState(parcels);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataID, setDataID] = useState(0);
    const [dataParcelNum, setDataParcelNum] = useState("");
    const [studentID, setStudentID] = useState("");
    const [password, setPassword] = useState("");
    const [deleteNotice, setDeleteNotice] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    function handleOpenModal(id: number, parcel_num: string) {
        setDataID(id);
        setDataParcelNum(parcel_num);
        setIsModalOpen(true);
    }

    async function handleConfirmSubmit() {
        var result = { success: false, message: "알 수 없는 오류가 발생했습니다." };
        if (status === "authenticated") {
            console.log("Authenticated user:", session.user);
            setIsModalOpen(false);
            result = await receiveParcelAction(dataID, dataParcelNum, (session.user as any)?.studentId, "", true, deleteNotice);
        } else {
            if (studentID.trim() === "") {
                alert("학번을 입력해주세요.");
                return;
            }
            if (!/^\d{5}$/.test(studentID)) {
                alert("학번 형식이 올바르지 않습니다.");
                return;
            }
            if (password.trim() === "") {
                alert("비밀번호를 입력해주세요.");
                return;
            }
            setIsModalOpen(false);
            result = await receiveParcelAction(dataID, dataParcelNum, studentID, password, false, deleteNotice);
        }
        if (result.success) {
            alert(result.message);
            window.location.reload();
        } else {
            alert(result.message);
            setDataID(0);
            setStudentID("");
            setPassword("");
        }
    }

    return (
        <>
            <ParcelSize size={data.length} />
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm font-semibold">
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4">주문 번호</th>
                            <th className="px-6 py-4">위치</th>
                            <th className="px-6 py-4">등록 시간</th>
                            <th className="px-6 py-4 text-center">수령</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                        {data.map((parcel, index) => (
                            <tr key={parcel.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                                <td className="px-6 py-4 text-xs font-mono text-gray-400">{parcel.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{parcel.order_num}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        {parcel.position}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{parcel.signed_time}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleOpenModal(parcel.id, parcel.order_num)} className="bg-green-200 hover:bg-green-400 text-green-800 py-1 px-3 rounded-md text-sm transition">
                                        수령
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {(isModalOpen && status === "unauthenticated") && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                <i className="fa-solid fa-circle-question text-xl text-blue-600"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{dataID}번 택배를 수령하시겠습니까?</h3>
                            <p className="text-sm text-gray-500 mt-1">확인을 위해 학번과 비밀번호를 입력해주세요.</p>
                        </div>
                        <div className="flex flex-col gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="학번 입력"
                                value={studentID}
                                onChange={(e) => setStudentID(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>
                        <div className="flex items-center px-1 py-1 mb-2">
                            <input
                                id="delete-notification"
                                type="checkbox"
                                checked={deleteNotice}
                                onChange={(e) => setDeleteNotice(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label
                                htmlFor="delete-notification"
                                className="ml-2 text-sm font-medium text-gray-600 cursor-pointer select-none"
                            >
                                수령 후 알림 목록에서 삭제하기
                            </label>
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
            {(isModalOpen && status === "authenticated") && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                <i className="fa-solid fa-circle-question text-xl text-blue-600"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{dataID}번 택배를 수령하시겠습니까?</h3>
                            <p className="text-sm text-gray-500 mt-1">{session.user?.name}님의 이름으로 수령됩니다.</p>
                        </div>
                        <div className="flex items-center px-1 py-1 mb-2">
                            <input
                                id="delete-notification"
                                type="checkbox"
                                checked={deleteNotice}
                                onChange={(e) => setDeleteNotice(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label
                                htmlFor="delete-notification"
                                className="ml-2 text-sm font-medium text-gray-600 cursor-pointer select-none"
                            >
                                수령 후 알림 목록에서 삭제하기
                            </label>
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