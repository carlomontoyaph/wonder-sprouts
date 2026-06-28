import { CSSProperties } from 'react'

const p = (l: string, t: string, w: string, h: string, x?: CSSProperties): CSSProperties => ({
  position: 'absolute', left: l, top: t, width: w, height: h, ...x,
})

export function GiraffeArt() {
  return <>
    <div style={p('16%','48%','40%','26%',{borderRadius:'50%',background:'#E6BB63'})}/>
    <div style={p('22%','64%','8%','27%',{borderRadius:'30%',background:'#E0B25A'})}/>
    <div style={p('40%','64%','8%','27%',{borderRadius:'30%',background:'#DCAC50'})}/>
    <div style={p('22%','87%','8%','5%',{borderRadius:'30%',background:'#8A5E22'})}/>
    <div style={p('40%','87%','8%','5%',{borderRadius:'30%',background:'#8A5E22'})}/>
    <div style={p('12%','52%','9%','4%',{borderRadius:999,background:'#E0B25A',transform:'rotate(22deg)'})}/>
    <div style={p('48%','14%','15%','44%',{borderRadius:999,background:'#E6BB63',transform:'rotate(11deg)'})}/>
    <div style={p('55%','6%','24%','16%',{borderRadius:'55% 65% 40% 50%',background:'#E6BB63'})}/>
    <div style={p('60%','-2%','3%','8%',{borderRadius:999,background:'#C98F3A'})}/>
    <div style={p('60%','-4%','6%','5%',{borderRadius:'50%',background:'#8A5E22'})}/>
    <div style={p('66%','-1%','3%','7%',{borderRadius:999,background:'#C98F3A'})}/>
    <div style={p('66%','-3%','6%','5%',{borderRadius:'50%',background:'#8A5E22'})}/>
    <div style={p('52%','6%','8%','5%',{borderRadius:'50%',background:'#D8A748',transform:'rotate(-20deg)'})}/>
    <div style={p('67%','9%','5%','6%',{borderRadius:'50%',background:'#4A3A28'})}/>
    <div style={p('24%','52%','10%','10%',{borderRadius:'42%',background:'#B5792C'})}/>
    <div style={p('38%','55%','9%','9%',{borderRadius:'45%',background:'#B5792C'})}/>
    <div style={p('50%','42%','7%','7%',{borderRadius:'45%',background:'#B5792C'})}/>
    <div style={p('53%','28%','6%','7%',{borderRadius:'45%',background:'#B5792C'})}/>
  </>
}

export function HoneyArt() {
  return <>
    <div style={p('40%','60%','7%','18%',{borderRadius:'0 0 50% 50%',background:'#F0B93E'})}/>
    <div style={p('41%','74%','5%','5%',{borderRadius:'50%',background:'#F0B93E'})}/>
    <div style={p('30%','22%','32%','32%',{clipPath:'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)',background:'#F2C24E'})}/>
    <div style={p('14%','40%','28%','28%',{clipPath:'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)',background:'#E7A92E'})}/>
    <div style={p('48%','40%','28%','28%',{clipPath:'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)',background:'#E7A92E'})}/>
    <div style={p('34%','28%','24%','20%',{clipPath:'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)',background:'#F7D277'})}/>
    <div style={p('68%','12%','24%','17%',{borderRadius:'50%',background:'#F4C84A',overflow:'hidden'})}>
      <div style={p('38%','0','14%','100%',{background:'#4A3A28'})}/>
      <div style={p('66%','0','12%','100%',{background:'#4A3A28'})}/>
    </div>
    <div style={p('63%','7%','11%','9%',{borderRadius:'50%',background:'#FFFFFF',opacity:.85})}/>
    <div style={p('78%','16%','4%','5%',{borderRadius:'50%',background:'#4A3A28'})}/>
  </>
}

export function BatArt() {
  return <>
    <div style={p('1%','34%','36%','30%',{clipPath:'polygon(100% 0,100% 100%,60% 72%,28% 100%,0 82%,22% 50%,0 18%)',background:'#6E5A8C'})}/>
    <div style={p('63%','34%','36%','30%',{clipPath:'polygon(0 0,0 100%,40% 72%,72% 100%,100% 82%,78% 50%,100% 18%)',background:'#6E5A8C'})}/>
    <div style={p('36%','20%','12%','16%',{clipPath:'polygon(50% 0,0 100%,100% 100%)',background:'#7A66A0'})}/>
    <div style={p('52%','20%','12%','16%',{clipPath:'polygon(50% 0,0 100%,100% 100%)',background:'#7A66A0'})}/>
    <div style={p('32%','30%','36%','40%',{borderRadius:'48% 48% 46% 46%',background:'#7A66A0'})}/>
    <div style={p('40%','40%','9%','11%',{borderRadius:'50%',background:'#FFFFFF'})}/>
    <div style={p('51%','40%','9%','11%',{borderRadius:'50%',background:'#FFFFFF'})}/>
    <div style={p('42%','43%','5%','6%',{borderRadius:'50%',background:'#4A3A28'})}/>
    <div style={p('53%','43%','5%','6%',{borderRadius:'50%',background:'#4A3A28'})}/>
    <div style={p('45%','58%','4%','6%',{clipPath:'polygon(50% 100%,0 0,100% 0)',background:'#FFFFFF'})}/>
    <div style={p('51%','58%','4%','6%',{clipPath:'polygon(50% 100%,0 0,100% 0)',background:'#FFFFFF'})}/>
  </>
}

export function JoeyArt() {
  return <>
    <div style={p('6%','62%','34%','13%',{borderRadius:999,background:'#CC9A5E',transform:'rotate(14deg)'})}/>
    <div style={p('14%','80%','32%','10%',{borderRadius:999,background:'#C8945A'})}/>
    <div style={p('24%','54%','30%','30%',{borderRadius:'50%',background:'#D2A062'})}/>
    <div style={p('36%','34%','34%','40%',{borderRadius:'50% 52% 46% 48%',background:'#DBAA6C'})}/>
    <div style={p('38%','58%','22%','20%',{borderRadius:'50% 50% 45% 45%',background:'#EBD4A8'})}/>
    <div style={p('42%','55%','14%','14%',{borderRadius:'50%',background:'#DBAA6C'})}/>
    <div style={p('43%','50%','4%','8%',{borderRadius:999,background:'#DBAA6C',transform:'rotate(-12deg)'})}/>
    <div style={p('53%','50%','4%','8%',{borderRadius:999,background:'#DBAA6C',transform:'rotate(12deg)'})}/>
    <div style={p('47%','60%','4%','4%',{borderRadius:'50%',background:'#4A3A28'})}/>
    <div style={p('56%','14%','26%','26%',{borderRadius:'52% 56% 46% 48%',background:'#DBAA6C'})}/>
    <div style={p('58%','0','7%','19%',{borderRadius:999,background:'#DBAA6C',transform:'rotate(-12deg)'})}/>
    <div style={p('69%','0','7%','19%',{borderRadius:999,background:'#DBAA6C',transform:'rotate(10deg)'})}/>
    <div style={p('74%','26%','12%','10%',{borderRadius:'50% 60% 50% 40%',background:'#D2A062'})}/>
    <div style={p('83%','29%','4%','4%',{borderRadius:'50%',background:'#4A3A28'})}/>
    <div style={p('66%','22%','6%','7%',{borderRadius:'50%',background:'#4A3A28'})}/>
  </>
}

export function OctopusArt() {
  return <>
    <div style={p('12%','54%','11%','36%',{borderRadius:999,background:'#BC6184',transform:'rotate(20deg)'})}/>
    <div style={p('27%','58%','11%','36%',{borderRadius:999,background:'#CE7196',transform:'rotate(9deg)'})}/>
    <div style={p('44%','60%','12%','37%',{borderRadius:999,background:'#BC6184'})}/>
    <div style={p('58%','58%','11%','36%',{borderRadius:999,background:'#CE7196',transform:'rotate(-9deg)'})}/>
    <div style={p('71%','54%','11%','36%',{borderRadius:999,background:'#BC6184',transform:'rotate(-20deg)'})}/>
    <div style={p('20%','16%','60%','50%',{borderRadius:'50% 50% 44% 44%',background:'#D67BA0'})}/>
    <div style={p('33%','32%','13%','16%',{borderRadius:'50%',background:'#FFFFFF'})}/>
    <div style={p('54%','32%','13%','16%',{borderRadius:'50%',background:'#FFFFFF'})}/>
    <div style={p('37%','37%','6%','8%',{borderRadius:'50%',background:'#4A3A28'})}/>
    <div style={p('58%','37%','6%','8%',{borderRadius:'50%',background:'#4A3A28'})}/>
    <div style={p('28%','48%','10%','6%',{borderRadius:'50%',background:'#F2998E',opacity:.55})}/>
    <div style={p('62%','48%','10%','6%',{borderRadius:'50%',background:'#F2998E',opacity:.55})}/>
    <div style={p('45%','50%','10%','6%',{border:'3px solid #4A3A28',borderTop:0,borderRadius:'0 0 40px 40px'})}/>
  </>
}
