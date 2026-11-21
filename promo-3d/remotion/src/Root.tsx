import {Composition} from 'remotion';
import {Promo} from './Promo';
export const FPS = 30;
export const Root = () => (
  <Composition id="NextPathPromo" component={Promo} durationInFrames={56 * FPS} fps={FPS} width={1920} height={1080} />
);
