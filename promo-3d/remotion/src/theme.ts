export const C = {bg:'#06013A',bg2:'#180092',ink:'#FFFFFF',mute:'#B4C3F5',blue:'#99B6FF',orange:'#FF7A00',red:'#FF4A24',line:'#3d34c4',pale:'#D9E3FF'};
export const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const ramp=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
export const eo=(p:number)=>1-Math.pow(1-p,3);
export const eio=(p:number)=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
import {staticFile} from 'remotion';
export const fontCss = `
@font-face{font-family:'HK Grotesk Wide';font-weight:700;src:url('${staticFile("fonts/HKGroteskWide-Bold.otf")}')}
@font-face{font-family:'HK Grotesk Wide';font-weight:900;src:url('${staticFile("fonts/HKGroteskWide-Black.otf")}')}
@font-face{font-family:'Roboto';font-weight:400;src:url('${staticFile("fonts/Roboto-Regular.ttf")}')}
@font-face{font-family:'Roboto';font-weight:500;src:url('${staticFile("fonts/Roboto-Medium.ttf")}')}
@font-face{font-family:'Roboto';font-weight:700;src:url('${staticFile("fonts/Roboto-Bold.ttf")}')}
@font-face{font-family:'Roboto';font-weight:800;src:url('${staticFile("fonts/Roboto-Black.ttf")}')}`;
