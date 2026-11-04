(function(root){
 'use strict';
 const MIN_SIZE=10,MAX_SIZE=20,MAX_WORDS=3,ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const letters=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,'');
 const list=round=>Array.isArray(round?.pairs)?round.pairs:[];
 const unit=rng=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(.9999999999999999,n)):.5;};
 function shuffled(values,rng){const out=values.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(unit(rng)*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 function placements(word,size,rng){const out=[],directions=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];for(let r=0;r<size;r++)for(let c=0;c<size;c++)for(const [dr,dc]of directions){const er=r+dr*(word.length-1),ec=c+dc*(word.length-1);if(er<0||er>=size||ec<0||ec>=size)continue;out.push(Array.from({length:word.length},(_,i)=>(r+dr*i)*size+c+dc*i));}return shuffled(out,rng);}
 function fresh(round,rng){
  const random=typeof rng==='function'?rng:Math.random,seen=new Set(),words=[],unavailable=[];
  for(const pair of list(round)){
   const normalized=letters(pair?.term);if(!normalized||seen.has(normalized))continue;seen.add(normalized);
   if(normalized.length>MAX_SIZE){unavailable.push({term:String(pair.term),definition:String(pair.definition||'')});continue;}
   if(words.length<MAX_WORDS)words.push({term:String(pair.term),definition:String(pair.definition||''),letters:normalized,path:[]});
  }
  const size=Math.max(MIN_SIZE,...words.map(word=>word.letters.length));let grid=Array(size*size).fill(''),success=false;
  const order=words.map((_,i)=>i).sort((a,b)=>words[b].letters.length-words[a].letters.length);
  for(let attempt=0;attempt<8&&!success;attempt++){
   grid.fill('');for(const word of words)word.path=[];success=true;
   for(const i of order){const word=words[i],path=placements(word.letters,size,random).find(path=>path.every((cell,j)=>!grid[cell]||grid[cell]===word.letters[j]));if(!path){success=false;break;}word.path=path;path.forEach((cell,j)=>{grid[cell]=word.letters[j];});}
  }
  // A small editable round is always placeable in separate rows, even for a pathological RNG.
  if(!success){grid.fill('');words.forEach((word,row)=>{word.path=Array.from({length:word.letters.length},(_,c)=>row*size+c);word.path.forEach((cell,j)=>{grid[cell]=word.letters[j];});});}
  grid=grid.map(char=>char||ABC[Math.floor(unit(random)*ABC.length)]);
  return {size,grid,words,found:[],selection:null,feedback:null,unavailable};
 }
 function complete(round,state){return Array.isArray(state?.words)&&state.words.length>0&&Array.isArray(state.found)&&state.words.every((_,i)=>state.found.includes(i));}
 function selectionPath(start,end,size){const sr=Math.floor(start/size),sc=start%size,er=Math.floor(end/size),ec=end%size,dr=er-sr,dc=ec-sc;if(dr!==0&&dc!==0&&Math.abs(dr)!==Math.abs(dc))return null;const length=Math.max(Math.abs(dr),Math.abs(dc))+1,rr=Math.sign(dr),cc=Math.sign(dc);return Array.from({length},(_,i)=>(sr+rr*i)*size+sc+cc*i);}
 function choose(round,state,index){
  if(!state||!Number.isInteger(state.size)||!Array.isArray(state.grid)||!Array.isArray(state.words)||!Array.isArray(state.found)||!Number.isInteger(index)||index<0||index>=state.grid.length||complete(round,state))return state;
  if(!Number.isInteger(state.selection))return {...state,found:state.found.slice(),selection:index,feedback:null};
  const path=selectionPath(state.selection,index,state.size),value=path?path.map(cell=>state.grid[cell]).join(''):'',reverse=value.split('').reverse().join('');
  const i=path?state.words.findIndex(word=>word.letters===value||word.letters===reverse):-1;
  if(i>=0&&!state.found.includes(i)){
   const word=state.words[i],chosen=word.letters===value?path:path.slice().reverse(),words=state.words.map((w,n)=>n===i?{...w,path:chosen}:w);
   return {...state,words,found:state.found.concat(i),selection:null,feedback:{correct:true,wordIndex:i,explanation:word.term+' — '+word.definition}};
  }
  const explanation=i>=0?'You already found '+state.words[i].term+'. Choose another listed term.':path?'That line is not one of this round’s terms. Connect the first and last letter of one listed term.':'Choose a straight line across, down, or diagonally. Connect the first and last letter of one listed term.';
  return {...state,found:state.found.slice(),selection:null,feedback:{correct:false,wordIndex:null,explanation}};
 }
 function reviewMarkup(round,state){
  const words=Array.isArray(state?.words)?state.words:list(round).map(pair=>({term:String(pair.term||''),definition:String(pair.definition||'')}));
  return '<div class="ws-review">'+words.map(word=>'<div class="ws-review-word"><span aria-hidden="true">✓</span><p><strong>'+esc(word.term)+'</strong><br>'+esc(word.definition)+'</p></div>').join('')+'</div>';
 }
 function markup(round,state,options){
  if(!state||!Array.isArray(state.grid)||!Array.isArray(state.words))return '';
  const closed=options?.closed===true,found=Array.isArray(state.found)?state.found:[],highlighted=new Set(state.words.flatMap((word,i)=>closed||found.includes(i)?word.path:[]));
  if(!state.words.length)return '<div class="ws-empty"><p>Add a term with 1–20 letters to play this round.</p>'+reviewMarkup(round,{words:state.unavailable||[]})+'</div>';
  const cue=closed?'All terms revealed.':state.selection===null?'Choose the first letter, then the last letter.':'Now choose the last letter of the term.';
  return '<div class="ws-game"><div class="ws-status"><strong>'+found.length+' / '+state.words.length+' terms found</strong><span>'+esc(cue)+'</span></div><div class="ws-layout"><div class="ws-grid-wrap"><div class="ws-grid" style="--ws-size:'+state.size+'" role="group" aria-label="Word-search letter grid">'+state.grid.map((char,index)=>'<button type="button" class="ws-cell'+(state.selection===index?' is-selected':'')+(highlighted.has(index)?(closed?' is-revealed':' is-found'):'')+'" data-action="ws-cell" data-cell="'+index+'" aria-pressed="'+String(state.selection===index||highlighted.has(index))+'" aria-label="Row '+(Math.floor(index/state.size)+1)+', column '+(index%state.size+1)+', '+esc(char)+(highlighted.has(index)?', found':'')+'"'+(closed?' disabled':'')+'>'+esc(char)+'</button>').join('')+'</div></div><ul class="ws-word-list" aria-label="Terms to find">'+state.words.map((word,i)=>'<li class="ws-word'+(closed||found.includes(i)?' is-found':'')+'"><span class="ws-word-check" aria-hidden="true">'+(closed||found.includes(i)?'✓':String(i+1))+'</span><div><strong>'+esc(word.term)+'</strong><p>'+esc(word.definition)+'</p></div></li>').join('')+'</ul></div>'+(state.feedback&&!closed?'<section class="ws-feedback '+(state.feedback.correct?'good':'wrong')+'" aria-live="polite"><h3>'+(state.feedback.correct?'Word found!':'Keep exploring.')+'</h3><p>'+esc(state.feedback.explanation)+'</p></section>':'')+'</div>';
 }
 root.UTWordSearch=Object.freeze({fresh,choose,complete,markup,reviewMarkup});
})(typeof window!=='undefined'?window:globalThis);
