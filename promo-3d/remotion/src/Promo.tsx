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
const VO: {at:number; file:string; dur:number}[] = [
  {at: 0.50, file:'vo1_hook.mp3', dur:5.59},      // A fibre cut. A single point of failure. So... where is the next path?
  {at: 6.30, file:'vo2_oldway.mp3', dur:9.91},    // Today, there's no reroute function. ...
  {at:16.60, file:'vo3_logo.mp3', dur:3.89},      // This is NextPath. Cut point in. Next path out.
  {at:21.70, file:'vo4_click.mp3', dur:2.47},     // Click a cable on the map to mark the cut point.
  {at:24.80, file:'vo5_affected.mp3', dur:7.51},  // NextPath instantly flags every affected system ...
  {at:32.50, file:'vo6_routes.mp3', dur:3.96},    // Then it finds the alternative paths, and ranks the best route first.
  {at:37.60, file:'vo7_ready.mp3', dur:2.95},     // Alternative path, ready. In seconds.
  {at:41.15, file:'vo8_why.mp3', dur:8.28},       // Why it matters. Thirty to sixty minutes, down to seconds. ...
  {at:49.50, file:'vo9_next.mp3', dur:6.43},      // Next: live data from NEPS and FLASH. NextPath. Cut point in, next path out.
];

// Background music (ElevenLabs Music v2.5, take bgm_1). The track's big lift sits at 17.45s in the file;
// trimming 0.87s puts it on the logo reveal (16.58s). It is ducked under the narration.
const MUSIC_TRIM = 0.87;
const musicVolume = (t:number) => {
  const base = 0.7 + (0.26-0.7)*ramp(t,16.45,16.6);           // quiet intro is lifted, loud body sits low
  const talk = Math.max(0,...VO.map(v=>Math.min(ramp(t,v.at-0.25,v.at), 1-ramp(t,v.at+v.dur,v.at+v.dur+0.35))));
  return base * (1-0.4*talk) * ramp(t,0,0.3);
};

// Sound effects (ElevenLabs Sound Effects v3). `at` = when the hit should land; `pk` = hit offset inside the file.
const SFX_FILES: Record<string,{pk:number; vol:number}> = {
  cut:{pk:0.09,vol:0.7}, whoosh:{pk:0.29,vol:0.35}, tick:{pk:0,vol:0.3}, logo:{pk:0.39,vol:0.55},
  pop:{pk:0.07,vol:0.25}, click:{pk:0.10,vol:0.5}, scan:{pk:0.21,vol:0.3}, success:{pk:0.09,vol:0.45},
};
const SFX: {at:number; s:string; vol?:number; len?:number}[] = [
  {at: 2.40, s:'cut'},                                                   // fibre cut (hook)
  {at: 5.90, s:'whoosh'},                                                // -> old way
  {at: 7.20, s:'tick', len:8.6},                                         // clock hand spins 7.2-15.8
  ...[0,1,2,3,4].map(i=>({at:7.0+i*1.2, s:'pop'})),                      // 5 manual steps
  {at:15.90, s:'whoosh'},                                                // -> logo
  {at:16.58, s:'logo'},                                                  // logo reveal
  {at:20.90, s:'whoosh'},                                                // -> demo
  {at:24.40, s:'click'},                                                 // cursor click
  {at:24.50, s:'cut', vol:0.4},                                          // cable cut on the map
  {at:25.10, s:'scan'},                                                  // impact scan
  ...[0,1,2,3].map(i=>({at:25.9+i*0.3, s:'pop', vol:0.2})),              // affected systems
  ...[29.2,31.6,34.0].map(at=>({at, s:'pop'})),                          // route cards
  {at:35.20, s:'pop', vol:0.35},                                         // BEST badge
  {at:37.60, s:'success'},                                               // alternative path ready
  {at:40.90, s:'whoosh'},                                                // -> why it matters
  ...[42.3,43.8,45.3].map(at=>({at, s:'pop'})),                          // impact cards
  {at:48.90, s:'whoosh'},                                                // -> roadmap
  {at:50.40, s:'pop'}, {at:52.00, s:'pop'},                              // today / next cards
  {at:53.60, s:'logo', vol:0.4},                                         // closing wordmark
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
      <Audio src={staticFile('music/bgm.mp3')} trimBefore={Math.round(MUSIC_TRIM*fps)} volume={f=>musicVolume(f/fps)}/>
      {SFX.map((x,i)=>{ const d=SFX_FILES[x.s]; const from=Math.max(0,Math.round((x.at-d.pk)*fps));
        return (<Sequence key={'sfx'+i} from={from} durationInFrames={x.len?Math.round(x.len*fps):undefined}>
          <Audio src={staticFile(`sfx/${x.s}.mp3`)} volume={f=>(x.vol??d.vol)*(x.len?1-ramp(f/fps,x.len-0.4,x.len):1)}/></Sequence>); })}
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
