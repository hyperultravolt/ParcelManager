'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerParcelAction } from "@/app/actions";
import ParcelAreas from "./ParcelAreas";

export default function OrderNumInput({parcelStatus}: {parcelStatus: any}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderNum, setOrderNum] = useState("");
    const [position, setPosition] = useState("");
    const [responseData, setResponseData] = useState("");
    const [resultColor, setResultColor] = useState("text-blue-600");
    const router = useRouter();

    const handleOpenModal = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (orderNum.trim() === "" || position.trim() === "") {
            alert("주문번호와 위치를 모두 입력해주세요.");
            return;
        } else if (orderNum.length < 4) {
            alert("주문번호는 최소 4자리여야 합니다.");
            return;
        } else if (!/^\d+$/.test(orderNum)) {
            alert("주문번호는 숫자여야 합니다.");
            return;
        } else if (!/^[A-Z]\d$/.test(position)) {
            alert("위치는 알파벳 대문자 1글자와 숫자 1글자의 조합이어야 합니다.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setIsModalOpen(false);
        const result = await registerParcelAction(orderNum, position);
        if (result.success) {
            alert(result.message);
            setOrderNum("");
            setPosition("");
            setFileName("");
            setResponseData("");
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setResultColor("text-blue-600");
        setResponseData("주문번호를 추출 중입니다...");
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await fetch('/api/extract-ord', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setOrderNum(data.order_num);
                setResultColor("text-green-600");
                setResponseData("주문번호가 성공적으로 추출되었습니다.");
            } else {
                setResultColor("text-red-600");
                setResponseData(data.message || "주문번호 추출에 실패했습니다.");
            }
        } catch (error) {
            console.error('주문번호 추출 실패', error);
            setResultColor("text-red-600");
            setResponseData("오류가 발생했습니다.");
        }
    };

    const [fileName, setFileName] = useState("");

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <form className="lg:col-span-2 space-y-5" onSubmit={handleOpenModal}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">운송장 촬영 및 업로드 (선택)</label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition ${fileName ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i className={`fa-solid fa-camera text-2xl mb-3 ${fileName ? 'text-blue-500' : 'text-gray-400'}`}></i>

                                    {fileName ? (
                                        <p className="text-sm text-blue-600 font-semibold">{fileName}</p>
                                    ) : (
                                        <>
                                            <p className="mb-1 text-sm text-gray-500">
                                                <span className="font-semibold text-gray-700">클릭하여 사진 촬영</span> 또는 업로드
                                            </p>
                                            <p className="text-xs text-gray-400">자동으로 주문번호를 인식합니다</p>
                                        </>
                                    )}
                                </div>
                                <p className="block text-sm font-medium text-gray-700 mb-2"></p>
                                {/* 실제 input은 hidden으로 숨김 */}
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        {responseData !== "" && (
                            <p id="resultText" className={`text-sm ${resultColor} mt-2`}>{responseData}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">주문번호 (기호 없이 숫자만)</label>
                        <input
                            type="text"
                            placeholder="예) 202412345671234, 1234"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition mb-2"
                            value={orderNum}
                            onChange={(e) => setOrderNum(e.target.value)}
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">위치 (알파벳 1글자 + 숫자 1글자)</label>
                        <input
                            type="text"
                            placeholder="예) A3"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition mb-2"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#1e4ed8] hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg mt-4 transition shadow-md">
                        택배 등록
                    </button>
                </form>

                <div className="space-y-4">
                    <div className="bg-[#f8fafc] border border-slate-100 p-5 rounded-xl">
                        <h3 className="font-bold text-gray-800 mb-3 text-sm">이용 안내</h3>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                            <li>주문번호 전부, 혹은 뒤 4자리를 입력해주세요.</li>
                            <li>혹은 운송장 사진을 업로드해, 자동으로 주문번호를 입력할 수 있습니다.</li>
                            <li>택배가 보관된 곳의 코드를 알파벳 대문자 1글자와 숫자 1글자의 조합으로 입력해주세요.</li>
                            <li>택배가 지정된 장소에 보관되지 않은 경우, F1을 대신 입력해주세요.</li>
                            <li>택배 목록에 해당되는 택배를 등록해드립니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                <i className="fa-solid fa-circle-question text-xl text-blue-600"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">택배를 등록하시겠습니까?</h3>
                            <p className="text-sm text-gray-500 mt-1">입력하신 정보가 맞는지 정확히 확인해주세요.</p>
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
            <h2 className="text-xl font-bold mb-3">택배 보관함 위치</h2>
        <ParcelAreas isInteractable={true} posState={position} setPosState={setPosition} parcelStatus={parcelStatus} />
        </>
    );
}