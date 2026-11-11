'use strict';
(()=>{
 const bench=document.getElementById('workbench'),focus=document.getElementById('focus');
 let behavior='spin';
 const descriptions={spin:['01 / PRESS AND RELEASE','Release the trigger.<br>The tool slows down.','Motor response and braking determine how rotation changes over time. The scene follows that simulated response.'],load:['02 / APPLY RESISTANCE','The motor turns.<br>The bit can stop.','With the clutch enabled, sufficient resistance can interrupt bit rotation while the motor continues. Reduce the load and compare.'],reverse:['03 / CHANGE DIRECTION','One tool.<br>Two directions.','Switching direction changes the drive command. The simulator determines the transition from forward to reverse rotation.']};
 document.querySelectorAll('[data-behavior]').forEach(button=>button.addEventListener('click',()=>{
  behavior=button.dataset.behavior;
  document.querySelectorAll('[data-behavior]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
  const info=descriptions[behavior];document.getElementById('behavior-kicker').textContent=info[0];document.getElementById('behavior-title').innerHTML=info[1];document.getElementById('behavior-copy').textContent=info[2];
 }));
 document.getElementById('behavior-launch').addEventListener('click',()=>{bench.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector(`[data-preset="${behavior}"]`).click();});
 function collapse(){bench.removeAttribute('role');bench.removeAttribute('aria-modal');bench.removeAttribute('aria-label');bench.classList.remove('immersive');document.body.classList.remove('immersive-open');focus.setAttribute('aria-pressed','false');focus.textContent='⛶ EXPAND';window.dispatchEvent(new Event('resize'));}
 focus.addEventListener('click',()=>{if(bench.classList.contains('immersive')){collapse();return;}bench.classList.add('immersive');bench.setAttribute('role','dialog');bench.setAttribute('aria-modal','true');bench.setAttribute('aria-label','Expanded tool workbench');document.body.classList.add('immersive-open');focus.setAttribute('aria-pressed','true');focus.textContent='✕ CLOSE';window.dispatchEvent(new Event('resize'));});
 document.addEventListener('keydown',e=>{if(!bench.classList.contains('immersive'))return;if(e.key==='Escape'){collapse();focus.focus();}if(e.key==='Tab'){const nodes=[...bench.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),summary')].filter(n=>n.offsetParent!==null),first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 window.addEventListener('mechanica:frame',e=>{const r=e.detail,motor=Math.abs(r.spindle_rpm)>1,bit=Math.abs(r.bit_rpm)>1,load=r.controls.load>0;
  document.getElementById('signal-drive').textContent=motor?'● MOTOR TURNING':'○ MOTOR IDLE';document.getElementById('signal-bit').textContent=bit?'● BIT TURNING':'○ BIT STOPPED';document.getElementById('signal-load').textContent=load?'● RESISTANCE APPLIED':'○ NO RESISTANCE';
  bench.dataset.motion=bit?'turning':motor?'disengaged':'rest';
  document.getElementById('signal-drive').classList.toggle('active',motor);document.getElementById('signal-bit').classList.toggle('active',bit);document.getElementById('signal-load').classList.toggle('active',load);
 });
 let scheduled=false;function progress(){const d=document.documentElement,total=d.scrollHeight-innerHeight;document.getElementById('page-progress').style.transform=`scaleX(${total>0?Math.min(1,scrollY/total):0})`;scheduled=false;}
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress);}},{passive:true});progress();
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(items=>items.forEach(i=>{if(i.isIntersecting){i.target.classList.add('in-view');observer.unobserve(i.target);}}),{threshold:.08});document.querySelectorAll('.architecture,.tasks,.probes').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
})();
