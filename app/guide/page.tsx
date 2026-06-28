import Link from "next/link";

export default async function Guide() {
  return (
    <>
      <section className="mb-16">
        <h1 className="text-2xl font-bold mb-2">환영합니다!</h1>
        <p className="text-s text-gray-500"> KSA 택배 관리기는 택배 번호를 입력하고 그 택배의 위치를 확인할 수 있는 시스템입니다. </p>
        <p className="text-s text-gray-500"> 처음 사용해 보신다면 아래의 매뉴얼을 참고해주세요! </p>
      </section>
      <section className="mb-16">
        <h1 className="text-2xl font-bold mb-2">회원가입 및 로그인</h1>
        <p className="text-s text-gray-500"> 학번과 전화번호, 이름을 입력하면 택배 관리기 시스템에 가입할 수 있습니다. </p>
        <p className="text-s text-gray-500"> 전화번호는 추후 등록된 알림이 올 때 메시지 수신번호로 작동합니다. </p>
        <p className="text-s text-gray-500"> 회원가입이 되어 있어야 택배 수령 처리가 가능합니다. </p>
      </section>
      <section className="mb-16">
        <Link href="/register"><h1 className="text-2xl font-bold mb-2 text-blue-800">택배 등록</h1></Link>
        <p className="text-s text-red-500"> 주의 : 학생들이 아닌 택배기사 분들을 위한 서비스입니다. </p>
        <p className="text-s text-gray-500"> 보관함에 도착한 택배의 주문번호와 보관 위치를 입력해서 택배 정보를 등록할 수 있습니다. </p>
        <p className="text-s text-gray-500"> 주문번호를 직접 입력하지 않고, 택배의 운송장을 찍으면 자동으로 주문번호를 인식할 수도 있습니다. </p>
        <p className="text-s text-gray-500"> 택배의 보관 위치를 나타내는 코드는, 하단의 표와 보관함의 포스트잇을 참고해주세요. </p>
      </section>
      <section className="mb-16">
        <Link href="/"><h1 className="text-2xl font-bold mb-2 text-blue-800">택배 찾기</h1></Link>
        <p className="text-s text-gray-500"> 택배의 주문번호를 입력하고, 그 주문번호에 해당하는 택배의 위치를 찾을 수 있습니다. </p>
        <p className="text-s text-gray-500"> 찾으려는 택배에서 수령 버튼을 누르면, 해당 택배를 본인이 수령한 것으로 처리할 수 있습니다. </p>
        <p className="text-s text-gray-500"> 본인 확인을 위해 로그인 혹은 학번/비밀번호 입력이 필요합니다. </p>
      </section>
      <section className="mb-16">
        <Link href="/notice"><h1 className="text-2xl font-bold mb-2 text-blue-800">알림 신청</h1></Link>
        <p className="text-s text-gray-500"> 택배를 주문한 이후, 주문번호를 미리 입력해 두면 해당 택배가 왔을 때 메시지로 알림을 받을 수 있습니다. </p>
        <p className="text-s text-gray-500"> 알림 메시지는 프로필에 입력된 주문번호로 발송됩니다. </p>
        <p className="text-s text-gray-500"> 등록된 알림에 해당하는 택배를 수령 처리할 때, 해당 알림을 삭제할 지 선책할 수 있습니다. </p>
        <p className="text-s text-gray-500"> 해당 알림에 대응되는 택배를 모두 찾았다면 삭제해주세요. </p>
      </section>
    </>
  );
}
