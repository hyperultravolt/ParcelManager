import Link from "next/link";
import { auth } from "@/auth";
import ParcelNoticeInput from "@/components/ParcelNoticeInput";
import NoticeList from "@/components/NoticeList";
import { getNoticeAction } from "../actions";

export default async function Home() {
    const session = await auth();
    if (!session) {
        return (
            <div>알림 기능 사용을 위해서는 <Link href="/login" className="text-blue-500 hover:underline">로그인</Link>이 필요합니다.</div>
        );
    }
    const result = await getNoticeAction((session.user as any)?.studentId);
    let listLoaded = false;
    console.log(session);
    if (result.success){
        listLoaded = true;
    }

    return (
        <>
            <section className="mb-8">
                <h1 className="text-2xl font-bold mb-2">새로운 주문번호를 등록하시겠나요?</h1>
                <p className="text-gray-500 mb-8 text-sm">주문번호를 등록해두면 추후 해당 택배가 도착했을 때 문자 알림을 받을 수 있습니다.</p>
            </section>
            <ParcelNoticeInput />
            <div className="mb-8"></div>
            {listLoaded && <NoticeList data={result.data} />}
            {!listLoaded && <p className="text-gray-500 mb-8 text-sm">알림 목록을 불러오는 데 실패했습니다.</p>}
        </>
    );
};