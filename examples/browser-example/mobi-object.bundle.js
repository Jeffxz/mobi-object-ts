!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.mobiObject=e():t.mobiObject=e()}(self,(function(){return(()=>{"use strict";var t={839:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0});var r=i(285),n=function(){function t(t){this.capacity=t,this.fragment_list=[],this.cur_fragment=new r.default(t),this.fragment_list.push(this.cur_fragment)}return t.prototype.write=function(t){this.cur_fragment.write(t)||(this.cur_fragment=new r.default(this.capacity),this.fragment_list.push(this.cur_fragment),this.cur_fragment.write(t))},t.prototype.get=function(t){for(var e=0;e<this.fragment_list.length;){var i=this.fragment_list[e];if(t<i.size)return i.get(t);t-=i.size,e+=1}return null},t.prototype.size=function(){for(var t=0,e=0;e<this.fragment_list.length;e++)t+=this.fragment_list[e].size;return t},t.prototype.shrink=function(){for(var t=new Uint8Array(this.size()),e=0,i=0;i<this.fragment_list.length;i++){var r=this.fragment_list[i];r.full()?t.set(r.buffer,e):t.set(r.buffer.slice(0,r.size),e),e+=r.size}return t},t}();e.default=n},790:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0});var r=i(839);function n(t){return t instanceof ArrayBuffer&&(t=new Uint8Array(t)),new TextDecoder("utf-8").decode(t)}var s=function(){function t(t){this.view=new DataView(t),this.buffer=this.view.buffer,this.offset=0,this.header=null}return t.prototype.getUint8=function(){var t=this.view.getUint8(this.offset);return this.offset+=1,t},t.prototype.getUint16=function(){var t=this.view.getUint16(this.offset);return this.offset+=2,t},t.prototype.getUint32=function(){var t=this.view.getUint32(this.offset);return this.offset+=4,t},t.prototype.getStr=function(t){var e=n(this.buffer.slice(this.offset,this.offset+t));return this.offset+=t,e},t.prototype.skip=function(t){this.offset+=t},t.prototype.setoffset=function(t){this.offset=t},t.prototype.get_record_extrasize=function(t,e){for(var i=t.length-1,r=0,n=15;n>0;n--)if(e&1<<n){var s=this.buffer_get_varlen(t,i),o=s[0],f=s[1];i=s[2],i-=o-f,r+=o}return 1&e&&(r+=1+(3&t[i])),r},t.prototype.buffer_get_varlen=function(t,e){for(var i=0,r=0,n=0,s=0,o=0;;o++){var f=t[e];if(r|=(127&f)<<s,s+=7,i+=1,e-=1,(n+=1)>=4||(128&f)>0)break}return[r,i,e]},t.prototype.read_text=function(){for(var t=this.palm_header.record_count,e=[],i=1;i<=t;i++)e.push(this.read_text_record(i));var r=function(t){for(var e=0,i=0;i<t.length;i++)e+=(s=t[i]).length;var r=new Uint8Array(e),n=0;for(i=0;i<t.length;i++){var s=t[i];r.set(s,n),n+=s.length}return r}(e);return n(r)},t.prototype.read_text_record=function(t){var e=this.mobi_header.extra_flags,i=this.reclist[t].offset,n=this.reclist[t+1].offset,s=new Uint8Array(this.buffer.slice(i,n)),o=this.get_record_extrasize(s,e);if(s=new Uint8Array(this.buffer.slice(i,n-o)),2===this.palm_header.compression){var f=function(t){for(var e=t.length,i=0,n=new r.default(t.length);i<e;){var s=t[i];if(i+=1,0==s)n.write(s);else if(s<=8){for(var o=i;o<i+s;o++)n.write(t[o]);i+=s}else if(s<=127)n.write(s);else if(s<=191){var f=t[i];i+=1;var h=(s<<8|f)>>3&2047,a=3+(7&f),u=n.size();for(o=0;o<a;o++)n.write(n.get(u-h)),u+=1}else n.write(32),n.write(128^s)}return n}(s);return f.shrink()}return s},t.prototype.read_image=function(t){var e=this.mobi_header.first_image_idx,i=this.reclist[e+t].offset,r=this.reclist[e+t+1].offset,n=new Uint8Array(this.buffer.slice(i,r));return new Blob([n.buffer])},t.prototype.load=function(){this.header=this.load_pdbheader(),this.reclist=this.load_reclist(),this.load_record0()},t.prototype.load_pdbheader=function(){return{name:this.getStr(32).replace(/\x00/g,""),attr:this.getUint16(),version:this.getUint16(),ctime:this.getUint32(),mtime:this.getUint32(),btime:this.getUint32(),mod_num:this.getUint32(),appinfo_offset:this.getUint32(),sortinfo_offset:this.getUint32(),type:this.getStr(4),creator:this.getStr(4),uid:this.getUint32(),next_rec:this.getUint32(),record_num:this.getUint16()}},t.prototype.load_reclist=function(){var t=[];if(this.header)for(var e=0;e<this.header.record_num;e++){var i={offset:this.getUint32(),attr:this.getUint32()};t.push(i)}return t},t.prototype.load_record0=function(){this.palm_header=this.load_record0_header(),this.mobi_header=this.load_mobi_header()},t.prototype.load_record0_header=function(){var t={},e=this.reclist[0];return this.setoffset(e.offset),t.compression=this.getUint16(),this.skip(2),t.text_length=this.getUint32(),t.record_count=this.getUint16(),t.record_size=this.getUint16(),t.encryption_type=this.getUint16(),this.skip(2),t},t.prototype.load_mobi_header=function(){var t={},e=this.offset;return t.identifier=this.getUint32(),t.header_length=this.getUint32(),t.mobi_type=this.getUint32(),t.text_encoding=this.getUint32(),t.uid=this.getUint32(),t.generator_version=this.getUint32(),this.skip(40),t.first_nonbook_index=this.getUint32(),t.full_name_offset=this.getUint32(),t.full_name_length=this.getUint32(),t.language=this.getUint32(),t.input_language=this.getUint32(),t.output_language=this.getUint32(),t.min_version=this.getUint32(),t.first_image_idx=this.getUint32(),t.huff_rec_index=this.getUint32(),t.huff_rec_count=this.getUint32(),t.datp_rec_index=this.getUint32(),t.datp_rec_count=this.getUint32(),t.exth_flags=this.getUint32(),this.skip(36),t.drm_offset=this.getUint32(),t.drm_count=this.getUint32(),t.drm_size=this.getUint32(),t.drm_flags=this.getUint32(),this.skip(8),this.skip(4),this.skip(46),t.extra_flags=this.getUint16(),this.setoffset(e+t.header_length),t},t}();e.default=s},285:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t){this.buffer=new Uint8Array(t),this.capacity=t,this.size=0}return t.prototype.write=function(t){return!(this.size>=this.capacity||(this.buffer[this.size]=t,this.size+=1,0))},t.prototype.full=function(){return this.size===this.capacity},t.prototype.get=function(t){return this.buffer[t]},t}();e.default=i}},e={};function i(r){var n=e[r];if(void 0!==n)return n.exports;var s=e[r]={exports:{}};return t[r](s,s.exports,i),s.exports}var r={};return(()=>{var t=r;Object.defineProperty(t,"__esModule",{value:!0}),t.MobiBuffer=t.MobiFragment=t.MobiFile=void 0;var e=i(790);t.MobiFile=e.default;var n=i(839);t.MobiBuffer=n.default;var s=i(285);t.MobiFragment=s.default})(),r})()}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUtXLE9BQVNYLEtBQUtELFVBRzVCLFlBQUFPLElBQUEsU0FBSUMsR0FDRixPQUFPUCxLQUFLb0IsT0FBT2IsSUFFdkIsRUEzQkEsR0E2QkEsVUFBZXFILElDNUJYQyxFQUEyQixHQUcvQixTQUFTQyxFQUFvQkMsR0FFNUIsSUFBSUMsRUFBZUgsRUFBeUJFLEdBQzVDLFFBQXFCRSxJQUFqQkQsRUFDSCxPQUFPQSxFQUFhdEksUUFHckIsSUFBSUMsRUFBU2tJLEVBQXlCRSxHQUFZLENBR2pEckksUUFBUyxJQU9WLE9BSEF3SSxFQUFvQkgsR0FBVXBJLEVBQVFBLEVBQU9ELFFBQVNvSSxHQUcvQ25JLEVBQU9ELFEsNEhDckJmLGFBTUUsRUFBQWlJLFNBTkssVUFDUCxhQU9FLEVBQUFyRyxXQVBLLFVBQ1AsYUFLRSxFQUFBc0csYUFMSyxXIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW9iaU9iamVjdC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vbW9iaU9iamVjdC8uL3NyYy9Nb2JpQnVmZmVyLnRzIiwid2VicGFjazovL21vYmlPYmplY3QvLi9zcmMvTW9iaUZpbGUudHMiLCJ3ZWJwYWNrOi8vbW9iaU9iamVjdC8uL3NyYy9Nb2JpRnJhZ21lbnQudHMiLCJ3ZWJwYWNrOi8vbW9iaU9iamVjdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tb2JpT2JqZWN0Ly4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wibW9iaU9iamVjdFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJtb2JpT2JqZWN0XCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW1wb3J0IE1vYmlGcmFnbWVudCBmcm9tICcuL01vYmlGcmFnbWVudCdcblxuY2xhc3MgTW9iaUJ1ZmZlciB7XG4gIGNhcGFjaXR5OiBudW1iZXJcbiAgZnJhZ21lbnRfbGlzdDogYW55XG4gIGN1cl9mcmFnbWVudDogTW9iaUZyYWdtZW50XG5cbiAgY29uc3RydWN0b3IoY2FwYWNpdHk6IG51bWJlcikge1xuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICB0aGlzLmZyYWdtZW50X2xpc3QgPSBbXTtcbiAgICB0aGlzLmN1cl9mcmFnbWVudCA9IG5ldyBNb2JpRnJhZ21lbnQoY2FwYWNpdHkpO1xuICAgIHRoaXMuZnJhZ21lbnRfbGlzdC5wdXNoKHRoaXMuY3VyX2ZyYWdtZW50KTtcbiAgfVxuXG4gIHdyaXRlKGJ5dGU6IG51bWJlcikge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLmN1cl9mcmFnbWVudC53cml0ZShieXRlKTtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgdGhpcy5jdXJfZnJhZ21lbnQgPSBuZXcgTW9iaUZyYWdtZW50KHRoaXMuY2FwYWNpdHkpO1xuICAgICAgdGhpcy5mcmFnbWVudF9saXN0LnB1c2godGhpcy5jdXJfZnJhZ21lbnQpO1xuICAgICAgdGhpcy5jdXJfZnJhZ21lbnQud3JpdGUoYnl0ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0KGlkeDogbnVtYmVyKSB7XG4gICAgdmFyIGZpID0gMDtcbiAgICB3aGlsZSAoZmkgPCB0aGlzLmZyYWdtZW50X2xpc3QubGVuZ3RoKSB7XG4gICAgICB2YXIgZnJhZyA9IHRoaXMuZnJhZ21lbnRfbGlzdFtmaV07XG4gICAgICBpZiAoaWR4IDwgZnJhZy5zaXplKSB7XG4gICAgICAgIHJldHVybiBmcmFnLmdldChpZHgpO1xuICAgICAgfVxuICAgICAgaWR4IC09IGZyYWcuc2l6ZTtcbiAgICAgIGZpICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICB2YXIgcyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZyYWdtZW50X2xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHMgKz0gdGhpcy5mcmFnbWVudF9saXN0W2ldLnNpemU7XG4gICAgfVxuICAgIHJldHVybiBzO1xuICB9XG5cbiAgc2hyaW5rKCkge1xuICAgIHZhciB0b3RhbF9idWZmZXIgPSBuZXcgVWludDhBcnJheSh0aGlzLnNpemUoKSk7XG4gICAgdmFyIG9mZnNldCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZyYWdtZW50X2xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBmcmFnID0gdGhpcy5mcmFnbWVudF9saXN0W2ldO1xuICAgICAgaWYgKGZyYWcuZnVsbCgpKSB7XG4gICAgICAgIHRvdGFsX2J1ZmZlci5zZXQoZnJhZy5idWZmZXIsIG9mZnNldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3RhbF9idWZmZXIuc2V0KGZyYWcuYnVmZmVyLnNsaWNlKDAsIGZyYWcuc2l6ZSksIG9mZnNldCk7XG4gICAgICB9XG4gICAgICBvZmZzZXQgKz0gZnJhZy5zaXplO1xuICAgIH1cbiAgICByZXR1cm4gdG90YWxfYnVmZmVyO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vYmlCdWZmZXJcbiIsIi8qKlxuICogY29waWVkIGFuZCBtb2RpZmllZCBmcm9tXG4gKiBodHRwczovL2dpdGh1Yi5jb20vd29zaGlmeXovbW9iaV9yZWFkZXIvYmxvYi9tYXN0ZXIvbW9iaS5qc1xuICovXG5pbXBvcnQgTW9iaUJ1ZmZlciBmcm9tICcuL01vYmlCdWZmZXInXG5pbXBvcnQgeyBNT0JJSGVhZGVyLCBQYWxtRE9DSGVhZGVyLCBQREJIZWFkZXIsIFJlY29yZEluZm8gfSBmcm9tICcuL1R5cGVzJ1xuXG5mdW5jdGlvbiBhYjJzdHIoYnVmOiBBcnJheUJ1ZmZlciB8IFVpbnQ4QXJyYXkpIHtcbiAgaWYgKGJ1ZiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgfVxuICByZXR1cm4gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIikuZGVjb2RlKGJ1Zik7XG59XG5cbmNvbnN0IGNvbWJpbmVfdWludDhhcnJheSA9IGZ1bmN0aW9uKGJ1ZmZlcnM6IFVpbnQ4QXJyYXlbXSkge1xuICBsZXQgdG90YWxfc2l6ZSA9IDA7XG4gIGZvcihsZXQgaSA9IDA7IGkgPCBidWZmZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGJ1ZmZlciA9IGJ1ZmZlcnNbaV07XG4gICAgdG90YWxfc2l6ZSBcdCs9IGJ1ZmZlci5sZW5ndGg7XG4gIH1cbiAgbGV0IHRvdGFsX2J1ZmZlciA9IG5ldyBVaW50OEFycmF5KHRvdGFsX3NpemUpO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yKGxldCBpID0gMCA7aSA8IGJ1ZmZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYnVmZmVyID0gYnVmZmVyc1tpXTtcbiAgICB0b3RhbF9idWZmZXIuc2V0KGJ1ZmZlciwgb2Zmc2V0KTtcbiAgICBvZmZzZXQgKz0gYnVmZmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gdG90YWxfYnVmZmVyO1xufVxuXG5jb25zdCB1bmNvbXByZXNzaW9uX2x6NzcgPSBmdW5jdGlvbihkYXRhOiBhbnkpIHtcbiAgbGV0IGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICBsZXQgb2Zmc2V0ID0gMDsgICAvLyBDdXJyZW50IG9mZnNldCBpbnRvIGRhdGFcbiAgbGV0IGJ1ZmZlciA9IG5ldyBNb2JpQnVmZmVyKGRhdGEubGVuZ3RoKTtcblxuICB3aGlsZShvZmZzZXQgPCBsZW5ndGgpIHtcbiAgICBsZXQgY2hhciA9IGRhdGFbb2Zmc2V0XTtcbiAgICBvZmZzZXQgKz0gMTtcblxuICAgIGlmIChjaGFyID09IDApIHtcbiAgICAgIGJ1ZmZlci53cml0ZShjaGFyKTtcbiAgICB9IGVsc2UgaWYgKGNoYXIgPD0gOCl7XG4gICAgICBmb3IobGV0IGkgPSBvZmZzZXQ7IGkgPCBvZmZzZXQgKyBjaGFyOyBpKyspIHtcbiAgICAgICAgYnVmZmVyLndyaXRlKGRhdGFbaV0pO1xuICAgICAgfVxuICAgICAgb2Zmc2V0ICs9IGNoYXI7XG4gICAgfSBlbHNlIGlmIChjaGFyIDw9IDB4N2YpIHtcbiAgICAgIGJ1ZmZlci53cml0ZShjaGFyKTtcbiAgICB9IGVsc2UgaWYgKGNoYXIgPD0gMHhiZikge1xuICAgICAgbGV0IG5leHQgPSBkYXRhW29mZnNldF07XG4gICAgICBvZmZzZXQgKz0gMTtcbiAgICAgIGxldCBkaXN0YW5jZSA9ICgoY2hhciA8PCA4IHwgbmV4dCkgPj4gMykgJiAweDdmZjtcbiAgICAgIGxldCBsel9sZW5ndGggPSAobmV4dCAmIDB4NykgKyAzO1xuXG4gICAgICBsZXQgYnVmZmVyX3NpemUgPSBidWZmZXIuc2l6ZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsel9sZW5ndGg7IGkrKykge1xuICAgICAgICBidWZmZXIud3JpdGUoYnVmZmVyLmdldChidWZmZXJfc2l6ZSAtIGRpc3RhbmNlKSlcbiAgICAgICAgYnVmZmVyX3NpemUgKz0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYnVmZmVyLndyaXRlKDMyKTtcbiAgICAgIGJ1ZmZlci53cml0ZShjaGFyIF4gMHg4MCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBidWZmZXI7XG59O1xuXG5jbGFzcyBNb2JpRmlsZSB7XG4gIHZpZXc6IERhdGFWaWV3XG4gIGJ1ZmZlcjogQXJyYXlCdWZmZXJcbiAgb2Zmc2V0OiBudW1iZXJcbiAgaGVhZGVyOiBQREJIZWFkZXIgfCBudWxsXG4gIHBhbG1faGVhZGVyOiBhbnlcbiAgbW9iaV9oZWFkZXI6IGFueVxuICByZWNsaXN0OiBhbnlcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBBcnJheUJ1ZmZlcikge1xuICAgIHRoaXMudmlldyA9IG5ldyBEYXRhVmlldyhkYXRhKVxuICAgIHRoaXMuYnVmZmVyID0gdGhpcy52aWV3LmJ1ZmZlclxuICAgIHRoaXMub2Zmc2V0ID0gMFxuICAgIHRoaXMuaGVhZGVyID0gbnVsbFxuICB9XG5cbiAgZ2V0VWludDgoKSB7XG4gICAgbGV0IHYgPSB0aGlzLnZpZXcuZ2V0VWludDgodGhpcy5vZmZzZXQpXG4gICAgdGhpcy5vZmZzZXQgKz0gMVxuICAgIHJldHVybiB2XG4gIH1cblxuICBnZXRVaW50MTYoKSB7XG4gICAgbGV0IHYgPSB0aGlzLnZpZXcuZ2V0VWludDE2KHRoaXMub2Zmc2V0KVxuICAgIHRoaXMub2Zmc2V0ICs9IDJcbiAgICByZXR1cm4gdlxuICB9XG5cbiAgZ2V0VWludDMyKCkge1xuICAgIGxldCB2ID0gdGhpcy52aWV3LmdldFVpbnQzMih0aGlzLm9mZnNldClcbiAgICB0aGlzLm9mZnNldCArPSA0XG4gICAgcmV0dXJuIHZcbiAgfVxuXG4gIGdldFN0cihzaXplOiBudW1iZXIpIHtcbiAgICBsZXQgdiA9IGFiMnN0cih0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLm9mZnNldCwgdGhpcy5vZmZzZXQgKyBzaXplKSlcbiAgICB0aGlzLm9mZnNldCArPSBzaXplXG4gICAgcmV0dXJuIHZcbiAgfVxuXG4gIHNraXAoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5vZmZzZXQgKz0gc2l6ZVxuICB9XG5cbiAgc2V0b2Zmc2V0KF9vZjogbnVtYmVyKSB7XG4gICAgdGhpcy5vZmZzZXQgPSBfb2ZcbiAgfVxuXG4gIGdldF9yZWNvcmRfZXh0cmFzaXplKGRhdGE6IFVpbnQ4QXJyYXksIGZsYWdzOiBudW1iZXIpIHtcbiAgICBsZXQgcG9zID0gZGF0YS5sZW5ndGggLSAxXG4gICAgbGV0IGV4dHJhID0gMFxuICAgIGZvciAobGV0IGkgPSAxNTsgaSA+IDA7IGktLSkge1xuICAgICAgaWYgKGZsYWdzICYgKDEgPDwgaSkpIHtcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuYnVmZmVyX2dldF92YXJsZW4oZGF0YSwgcG9zKVxuICAgICAgICBsZXQgc2l6ZSA9IHJlc1swXVxuICAgICAgICBsZXQgbCA9IHJlc1sxXVxuICAgICAgICBwb3MgPSByZXNbMl1cbiAgICAgICAgcG9zIC09IHNpemUgLSBsXG4gICAgICAgIGV4dHJhICs9IHNpemVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsYWdzICYgMSkge1xuICAgICAgbGV0IGEgPSBkYXRhW3Bvc11cbiAgICAgIGV4dHJhICs9IChhICYgMHgzKSArIDFcbiAgICB9XG4gICAgcmV0dXJuIGV4dHJhXG4gIH1cblxuICBidWZmZXJfZ2V0X3ZhcmxlbihkYXRhOiBVaW50OEFycmF5LCBwb3M6IG51bWJlcikge1xuICAgIGxldCBsID0gMFxuICAgIGxldCBzaXplID0gMFxuICAgIGxldCBieXRlX2NvdW50ID0gMFxuICAgIGxldCBtYXNrID0gMHg3ZlxuICAgIGxldCBzdG9wX2ZsYWcgPSAweDgwXG4gICAgbGV0IHNoaWZ0ID0gMFxuICAgIGZvciAobGV0IGkgPSAwOyA7IGkrKykge1xuICAgICAgbGV0IGJ5dGUgPSBkYXRhW3Bvc11cbiAgICAgIHNpemUgfD0gKGJ5dGUgJiBtYXNrKSA8PCBzaGlmdFxuICAgICAgc2hpZnQgKz0gN1xuICAgICAgbCArPSAxXG4gICAgICBieXRlX2NvdW50ICs9IDFcbiAgICAgIHBvcyAtPSAxXG5cbiAgICAgIGxldCB0b19zdG9wID0gYnl0ZSAmIHN0b3BfZmxhZ1xuICAgICAgaWYgKGJ5dGVfY291bnQgPj0gNCB8fCB0b19zdG9wID4gMCkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW3NpemUsIGwsIHBvc11cbiAgfVxuXG4gIHJlYWRfdGV4dCgpIHtcbiAgICBsZXQgdGV4dF9lbmQgPSB0aGlzLnBhbG1faGVhZGVyLnJlY29yZF9jb3VudFxuICAgIGxldCBidWZmZXJzID0gW11cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0ZXh0X2VuZDsgaSsrKSB7XG4gICAgICBidWZmZXJzLnB1c2godGhpcy5yZWFkX3RleHRfcmVjb3JkKGkpKVxuICAgIH1cbiAgICBsZXQgYWxsID0gY29tYmluZV91aW50OGFycmF5KGJ1ZmZlcnMpXG4gICAgcmV0dXJuIGFiMnN0cihhbGwpXG4gIH1cblxuICByZWFkX3RleHRfcmVjb3JkKGk6IG51bWJlcikge1xuICAgIGxldCBmbGFncyA9IHRoaXMubW9iaV9oZWFkZXIuZXh0cmFfZmxhZ3NcbiAgICBsZXQgYmVnaW4gPSB0aGlzLnJlY2xpc3RbaV0ub2Zmc2V0XG4gICAgbGV0IGVuZCA9IHRoaXMucmVjbGlzdFtpKzFdLm9mZnNldFxuXG4gICAgbGV0IGRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlci5zbGljZShiZWdpbiwgZW5kKSlcbiAgICBsZXQgZXggPSB0aGlzLmdldF9yZWNvcmRfZXh0cmFzaXplKGRhdGEsIGZsYWdzKVxuXG4gICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyLnNsaWNlKGJlZ2luLCBlbmQgLSBleCkpXG4gICAgaWYgKHRoaXMucGFsbV9oZWFkZXIuY29tcHJlc3Npb24gPT09IDIpIHtcbiAgICAgIGxldCBidWZmZXIgPSB1bmNvbXByZXNzaW9uX2x6NzcoZGF0YSlcbiAgICAgIHJldHVybiBidWZmZXIuc2hyaW5rKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGFcbiAgICB9XG4gIH1cblxuICByZWFkX2ltYWdlKGlkeDogbnVtYmVyKSB7XG4gICAgbGV0IGZpcnN0X2ltYWdlX2lkeCA9IHRoaXMubW9iaV9oZWFkZXIuZmlyc3RfaW1hZ2VfaWR4XG4gICAgbGV0IGJlZ2luID0gdGhpcy5yZWNsaXN0W2ZpcnN0X2ltYWdlX2lkeCArIGlkeF0ub2Zmc2V0XG4gICAgbGV0IGVuZCA9IHRoaXMucmVjbGlzdFtmaXJzdF9pbWFnZV9pZHggKyBpZHggKyAxXS5vZmZzZXRcbiAgICBsZXQgZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyLnNsaWNlKGJlZ2luLCBlbmQpKVxuICAgIHJldHVybiBuZXcgQmxvYihbZGF0YS5idWZmZXJdKVxuICB9XG5cbiAgbG9hZCgpIHtcbiAgICB0aGlzLmhlYWRlciA9IHRoaXMubG9hZF9wZGJoZWFkZXIoKVxuICAgIHRoaXMucmVjbGlzdCA9IHRoaXMubG9hZF9yZWNsaXN0KClcbiAgICB0aGlzLmxvYWRfcmVjb3JkMCgpXG4gIH1cblxuICBsb2FkX3BkYmhlYWRlcigpIHtcbiAgICBjb25zdCBoZWFkZXI6IFBEQkhlYWRlciA9IHtcbiAgICAgIG5hbWU6IHRoaXMuZ2V0U3RyKDMyKS5yZXBsYWNlKC9cXHgwMC9nLCAnJyksXG4gICAgICBhdHRyOiB0aGlzLmdldFVpbnQxNigpLFxuICAgICAgdmVyc2lvbjogdGhpcy5nZXRVaW50MTYoKSxcbiAgICAgIGN0aW1lOiB0aGlzLmdldFVpbnQzMigpLFxuICAgICAgbXRpbWU6IHRoaXMuZ2V0VWludDMyKCksXG4gICAgICBidGltZTogdGhpcy5nZXRVaW50MzIoKSxcbiAgICAgIG1vZF9udW06IHRoaXMuZ2V0VWludDMyKCksXG4gICAgICBhcHBpbmZvX29mZnNldDogdGhpcy5nZXRVaW50MzIoKSxcbiAgICAgIHNvcnRpbmZvX29mZnNldDogdGhpcy5nZXRVaW50MzIoKSxcbiAgICAgIHR5cGU6IHRoaXMuZ2V0U3RyKDQpLFxuICAgICAgY3JlYXRvcjogdGhpcy5nZXRTdHIoNCksXG4gICAgICB1aWQ6IHRoaXMuZ2V0VWludDMyKCksXG4gICAgICBuZXh0X3JlYzogdGhpcy5nZXRVaW50MzIoKSxcbiAgICAgIHJlY29yZF9udW06IHRoaXMuZ2V0VWludDE2KClcbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlclxuICB9XG5cbiAgbG9hZF9yZWNsaXN0KCkge1xuICAgIGNvbnN0IHJlY2xpc3QgPSBbXVxuICAgIGlmICh0aGlzLmhlYWRlcikge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVyLnJlY29yZF9udW07IGkrKykge1xuICAgICAgICBjb25zdCByZWNvcmQ6IFJlY29yZEluZm8gPSB7XG4gICAgICAgICAgb2Zmc2V0OiB0aGlzLmdldFVpbnQzMigpLFxuICAgICAgICAgIGF0dHI6IHRoaXMuZ2V0VWludDMyKClcbiAgICAgICAgfVxuICAgICAgICByZWNsaXN0LnB1c2gocmVjb3JkKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVjbGlzdFxuICB9XG5cbiAgbG9hZF9yZWNvcmQwKCkge1xuICAgIHRoaXMucGFsbV9oZWFkZXIgPSB0aGlzLmxvYWRfcmVjb3JkMF9oZWFkZXIoKVxuICAgIHRoaXMubW9iaV9oZWFkZXIgPSB0aGlzLmxvYWRfbW9iaV9oZWFkZXIoKVxuICB9XG5cbiAgbG9hZF9yZWNvcmQwX2hlYWRlcigpIHtcbiAgICBjb25zdCBwX2hlYWRlciA9IHt9IGFzIFBhbG1ET0NIZWFkZXJcbiAgICBjb25zdCBmaXJzdF9yZWNvcmQgPSB0aGlzLnJlY2xpc3RbMF1cbiAgICB0aGlzLnNldG9mZnNldChmaXJzdF9yZWNvcmQub2Zmc2V0KVxuXG4gICAgcF9oZWFkZXIuY29tcHJlc3Npb24gPSB0aGlzLmdldFVpbnQxNigpXG4gICAgdGhpcy5za2lwKDIpXG4gICAgcF9oZWFkZXIudGV4dF9sZW5ndGggPSB0aGlzLmdldFVpbnQzMigpXG4gICAgcF9oZWFkZXIucmVjb3JkX2NvdW50ID0gdGhpcy5nZXRVaW50MTYoKVxuICAgIHBfaGVhZGVyLnJlY29yZF9zaXplID0gdGhpcy5nZXRVaW50MTYoKVxuICAgIHBfaGVhZGVyLmVuY3J5cHRpb25fdHlwZSA9IHRoaXMuZ2V0VWludDE2KClcbiAgICB0aGlzLnNraXAoMilcblxuICAgIHJldHVybiBwX2hlYWRlclxuICB9XG5cbiAgbG9hZF9tb2JpX2hlYWRlcigpIHtcbiAgICBjb25zdCBtb2JpX2hlYWRlciA9IHt9IGFzIE1PQklIZWFkZXJcbiAgICBjb25zdCBzdGFydF9vZmZzZXQgPSB0aGlzLm9mZnNldFxuICAgIG1vYmlfaGVhZGVyLmlkZW50aWZpZXIgPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuaGVhZGVyX2xlbmd0aCA9IHRoaXMuZ2V0VWludDMyKClcbiAgICBtb2JpX2hlYWRlci5tb2JpX3R5cGUgPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIudGV4dF9lbmNvZGluZyA9IHRoaXMuZ2V0VWludDMyKClcbiAgICBtb2JpX2hlYWRlci51aWQgPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuZ2VuZXJhdG9yX3ZlcnNpb24gPSB0aGlzLmdldFVpbnQzMigpXG4gICAgdGhpcy5za2lwKDQwKVxuICAgIG1vYmlfaGVhZGVyLmZpcnN0X25vbmJvb2tfaW5kZXggPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuZnVsbF9uYW1lX29mZnNldCA9IHRoaXMuZ2V0VWludDMyKClcbiAgICBtb2JpX2hlYWRlci5mdWxsX25hbWVfbGVuZ3RoID0gdGhpcy5nZXRVaW50MzIoKVxuICAgIG1vYmlfaGVhZGVyLmxhbmd1YWdlID0gdGhpcy5nZXRVaW50MzIoKVxuICAgIG1vYmlfaGVhZGVyLmlucHV0X2xhbmd1YWdlID0gdGhpcy5nZXRVaW50MzIoKVxuICAgIG1vYmlfaGVhZGVyLm91dHB1dF9sYW5ndWFnZSA9IHRoaXMuZ2V0VWludDMyKClcbiAgICBtb2JpX2hlYWRlci5taW5fdmVyc2lvbiA9IHRoaXMuZ2V0VWludDMyKClcbiAgICBtb2JpX2hlYWRlci5maXJzdF9pbWFnZV9pZHggPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuaHVmZl9yZWNfaW5kZXggPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuaHVmZl9yZWNfY291bnQgPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuZGF0cF9yZWNfaW5kZXggPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuZGF0cF9yZWNfY291bnQgPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuZXh0aF9mbGFncyA9IHRoaXMuZ2V0VWludDMyKClcbiAgICB0aGlzLnNraXAoMzYpXG4gICAgbW9iaV9oZWFkZXIuZHJtX29mZnNldCA9IHRoaXMuZ2V0VWludDMyKClcbiAgICBtb2JpX2hlYWRlci5kcm1fY291bnQgPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuZHJtX3NpemUgPSB0aGlzLmdldFVpbnQzMigpXG4gICAgbW9iaV9oZWFkZXIuZHJtX2ZsYWdzID0gdGhpcy5nZXRVaW50MzIoKVxuICAgIHRoaXMuc2tpcCg4KVxuICAgIHRoaXMuc2tpcCg0KVxuICAgIHRoaXMuc2tpcCg0NilcbiAgICBtb2JpX2hlYWRlci5leHRyYV9mbGFncyA9IHRoaXMuZ2V0VWludDE2KClcbiAgICB0aGlzLnNldG9mZnNldChzdGFydF9vZmZzZXQgKyBtb2JpX2hlYWRlci5oZWFkZXJfbGVuZ3RoKVxuICAgIHJldHVybiBtb2JpX2hlYWRlclxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vYmlGaWxlXG4iLCJjbGFzcyBNb2JpRnJhZ21lbnQge1xuICBidWZmZXI6IFVpbnQ4QXJyYXlcbiAgY2FwYWNpdHk6IG51bWJlclxuICBzaXplOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvcihjYXBhY2l0eTogbnVtYmVyKSB7XG4gICAgdGhpcy5idWZmZXIgPSBuZXcgVWludDhBcnJheShjYXBhY2l0eSlcbiAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHlcbiAgICB0aGlzLnNpemUgPSAwXG4gIH1cblxuICB3cml0ZShieXRlOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5zaXplID49IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmJ1ZmZlclt0aGlzLnNpemVdID0gYnl0ZVxuICAgIHRoaXMuc2l6ZSArPSAxXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZ1bGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gdGhpcy5jYXBhY2l0eVxuICB9XG5cbiAgZ2V0KGlkeDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyW2lkeF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2JpRnJhZ21lbnRcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgTW9iaUZpbGUgZnJvbSAnLi9zcmMvTW9iaUZpbGUnXG5pbXBvcnQgTW9iaUJ1ZmZlciBmcm9tICcuL3NyYy9Nb2JpQnVmZmVyJ1xuaW1wb3J0IE1vYmlGcmFnbWVudCBmcm9tICcuL3NyYy9Nb2JpRnJhZ21lbnQnXG5pbXBvcnQgeyBQREJIZWFkZXIsIFBhbG1ET0NIZWFkZXIsIE1PQklIZWFkZXIsIFJlY29yZEluZm8gfSBmcm9tICcuL3NyYy9UeXBlcydcblxuZXhwb3J0IHtcbiAgTW9iaUZpbGUsXG4gIE1vYmlGcmFnbWVudCxcbiAgTW9iaUJ1ZmZlcixcbiAgUERCSGVhZGVyLFxuICBQYWxtRE9DSGVhZGVyLFxuICBNT0JJSGVhZGVyLFxuICBSZWNvcmRJbmZvXG59XG4iXSwibmFtZXMiOlsicm9vdCIsImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmaW5lIiwiYW1kIiwic2VsZiIsImNhcGFjaXR5IiwidGhpcyIsImZyYWdtZW50X2xpc3QiLCJjdXJfZnJhZ21lbnQiLCJwdXNoIiwid3JpdGUiLCJieXRlIiwiZ2V0IiwiaWR4IiwiZmkiLCJsZW5ndGgiLCJmcmFnIiwic2l6ZSIsInMiLCJpIiwic2hyaW5rIiwidG90YWxfYnVmZmVyIiwiVWludDhBcnJheSIsIm9mZnNldCIsImZ1bGwiLCJzZXQiLCJidWZmZXIiLCJzbGljZSIsIk1vYmlCdWZmZXIiLCJhYjJzdHIiLCJidWYiLCJBcnJheUJ1ZmZlciIsIlRleHREZWNvZGVyIiwiZGVjb2RlIiwiZGF0YSIsInZpZXciLCJEYXRhVmlldyIsImhlYWRlciIsImdldFVpbnQ4IiwidiIsImdldFVpbnQxNiIsImdldFVpbnQzMiIsImdldFN0ciIsInNraXAiLCJzZXRvZmZzZXQiLCJfb2YiLCJnZXRfcmVjb3JkX2V4dHJhc2l6ZSIsImZsYWdzIiwicG9zIiwiZXh0cmEiLCJyZXMiLCJidWZmZXJfZ2V0X3ZhcmxlbiIsImwiLCJieXRlX2NvdW50Iiwic2hpZnQiLCJyZWFkX3RleHQiLCJ0ZXh0X2VuZCIsInBhbG1faGVhZGVyIiwicmVjb3JkX2NvdW50IiwiYnVmZmVycyIsInJlYWRfdGV4dF9yZWNvcmQiLCJhbGwiLCJ0b3RhbF9zaXplIiwiY29tYmluZV91aW50OGFycmF5IiwibW9iaV9oZWFkZXIiLCJleHRyYV9mbGFncyIsImJlZ2luIiwicmVjbGlzdCIsImVuZCIsImV4IiwiY29tcHJlc3Npb24iLCJjaGFyIiwibmV4dCIsImRpc3RhbmNlIiwibHpfbGVuZ3RoIiwiYnVmZmVyX3NpemUiLCJ1bmNvbXByZXNzaW9uX2x6NzciLCJyZWFkX2ltYWdlIiwiZmlyc3RfaW1hZ2VfaWR4IiwiQmxvYiIsImxvYWQiLCJsb2FkX3BkYmhlYWRlciIsImxvYWRfcmVjbGlzdCIsImxvYWRfcmVjb3JkMCIsIm5hbWUiLCJyZXBsYWNlIiwiYXR0ciIsInZlcnNpb24iLCJjdGltZSIsIm10aW1lIiwiYnRpbWUiLCJtb2RfbnVtIiwiYXBwaW5mb19vZmZzZXQiLCJzb3J0aW5mb19vZmZzZXQiLCJ0eXBlIiwiY3JlYXRvciIsInVpZCIsIm5leHRfcmVjIiwicmVjb3JkX251bSIsInJlY29yZCIsImxvYWRfcmVjb3JkMF9oZWFkZXIiLCJsb2FkX21vYmlfaGVhZGVyIiwicF9oZWFkZXIiLCJmaXJzdF9yZWNvcmQiLCJ0ZXh0X2xlbmd0aCIsInJlY29yZF9zaXplIiwiZW5jcnlwdGlvbl90eXBlIiwic3RhcnRfb2Zmc2V0IiwiaWRlbnRpZmllciIsImhlYWRlcl9sZW5ndGgiLCJtb2JpX3R5cGUiLCJ0ZXh0X2VuY29kaW5nIiwiZ2VuZXJhdG9yX3ZlcnNpb24iLCJmaXJzdF9ub25ib29rX2luZGV4IiwiZnVsbF9uYW1lX29mZnNldCIsImZ1bGxfbmFtZV9sZW5ndGgiLCJsYW5ndWFnZSIsImlucHV0X2xhbmd1YWdlIiwib3V0cHV0X2xhbmd1YWdlIiwibWluX3ZlcnNpb24iLCJodWZmX3JlY19pbmRleCIsImh1ZmZfcmVjX2NvdW50IiwiZGF0cF9yZWNfaW5kZXgiLCJkYXRwX3JlY19jb3VudCIsImV4dGhfZmxhZ3MiLCJkcm1fb2Zmc2V0IiwiZHJtX2NvdW50IiwiZHJtX3NpemUiLCJkcm1fZmxhZ3MiLCJNb2JpRmlsZSIsIk1vYmlGcmFnbWVudCIsIl9fd2VicGFja19tb2R1bGVfY2FjaGVfXyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImNhY2hlZE1vZHVsZSIsInVuZGVmaW5lZCIsIl9fd2VicGFja19tb2R1bGVzX18iXSwic291cmNlUm9vdCI6IiJ9