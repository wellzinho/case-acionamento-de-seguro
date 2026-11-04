(() => {
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e};
 const sec=n=>document.querySelector('#s'+n);
 const bp=sec(7),inner=bp.querySelector('.inner'),figure=bp.querySelector('figure'),notes=bp.querySelector('details.notes');
 const eyebrow=bp.querySelector('.eyebrow');eyebrow.querySelector('span').textContent='Discovery · Service Blueprint';
 const title=el('h2');title.append('Como manter o acionamento no app ',el('em','','com duas seguradoras?'));
 const intro=el('p','lead','Usei a matriz CSD e o Gemini para preparar as perguntas. Na dinâmica, facilitei a leitura do Blueprint com o time: para cada ação do cliente, ligamos a tela ao sistema, à pessoa responsável e ao retorno esperado.');
 const points=[
 ['Continuidade','O cliente conseguiria abrir um único pedido no app?','Defendi que a abertura e o envio dos documentos acontecessem onde o seguro foi contratado. O desenho passou a contemplar clientes com apólices das duas seguradoras.',13],
 ['Integração','Como os documentos chegariam à Icatu?','Exploramos uma API direta. Como a Icatu não dispunha dessa integração, combinamos o recebimento pelo ERP e o encaminhamento pelo analista.',69],
 ['Documentos','Poderíamos reutilizar a identificação da abertura da conta?','O reaproveitamento atendia à meutudo. A Icatu exigia o envio dos documentos, então incluí essa etapa na jornada. A validação automática com OCR ficou para evolução por restrição técnica.',66],
 ['Responsabilidades','Quem analisa, comunica e paga? Qual prazo mostrar?','Cada seguradora responde pela sua análise, comunicação e pagamento. O app precisava explicar o prazo de retorno e orientar o cliente mesmo quando as decisões fossem diferentes.',57]
 ];
 const panel=el('div','bp-focus'),menu=el('div','guided-tabs'),content=el('div','bp-detail');panel.append(menu,content);
 function select(i){const [tag,q,answer,card]=points[i],c=boardCards.blueprint[card],button=el('button','bp-crop'),image=el('img');image.src='imagens/cards/'+c.f;image.alt=c.t;button.setAttribute('aria-label','Ampliar detalhe do Blueprint: '+tag);button.append(image);button.onclick=()=>{const full=document.querySelector('#full');full.src=image.src;full.alt=image.alt;document.querySelector('#viewer').showModal()};const copy=el('div');copy.append(el('h3','',q),el('p','',answer));content.replaceChildren(copy,button);[...menu.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)))}
 points.forEach(([tag],i)=>{const b=el('button','',tag);b.onclick=()=>select(i);menu.append(b)});select(0);
 figure.classList.add('bp-original');figure.querySelector('img').src='imagens/blueprint-overview.webp';figure.querySelector('.zoom').dataset.src='imagens/blueprint-overview.webp';
 notes.querySelector('p').prepend('Usei o Gemini para organizar hipóteses antes da dinâmica. O time validou as restrições e tomou as decisões em conjunto. ');
 const orbit=inner.querySelector('.cine-orbit');
 inner.replaceChildren(eyebrow,title,intro,figure,panel,notes);
 if(orbit) bp.append(orbit);
 for(const n of [6,8]){const alias=el('span','legacy-anchor');alias.id='s'+n;sec(n).remove();bp.before(alias)}
 const flow=sec(12);flow.querySelector('.eyebrow span').textContent='User Flow · Validação técnica';flow.querySelector('h2').replaceChildren('Como o caminho muda ',el('em','','entre coberturas?'));flow.querySelector('.lead').textContent='Desenhei os caminhos do cliente e percorri cada ramificação com engenharia. Mudavam os documentos exigidos, quem podia abrir o pedido e o canal de acionamento.';
 flow.querySelector('.columns')?.remove();flow.querySelector('details.notes p').textContent='O User Flow permitiu validar com engenharia o caminho principal, as exceções e a complexidade da jornada externa. A escolha do seguro e o escopo da primeira entrega já haviam sido discutidos na definição do MVP.';
 sec(10).querySelector('.eyebrow span').textContent='MVP · Escopo e evolução';sync();
})();
