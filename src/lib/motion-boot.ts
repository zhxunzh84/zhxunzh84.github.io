import { MOTION_KEY } from "./preference-keys";

/** Runs before React hydrates (inlined in <head>) to avoid a flash of motion. */
export const motionBootScript = `try{var m=localStorage.getItem('${MOTION_KEY}');if(m!=='on'&&m!=='off'){m=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'}document.documentElement.dataset.motion=m}catch(e){}`;
