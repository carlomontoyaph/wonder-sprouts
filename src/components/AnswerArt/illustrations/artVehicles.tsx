import { CSSProperties } from 'react'
const p = (l:string,t:string,w:string,h:string,x?:CSSProperties):CSSProperties => ({position:'absolute',left:l,top:t,width:w,height:h,...x})

export function Airplane2Art() { return <><div style={p('2%','50%','42%','14%',{borderRadius:'50% 20% 20% 50%',background:'#C2D2DF',transform:'rotate(8deg)'})}/><div style={p('56%','50%','42%','14%',{borderRadius:'20% 50% 50% 20%',background:'#C2D2DF',transform:'rotate(-8deg)'})}/><div style={p('44%','14%','12%','24%',{borderRadius:'40% 40% 0 0',background:'#C2D2DF'})}/><div style={p('26%','24%','48%','62%',{borderRadius:'50% 50% 46% 46%',background:'#FBFCFE'})}/><div style={p('30%','60%','40%','28%',{borderRadius:'50%',background:'#D8453E'})}/><div style={p('32%','34%','36%','20%',{borderRadius:'50% 50% 45% 45%',background:'#8CC1DA'})}/><div style={p('40%','36%','9%','11%',{borderRadius:'50%',background:'#B7DCEC'})}/><div style={p('32%','55%','36%','7%',{borderRadius:999,background:'#E0534B'})}/></> }
export function TracksArt() {
  return <>
    <div style={{position:'absolute',left:0,top:0,width:'100%',height:'46%',background:'#CFE2F0'}}/>
    <div style={{position:'absolute',left:'60%',top:'30%',width:'14%',height:'14%',borderRadius:'50%',background:'#F6D45B'}}/>
    <div style={{position:'absolute',left:'6%',top:'36%',width:'34%',height:'14%',borderRadius:'50% 50% 0 0',background:'#A7C68C'}}/>
    <div style={{position:'absolute',left:'30%',top:'38%',width:'40%',height:'12%',borderRadius:'50% 50% 0 0',background:'#94B97C'}}/>
    <div style={{position:'absolute',left:0,top:'46%',width:'100%',height:'54%',background:'#CBB089'}}/>
    <div style={{position:'absolute',left:0,top:'46%',width:'100%',height:'54%',background:'#B79A6E',clipPath:'polygon(40% 0,60% 0,90% 100%,10% 100%)'}}/>
    <div style={{position:'absolute',left:0,top:'46%',width:'100%',height:'54%',background:'#7E909F',clipPath:'polygon(45% 0,47% 0,30% 100%,22% 100%)'}}/>
    <div style={{position:'absolute',left:0,top:'46%',width:'100%',height:'54%',background:'#7E909F',clipPath:'polygon(53% 0,55% 0,78% 100%,70% 100%)'}}/>
    <div style={{position:'absolute',left:'46.5%',top:'48%',width:'7%',height:'2.5%',borderRadius:2,background:'#8A6A3E'}}/>
    <div style={{position:'absolute',left:'44%',top:'54%',width:'12%',height:'3.5%',borderRadius:2,background:'#8A6A3E'}}/>
    <div style={{position:'absolute',left:'40%',top:'63%',width:'20%',height:'4.5%',borderRadius:2,background:'#946C3C'}}/>
    <div style={{position:'absolute',left:'34%',top:'74%',width:'32%',height:'5.5%',borderRadius:3,background:'#8A6A3E'}}/>
    <div style={{position:'absolute',left:'26%',top:'87%',width:'48%',height:'7%',borderRadius:3,background:'#946C3C'}}/>
  </>
}
export function FiretruckArt() {
  return <>
    <div style={{position:'absolute',left:'18%',top:'24%',width:'60%',height:'5%',borderRadius:999,background:'#C7CFD6',transform:'rotate(-12deg)',transformOrigin:'left'}}/>
    <div style={{position:'absolute',left:'18%',top:'26%',width:'60%',height:'5%',borderRadius:999,background:'#E0E6EC',transform:'rotate(-12deg)',transformOrigin:'left',opacity:.6}}/>
    <div style={{position:'absolute',left:'10%',top:'42%',width:'80%',height:'30%',borderRadius:8,background:'#D8453E'}}/>
    <div style={{position:'absolute',right:'10%',top:'34%',width:'24%',height:'24%',borderRadius:'8px 10px 0 0',background:'#E0534B'}}/>
    <div style={{position:'absolute',right:'12%',top:'37%',width:'16%',height:'12%',borderRadius:4,background:'#9CCBE0'}}/>
    <div style={{position:'absolute',left:'14%',top:'52%',width:'40%',height:'8%',borderRadius:3,background:'#F4F6FA',opacity:.85}}/>
    <div style={{position:'absolute',left:'20%',top:'66%',width:'18%',height:'18%',borderRadius:'50%',background:'#3A3A3A'}}/>
    <div style={{position:'absolute',left:'24%',top:'70%',width:'10%',height:'10%',borderRadius:'50%',background:'#9AA3AB'}}/>
    <div style={{position:'absolute',right:'22%',top:'66%',width:'18%',height:'18%',borderRadius:'50%',background:'#3A3A3A'}}/>
    <div style={{position:'absolute',right:'26%',top:'70%',width:'10%',height:'10%',borderRadius:'50%',background:'#9AA3AB'}}/>
    <div style={{position:'absolute',right:'18%',top:'29%',width:'9%',height:'7%',borderRadius:3,background:'#F4C84A'}}/>
  </>
}
export function BoatArt() {
  return <>
    <div style={{position:'absolute',left:'48%',top:'14%',width:'3%',height:'48%',borderRadius:999,background:'#9A7B53'}}/>
    <div style={{position:'absolute',left:'24%',top:'16%',width:'24%',height:'44%',background:'#F4F6FA',clipPath:'polygon(100% 0,100% 100%,0 100%)',boxShadow:'inset 3px 0 0 rgba(150,165,185,0.18)'}}/>
    <div style={{position:'absolute',left:'52%',top:'22%',width:'18%',height:'38%',background:'#E0653E',clipPath:'polygon(0 0,0 100%,100% 100%)'}}/>
    <div style={{position:'absolute',left:'18%',top:'60%',width:'64%',height:'18%',background:'#C2542F',borderRadius:'0 0 45% 45%',clipPath:'polygon(0 0,100% 0,86% 100%,14% 100%)'}}/>
    <div style={{position:'absolute',left:'8%',top:'80%',width:'84%',height:'7%',borderRadius:999,background:'#6FA3D6'}}/>
    <div style={{position:'absolute',left:'14%',top:'88%',width:'30%',height:'5%',borderRadius:999,background:'#8FB8E0'}}/>
    <div style={{position:'absolute',right:'14%',top:'88%',width:'26%',height:'5%',borderRadius:999,background:'#8FB8E0'}}/>
  </>
}
export function BicycleArt() {
  return <>
    <div style={{position:'absolute',left:'8%',top:'46%',width:'36%',height:'36%',borderRadius:'50%',background:'#E8EEF3',boxShadow:'inset 0 0 0 5px #54718A'}}/>
    <div style={{position:'absolute',right:'8%',top:'46%',width:'36%',height:'36%',borderRadius:'50%',background:'#E8EEF3',boxShadow:'inset 0 0 0 5px #54718A'}}/>
    <div style={{position:'absolute',left:'23%',top:'61%',width:'6%',height:'6%',borderRadius:'50%',background:'#54718A'}}/>
    <div style={{position:'absolute',right:'23%',top:'61%',width:'6%',height:'6%',borderRadius:'50%',background:'#54718A'}}/>
    <div style={{position:'absolute',left:'26%',top:'42%',width:'34%',height:'5%',borderRadius:999,background:'#E0653E',transform:'rotate(20deg)'}}/>
    <div style={{position:'absolute',left:'26%',top:'46%',width:'22%',height:'5%',borderRadius:999,background:'#E0653E',transform:'rotate(74deg)',transformOrigin:'left'}}/>
    <div style={{position:'absolute',left:'42%',top:'46%',width:'26%',height:'5%',borderRadius:999,background:'#E8946A',transform:'rotate(-58deg)',transformOrigin:'left'}}/>
    <div style={{position:'absolute',left:'30%',top:'36%',width:'12%',height:'6%',borderRadius:999,background:'#4A3A28',transform:'rotate(8deg)'}}/>
    <div style={{position:'absolute',right:'24%',top:'34%',width:'14%',height:'4.5%',borderRadius:999,background:'#4A3A28'}}/>
    <div style={{position:'absolute',right:'24%',top:'34%',width:'4.5%',height:'14%',borderRadius:999,background:'#54718A'}}/>
    <div style={{position:'absolute',left:'44%',top:'64%',width:'9%',height:'5%',borderRadius:999,background:'#4A3A28'}}/>
  </>
}
