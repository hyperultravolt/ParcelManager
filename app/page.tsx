import ParcelAreas from "@/components/ParcelAreas";
import OrderNumInput from "@/components/OrderNumInput";
import { getParcelStatus } from "./actions";
import Image from "next/image";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const parcelStatus = await getParcelStatus();
  console.log(parcelStatus);
  return (
    <>
      <section className="mb-16">
        {session ? (
          <h1 className="text-2xl font-bold mb-2">{session.user?.name}님 환영합니다!</h1>
        ) : (
          <h1 className="text-2xl font-bold mb-2">환영합니다!</h1>
        )}
        <p className="text-gray-500 mb-8 text-sm">주문번호를 입력하고 택배의 위치를 확인하세요.</p>

        <OrderNumInput />
      </section>

      <section>
        <h1 className="text-xl font-bold mb-4">택배 보관함 현황</h1>

        <ParcelAreas isInteractable={false} posState={"A0"} setPosState={""} parcelStatus={parcelStatus}/>
  
        {/*<div className="mt-4 max-w-3xl w-full bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-800">C4</span>
            <span className="bg-[#dbeafe] text-[#1e40af] px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
              보관중
            </span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              현재 택배 수: <span className="font-semibold text-blue-600 text-base ml-1">2개</span>
            </p>
            <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition shadow-sm whitespace-nowrap">
              확인
            </button>
          </div>
        </div>*/}
      </section>
    </>
  );
}
