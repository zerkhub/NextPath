import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {C, clamp, ramp, eo, eio} from './theme';

const raw: Record<number,[number,number]> = {0:[500,70],1:[440,200],2:[600,260],3:[420,360],4:[640,420],5:[450,520],6:[290,470],7:[610,600],8:[480,700],9:[320,650],10:[520,840]};
const zJit = [0.0,0.5,-0.6,0.3,-0.4,0.6,-0.5,0.4,-0.3,0.5,0.0];
const P: THREE.Vector3[] = Object.keys(raw).map((k,i)=>{const [x,y]=raw[+k];return new THREE.Vector3(((500+(x-480)*1.35)-500)*0.0100,-(y-455)*0.0100,zJit[i]);});
const edges:[number,number][]=[[0,1],[1,3],[3,5],[5,8],[8,10],[0,2],[1,2],[2,4],[3,4],[4,5],[4,7],[7,8],[3,6],[6,9],[9,8],[6,5],[9,10],[7,10]];
const mainEdges:[number,number][]=[[0,1],[1,3],[3,5],[5,8],[8,10]];
const isMain=(a:number,b:number)=>mainEdges.some(e=>(e[0]==a&&e[1]==b)||(e[0]==b&&e[1]==a));
const routes=[{ids:[3,4,5],col:C.orange},{ids:[3,6,5],col:C.blue},{ids:[3,6,9,8],col:C.pale}];
const UP = new THREE.Vector3(0,1,0);

const Seg: React.FC<{a:THREE.Vector3;b:THREE.Vector3;r:number;color:string;p?:number;opacity?:number}> = ({a,b,r,color,p=1,opacity=1}) => {
  if (p<=0.001) return null;
  const dir = new THREE.Vector3().subVectors(b,a); const len = dir.length(); dir.normalize();
  const mid = new THREE.Vector3().copy(a).addScaledVector(dir,len*p/2);
  const q = new THREE.Quaternion().setFromUnitVectors(UP,dir);
  return <mesh position={mid} quaternion={q} scale={[1,len*p,1]}>
    <cylinderGeometry args={[r,r,1,12]}/><meshBasicMaterial color={color} transparent opacity={opacity}/>
  </mesh>;
};
const Poly: React.FC<{ids:number[];r:number;color:string;p:number;opacity?:number}> = ({ids,r,color,p,opacity=1}) => {
  const lens = ids.slice(1).map((id,i)=>P[ids[i]].distanceTo(P[id])); const tot = lens.reduce((a,b)=>a+b,0);
  let acc=0; return <>{ids.slice(1).map((id,i)=>{const s=acc/tot, e=(acc+lens[i])/tot; acc+=lens[i]; const lp=clamp((p-s)/(e-s)); return <Seg key={i} a={P[ids[i]]} b={P[id]} r={r} color={color} p={lp} opacity={opacity}/>;})}</>;
};
const along=(ids:number[],u:number)=>{const lens=ids.slice(1).map((id,i)=>P[ids[i]].distanceTo(P[id]));const tot=lens.reduce((a,b)=>a+b,0);let d=clamp(u)*tot;for(let i=0;i<lens.length;i++){if(d<=lens[i]||i==lens.length-1){return new THREE.Vector3().lerpVectors(P[ids[i]],P[ids[i+1]],clamp(d/lens[i]));}d-=lens[i];}return P[ids[0]].clone();};
const Glow: React.FC<{pos:THREE.Vector3;r:number;color:string;op:number}> = ({pos,r,color,op}) => op<=0.01?null:<mesh position={pos}><sphereGeometry args={[r,24,24]}/><meshBasicMaterial color={color} transparent opacity={op} depthWrite={false}/></mesh>;

// stars / dust
const dust = (()=>{const n=260;const a=new Float32Array(n*3);let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(let i=0;i<n;i++){a[i*3]=(rnd()-.5)*18;a[i*3+1]=(rnd()-.5)*10;a[i*3+2]=(rnd()-.5)*8-1;}return a;})();

export type Net3DProps = {t:number; mode:'hook'|'demo'; fade:number};
const Scene: React.FC<Net3DProps> = ({t,mode,fade}) => {
  const demo = mode==='demo';
  const t0 = demo?21.2:0.1;
  const cutT = demo?24.5:2.4;
  const cutP = ramp(t,cutT,cutT+0.25);
  const cutMid = new THREE.Vector3().lerpVectors(P[3],P[5],0.5);
  const lt = demo? t-21 : t;
  const rotY = Math.sin(lt*0.22)*0.28 + (demo?-0.15:0.2);
  const gx = demo ? -2.9 : 2.7;
  const flowPhase = (t*0.22)%1;
  const mainIds=[0,1,3,5,8,10];
  const fullIds=[0,1,3,4,5,8,10];
  const nodeOp = (i:number)=>eo(ramp(t,t0+0.2+i*0.05,t0+0.7+i*0.05));
  const routeP = demo ? [eio(ramp(t,28.0,29.2)), eio(ramp(t,30.4,31.6)), eio(ramp(t,32.8,34.0))] : [0,0,0];
  const bestOn = demo ? ramp(t,35.2,36.0) : 0;
  const scanP = demo ? ramp(t,25.0,27.0) : ramp(t,cutT,cutT+1.6);
  return <>
    <group position={[gx,0.05,0]} scale={0.8} rotation={[-0.32,rotY,0]}>
      {/* floor grid */}
      <gridHelper args={[16,32,'#2f2a96','#1d1580']} position={[0,-4.4,0]}/>
      {/* base edges */}
      {edges.map(([a,b],i)=>{
        const main=isMain(a,b); const isCut=(a==3&&b==5);
        const p=eio(ramp(t,t0+i*0.05,t0+i*0.05+0.9));
        if(isCut&&cutP>0){
          const gap=0.34; const dir=new THREE.Vector3().subVectors(P[5],P[3]).normalize();
          const m1=cutMid.clone().addScaledVector(dir,-gap), m2=cutMid.clone().addScaledVector(dir,gap);
          const flick = 0.55+0.45*Math.sin(t*30);
          return <React.Fragment key={i}><Seg a={P[3]} b={m1} r={0.06} color={C.red}/><Seg a={m2} b={P[5]} r={0.06} color={C.red}/><Glow pos={cutMid} r={0.28} color={C.red} op={0.35*flick}/></React.Fragment>;
        }
        let col = main? C.blue : '#3d34c4';
        const down=(a==5&&b==8)||(a==8&&b==10);
        if(main&&down&&cutP>0.5) col='#7a3a6a';
        return <Seg key={i} a={P[a]} b={P[b]} r={main?0.055:0.028} color={col} p={p}/>;
      })}
      {/* routes */}
      {demo && routes.map((r,i)=>(<React.Fragment key={i}>
        <Poly ids={r.ids} r={0.13} color={r.col} p={routeP[i]} opacity={0.3}/>
        <Poly ids={r.ids} r={0.075} color={r.col} p={routeP[i]}/>
      </React.Fragment>))}
      {/* nodes */}
      {P.map((p,i)=>{
        const op=nodeOp(i); if(op<=0.01) return null;
        const hot = cutP>0.1 && (i==3||i==5); const dim = cutP>0.5 && (i==8||i==10);
        const col = hot?'#FF8A70':dim?'#b86a9a':C.blue;
        return <group key={i} position={p} scale={op}>
          <mesh><sphereGeometry args={[0.15,24,24]}/><meshBasicMaterial color={C.bg}/></mesh>
          <mesh><torusGeometry args={[0.15,0.04,12,32]}/><meshBasicMaterial color={col}/></mesh>
          <mesh><sphereGeometry args={[0.34,24,24]}/><meshBasicMaterial color={hot?C.red:col} transparent opacity={hot?0.22:0.14} depthWrite={false}/></mesh>
        </group>;
      })}
      {/* flowing pulses on main path (stop at cut) */}
      {[0,1,2,3,4,5].map(i=>{
        const u=(flowPhase+i/6)%1; const pos=along(mainIds,u);
        const cutU = (()=>{const lens=mainIds.slice(1).map((id,k)=>P[mainIds[k]].distanceTo(P[id]));const tot=lens.reduce((a,b)=>a+b,0);return (lens[0]+lens[1]*0.5+0)/tot;})();
        let vis=ramp(t,t0+1.0,t0+1.6);
        if(cutP>0 && !(demo&&bestOn>0)){ vis = u<cutU ? vis : 0; }
        if(demo && bestOn>0){ const q=along(fullIds,(t*0.25+i/6)%1); return <Glow key={i} pos={q} r={0.12} color={'#FFD9B8'} op={bestOn*0.95}/>; }
        return <Glow key={i} pos={pos} r={0.1} color={'#FFFFFF'} op={vis*0.95}/>;
      })}
      {/* cut fx rings */}
      {[0,1].map(i=>{const p=ramp(t,cutT+i*0.35,cutT+1.3+i*0.35); if(t<cutT||p>=1) return null;
        return <mesh key={i} position={cutMid} rotation={[Math.PI/2+0.1,0,0]} scale={0.3+p*4.2}><torusGeometry args={[0.5,0.025,8,64]}/><meshBasicMaterial color={C.red} transparent opacity={1-p}/></mesh>;})}
      {/* scan sphere */}
      {scanP>0&&scanP<1&&<mesh position={cutMid} scale={0.5+scanP*5}><sphereGeometry args={[0.5,32,32]}/><meshBasicMaterial color={C.blue} transparent opacity={0.10*(1-scanP)} wireframe depthWrite={false}/></mesh>}
    </group>
    {/* dust */}
    <points rotation={[0,lt*0.02,0]}><bufferGeometry><bufferAttribute attach="attributes-position" args={[dust,3]}/></bufferGeometry><pointsMaterial color={'#99B6FF'} size={0.035} transparent opacity={0.5*fade}/></points>
  </>;
};
export const Net3D: React.FC<Net3DProps> = (props) => (
  <ThreeCanvas width={1920} height={1080} camera={{position:[0,0,12.5],fov:35}} style={{opacity:props.fade}} gl={{alpha:true,antialias:true}}>
    <Scene {...props}/>
  </ThreeCanvas>
);
