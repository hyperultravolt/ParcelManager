자료구조 프로젝트를 위해 만든 parcel manager 웹 프로그램입니다. \\
npm run dev 혹은 npm run start를 터미널에서 실행하면 localhost:3000으로 열립니다. \\
용량 문제로 node_modules 폴더를 제거했습니다. npm install을 먼저 실행해주세요. \\
\\
실행을 위해 MySQL 데이터베이스를 구축해야 합니다. 데이터베이스 이름은 parcel_database이며, \\
각 테이블의 구조는 다음과 같습니다. \\
\\
users : \\
student_id - varchar(10), primary key \\
name - varchar(15), no null \\
phone - varchar(20), no null \\
password - varchar(70), no null \\
\\
parcels : \\ 
id - int, primary key, auto increment \\
order_num - varchar(25), no null \\
position - varchar(8), no null \\
signed_time - datetime, no null \\
status - varchar(12), default : 'waiting' \\
student_id - varchar(12), default : '00000' \\
\\
notices :  \\
id - int, primary key, auto increment \\
order_num - varchar(25), no null \\
student_id - varchar(12), no null \\
signed_time - datetime, no null \\
matched - int, default : 0 \\
\\
본 프로그램은 이 외에도 SOLAPI, Gemini 등을 사용합니다. \\
보안상의 이유로 해당 API들의 Key는 숨긴 채 업로드합니다. \\
이로 인해 일부 기능(알림 발송, 주문번호 추출)을 테스트할 수 없을 수 있습니다. \\
관련된 Key들의 목록은 .env.local을 참고해주세요. \\