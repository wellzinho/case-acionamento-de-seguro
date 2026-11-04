(() => {
 const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n};
 const first=document.querySelector('#s1 .inner'),second=document.querySelector('#s2'),cover=el('div','spread'),foot=el('div','spread-foot');
 const title=second.querySelector('h2'),author=first.querySelector('h2'),photo=second.querySelector('figure'),cta=first.querySelector('.cover-start'),notes=first.querySelector('details');
 author.className='folio-author';author.querySelector('br').replaceWith(' ');cta.href='#s3';
 first.querySelector('.cover-art').remove();first.querySelector('.cover-label').remove();
 const identity=el('div','spread-identity');identity.append(author,first.querySelector('.lead'));
 const upper=el('div','spread-upper');upper.append(first.querySelector('.eyebrow'),second.querySelector('.lead'));
 cover.append(upper,title,photo);foot.append(identity,cta);notes.append(second.querySelector('details p'));first.replaceChildren(cover,foot,notes);second.replaceWith(Object.assign(el('span','legacy-anchor'),{id:'s2'}));
 sections.forEach((section,i)=>{const label=section.querySelector('.eyebrow');if(label)label.firstChild.textContent=String(i+1).padStart(2,'0')+' / '+sections.length+' '});sync();
 for(const [id,key] of [[5,'csd']]){
  const fig=document.querySelector('#s'+id+' figure'),original=fig.querySelector('.zoom'),source=original.querySelector('img'),cards=boardCards[key];
  const board=el('div','folio-board'),nav=el('div','folio-nav'),tabs=el('div','folio-tabs'),list=el('div','folio-list'),stage=el('div','folio-stage'),display=el('button','folio-focus'),img=el('img',''),actions=el('div','folio-actions'),prev=el('button','','←'),next=el('button','','→'),count=el('span','');
  display.append(img);display.setAttribute('aria-label','Ampliar card selecionado');prev.setAttribute('aria-label','Card anterior');next.setAttribute('aria-label','Próximo card');actions.append(prev,count,next);stage.append(display,actions);nav.append(tabs,list);board.append(nav,stage);original.before(board);original.classList.add('folio-map');original.setAttribute('title','Abrir mapa completo');
  let index=0,group='',active;const groups=[...new Set(cards.map(c=>c.g))],buttons=new Map();
  function choose(i){index=i;const c=cards[i];if(group!==c.g){group=c.g;list.replaceChildren();buttons.clear();for(const [j,item] of cards.entries()){if(item.g!==group)continue;const b=el('button','folio-card',item.t);b.onclick=()=>choose(j);buttons.set(j,b);list.append(b)}}
   for(const [j,b] of buttons)b.setAttribute('aria-pressed',String(i===j));[...tabs.children].forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===group)));img.src='imagens/cards/'+c.f;img.alt=c.t;count.textContent=(i+1)+' / '+cards.length;prev.disabled=i===0;next.disabled=i===cards.length-1;active=buttons.get(i);list.scrollTop=Math.max(0,active.offsetTop-list.offsetTop-list.clientHeight/2);img.animate([{opacity:.2,transform:'scale(.97)'},{opacity:1,transform:'none'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:250})}
  groups.forEach(g=>{const b=el('button','',g);b.onclick=()=>choose(cards.findIndex(c=>c.g===g&&(g!=='Suposições'||c.t.toLowerCase().includes('confiança')))||0);tabs.append(b)});
  prev.onclick=()=>choose(index-1);next.onclick=()=>choose(index+1);display.onclick=()=>{const full=document.querySelector('#full');full.src=img.src;full.alt=img.alt;document.querySelector('#viewer').showModal()};
  original.onclick=()=>{
   const modal=el('dialog','folio-map-dialog'),close=el('button','folio-close','Fechar ×'),canvas=el('div','folio-canvas'),map=source.cloneNode();
   map.removeAttribute('width');map.removeAttribute('height');canvas.append(map);
   cards.forEach((card,j)=>{const point=el('button','map-point');point.title=card.t;point.setAttribute('aria-label',card.t);
    const [x,y,w,h]=card.b;Object.assign(point.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'});
    point.onclick=()=>{choose(j);modal.close();display.focus()};canvas.append(point)});
   close.onclick=()=>modal.close();modal.onclose=()=>modal.remove();modal.append(close,canvas);document.body.append(modal);modal.showModal();
  };
  choose(0);
 }
})();
