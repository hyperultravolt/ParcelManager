import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image || !(image instanceof File)) {
      return NextResponse.json({ error: "이미지 파일이 필요합니다." }, { status: 400 });
    }

    //console.log(process.env.GOOGLE_API_KEY);
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const prompt =`
      이 이미지는 택배 운송장입니다. 
      이미지에서 '주문번호'를 찾아서 반드시 아래의 JSON 형식으로만 응답하세요.
      다른 설명이나 마크다운 백틱(\`\`\`)은 절대 포함하지 마세요.
      만약 주문번호에 특수기호(-, _ 등)가 포함되어 있다면, 제외하고 숫자만 추출해서 응답하세요.
      만약 주문번호를 찾을 수 없다면, 대신 운송장번호를 추출해서 아래와 같이 응답하세요.
      주문번호로 추정되는 텍스트는 있지만 그게 주문번호인지 확실하지 않은 경우에도 운송장번호를 응답하세요.
      {"ok": true, "orderNumber": "추출한번호"}
      만약 주문번호, 운송장번호를 둘 다 찾을 수 없을 경우라면,
      {"ok": false}를 응답하세요.
    `

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {text: prompt},
        {inlineData:{mimeType: image.type, data: base64Image}}
      ]
    });

    const responseText = response.text;
    
    if(!responseText){
      throw new Error("API 응답이 비어있습니다.");
    }

    const parsedData = JSON.parse(responseText.trim());
    if (!parsedData.ok) {
      throw new Error("주문번호나 운송장번호를 찾을 수 없습니다.");
    }
    const orderNum = parsedData.orderNumber;
    return NextResponse.json({ order_num: orderNum }, { status: 200 });
  } catch (error) {
    console.error("Gemini API 에러:", error);
    return NextResponse.json({ error: "Gemini API 에러", message: "주문번호 추출에 실패했습니다." }, { status: 500 });
  }
}