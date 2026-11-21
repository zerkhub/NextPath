import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Net3D} from './Net3D';
import {C, ramp, eo, fontCss} from './theme';

const Bg = () => (
  <AbsoluteFill style={{background:`radial-gradient(1200px 800px at 70% 30%, #1a0a7a 0%, ${C.bg} 70%)`}}>
    <AbsoluteFill style={{opacity:.35,backgroundImage:'radial-gradient(circle, #2f2a96 1.2px, transparent 1.6px)',backgroundSize:'48px 48px'}}/>
  </AbsoluteFill>
);
const FU: React.FC<{t:number;s:number;d:number;style?:React.CSSProperties;children:React.ReactNode;out?:number}> = ({t,s,d,style,children,out}) => {
  const p = eo(ramp(t,s,s+d)); const o = out!==undefined ? p*(1-ramp(t,out,out+0.3)) : p;
  return <div style={{position:'absolute',opacity:o,transform:`translateY(${(1-p)*26}px)`,...style}}>{children}</div>;
};
const hk:React.CSSProperties={fontFamily:"'HK Grotesk Wide'"};

const Hook: React.FC<{t:number}> = ({t}) => (<>
  <FU t={t} s={2.5} d={0.5} style={{left:110,top:330,width:900,...hk,fontSize:100,fontWeight:700,letterSpacing:-2,lineHeight:1.02}}><span style={{color:C.red}}>Fibre</span><br/>cut.</FU>
  <FU t={t} s={3.9} d={0.6} style={{left:114,top:670,width:760,fontSize:44,fontWeight:500,color:C.mute,lineHeight:1.3}}>A single point of failure.<br/>Where is the next path?</FU>
</>);

const row:React.CSSProperties={display:'flex',alignItems:'center',gap:18,fontSize:34,fontWeight:600,height:54};
const Dot = ({c}:{c:string}) => <div style={{width:20,height:20,borderRadius:'50%',background:c,flex:'none'}}/>;
const Card: React.FC<{t:number;s:number;sw:string;t1:string;t2:string;badge?:boolean}> = ({t,s,sw,t1,t2,badge}) => (
  <FU t={t} s={s} d={0.4} style={{position:'relative',display:'flex',alignItems:'center',gap:22,height:92,padding:'0 26px',borderRadius:20,marginTop:12,background:'rgba(36,16,170,.55)',border:`2px solid ${C.line}`,width:620}}>
    <div style={{width:12,height:56,borderRadius:6,background:sw,flex:'none'}}/>
    <div><div style={{fontSize:34,fontWeight:700}}>{t1}</div><div style={{fontSize:25,fontWeight:500,color:C.mute,marginTop:4}}>{t2}</div></div>
    {badge && <div style={{marginLeft:'auto',fontSize:22,fontWeight:800,letterSpacing:1,padding:'8px 16px',borderRadius:999,background:C.orange,color:C.bg,opacity:eo(ramp(t,35.2,35.7))}}>BEST</div>}
  </FU>
);
const Demo: React.FC<{t:number}> = ({t}) => {
  const cur = (() => { // cursor path to the cut point, click at 24.4
    const a=ramp(t,22.4,24.4); const x=900-(900-480)*eo(a), y=900-(900-490)*eo(a);
    const click=t>24.4&&t<24.9; return {x,y,o:ramp(t,22.2,22.6)*(1-ramp(t,25.2,25.6)),s:click?0.85:1};
  })();
  return (<>
    <FU t={t} s={21.2} d={0.5} style={{left:60,top:34,...hk,fontSize:24,fontWeight:900,letterSpacing:-.3}}>Next<span style={{color:C.blue}}>Path</span></FU>
    <FU t={t} s={21.2} d={0.6} style={{left:1180,top:90,width:700,height:900,borderRadius:30,background:'rgba(6,1,58,.92)',border:`1.5px solid ${C.line}`,boxShadow:'0 30px 80px rgba(0,0,0,.45)'}}>
      <div style={{position:'absolute',left:38,top:36,fontSize:24,letterSpacing:4,fontWeight:700,color:C.mute}}>CUT ANALYSIS</div>
    </FU>
    <FU t={t} s={21.6} d={0.5} out={24.3} style={{left:1218,top:210,fontSize:34,color:C.mute,fontWeight:500,width:620,lineHeight:1.35}}>Click a cable on the map to mark the cut point.</FU>
    <FU t={t} s={24.7} d={0.4} style={{left:1218,top:200,width:620}}>
      <div style={row}><Dot c={C.red}/>Cut point set</div>
      <div style={{fontSize:26,color:C.mute,marginLeft:38,marginTop:-6}}>Segment N3 – N5</div>
    </FU>
    <FU t={t} s={25.6} d={0.4} style={{left:1218,top:340,fontSize:22,letterSpacing:4,fontWeight:700,color:C.mute}}>AFFECTED SYSTEMS</FU>
    {['DWDM systems','Metro-E systems','5G sites','Customer links'].map((n,i)=>(
      <FU key={n} t={t} s={25.9+i*0.3} d={0.3} style={{left:1218,top:376+i*54,width:620}}><div style={row}><Dot c={C.red}/>{n}</div></FU>))}
    <FU t={t} s={27.4} d={0.4} style={{left:1218,top:626,fontSize:22,letterSpacing:4,fontWeight:700,color:C.mute}}>ALTERNATIVE PATHS</FU>
    <div style={{position:'absolute',left:1218,top:642}}>
      <Card t={t} s={29.2} sw={C.orange} t1="Route 1 · via N4" t2="1 intermediate node" badge/>
      <Card t={t} s={31.6} sw={C.blue} t1="Route 2 · via N6" t2="1 intermediate node"/>
      <Card t={t} s={34.0} sw={C.pale} t1="Route 3 · via N6, N9, N8" t2="3 intermediate nodes"/>
    </div>
    <FU t={t} s={37.6} d={0.6} style={{left:700,top:940,width:480,height:84,borderRadius:24,background:'rgba(255,122,0,.14)',border:`2px solid ${C.orange}`,display:'flex',alignItems:'center',gap:20,padding:'0 24px',fontSize:34,fontWeight:700}}>
      <svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="#FF7A00"/><path d="M14 27 L23 36 L39 17" stroke="#06013A" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Alternative path ready
    </FU>
    <div style={{position:'absolute',left:cur.x,top:cur.y,opacity:cur.o,transform:`scale(${cur.s})`}}>
      <svg width="44" height="44" viewBox="0 0 24 24"><path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.2 L18 13 Z" fill="#fff" stroke="#06013A" strokeWidth="1.4" strokeLinejoin="round"/></svg>
    </div>
  </>);
};

// Narration (ElevenLabs, voice "Marty - Warm, Confident Narrator", model eleven_v4).
// Clips are pre-trimmed and tempo-matched in remotion/public/narration/. `at` = start time in seconds.
const VO: {at:number; file:string}[] = [
  {at: 0.50, file:'vo1_hook.mp3'},      // A fibre cut. A single point of failure. So... where is the next path?
  {at: 6.30, file:'vo2_oldway.mp3'},    // Today, there's no reroute function. ...
  {at:16.60, file:'vo3_logo.mp3'},      // This is NextPath. Cut point in. Next path out.
  {at:21.70, file:'vo4_click.mp3'},     // Click a cable on the map to mark the cut point.
  {at:24.80, file:'vo5_affected.mp3'},  // NextPath instantly flags every affected system ...
  {at:32.50, file:'vo6_routes.mp3'},    // Then it finds the alternative paths, and ranks the best route first.
  {at:37.60, file:'vo7_ready.mp3'},     // Alternative path, ready. In seconds.
  {at:41.60, file:'vo8_why.mp3'},       // Thirty to sixty minutes, down to seconds. ...
  {at:49.15, file:'vo9_next.mp3'},      // Next: live data from NEPS and FLASH. NextPath. Cut point in, next path out.
];

const WIN = (f:number,a:number,b:number,fade=0.4)=> Math.min(ramp(f,a,a+fade), 1-ramp(f,b-fade,b));

export const Promo: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t = frame/fps;
  const s1 = Math.min(1,1-ramp(t,5.6,6.0));
  const s4 = WIN(t,21,41);
  return (
    <AbsoluteFill style={{fontFamily:"'Roboto'",color:C.ink,background:C.bg}}>
      <style>{fontCss}</style>
      <Bg/>
      {VO.map(v=>(<Sequence key={v.file} from={Math.round(v.at*fps)}><Audio src={staticFile(`narration/${v.file}`)}/></Sequence>))}
      {/* 2D scenes rendered by HyperFrames */}
      <Sequence from={6*fps} durationInFrames={15*fps}><OffthreadVideo src={staticFile('hf_2d.mp4')} startFrom={6*fps} muted/></Sequence>
      <Sequence from={41*fps} durationInFrames={15*fps}><OffthreadVideo src={staticFile('hf_2d.mp4')} startFrom={41*fps} muted/></Sequence>
      {/* 3D scenes (Three.js) */}
      {t<6 && <><Net3D t={t} mode="hook" fade={s1}/><div style={{opacity:s1}}><Hook t={t}/></div></>}
      {t>=21 && t<41 && <><Net3D t={t} mode="demo" fade={s4}/><div style={{opacity:s4}}><Demo t={t}/></div></>}
    </AbsoluteFill>
  );
};
