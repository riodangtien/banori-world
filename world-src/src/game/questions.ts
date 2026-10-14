export type Subject='math';
export type Grade=1|2|3|4|5;
export type Difficulty='easy'|'medium'|'hard';
export type Zone='number'|'shape'|'measure';
export type Operation='add'|'subtract'|'multiply'|'divide'|'fraction'|'percent'|'sides'|'perimeter'|'area'|'triangleArea';
export type SceneSpec={zone:Zone;operation:Operation;a:number;b:number;shape?:'triangle'|'square'|'rectangle'|'circle';unit?:string;copies?:number};
export type Question={id:string;grade:Grade;zone:Zone;difficulty:Difficulty;skill:string;prompt:string;answers:string[];correct:number;value:number;hint:string;explanation:string;scene:SceneSpec};
export const subjects={math:'Primary Mathematics'};
export const difficultyLabels={easy:'Easy',medium:'Medium',hard:'Hard'};
export const zones=[{id:'number',name:'Number Camp',target:'Banana baskets',skill:'Numbers & grouping'},{id:'shape',name:'Shape Garden',target:'Geometry sign',skill:'Shapes & space'},{id:'measure',name:'Measure Trail',target:'Bridge measurements',skill:'Length & comparison'}] as const;
export function calculate(s:SceneSpec){switch(s.operation){case'add':return s.a+s.b;case'subtract':return s.a-s.b;case'multiply':return s.a*s.b;case'divide':return s.a/s.b;case'fraction':return s.a/s.b;case'percent':return s.a*s.b/100;case'sides':return s.a;case'perimeter':return 2*(s.a+s.b);case'area':return s.a*s.b;case'triangleArea':return s.a*s.b/2;}}
export const formatNumber=(n:number)=>String(Math.round(n*1000)/1000).replace('.',',');
const fmt=formatNumber;
function make(grade:Grade,zone:Zone,i:number,scene:SceneSpec,prompt:string,skill:string,hint:string,explanation:string):Question{
 const value=calculate(scene),suffix=scene.unit?` ${scene.unit}`:'',candidates=[value,value+1,Math.max(0,value-1),value+2];if(new Set(candidates).size<4)candidates[2]=value+3;
 return{id:`g${grade}-${zone}-${i}`,grade,zone,difficulty:i<2?'easy':i<4?'medium':'hard',skill,prompt,answers:candidates.map(n=>fmt(n)+suffix),correct:0,value,hint,explanation,scene};
}
export const questions:Question[]=[];
for(const grade of [1,2,3,4,5] as Grade[])for(let i=0;i<5;i++){
 let s:SceneSpec,p:string,skill:string,h:string,e:string;
 if(grade===1){const a=3+i,b=2+i;s={zone:'number',operation:i<3?'add':'subtract',a:i<3?a:a+b,b};p=i<3?`Giỏ A có ${a} quả chuối, giỏ B có ${b} quả. Cả hai giỏ có bao nhiêu quả?`:`Có ${a+b} quả chuối. Lấy ra ${b} quả. Còn bao nhiêu quả?`;skill=i<3?'Cộng trong phạm vi 20':'Trừ trong phạm vi 20';h=i<3?'Đếm hai nhóm rồi cộng lại.':'Bớt nhóm đã lấy ra khỏi tổng.';e=i<3?`${a} + ${b} = ${a+b} quả chuối.`:`${a+b} − ${b} = ${a} quả chuối.`;}
 else if(grade===2){const total=12+i*2,groups=2;s={zone:'number',operation:i<2?'add':i<4?'multiply':'divide',a:i<2?8+i:i<4?groups:total,b:i<2?4+i:i<4?4+i:groups};p=i<2?`Giỏ A có ${s.a} quả, giỏ B có ${s.b} quả. Tổng cộng bao nhiêu quả chuối?`:i<4?`Có ${groups} giỏ, mỗi giỏ có ${s.b} quả chuối. Có tất cả bao nhiêu quả?`:`Chia đều ${total} quả chuối vào ${groups} giỏ. Mỗi giỏ có bao nhiêu quả?`;skill=i<2?'Cộng hai nhóm':i<4?'Nhân với 2':'Chia đều cho 2';h=i<2?'Cộng số quả trong hai giỏ.':i<4?'Cộng hai nhóm bằng nhau.':'Chia tổng số quả thành hai phần bằng nhau.';e=`${s.a} ${i<2?'+':i<4?'×':'÷'} ${s.b} = ${calculate(s)} quả chuối.`;}
 else if(grade===3){s={zone:'number',operation:i<3?'multiply':'divide',a:i<3?3:i===3?18:20,b:i<3?4+i:i===3?3:4};p=i<3?`Có ${s.a} giỏ, mỗi giỏ có ${s.b} quả chuối. Tổng cộng có bao nhiêu quả?`:`Chia đều ${s.a} quả chuối vào ${s.b} giỏ. Mỗi giỏ có bao nhiêu quả?`;skill=i<3?'Nhân các nhóm bằng nhau':'Phép chia hết';h=i<3?'Nhân số giỏ với số quả mỗi giỏ.':'Chia tổng số quả cho số giỏ.';e=`${s.a} ${i<3?'×':'÷'} ${s.b} = ${calculate(s)} quả chuối.`;}
 else if(grade===4){s={zone:'number',operation:'fraction',a:[12,16,20,24,20][i],b:[2,4,5,3,4][i]};p=`Có ${s.a} quả chuối. 1/${s.b} số chuối là bao nhiêu quả?`;skill='Phân số của một số';h=`Chia ${s.a} cho mẫu số ${s.b}.`;e=`${s.a} × 1/${s.b} = ${calculate(s)} quả chuối.`;}
 else {s={zone:'number',operation:'percent',a:20,b:[25,50,75,10,20][i]};p=`Có ${s.a} quả chuối. ${s.b}% số chuối là bao nhiêu quả?`;skill='Tỉ số phần trăm';h=`Tính ${s.a} × ${s.b} rồi chia cho 100.`;e=`${s.a} × ${s.b}/100 = ${calculate(s)} quả chuối.`;}
 questions.push(make(grade,'number',i,s,p,skill,h,e));
 const shape=(['triangle','square','rectangle','circle','triangle'] as const)[i],vn={triangle:'tam giác',square:'hình vuông',rectangle:'hình chữ nhật',circle:'hình tròn'}[shape],sides={triangle:3,square:4,rectangle:4,circle:0}[shape];
 if(grade<=2){s={zone:'shape',operation:'sides',shape,a:i===4?sides*2:sides,b:0,copies:i===4?2:1};p=i===4?`Có 2 biển ${vn}. Cả hai có tổng cộng bao nhiêu cạnh thẳng?`:`Biển ${vn} có bao nhiêu cạnh thẳng?`;skill='Nhận biết cạnh của hình';h='Chỉ đếm các cạnh thẳng; hình tròn không có cạnh thẳng.';e=i===4?`2 × ${sides} = ${sides*2} cạnh thẳng.`:`${vn[0].toUpperCase()+vn.slice(1)} có ${sides} cạnh thẳng.`;}
 else if(grade===3){s={zone:'shape',operation:'perimeter',shape:i%2?'square':'rectangle',a:3+i,b:i%2?3+i:2+i,unit:'cm'};p=`Bảng hình ${i%2?'vuông':'chữ nhật'} có hai kích thước ${s.a} cm và ${s.b} cm. Chu vi là bao nhiêu?`;skill='Chu vi hình chữ nhật, hình vuông';h='Cộng chiều dài và chiều rộng rồi nhân hai.';e=`(${s.a} + ${s.b}) × 2 = ${calculate(s)} cm.`;}
 else if(grade===4){s={zone:'shape',operation:i<3?'area':'perimeter',shape:'rectangle',a:4+i,b:2+i,unit:i<3?'cm²':'cm'};p=`Bảng hình chữ nhật dài ${s.a} cm, rộng ${s.b} cm. ${i<3?'Diện tích':'Chu vi'} là bao nhiêu?`;skill=i<3?'Diện tích hình chữ nhật':'Chu vi hình chữ nhật';h=i<3?'Nhân chiều dài với chiều rộng.':'Cộng hai kích thước rồi nhân hai.';e=i<3?`${s.a} × ${s.b} = ${calculate(s)} cm².`:`(${s.a} + ${s.b}) × 2 = ${calculate(s)} cm.`;}
 else {s={zone:'shape',operation:'triangleArea',shape:'triangle',a:6+i*2,b:4,unit:'cm²'};p=`Biển tam giác có đáy ${s.a} cm, chiều cao 4 cm. Diện tích là bao nhiêu?`;skill='Diện tích hình tam giác';h='Lấy đáy nhân chiều cao rồi chia hai.';e=`${s.a} × 4 ÷ 2 = ${calculate(s)} cm².`;}
 questions.push(make(grade,'shape',i,s,p,skill,h,e));
 const a=grade===5?1.25+i*.25:grade===1?3+i:grade*3+i,b=grade===5?.75:grade===1?2:2+i;
 s={zone:'measure',operation:i<3?'add':'subtract',a:i<3?a:a+b,b,unit:grade===5?'km':'m'};p=i<3?`Đoạn A dài ${fmt(a)} ${s.unit}, đoạn B dài ${fmt(b)} ${s.unit}. Đi cả hai đoạn dài bao nhiêu?`:`Đoạn A dài ${fmt(a+b)} ${s.unit}, đoạn B dài ${fmt(b)} ${s.unit}. Đoạn A dài hơn bao nhiêu?`;skill=grade===5?'Cộng, trừ số đo thập phân':i<3?'Cộng số đo độ dài':'So sánh độ dài';h=i<3?'Các số đo cùng đơn vị: cộng lại.':'Lấy đoạn dài trừ đoạn ngắn.';e=`${fmt(s.a)} ${i<3?'+':'−'} ${fmt(s.b)} = ${fmt(calculate(s))} ${s.unit}.`;
 questions.push(make(grade,'measure',i,s,p,skill,h,e));
}
export function selectMissions(grade:Grade,difficulty:Difficulty,random:()=>number=Math.random){return zones.map(zone=>{const pool=questions.filter(q=>q.grade===grade&&q.zone===zone.id&&q.difficulty===difficulty);return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))].id;});}
export function getQuestion(ids:string[],mission:number){return questions.find(q=>q.id===ids[mission])??questions[0];}
export function shuffledIndices(previous:number[]=[],random:()=>number=Math.random){const order=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}if(previous.length&&order.every((n,i)=>n===previous[i]))order.push(order.shift()!);return order;}
