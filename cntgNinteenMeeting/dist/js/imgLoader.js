!function(t){function n(){this.urlList=null,this.urlListOriginalLength=null,this.completeFunction=null,this.processNum=0,this.processFunction=null,this.urlHeader=""}n.prototype.loadImages=function(t,n){this.urlList=t,this.urlListOriginalLength=t.length,this.urlHeader=n||""},n.prototype.complete=function(t){this.completeFunction=t||null},n.prototype.process=function(t){this.processFunction=t||null},n.prototype.start=function(){this.calprocessNum(),this.loadOneImage()},n.prototype.loadOneImage=function(){var t=this;if(null!=t.urlList){var n=t.urlList.shift();if(void 0!==n){var o=new Image;if(o.src=t.urlHeader+n,o.style.cssText="visibility: hidden; width: 1px; height: 1px; position: absolute;",document.body.appendChild(o),o.complete)return t.calprocessNum(),t.loadOneImage();o.onload=function(){return t.calprocessNum(),o.onload=null,t.loadOneImage()},o.onerror=function(){return o.onerror=null,t.loadOneImage()}}else null!=t.completeFunction&&setTimeout(function(){t.completeFunction()},800)}},n.prototype.calprocessNum=function(){var t=this,n=(t.urlListOriginalLength-t.urlList.length)/t.urlListOriginalLength;t.processNum=Math.floor(100*n)>=100?100:Math.floor(100*n),null!=t.processFunction&&t.processFunction.call(t)},t.ImagesLoader=n}(window);