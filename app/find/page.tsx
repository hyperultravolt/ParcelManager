'use server'

import ParcelList from "@/components/ParcelList";

export default async function Home({ searchParams }:{ searchParams: { order_num: string } }) {
    let data = [];
    const { order_num } = await searchParams;

    const res = await fetch(`http://localhost:3000/api/finds?order_num=${order_num}`);

    console.log("Response status:", res.status);

    if (res.ok) {
        data = await res.json();
    }

    return (
        <>
            <section>
                <h1 className="text-2xl font-bold mb-2">택배 목록</h1>
                <p className="text-gray-500 mb-8 text-sm">해당 번호에 대응되는 택배 목록입니다.</p>

                <ParcelList parcels={data} />
            </section>
        </>
    );
}
