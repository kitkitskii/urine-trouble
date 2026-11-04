(function(root){
 'use strict';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pairs=round=>Array.isArray(round?.pairs)?round.pairs:[];
 function fresh(round,rng){
  const cards=pairs(round).flatMap((_,pairIndex)=>[{pairIndex,side:'term'},{pairIndex,side:'definition'}]);
  const random=typeof rng==='function'?rng:Math.random;
  for(let i=cards.length-1;i>0;i--){const raw=Number(random()),unit=Number.isFinite(raw)?Math.max(0,Math.min(.9999999999999999,raw)):.5,j=Math.floor(unit*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
  return {cards,flipped:[],matched:[],attempts:0,feedback:null};
 }
 function relationship(pair){
  if(!pair)return '';
  const line=String(pair.term??'')+' — '+String(pair.definition??'');
  return line+(pair.explanation?' '+String(pair.explanation):'');
 }
 function flip(round,state,cardIndex){
  if(!state||!Array.isArray(state.cards)||!Array.isArray(state.flipped)||!Array.isArray(state.matched)||!Number.isInteger(cardIndex)||cardIndex<0||cardIndex>=state.cards.length||state.feedback||state.flipped.length>=2||state.flipped.includes(cardIndex))return state;
  const card=state.cards[cardIndex],list=pairs(round);
  if(!card||!Number.isInteger(card.pairIndex)||!list[card.pairIndex]||!['term','definition'].includes(card.side)||state.matched.includes(card.pairIndex))return state;
  const flipped=[...state.flipped,cardIndex];
  if(flipped.length===1)return {...state,flipped,matched:[...state.matched],feedback:null};
  const first=state.cards[flipped[0]],correct=first.pairIndex===card.pairIndex&&first.side!==card.side;
  const matched=correct?[...state.matched,card.pairIndex]:[...state.matched];
  const explanation=correct?relationship(list[card.pairIndex]):'These cards belong to different pairs. '+relationship(list[first.pairIndex])+' '+relationship(list[card.pairIndex]);
  return {...state,flipped,matched,attempts:state.attempts+1,feedback:{correct,explanation,pairIndex:correct?card.pairIndex:null}};
 }
 function nextTurn(round,state){
  if(!state?.feedback)return state;
  return {...state,flipped:[],matched:[...state.matched],feedback:null};
 }
 function complete(round,state){
  const count=pairs(round).length;
  return count>0&&Array.isArray(state?.matched)&&new Set(state.matched.filter(i=>Number.isInteger(i)&&i>=0&&i<count)).size===count;
 }
 function perfect(round,state){return complete(round,state)&&state.attempts===pairs(round).length;}
 function markup(round,state,options){
  if(!state||!Array.isArray(state.cards))return '';
  const list=pairs(round),closed=options?.closed===true,found=state.matched.length;
  const turnLabel=state.feedback?'':state.flipped.length===1?'Choose its partner.':'Choose two cards.';
  const trail='<div class="memory-pair-trail" role="img" aria-label="'+found+' of '+list.length+' pairs found">'+list.map((_,i)=>'<span class="memory-pair-dot'+(i<found?' is-complete':'')+'" aria-hidden="true">'+(i<found?'✓':String(i+1))+'</span>').join('')+'</div>';
  return '<div class="memory-status"><div class="memory-progress"><strong>'+found+' / '+list.length+' pairs</strong><span>'+state.attempts+' '+(state.attempts===1?'turn':'turns')+'</span></div>'+trail+'</div>'+(turnLabel?'<p class="memory-turn-label">'+turnLabel+'</p>':'')+'<div class="memory-board" role="group" aria-label="Memory cards">'+state.cards.map((card,index)=>{
   const pair=list[card.pairIndex],matched=state.matched.includes(card.pairIndex),turnCard=state.flipped.includes(index),faceUp=closed||matched||turnCard,value=pair?.[card.side]??'',disabled=closed||matched||turnCard||!!state.feedback;
   const justMatched=matched&&state.feedback?.correct&&state.feedback.pairIndex===card.pairIndex;
   const classes='memory-card'+(faceUp?' is-flipped pair-tone-'+(card.pairIndex%4):'')+(matched?' is-matched':'')+(turnCard?' is-turn-card':'')+(justMatched?' is-just-matched':'');
   const number=String(index+1).padStart(2,'0');
   return '<button type="button" class="'+classes+'" data-action="memory-flip" data-card-index="'+index+'" aria-pressed="'+faceUp+'" aria-label="'+esc('Card '+(index+1)+(faceUp?': '+value+(matched?', matched':''):': face down'))+'"'+(disabled?' disabled':'')+'><span class="memory-card-number" aria-hidden="true">'+number+'</span>'+(faceUp?'<span class="memory-content"><small class="memory-kind">'+(card.side==='term'?'Term':'Meaning')+'</small><span class="memory-face">'+esc(value)+'</span></span>'+(matched?'<span class="memory-check" aria-hidden="true">✓</span>':''):'<span class="memory-cover" aria-hidden="true"><span class="memory-emblem">✦</span><span class="memory-back">DOUBLE<br>TROUBLE</span></span>')+'</button>';
  }).join('')+'</div>';
 }
 function reviewMarkup(round,state){
  return '<div class="pair-solution memory-review">'+pairs(round).map((pair,i)=>'<div class="memory-review-pair pair-tone-'+(i%4)+'"><span class="memory-review-mark" aria-hidden="true">✓</span><div><p><strong>'+esc(pair.term)+'</strong> — '+esc(pair.definition)+'</p>'+(pair.explanation?'<p class="memory-rationale">'+esc(pair.explanation)+'</p>':'')+'</div></div>').join('')+'</div>';
 }
 root.UTMemory=Object.freeze({fresh,flip,nextTurn,complete,perfect,markup,reviewMarkup});
})(typeof window!=='undefined'?window:globalThis);
