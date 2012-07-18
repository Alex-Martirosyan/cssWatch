/**
 * © 2012 Aleksej Martirosyan
 * Alex-Martirosyan@ya.ru
 */ 
 
 var cssWatch = {  
     /**
      * Интервал проверки изменений css (в миллисекундах)
      */
     interValUpdate: 100,
     

/*------Дальше править не рекомендуется-----------------------------------------------------*/

     arrayCssFiles: new Array(),
     arrayLastModified: new Array(),
     arrayCssObj: new Array(),
     counter: 0,
     
     ajax: function (obj) {
         var _this = this;
         var request=null;
         var lastModified = '';
         
         try {
            request = new XMLHttpRequest();
         } catch (e) {
             try {
                 request=new ActiveXObject("Msxml2.XMLHTTP");
             } catch (e) {
                 request=new ActiveXObject("Microsoft.XMLHTTP");
             }
         }
         
         var url = obj.url+'?_=' + Math.random();
         request.onreadystatechange = function (text,text2) {
             if (request.readyState == 4) {                
                 lastModified = /Last-Modified[]?:([^\n]+)/ig.exec(request.getAllResponseHeaders());
                 lastModified = lastModified[1];
                 
                 if (request.status == 200) {              
                     _this.arrayCssObj[_this.counter].setAttribute('href',_this.arrayCssFiles[_this.counter]+'?_=' + Math.random());
                     if (lastModified) {
                         _this.arrayLastModified[_this.counter] = lastModified.replace(/^\s+/, '').replace(/\s+$/, '');
                     }
                 } 

                 setTimeout(function () {
                     if (_this.counter < _this.arrayCssObj.length - 1) {
                         _this.counter++;
                         _this.loadCss();
                     } else {
                         _this.counter = 0;
                         _this.loadCss();
                     }                      
                 },_this.interValUpdate);                 
             }
         };

         request.open("HEAD", url, true);

         if (_this.arrayLastModified[_this.counter]) {
             request.setRequestHeader("If-Modified-Since", _this.arrayLastModified[_this.counter]);
         }
         request.send(null);
         
         return request;         
     },

     parse : function () {   
         var _this = this;
         
         var arrayLink = document.getElementsByTagName('link');
         var arrayLinkLength = arrayLink.length;
         
         for (var i = 0; i < arrayLinkLength; i++) {
             if (arrayLink[i].getAttribute('href').substr(-4) == '.css' && arrayLink[i].getAttribute('cssWatch') != 'no') {
                 _this.arrayCssFiles[_this.arrayCssFiles.length] = arrayLink[i].getAttribute('href');
                 _this.arrayCssObj[_this.arrayCssFiles.length - 1] = arrayLink[i];                 
             }
         }

         if (_this.arrayCssFiles.length > 0) {
             this.loadCss();
         }
      },
      
     loadCss: function () {
          var _this = this;
                 
          this.ajax({url:_this.arrayCssFiles[_this.counter]});
     },
     
     create: function () {       
         var _this = this;
         
         if (document.readyState == 'complete') {
             this.init();             
         } else {
             setTimeout(function () {
                 _this.create();
             },50);
         }
     }
 };
  
 cssWatch.create();
