import { CSSProperties } from 'react'
const p = (l:string,t:string,w:string,h:string,x?:CSSProperties):CSSProperties => ({position:'absolute',left:l,top:t,width:w,height:h,...x})

const starClip = 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'

export function MercuryArt() {
  return <>
    <div style={{position:'absolute',right:'6%',top:'6%',width:'26%',height:'26%',borderRadius:'50%',background:'#F4C766',boxShadow:'0 0 0 5px rgba(244,199,102,0.30)'}}/>
    <div style={p('20%','34%','50%','50%',{borderRadius:'50%',background:'#B3A491',boxShadow:'inset -6px -6px 0 rgba(90,78,60,0.18)'})}/>
    <div style={p('31%','46%','13%','13%',{borderRadius:'50%',background:'#9C8C76'})}/>
    <div style={p('50%','60%','10%','10%',{borderRadius:'50%',background:'#9C8C76'})}/>
    <div style={p('40%','68%','7%','7%',{borderRadius:'50%',background:'#9C8C76'})}/>
  </>
}
export function MeteorArt() {
  return <>
    <div style={{position:'absolute',right:'10%',top:'10%',width:'64%',height:'20%',borderRadius:999,background:'linear-gradient(250deg,#F4C766 0%,#E8946A 55%,rgba(232,148,106,0) 100%)',transform:'rotate(38deg)',transformOrigin:'left center'}}/>
    <div style={p('16%','54%','34%','34%',{borderRadius:'50%',background:'#8A6E52',boxShadow:'inset -5px -5px 0 rgba(60,44,30,0.25)'})}/>
    <div style={p('24%','64%','9%','9%',{borderRadius:'50%',background:'#6F573F'})}/>
    <div style={p('36%','73%','6%','6%',{borderRadius:'50%',background:'#6F573F'})}/>
    <div style={p('70%','18%','9%','9%',{clipPath:starClip,background:'#F4C766',animation:'aaTwinkle 1.6s ease-in-out infinite'})}/>
    <div style={p('82%','34%','6%','6%',{clipPath:starClip,background:'#F4C766',animation:'aaTwinkle 1.6s ease-in-out infinite .5s'})}/>
  </>
}
export function MilkywayArt() {
  return <>
    <div style={{position:'absolute',inset:0,animation:'aaSpin 26s linear infinite'}}>
      <div style={p('8%','30%','84%','40%',{borderRadius:'50%',background:'radial-gradient(closest-side,#F6E7B8 0%,#B7A0E0 38%,#7C84C4 66%,rgba(124,132,196,0.15) 100%)',transform:'rotate(-22deg)'})}/>
      <div style={p('42%','42%','16%','16%',{borderRadius:'50%',background:'#FFF6E3',boxShadow:'0 0 14px 4px rgba(246,231,184,0.8)'})}/>
      <div style={p('22%','38%','4%','4%',{borderRadius:'50%',background:'#FFFFFF'})}/>
      <div style={p('72%','56%','4%','4%',{borderRadius:'50%',background:'#FFFFFF'})}/>
      <div style={p('64%','36%','3%','3%',{borderRadius:'50%',background:'#FFFFFF'})}/>
      <div style={p('30%','60%','3%','3%',{borderRadius:'50%',background:'#FFFFFF'})}/>
    </div>
    <div style={p('14%','18%','6%','6%',{clipPath:starClip,background:'#F4C766',animation:'aaTwinkle 1.8s ease-in-out infinite'})}/>
    <div style={{position:'absolute',right:'12%',bottom:'16%',width:'5%',height:'5%',clipPath:starClip,background:'#F4C766',animation:'aaTwinkle 1.8s ease-in-out infinite .6s'}}/>
  </>
}
export function MarsArt() {
  return <>
    <div style={p('18%','22%','58%','58%',{borderRadius:'50%',background:'#C2542F',boxShadow:'inset -7px -7px 0 rgba(110,40,20,0.25)',overflow:'hidden'})}>
      <div style={p('18%','30%','34%','24%',{borderRadius:'50% 60% 55% 45%',background:'#A23E20'})}/>
      <div style={p('55%','58%','26%','20%',{borderRadius:'55% 45% 60% 50%',background:'#A23E20'})}/>
      <div style={p('34%','-4%','34%','16%',{borderRadius:'50%',background:'#F3ECE0'})}/>
    </div>
    <div style={{position:'absolute',right:'12%',top:'16%',width:'13%',height:'13%',borderRadius:'50%',background:'#CFC6B8',boxShadow:'inset -3px -3px 0 rgba(90,80,66,0.25)'}}/>
  </>
}
export function SpacesuitArt() {
  return <>
    <div style={{position:'absolute',left:'24%',bottom:'6%',width:'52%',height:'26%',borderRadius:'40% 40% 22% 22%',background:'#EDEFF6',boxShadow:'inset 0 -4px 0 rgba(90,98,130,0.10)'}}/>
    <div style={{position:'absolute',left:'45%',bottom:'12%',width:'10%',height:'10%',borderRadius:'50%',background:'#7BAE7F'}}/>
    <div style={p('20%','14%','60%','60%',{borderRadius:'50%',background:'#FFFFFF',boxShadow:'0 6px 0 rgba(90,98,130,0.10)'})}/>
    <div style={p('16%','38%','11%','14%',{borderRadius:'50%',background:'#D8DCEA'})}/>
    <div style={{position:'absolute',right:'16%',top:'38%',width:'11%',height:'14%',borderRadius:'50%',background:'#D8DCEA'}}/>
    <div style={p('30%','28%','40%','34%',{borderRadius:'46%',background:'#3A4A6B',overflow:'hidden'})}>
      <div style={p('14%','16%','30%','24%',{borderRadius:'50%',background:'rgba(108,140,255,0.55)'})}/>
      <div style={{position:'absolute',right:'16%',bottom:'20%',width:'14%',height:'14%',clipPath:starClip,background:'#FFFFFF',opacity:.85}}/>
    </div>
  </>
}
