'use server'

import ParcelInput from "@/components/ParcelInput";
import ParcelAreas from "@/components/ParcelAreas";
import { getParcelStatus } from "../actions";

export default async function Home() {
  let data = [];
  const parcelStatus = await getParcelStatus();

  //const res = await fetch("http://localhost:3000/api/lists");
  //console.log("Response status:", res.status);

  /*if (res.ok) {
    data = await res.json();
  }*/

  return (
    <>
      <section>
        <h1 className="text-2xl font-bold mb-2">택배 등록</h1>
        <p className="text-gray-500 mb-8 text-sm">발송된 택배를 등록해주세요.</p>
        
        <ParcelInput parcelStatus={parcelStatus}/>
      </section>
    </>
  );
}
