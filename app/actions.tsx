'use server'

import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { SolapiMessageService } from 'solapi';

export async function registerParcelAction(order_num: string, position: string) {
    console.log("Registering parcel with order_num:", order_num, "and position:", position);
    if (!order_num || !position) {
        return {success: false, message: "주문번호나 위치 데이터가 누락되었습니다."};
    }
    try{
        const [result] = await pool.query("INSERT INTO parcels (order_num, position, signed_time) VALUES (?, ?, NOW())", [order_num, position]);
        sendParcelNoticeAction(order_num, position);
        return {success: true, message: "택배가 정상적으로 등록되었습니다."};
    } catch (error) {
        console.error("Error registering parcel:", error);
        return {success: false, message: "택배 등록 중 오류가 발생했습니다."};
    }
}

export async function receiveParcelAction(parcelId: number, order_num: string, studentId: string, studentPW: string, isLogined : boolean, deleteNotice: boolean) {
    console.log("Receiving parcel with ID:", parcelId, "for student ID:", studentId);
    if (!parcelId || !studentId || (!studentPW && !isLogined)) {
        return {success: false, message: "데이터가 누락되었습니다."};
    }
    try{
        if(!isLogined){
            const [rows] = await pool.query("SELECT password FROM users WHERE student_id = ?", [studentId]) as unknown as [any[]];
            if (!rows || rows.length === 0) {
                return {success: false, message: "존재하지 않는 학번입니다."};
            }
            const isMatch = await bcrypt.compare(studentPW, rows[0].password);
            if (!isMatch) {
                return {success: false, message: "비밀번호가 일치하지 않습니다."};
            }
        }
        const [result] = await pool.query("UPDATE parcels SET student_id = ?, status='received' WHERE id = ?", [studentId, parcelId]) as unknown as [any];
        if (result.affectedRows === 0) {
            return {success: false, message: "택배 수령 처리에 실패했습니다."};
        }
        matchParcelNoticeAction(order_num, studentId, deleteNotice);
        return {success: true, message: "택배가 정상적으로 수령되었습니다."};
    } catch (error) {
        console.error("Error receiving parcel:", error);
        return {success: false, message: "택배 수령 처리 중 오류가 발생했습니다."};
    }
}

export async function getParcelStatus(){
    const parcelCounts = Array.from(new Array(5), () => new Array(7).fill(0));
    try{
        const [rows] = await pool.query("SELECT position FROM parcels where status='waiting' ") as unknown as [any[]];
        for (const row of rows){
            const code1 = row.position.charCodeAt(0);
            const code2 = row.position.charCodeAt(1);
            if (code1<65 || 69<code1 || code2<49 || 55<code2) continue;
            parcelCounts[code1-65][code2-49]+=1;
        }
        return {success: true, data: parcelCounts};
    } catch (error){
        console.error("Error in getting parcel status:", error);
        return {success: false, message: "택배 상태 확인 중 오류가 발생했습니다."};
    }
}

export async function matchParcelNoticeAction(order_num: string, studentId: string, deleteNotice: boolean){
    console.log("Matching notice for order_num:", order_num);
    if (!studentId){
        return {success: false, message: "학번이 누락되었습니다."};
    }
    if (!order_num) {
        return {success: false, message: "주문번호가 누락되었습니다."};
    }
    if (order_num.length < 4) {
        return {success: false, message: "주문번호는 최소 4자리 이상이어야 합니다."};
    }
    const sliced_order_num = order_num.slice(-4);
    try{
        const [rows] = await pool.query("SELECT id, matched FROM notices WHERE student_id = ? AND order_num LIKE ?", [studentId, `%${sliced_order_num}`]) as unknown as [any[]];
        //return {success: true, data: rows};
        for (const row of rows){
            const [result] = await pool.query("UPDATE notices SET matched = ? WHERE id = ?",[row.matched+1,row.id]) as unknown as any[];
            if (result.affectedRows===0) continue
            if(deleteNotice) deleteNoticeAction(row.id)
        }
        return {success:true, message:"알림 매칭을 갱신했습니다."};
    }catch(error){
        console.error("알림 찾기 실패:", error);
        return { success: false, error: "알림 매칭에 실패했습니다." };
    }
}

export async function deleteNoticeAction(noticeId: number){
    if (!noticeId){
        return {success: false, message: "데이터가 누락되었습니다."};
    }
    try{
        const [result] = await pool.query("DELETE FROM notices WHERE id = ?",[noticeId]) as unknown as [any];
        if (result.affectedRows === 0) {
            return {success: false, message: "알림 삭제 처리에 실패했습니다."};
        }
        return {success: true, message: "알림을 삭제했습니다."};
    }catch(error){
        return {success: false, message: "알림 삭제 처리에 실패했습니다."};
    }
}

export async function registerNoticeAction(order_num: string, studentId: string){
    console.log("Registering notice for order_num:", order_num, "and student ID:", studentId);
    if (!order_num || !studentId) {
        return {success: false, message: "주문번호나 학번이 누락되었습니다."};
    }
    try{
        const [result] = await pool.query("INSERT INTO notices (order_num, student_id, signed_time) VALUES (?, ?, NOW())", [order_num, studentId]);
        return {success: true, message: "택배 알림이 정상적으로 등록되었습니다."};
    } catch (error) {
        console.error("Error registering notice:", error);
        return {success: false, message: "택배 알림 등록 중 오류가 발생했습니다."};
    }
}

export async function getNoticeAction(studentId: string) {
    console.log("Fetching notices for student ID:", studentId);
    if (!studentId) {
        return {success: false, message: "학번이 누락되었습니다."};
    }
    try{
        const [rows] = await pool.query("SELECT id, order_num, matched, DATE_FORMAT(signed_time, '%Y-%m-%d %H:%i:%s') AS signed_time FROM notices WHERE student_id = ?", [studentId]) as unknown as [any[]];
        return {success: true, data: rows};
    } catch (error) {
        console.error("Error fetching notices:", error);
        return {success: false, message: "택배 알림 조회 중 오류가 발생했습니다."};
    }
}

export async function sendParcelNoticeAction(order_num: string, position: string){
    console.log("Finding notice for order_num:", order_num);
    if (!order_num) {
        return {success: false, message: "주문번호가 누락되었습니다."};
    }
    if (order_num.length < 4) {
        return {success: false, message: "주문번호는 최소 4자리 이상이어야 합니다."};
    }
    const sliced_order_num = order_num.slice(-4);
    try{
        const [rows] = await pool.query("SELECT id, student_id, matched, DATE_FORMAT(signed_time, '%Y-%m-%d %H:%i:%s') AS signed_time FROM notices WHERE order_num LIKE ?", [`%${sliced_order_num}`]) as unknown as [any[]];
        //return {success: true, data: rows};
        for (const row of rows){
            const [phones] = await pool.query("SELECT phone from users WHERE student_id = ?",row.student_id) as unknown as any[];
            if (phones.length==0) continue
            sendSmsAction(phones[0].phone,`주문번호 ${order_num}번에 대응하는 택배가 ${position}에 배송된 것 같습니다.\n확인해 보세요!`);
        }
        return {success:true, message:"메시지를 전송했습니다."};
    }catch(error){
        console.error("알림 찾기 실패:", error);
        return { success: false, error: "알림 찾기에 실패했습니다." };
    }
}

export async function sendSmsAction(phoneNumber: string, messageContent: string) {
  // 환경변수에서 키와 발신번호를 가져옴 (반드시 .env.local에 설정해둘 것!)
  const apiKey = process.env.SOLAPI_KEY;
  const apiSecret = process.env.SOLAPI_SECRET;
  const senderNumber = process.env.SOLAPI_SENDER_NUMBER; 

  if (!apiKey || !apiSecret || !senderNumber) {
    return {success:false, error: "문자 전송에 필요한 설정이 없습니다."};
  }

  const messageService = new SolapiMessageService(apiKey, apiSecret);

  try {
    const response = await messageService.send({
      to: phoneNumber,
      from: senderNumber, 
      text: messageContent
    });
    
    console.log("문자 전송 성공:", response);
    return { success: true, data: response };
    
  } catch (error) {
    console.error("문자 전송 실패:", error);
    return { success: false, error: "문자 전송에 실패했습니다." };
  }
}