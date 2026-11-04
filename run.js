(function(root){
 'use strict';
 const VERSION=1,MAX_STAGES=5,validId=value=>typeof value==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(value);
 const stageKey=stage=>JSON.stringify([stage.gameId,stage.itemId]);
 const validStage=stage=>!!stage&&typeof stage==='object'&&!Array.isArray(stage)&&validId(stage.gameId)&&validId(stage.itemId);
 const copyStage=stage=>({gameId:stage.gameId,itemId:stage.itemId});
 function candidatesOf(values){
  const unique=new Map();
  for(const value of Array.isArray(values)?values:[]){
   if(!validStage(value))continue;
   const key=stageKey(value),previous=unique.get(key);
   unique.set(key,{...copyStage(value),complete:value.complete===true&&(!previous||previous.complete)});
  }
  return [...unique.values()];
 }
 function shuffled(values,rng){
  const output=values.slice();
  for(let i=output.length-1;i>0;i--){
   const raw=Number(rng()),unit=Number.isFinite(raw)?Math.max(0,Math.min(.9999999999999999,raw)):0;
   const j=Math.floor(unit*(i+1));[output[i],output[j]]=[output[j],output[i]];
  }
  return output;
 }
 function validRun(run){
  if(!run||typeof run!=='object'||Array.isArray(run)||run.version!==VERSION||!Array.isArray(run.stages)||run.stages.length>MAX_STAGES||!Number.isInteger(run.index)||run.index<0||run.index>run.stages.length)return false;
  const seen=new Set();
  for(const stage of run.stages){if(!validStage(stage)||seen.has(stageKey(stage)))return false;seen.add(stageKey(stage));}
  return true;
 }
 function create(candidates,config){
  config=config&&typeof config==='object'?config:{};
  const length=Number.isInteger(config.length)?Math.max(1,Math.min(MAX_STAGES,config.length)):MAX_STAGES;
  const rng=typeof config.rng==='function'?config.rng:Math.random,available=candidatesOf(candidates),stages=[],usedGames=new Set();
  for(const completed of [false,true]){
   const pool=shuffled(available.filter(item=>item.complete===completed),rng);
   while(pool.length&&stages.length<length){
    const freshGame=pool.findIndex(item=>!usedGames.has(item.gameId));
    const [item]=pool.splice(freshGame<0?0:freshGame,1);
    stages.push(copyStage(item));usedGames.add(item.gameId);
   }
  }
  return {version:VERSION,stages,index:0};
 }
 function current(run){return validRun(run)&&run.index<run.stages.length?copyStage(run.stages[run.index]):null;}
 function complete(run){return validRun(run)&&run.index===run.stages.length;}
 function next(run){return validRun(run)?{version:VERSION,stages:run.stages.map(copyStage),index:Math.min(run.stages.length,run.index+1)}:null;}
 function restore(raw,candidates){
  try{
   const run=typeof raw==='string'?JSON.parse(raw):raw;
   if(!validRun(run))return null;
   const known=new Set(candidatesOf(candidates).map(stageKey));
   if(run.stages.some(stage=>!known.has(stageKey(stage))))return null;
   return {version:VERSION,stages:run.stages.map(copyStage),index:run.index};
  }catch(_){return null;}
 }
 root.UTRun=Object.freeze({create,current,next,complete,restore});
})(typeof window!=='undefined'?window:globalThis);
