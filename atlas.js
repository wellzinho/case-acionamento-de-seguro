(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const make=(tag,cls)=>Object.assign(document.createElement(tag),{className:cls});
 // Keep the published number in the accessibility tree and animate only a decorative overlay.
 const values=document.querySelectorAll('.metrics strong');
 function roll(target){
  if(reduced.matches)return;
  const value=target.textContent,overlay=make('span','reel-overlay');overlay.setAttribute('aria-hidden','true');
  for(const char of value){
   const cell=make('i','reel-cell');
   if(/\d/.test(char)){const tape=make('i','reel-tape');const end=10+Number(char);for(let j=0;j<=end;j++){const d=make('i','reel-digit');d.dataset.glyph=j%10;tape.append(d)}cell.append(tape);tape.style.setProperty('--steps',end);tape.style.animationDelay=(overlay.childElementCount*65)+'ms'}else{cell.classList.add('reel-symbol');cell.dataset.glyph=char}
   overlay.append(cell)
  }
  target.append(overlay);target.classList.add('rolling');setTimeout(()=>{target.classList.remove('rolling');overlay.remove()},1750)
 }
 const watcher=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){watcher.unobserve(e.target);roll(e.target)}}),{threshold:.55});values.forEach(v=>watcher.observe(v));
})();
(() => {
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('assembled');observer.unobserve(e.target)}}),{threshold:.24});
 document.querySelectorAll('.atlas').forEach(board=>observer.observe(board));
})();
