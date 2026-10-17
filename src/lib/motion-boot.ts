import { MOTION_KEY } from "./preference-keys";

/**
 * Runs before React hydrates (inlined in <head>) to avoid a flash of motion.
 * The storage read has its own try/catch: if storage is blocked we still fall
 * back to the OS reduced-motion setting and always set data-motion.
 */
export const motionBootScript = `(function(){var m=null;try{m=localStorage.getItem('${MOTION_KEY}')}catch(e){}if(m!=='on'&&m!=='off'){var r=false;try{r=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}m=r?'off':'on'}document.documentElement.dataset.motion=m})();`;
