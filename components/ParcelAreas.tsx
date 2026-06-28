'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerParcelAction } from "@/app/actions";

export default function ParcelAreas({isInteractable, posState, setPosState, parcelStatus}: {isInteractable: boolean, posState: any, setPosState: any, parcelStatus: any}) {
    const style1 = "bg-[#dcfce7] text-[#166534] py-3 rounded-lg font-medium";
    const style2 = "bg-[#dbeafe] text-[#1e40af] py-3 rounded-lg font-medium";
    const style3 = "bg-[#ffe9e9] text-red-400 py-3 rounded-lg font-medium";
    const selStyle1 = "bg-green-200 text-[#166534] py-3 rounded-lg font-medium border-2 border-green-800 shadow-sm relative"
    const selStyle2 = "bg-blue-200 text-[#1e40af] py-3 rounded-lg font-medium border-2 border-blue-800 shadow-sm relative"
    const selStyle3 = "bg-red-200 text-red-400 py-3 rounded-lg font-medium border-2 border-red-800 shadow-sm relative"

    function loadStyle(vPos: number, hPos:number, isSelected: boolean){
        if (!parcelStatus.success){
            if (isSelected) return "bg-gray-300 text-gray-800 py-3 rounded-lg font-bold border-2 border-gray-800 shadow-sm relative";
            else return "bg-gray-200 text-gray-800 py-3 rounded-lg font-medium";
        }
        const amount = parcelStatus.data[vPos-1][hPos-1];
        if(isSelected){
            if (amount === 0) return selStyle1;
            else if (amount <= 3) return selStyle2;
            else return selStyle3;
        }else{
            if (amount === 0) return style1;
            else if (amount <= 3) return style2;
            else return style3;
        }
    }

    function getStyle(vPos: number, hPos: number){
        if (!isInteractable) return loadStyle(vPos,hPos,false);
        if (posState.length != 2) return loadStyle(vPos,hPos,false);
        if (posState[0] == String.fromCharCode(64+vPos) && posState[1] == String.fromCharCode(48+hPos)) return loadStyle(vPos,hPos,true);
        else return loadStyle(vPos,hPos,false);
    }

    function setPosition(pos: string){
        if (!isInteractable) return;
        setPosState(pos);
    }

    return (
        <>
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-400"></span>비어있음</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400"></span>3개 이하</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-300"></span>4개 이상</div>
        </div>

        <div className="grid grid-cols-[2rem_repeat(7,1fr)] gap-3 items-center text-center max-w-3xl">
          <div></div>
          <div className="text-gray-500 font-medium">1</div>
          <div className="text-gray-500 font-medium">2</div>
          <div className="text-gray-500 font-medium">3</div>
          <div className="text-gray-500 font-medium">4</div>
          <div className="text-gray-500 font-medium">5</div>
          <div className="text-gray-500 font-medium">6</div>
          <div className="text-gray-500 font-medium">7</div>

          <div className="text-gray-500 font-bold">A</div>
          <div onClick={()=>setPosition("A1")} className={getStyle(1,1)}>A1</div>
          <div onClick={()=>setPosition("A2")} className={getStyle(1,2)}>A2</div>
          <div onClick={()=>setPosition("A3")} className={getStyle(1,3)}>A3</div>
          <div onClick={()=>setPosition("A4")} className={getStyle(1,4)}>A4</div>
          <div onClick={()=>setPosition("A5")} className={getStyle(1,5)}>A5</div>
          <div onClick={()=>setPosition("A6")} className={getStyle(1,6)}>A6</div>
          <div onClick={()=>setPosition("A7")} className={getStyle(1,7)}>A7</div>

          <div className="text-gray-500 font-bold">B</div>
          <div onClick={()=>setPosition("B1")} className={getStyle(2,1)}>B1</div>
          <div onClick={()=>setPosition("B2")} className={getStyle(2,2)}>B2</div>
          <div onClick={()=>setPosition("B3")} className={getStyle(2,3)}>B3</div>
          <div onClick={()=>setPosition("B4")} className={getStyle(2,4)}>B4</div>
          <div onClick={()=>setPosition("B5")} className={getStyle(2,5)}>B5</div>
          <div onClick={()=>setPosition("B6")} className={getStyle(2,6)}>B6</div>
          <div onClick={()=>setPosition("B7")} className={getStyle(2,7)}>B7</div>

          <div className="text-gray-500 font-bold">C</div>
          <div onClick={()=>setPosition("C1")} className={getStyle(3,1)}>C1</div>
          <div onClick={()=>setPosition("C2")} className={getStyle(3,2)}>C2</div>
          <div onClick={()=>setPosition("C3")} className={getStyle(3,3)}>C3</div>
          <div onClick={()=>setPosition("C4")} className={getStyle(3,4)}>C4</div>
          <div onClick={()=>setPosition("C5")} className={getStyle(3,5)}>C5</div>
          <div onClick={()=>setPosition("C6")} className={getStyle(3,6)}>C6</div>
          <div onClick={()=>setPosition("C7")} className={getStyle(3,7)}>C7</div>

          <div className="text-gray-500 font-bold">D</div>
          <div onClick={()=>setPosition("D1")} className={getStyle(4,1)}>D1</div>
          <div onClick={()=>setPosition("D2")} className={getStyle(4,2)}>D2</div>
          <div onClick={()=>setPosition("D3")} className={getStyle(4,3)}>D3</div>
          <div onClick={()=>setPosition("D4")} className={getStyle(4,4)}>D4</div>
          <div onClick={()=>setPosition("D5")} className={getStyle(4,5)}>D5</div>
          <div onClick={()=>setPosition("D6")} className={getStyle(4,6)}>D6</div>
          <div onClick={()=>setPosition("D7")} className={getStyle(4,7)}>D7</div>

          <div className="text-gray-500 font-bold">E</div>
          <div onClick={()=>setPosition("E1")} className={getStyle(5,1)}>E1</div>
          <div onClick={()=>setPosition("E2")} className={getStyle(5,2)}>E2</div>
          <div onClick={()=>setPosition("E3")} className={getStyle(5,3)}>E3</div>
          <div onClick={()=>setPosition("E4")} className={getStyle(5,4)}>E4</div>
          <div onClick={()=>setPosition("E5")} className={getStyle(5,5)}>E5</div>
          <div onClick={()=>setPosition("E6")} className={getStyle(5,6)}>E6</div>
          <div onClick={()=>setPosition("E7")} className={getStyle(5,7)}>E7</div>
        </div>
        </>
    );
}