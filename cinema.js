(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const scenes=[];
  const node=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls||'';if(text)e.textContent=text;return e};
  function scene(n,type,label,lines,visual){
    const host=document.querySelector('#s'+n+' .inner'),run=node('div','cine-run '+type),stick=node('div','cine-stick'),copy=node('div','cine-copy'),ey=node('div','cine-kicker',label),phrase=node('p','cine-phrase'),fragments=[];
    lines.forEach(line=>{const span=node('span','cine-line',line+' ');phrase.append(span);fragments.push(span)});
    const meter=node('div','cine-meter');meter.setAttribute('aria-hidden','true');lines.forEach(()=>meter.append(node('i')));
    copy.append(ey,phrase,meter);stick.append(copy);if(visual)stick.append(visual);run.append(stick);host.querySelector('.eyebrow').before(run);
    const state={run,stick,fragments,meter,index:-1,onFrame:null};scenes.push(state);return state;
  }
  const context=scene(3,'cine-editorial','01   /   O PONTO DE PARTIDA',[
    'O cliente contratava o seguro na meutudo.','Quando precisava acioná-lo, saía do app.','Como reunir duas seguradoras em um único pedido?'
  ]);
  const svgNS='http://www.w3.org/2000/svg';
  function svgEl(tag,attrs){const e=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e}
  const space=node('div','orbit-space'),svg=svgEl('svg',{viewBox:'0 0 520 440',role:'img','aria-label':'Ecossistema do acionamento: cliente no app, ERP, analista e Icatu'});
  space.append(svg);const center=[260,220];
  [85,143,195].forEach((r,i)=>{svg.append(svgEl('circle',{cx:260,cy:220,r,fill:'none',stroke:['#a86487','#77506d','#584554'][i],'stroke-width':1,'stroke-dasharray':i===2?'2 7':'none'}));const g=svgEl('g',{class:'orbit-trail trail-'+i});g.append(svgEl('circle',{cx:260+r,cy:220,r:i===1?4:3,fill:'#ffb0d7'}));svg.append(g)});
  const satellites=[['App',260,135],['ERP',394,174],['Analista',324,348],['Icatu',107,280]];
  satellites.forEach(([t,x,y],i)=>{const g=svgEl('g',{class:'satellite'});g.append(svgEl('line',{x1:260,y1:220,x2:x,y2:y,stroke:'#8d657e','stroke-dasharray':'3 6'}),svgEl('rect',{x:x-45,y:y-18,width:90,height:36,rx:18,fill:'#342b38',stroke:'#926d84'}));let label=svgEl('text',{x,y:y+5,'text-anchor':'middle',fill:'#fff','font-size':15});label.textContent=t;g.append(label);svg.append(g)});
  svg.append(svgEl('circle',{cx:260,cy:220,r:43,fill:'#eed3df'}));let middle=svgEl('text',{x:260,y:225,'text-anchor':'middle',fill:'#332232','font-size':14,'font-weight':700});middle.textContent='Pedido';svg.append(middle);
  const orbit=scene(7,'cine-orbit','02   /   POR TRÁS DO APP',['O cliente enviava os documentos pelo app.','O ERP recebia o pedido.','O analista conferia e encaminhava.','A Icatu analisava suas apólices.'],space);
  orbit.onFrame=(p,i)=>space.querySelectorAll('.satellite').forEach((s,j)=>s.classList.toggle('lit',i===j));
  const device=node('div','device-stage'),phone=node('div','cine-device'),glass=node('div','device-glass'),stepLabel=node('div','device-index');
  const names=['Cobertura','Exclusões','Documentos','Próximos passos'];
  const track=node('div','edu-track');
  [['imagens/edu-slide-0.png','O que o seguro cobre'],['imagens/edu-slide-1.png','Quando não há cobertura'],['imagens/edu-slide-2.png','Documentos necessários'],['imagens/edu-slide-3.png','Como funciona']].forEach(([src,alt])=>{const im=node('img','device-screen');im.src=src;im.alt=alt;track.append(im)});
  glass.append(track);
  phone.append(glass);device.append(phone,stepLabel);
  const demo=scene(15,'cine-phone','03   /   DENTRO DO PRODUTO',['O que meu seguro cobre?','Em que situações ele não se aplica?','Quais documentos preciso preparar?','O que acontece depois do envio?'],device);
  const carousel=document.querySelector('#s15 .exhibit');
  if(carousel){
    const run=demo.run,runNext=run.nextSibling,carouselNext=carousel.nextSibling,parent=run.parentNode;
    parent.insertBefore(carousel,runNext);
    parent.insertBefore(run,carouselNext);
  }
  demo.onFrame=(p,i)=>{
    track.style.setProperty('--slide',String(i));
    stepLabel.textContent='0'+(i+1)+' / 04    ·    '+names[i];
    phone.style.setProperty('--tilt','0deg');
    phone.style.setProperty('--float','0px');
  };
  const proto=node('div','device-stage'),protoPhone=node('div','cine-device'),protoGlass=node('div','device-glass'),protoIndex=node('div','device-index');
  const protoNames=['TRCT','Rescisão','Documento pendente','Em análise'];
  [['imagens/trct-antes.png','Antes: o documento aparecia como TRCT'],['imagens/trct-depois.png','Depois: Rescisão, com a explicação do documento'],['imagens/pending.png','Documentos faltantes: possibilidade de retomar o envio'],['imagens/analysis.png','Análise em andamento: prazo de até 30 dias visível']].forEach(([src,alt])=>{const im=node('img','device-screen');im.src=src;im.alt=alt;protoGlass.append(im)});
  protoPhone.append(protoGlass);proto.append(protoPhone,protoIndex);
  const change=scene(21,'cine-phone','O QUE MUDOU',['Antes, o documento aparecia só como TRCT.','Depois, Rescisão explica o que enviar.','Se falta documento, a pessoa retoma o envio.','Em análise, o prazo de até 30 dias fica visível.'],proto);
  document.querySelector('#s21 .lead')?.after(change.run);
  document.querySelector('#s21 .exhibit')?.remove();
  change.onFrame=(p,i)=>{protoGlass.querySelectorAll('.device-screen').forEach((im,j)=>im.classList.toggle('shown',i===j));protoIndex.textContent='0'+(i+1)+' / 04    ·    '+protoNames[i];protoPhone.style.setProperty('--tilt','0deg');protoPhone.style.setProperty('--float','0px')};
  const mazeBeats=[
    {kicker:'01  /  03    ·    Tarefa 1',line:'A maioria localizou a cobertura.',detail:'80% de sucesso, com 10 participantes. O caminho mostra onde a navegação se repetiu.',src:'imagens/maze-tarefa1.jpg',alt:'Relatório do Maze, tarefa 1: 80% de sucesso ao localizar a cobertura de perda de renda'},
    {kicker:'02  /  03    ·    Tarefa 2',line:'O envio dos documentos também foi concluído.',detail:'77,8% de sucesso, com 9 participantes. A tarefa era encontrar o aviso de sinistro, enviar e seguir para a análise.',src:'imagens/maze-tarefa2.jpg',alt:'Relatório do Maze, tarefa 2: 77,8% de sucesso no envio do aviso de sinistro'},
    {kicker:'03  /  03    ·    Facilidade',line:'A facilidade média ficou em 3,9.',detail:'Nove respostas, de 1 a 5. 56% marcaram muito fácil e 22% muito difícil. Ninguém ficou nas notas do meio.',src:'imagens/maze-facilidade.jpg',alt:'Relatório do Maze: facilidade média 3,9, com 56% em muito fácil e 22% em muito difícil'}
  ];
  const mazeStage=node('div','maze-stage'),mazeFrame=node('button','maze-frame'),mazeDetail=node('p','maze-detail',mazeBeats[0].detail);
  mazeFrame.type='button';mazeFrame.setAttribute('aria-label','Próximo trecho do relatório');
  mazeBeats.forEach((beat,i)=>{const im=node('img','maze-shot'+(i===0?' shown':''));im.src=beat.src;im.alt=beat.alt;mazeFrame.append(im)});
  const mazeEnlarge=node('button','maze-enlarge','↗ Ampliar');mazeEnlarge.type='button';
  mazeStage.append(mazeFrame,mazeEnlarge);
  const maze=scene(19,'cine-maze','01  /  03    ·    Tarefa 1',mazeBeats.map(b=>b.line),mazeStage);
  document.querySelector('#s19 .columns')?.after(maze.run);
  maze.run.querySelector('.cine-copy').insertBefore(mazeDetail,maze.run.querySelector('.cine-meter'));
  const mazeNav=node('div','maze-nav'),mazePrev=node('button','','←'),mazeNext=node('button','','→');
  mazePrev.type='button';mazeNext.type='button';mazePrev.setAttribute('aria-label','Trecho anterior');mazeNext.setAttribute('aria-label','Próximo trecho');
  mazeNav.append(mazePrev,mazeNext);maze.run.querySelector('.cine-copy').append(mazeNav);
  maze.onFrame=(p,i)=>{mazeFrame.querySelectorAll('.maze-shot').forEach((im,j)=>im.classList.toggle('shown',i===j));mazeDetail.textContent=mazeBeats[i].detail;maze.run.querySelector('.cine-kicker').textContent=mazeBeats[i].kicker};
  function mazeGo(direction){
    const steps=mazeBeats.length,r=maze.run.getBoundingClientRect(),top=parseFloat(getComputedStyle(maze.stick).top)||0;
    const travel=Math.max(1,r.height-maze.stick.offsetHeight),progress=Math.max(0,Math.min(1,(top-r.top)/travel));
    const beat=Math.min(steps-1,Math.floor(progress*steps+.015)),dest=beat+direction;
    if(dest<0)return;
    const behavior=reduced.matches?'instant':'smooth';
    if(dest>=steps){document.querySelector('#s20').scrollIntoView({behavior,block:'start'});return}
    scrollTo({top:scrollY+r.top-top+travel*((dest+.12)/steps),behavior});
  }
  mazeFrame.addEventListener('click',()=>mazeGo(1));
  mazePrev.addEventListener('click',()=>mazeGo(-1));
  mazeNext.addEventListener('click',()=>mazeGo(1));
  mazeEnlarge.addEventListener('click',()=>{const current=mazeFrame.querySelector('.maze-shot.shown')||mazeFrame.querySelector('.maze-shot');const full=document.querySelector('#full');full.src=current.src;full.alt=current.alt;document.querySelector('#viewer').showModal()});
  const aiArt=node('div','ai-stage');['Matriz CSD','Gemini','Hipóteses','Discussão no Blueprint'].forEach((t,i)=>{const item=node('div','ai-node');item.append(node('small','',String(i+1).padStart(2,'0')),node('b','',t));aiArt.append(item)});
  const ai=scene(6,'cine-ai','IA   /   DO INSUMO À DECISÃO',['Comecei pelas dúvidas da CSD.','Usei o Gemini para explorar possibilidades.','Selecionei as perguntas que precisávamos discutir.','Levei as hipóteses ao time.'],aiArt);
  ai.onFrame=(p,i)=>aiArt.querySelectorAll('.ai-node').forEach((e,j)=>{e.classList.toggle('lit',i===j);e.classList.toggle('past',j<i)});
  const end=scene(25,'cine-editorial cine-result','04   /   EM PRODUÇÃO',['De cada 100 pessoas que iniciaram a jornada,','85 chegaram à confirmação do envio dos documentos.']);
  const clamp=v=>Math.max(0,Math.min(1,v));let queued=false;
  function paint(){queued=false;const vh=innerHeight;
    scenes.forEach(s=>{const rect=s.run.getBoundingClientRect();if(rect.bottom<0||rect.top>vh)return;
      const stickyTop=parseFloat(getComputedStyle(s.stick).top)||0;
      const available=Math.max(1,rect.height-s.stick.offsetHeight);
      const p=clamp((stickyTop-rect.top)/available),count=s.fragments.length;
      const i=Math.min(count-1,Math.floor(p*count));
      s.fragments.forEach((f,j)=>{const brightness=clamp((p*count-j)*3+.25);f.style.setProperty('--ink',reduced.matches||j<=i-1||j===0?'1':String(.28+.72*brightness));f.classList.toggle('current',i===j)});
      [...s.meter.children].forEach((m,j)=>m.classList.toggle('done',j<=i));s.onFrame?.(p,i);s.index=i;
    });
    const dark=scenes.some(s=>{
      if(!s.run.matches('.cine-orbit,.cine-ai,.cine-result'))return false;
      const r=s.stick.getBoundingClientRect();
      return r.top<90&&r.bottom>vh*.4;
    });
    document.body.classList.toggle('cine-dark',dark);
  }
  function request(){if(!queued){queued=true;requestAnimationFrame(paint)}}
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduced.addEventListener('change',request);request();
  // Presentation keys advance a single narrative beat before leaving the chapter.
  function advanceBeat(direction){
    const active=scenes.find(s=>{const r=s.run.getBoundingClientRect();return r.top<=Math.max(200,innerHeight*.27)&&r.bottom>innerHeight*.6});
    if(!active)return false;
    const r=active.run.getBoundingClientRect(),top=parseFloat(getComputedStyle(active.stick).top)||0;
    const travel=Math.max(1,r.height-active.stick.offsetHeight),progress=clamp((top-r.top)/travel);
    const steps=active.fragments.length,beat=Math.min(steps-1,Math.floor(progress*steps+.015));
    const dest=beat+direction;
    if(dest<0)return false;
    const target=dest>=steps?scrollY+r.bottom-top:scrollY+r.top-top+travel*((dest+.12)/steps);
    scrollTo({top:target,behavior:reduced.matches?'instant':'smooth'});return true;
  }
  addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.closest('input,textarea,select'))return;const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d&&advanceBeat(d)){e.preventDefault();e.stopImmediatePropagation()}},true);
  for(const [id,d] of [['next',1],['prev',-1]])document.getElementById(id)?.addEventListener('click',e=>{if(advanceBeat(d)){e.stopImmediatePropagation();e.preventDefault()}},true);
  // Reveal individual blocks when they reach the reading area, including in long chapters.
  if('IntersectionObserver'in window&&!reduced.matches){const observer=new IntersectionObserver(items=>items.forEach(it=>{if(it.isIntersecting){it.target.classList.add('read-now');observer.unobserve(it.target)}}),{rootMargin:'0px 0px -5% 0px'});document.querySelectorAll('.chapter h2,.chapter .lead,.chapter .statement,.chapter .hypothesis,.chapter .metrics>div,.chapter .rows>div,.chapter figcaption').forEach(e=>{e.classList.add('read-block');observer.observe(e)})}
})();
