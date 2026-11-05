(() => {
  document.querySelectorAll('img').forEach(img=>{
    img.loading='eager';
    const src=img.getAttribute('src');
    if(!src || (img.complete && img.naturalWidth)) return;
    const revive=()=>{img.removeAttribute('src');img.src=src};
    if(img.complete) revive();
    else img.addEventListener('error', revive, {once:true});
  });
  const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt)n.textContent=txt;return n};
  const section=n=>document.querySelector('#s'+n);
  const inner=n=>section(n).querySelector('.inner');
  const media=(src,alt)=>{const i=el('img');i.src='imagens/'+src;i.alt=alt;return i};
  const notes=(n,node)=>section(n).querySelector('details').append(node);
  function exhibit(n,entries,first,kind,label){
    const wrap=el('div','exhibit '+kind), controls=el('div','selectors'),stage=el('div','stage');
    controls.setAttribute('role','group');controls.setAttribute('aria-label',label);
    const kicker=el('div','exhibit-label',label);
    first.before(wrap);wrap.append(kicker,controls,stage);
    const buttons=[],panels=[];
    function wake(root){
      root.querySelectorAll('img').forEach(img=>{
        img.loading='eager';
        if(img.complete && img.naturalWidth) return;
        const src=img.getAttribute('src');
        if(!src) return;
        img.removeAttribute('src');
        img.src=src;
      });
    }
    function select(index){
      buttons.forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===index));panels[j].hidden=j!==index;});
      if(panels[index]) wake(panels[index]);
    }
    entries.forEach(([name,node],j)=>{
      const b=el('button','exhibit-button',name);b.type='button';b.onclick=()=>select(j);
      const panel=el('div','exhibit-panel');panel.id='panel-'+n+'-'+j;b.setAttribute('aria-controls',panel.id);
      wake(node);panel.append(node);stage.append(panel);controls.append(b);buttons.push(b);panels.push(panel);
    });
    select(0);return wrap;
  }
  const hero=el('div','cover-art');hero.append(media('portfolio1.webp','Mockup original do acionamento de seguros no app meutudo'));
  inner(1).querySelector('.lead').after(hero);
  notes(1,inner(1).querySelector('.columns'));
  const heroTitle=el('span','cover-label','CASE DE PRODUCT DESIGN  /  SEGUROS');inner(1).querySelector('h2').before(heroTitle);
  const coverButton=el('a','cover-start','Explorar o case ↓');coverButton.href='#s2';inner(1).querySelector('details').before(coverButton);
  // The original evidence stays available inside each interactive exhibit.
  const rows=[...section(8).querySelectorAll('.alignment-row')];
  const table=section(8).querySelector('.alignment-table');
  const entries=rows.map(row=>{const cells=[...row.children];const name=cells[0].lastChild.textContent;const panel=el('div','decision-story');
    cells.slice(1).forEach((c,i)=>{const part=el('div','decision-step');part.append(el('small','', ['HIPÓTESE','DESCOBERTA','DECISÃO'][i]),el('p','',c.lastChild.textContent));panel.append(part)});return [name,panel]});
  exhibit(8,entries,table,'decisions','Explore as decisões do Blueprint');table.remove();
  const edu=section(15).querySelector('.education-grid');
  const eduNames=['Cobertura','Exclusões','Documentos','Próximos passos'];
  const eduEntries=eduNames.map((name,i)=>{const frame=el('div','education-demo visao-copy');const text=el('div','demo-copy');text.append(el('span','folio','0'+(i+1)+' / 04'),el('h3','',['O seguro atende ao meu caso?','Quais situações ficam de fora?','O que preciso preparar?','O que acontece após o envio?'][i]),el('p','',['A primeira tela apresenta os casos cobertos.','As exclusões aparecem antes de abrir o pedido.','A pessoa pode baixar o formulário antes de começar o envio.','O cliente vê as etapas da análise e como receberá o retorno.'][i]));frame.append(text);return [name,frame]});
  exhibit(15,eduEntries,edu,'carousel','Percorra o carrossel educativo');edu.remove();
  const visaoStage=section(15).querySelector('.exhibit.carousel .stage');
  const visaoExhibit=visaoStage.parentElement;
  const visaoWash=el('div','visao-wash'),visaoWashImg=el('img');
  visaoWash.setAttribute('aria-hidden','true');
  visaoWashImg.alt='';
  visaoWashImg.src='imagens/visao-geral.png';
  visaoWash.append(visaoWashImg);
  visaoExhibit.prepend(visaoWash);
  const visaoPhone=el('div','visao-phone'),visaoGlass=el('div','visao-glass'),visaoReel=el('img','visao-reel');
  visaoReel.src='imagens/visao-geral.png';visaoReel.alt='Jornada Acionar seguro, da cobertura ao que acontece depois do envio';
  visaoGlass.append(visaoReel);visaoPhone.append(visaoGlass);
  const visaoZoom=el('button','zoom visao-zoom','↗ Ampliar');visaoZoom.type='button';visaoZoom.dataset.src='imagens/visao-geral.png';visaoZoom.setAttribute('aria-label','Ampliar a jornada Acionar seguro');
  visaoZoom.onclick=()=>{const full=document.querySelector('#full');full.src=visaoZoom.dataset.src;full.alt=visaoZoom.getAttribute('aria-label');document.querySelector('#viewer').showModal()};
  const visaoWrap=el('div','visao-frame');visaoWrap.append(visaoPhone,visaoZoom);visaoStage.append(visaoWrap);
  const visaoStops=[0,0.34,0.47,0.62];
  const showVisao=i=>visaoExhibit.style.setProperty('--reel',(-visaoStops[i]*100)+'%');
  [...visaoStage.parentElement.querySelectorAll('.exhibit-button')].forEach((b,i)=>b.addEventListener('click',()=>showVisao(i)));
  showVisao(0);
  const compare=section(21).querySelector('figure'),pair=section(21).querySelector('.paired'), states=[...pair.querySelectorAll('figure')];
  exhibit(21,[['Antes e depois',compare],['Documento pendente',states[0]],['Em análise',states[1]]],compare,'research-demo','Veja o que mudou no protótipo');pair.remove();
  function hypothesis(n,label){const grid=section(n).querySelector('.hypothesis-grid'),cards=[...grid.children];const entries=cards.map(c=>[c.querySelector('span').textContent,c]);exhibit(n,entries,grid,'hypotheses',label);grid.remove()}
  hypothesis(6,'Perguntas levadas à dinâmica');hypothesis(18,'Hipóteses do teste no Maze');
  const qa=section(23).querySelector('.split'); const ref=qa.querySelector('figure');
  const qaEntries=[['Dados bancários','A implementação omitia os dados bancários na revisão.'],['Documentos','Em alguns cenários, a lista não exibia todos os documentos enviados.']].map(([t,d],i)=>{const scene=el('div','qa-scene');const crop=el('div','qa-crop crop-'+i);crop.append(media('review.png','Recorte da referência de revisão no Figma'));const copy=el('div','demo-copy');copy.append(el('small','', 'DESIGN REVIEW'),el('h3','',t),el('p','',d),el('p','', 'Registrei a divergência em card e indiquei a referência para engenharia.'));scene.append(crop,copy);return [t,scene]});
  exhibit(23,qaEntries,qa,'quality','Inspecione os pontos encontrados no QA');notes(23,qa);ref.querySelector('figcaption').firstChild.textContent='Referência completa no Figma ';
  [6,8,9,15,18,20].forEach(n=>{const c=section(n).querySelector('.callout');if(c)notes(n,c)});
  [10,16,17,18,25].forEach(n=>{const c=section(n).querySelector('.caption');if(c)notes(n,c)});
  webProposal();
  function webProposal(){
    const figs=[...section(13).querySelectorAll('figure')];
    if(figs.length<2) return;
    const spread=el('div','web-spread');
    const index=el('div','web-index');
    const folio=el('div','web-folio');
    const num=el('span','web-num','01');
    const kicker=el('p','web-kicker','Proposta web · V2');
    folio.append(num,kicker);
    const title=el('h3','web-title');
    title.append(document.createTextNode('Mobile e desktop,'));
    title.append(document.createElement('br'));
    const em=document.createElement('em');
    em.textContent='lado a lado.';
    title.append(em);
    const lede=el('p','web-lede','');
    const toc=el('div','web-toc');
    toc.setAttribute('role','tablist');
    toc.setAttribute('aria-label','Páginas da proposta web');
    const note=el('p','web-note');
    note.setAttribute('aria-live','polite');
    const original=el('button','web-original','Arte original ↗');
    original.type='button';
    const steps=el('div','web-steps');
    steps.setAttribute('role','tablist');
    steps.setAttribute('aria-label','Estados do formulário no mobile');
    index.append(folio,title,lede,toc,note,original);

    function shell(kind,label){
      const col=el('figure','web-col is-'+kind);
      const cap=el('figcaption');
      cap.textContent=label;
      const frame=el('div','web-shell');
      const chrome=el('div','web-chrome');
      chrome.append(el('span','web-dots'),el('span','web-domain','meutudo.com.br'));
      const view=el('div','web-view');
      view.tabIndex=0;
      frame.append(chrome,view);
      col.append(cap,frame);
      return {col,view};
    }
    const phone=shell('phone','Mobile');
    const desk=shell('desk','Desktop');
    const phoneWrap=el('div','web-phone-wrap');
    phoneWrap.append(phone.col);
    const pair=el('div','web-pair');
    pair.append(phoneWrap,desk.col);
    const scrub=el('label','web-scrub');
    const range=document.createElement('input');
    range.type='range';range.min='0';range.max='1000';range.value='0';
    range.setAttribute('aria-label','Percorrer a página inicial no mobile e no desktop');
    scrub.append(el('span','','Início'),range,el('span','','Rodapé'));
    const stage=el('div','web-stage');
    stage.append(pair,steps,scrub);
    spread.append(index,stage);
    figs[0].before(spread);
    figs.forEach(f=>f.remove());

    const img=(src,alt)=>{const i=el('img');i.src=src;i.alt=alt;i.draggable=false;return i};
    const homeMobile=img('imagens/web-spread/home-mobile.png?v=figma','Página inicial da proposta web de morte por acidente, no mobile.');
    const formSteps=[
      ['Em branco','Os campos ainda estão vazios e continuar permanece indisponível.','Formulário de identificação vazio, no mobile.'],
      ['CPF','O nome já foi informado. O CPF está em foco, com o teclado numérico.','CPF em foco no formulário mobile, com teclado numérico.'],
      ['Celular','O CPF está preenchido. O celular está em foco, com o teclado numérico.','Celular em foco no formulário mobile, com teclado numérico.'],
      ['E-mail','O celular está preenchido. O e-mail está em foco, com o teclado alfabético.','E-mail em foco no formulário mobile, com teclado alfabético.'],
      ['Continuar','Os dados estão completos e o botão continuar fica disponível.','Formulário mobile completo, com continuar disponível.']
    ];
    const stepImgs=formSteps.map(([, ,alt],i)=>img('imagens/web-spread/form-mobile-'+(i+1)+'.png',alt));
    const pages=[
      {id:'home',num:'01',name:'Página inicial',lede:'Antes de abrir o pedido, a página explica a cobertura, os documentos e o que acontece depois do envio.',note:'No desktop, a imagem da direita fica fixa. A rolagem mostra o restante da página, no mesmo ponto do mobile.',art:'imagens/web.png',artLabel:'Morte por acidente — proposta de jornada web para V2'},
      {id:'form',num:'02',name:'Identificação do solicitante',lede:'Quem aciona pelo titular informa nome, CPF, celular e e-mail. No mobile, o teclado entra na tela. No desktop, formulário e imagem dividem a mesma vista.',note:'',art:'imagens/webform.png',artLabel:'Identificação de quem aciona o seguro — variações mobile e desktop'}
    ];
    const pageBtns=pages.map((p,i)=>{
      const b=el('button','web-page');b.type='button';b.setAttribute('role','tab');
      b.append(el('b','',p.num),el('span','',p.name));
      b.onclick=()=>selectPage(i);toc.append(b);return b;
    });
    const stepBtns=formSteps.map(([name],i)=>{
      const b=el('button','web-step');b.type='button';b.setAttribute('role','tab');
      b.append(el('b','',String(i+1).padStart(2,'0')),el('span','',name));
      b.onclick=()=>selectStep(i);steps.append(b);return b;
    });
    let page=0,step=0,lock=0;
    const views=()=>[phone.view,desk.view];
    function setProgress(p,source){
      lock++;
      views().forEach(v=>{
        if(v===source) return;
        const max=v.scrollHeight-v.clientHeight;
        v.scrollTop=max*p;
      });
      range.value=String(Math.round(p*1000));
      requestAnimationFrame(()=>requestAnimationFrame(()=>{lock=Math.max(0,lock-1)}));
    }
    function onViewScroll(e){
      if(lock||spread.dataset.page!=='home') return;
      const v=e.currentTarget,max=v.scrollHeight-v.clientHeight;
      setProgress(max?v.scrollTop/max:0,v);
    }
    phone.view.addEventListener('scroll',onViewScroll,{passive:true});
    desk.view.addEventListener('scroll',onViewScroll,{passive:true});
    range.oninput=()=>{if(spread.dataset.page==='home') setProgress(range.value/1000,null)};
    function selectStep(i){
      step=i;
      stepBtns.forEach((b,j)=>b.setAttribute('aria-selected',String(j===i)));
      stepImgs.forEach((image,j)=>{image.hidden=j!==i});
      if(spread.dataset.page==='form') note.textContent=formSteps[i][1];
    }
    function mountDeskForm(){
      const bar=desk.col.querySelector('.desk-chrome');
      if(bar) bar.remove();
      const shot=img('imagens/web-spread/form-desktop.png?v=figma','Identificação de quem aciona o seguro, no desktop.');
      shot.className='desk-form';
      desk.view.replaceChildren(shot);
    }
    function mountDeskHome(){
      const shell=desk.col.querySelector('.web-shell');
      if(!shell.querySelector('.desk-chrome')){
        const bar=img('imagens/web-spread/home-desktop-chrome.png?v=scroll','');
        bar.className='desk-chrome';
        bar.alt='';
        bar.setAttribute('aria-hidden','true');
        shell.insertBefore(bar, desk.view);
      }
      const split=el('div','desk-split');
      const flow=el('div','desk-flow');
      flow.append(img('imagens/web-spread/home-desktop-flow.png?v=scroll','Página inicial da proposta web de morte por acidente, no desktop. O conteúdo rola ao lado da imagem.'));
      const rail=el('div','desk-rail');
      const photo=img('imagens/web-spread/home-desktop-photo.png?v=scroll','');
      photo.alt='';
      photo.setAttribute('aria-hidden','true');
      rail.append(photo);
      split.append(flow,rail);
      const foot=img('imagens/web-spread/home-desktop-footer.png?v=scroll','Rodapé da página meutudo na proposta desktop.');
      foot.className='desk-foot';
      desk.view.replaceChildren(split,foot);
    }
    function selectPage(i){
      page=i;
      const p=pages[i];
      spread.dataset.page=p.id;
      num.textContent=p.num;
      lede.textContent=p.lede;
      pageBtns.forEach((b,j)=>{b.setAttribute('aria-selected',String(j===i));b.tabIndex=j===i?0:-1});
      if(i===1){phone.view.replaceChildren(...stepImgs);selectStep(step);mountDeskForm()}
      else{phone.view.replaceChildren(homeMobile);note.textContent=p.note;mountDeskHome()}
      phone.view.scrollTop=0;desk.view.scrollTop=0;range.value='0';
      original.setAttribute('aria-label','Ampliar: '+p.artLabel);
      original.onclick=()=>{const full=document.querySelector('#full');full.src=p.art;full.alt=p.artLabel;document.querySelector('#viewer').showModal()};
    }
    function move(e,length,current,apply,buttons){
      if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(e.key)) return;
      e.preventDefault();
      const dir=(e.key==='ArrowDown'||e.key==='ArrowRight')?1:-1;
      apply((current+dir+length)%length);
      buttons[(dir===1?(current+1):(current-1+length))%length].focus();
    }
    toc.addEventListener('keydown',e=>move(e,pages.length,page,selectPage,pageBtns));
    steps.addEventListener('keydown',e=>move(e,formSteps.length,step,selectStep,stepBtns));
    selectStep(0);
    selectPage(0);
  }
  // A compact, animated service map illustrates the backstage handoff.
  const map=el('div','service-map');map.setAttribute('aria-label','Do app ao ERP, do analista à Icatu');
  [['01','App','Cliente envia'],['02','ERP','Operação recebe'],['03','Analista','Confere e encaminha'],['04','Icatu','Analisa suas apólices']].forEach(([i,t,d])=>{const v=el('div','station');v.append(el('small','',i),el('b','',t),el('span','',d));map.append(v)});
  section(7).querySelector('.columns').before(map);notes(7,section(7).querySelector('.columns'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Reveal the two original document labels at the same position.
  const comparison=section(21).querySelector('#panel-21-0 figure');
  const slider=el('div','comparison-slider');
  const before=el('div','compare-image before'), after=el('div','compare-image after');
  const line=el('i','comparison-line');slider.append(before,after,line);
  const range=el('input','compare-control');range.type='range';range.min='0';range.max='100';range.value='50';
  range.setAttribute('aria-label','Comparar o rótulo TRCT com o texto após o teste');
  function updateCompare(){slider.style.setProperty('--split',range.value+'%');}
  range.oninput=updateCompare;updateCompare();
  const legend=el('div','compare-legend');legend.append(el('b','','Antes · TRCT'),el('b','','Depois · Rescisão'));
  const instruction=el('label','compare-instruction','Arraste para comparar');instruction.append(range);
  comparison.before(legend,slider,instruction);notes(21,comparison);
  if(!reduced){
    let queued=false;
    const moveArt=()=>{queued=false;const y=Math.min(scrollY,innerHeight);hero.style.setProperty('--lift',(-y*.085)+'px');};
    addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(moveArt)}},{passive:true});
  }
  if(!reduced && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(records=>records.forEach(({isIntersecting,target})=>{if(isIntersecting){target.classList.add('arrived');observer.unobserve(target)}}),{threshold:0,rootMargin:'0px 0px -4% 0px'});
    document.querySelectorAll('.chapter .inner').forEach(x=>{x.classList.add('motion');observer.observe(x)});
  }
})();
