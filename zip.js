(function(root){'use strict';
 const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0;}
 function crc(bytes){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
 const encode=s=>new TextEncoder().encode(s);
 function header(size){const bytes=new Uint8Array(size);return{bytes,d:new DataView(bytes.buffer)};}
 function make(files){let offset=0,centralSize=0;const chunks=[],central=[];
  for(const [name,value] of Object.entries(files)){const filename=encode(name),data=typeof value==='string'?encode(value):value,checksum=crc(data),h=header(30+filename.length);h.d.setUint32(0,0x04034b50,true);h.d.setUint16(4,20,true);h.d.setUint16(6,0x800,true);h.d.setUint16(12,0x5021,true);h.d.setUint32(14,checksum,true);h.d.setUint32(18,data.length,true);h.d.setUint32(22,data.length,true);h.d.setUint16(26,filename.length,true);h.bytes.set(filename,30);chunks.push(h.bytes,data);
   const c=header(46+filename.length);c.d.setUint32(0,0x02014b50,true);c.d.setUint16(4,20,true);c.d.setUint16(6,20,true);c.d.setUint16(8,0x800,true);c.d.setUint16(14,0x5021,true);c.d.setUint32(16,checksum,true);c.d.setUint32(20,data.length,true);c.d.setUint32(24,data.length,true);c.d.setUint16(28,filename.length,true);c.d.setUint32(42,offset,true);c.bytes.set(filename,46);central.push(c.bytes);centralSize+=c.bytes.length;offset+=h.bytes.length+data.length;
  }
  const end=header(22),count=central.length;end.d.setUint32(0,0x06054b50,true);end.d.setUint16(8,count,true);end.d.setUint16(10,count,true);end.d.setUint32(12,centralSize,true);end.d.setUint32(16,offset,true);return new Blob([...chunks,...central,end.bytes],{type:'application/zip'});
 }
 root.UTZip={make,crc};
})(typeof window!=='undefined'?window:globalThis);
