(function ($) {
    var movies = {};
    $.fn.videoIOControlsDefaults = {};
    var registerGlobalHandlers = function() {
        window.onPropertyChange = function(event) {
           console.log(event.objectID + ": " + event.property + " = " + event.newValue);
           var movie = movies[event.objectID];
           if(typeof movie === undefined || typeof movie.propertyElements === undefined) {
               console.log("Property Elements not defined yet");
               return;
           }
           var propertyElement = movie.propertyElements[event.property];
           if(propertyElement) {
               $.each(propertyElement, 
                      function(index, element){
                          element.text(event.newValue);
                      });
           }
           var value = event.newValue;
           switch(event.property) {
               case "record":
               if(value) {
                   movie.enableControls(['stop','pause','cancel']);
                   if(typeof movie.defaults.maxLength === 'number') {
                       setTimeout(
                           function(){
                               movie.controls.stop.click();
                           }
                           ,movie.defaults.maxLength*1000);
                   }
               } else {
                   movie.enableControls(['record','play','save','delete','cancel']);
               }
               break;
               case "playing":
               if(value) {
                   movie.enableControls(['stop','pause','cancel']);                   
               } else {
                   movie.enableControls(['record','play','save','delete','cancel']);
               }
           };
           movie.trigger(event.property+".videoIO.property", event.newValue);
        };
        window.callMethod = function(inputName) {
            console.log("callMethod", inputName);
        };
        window.onCallback = function(event) {
            console.log("onCallback", event);
        };
        window.onPostingNotify = function(event) {
            console.log("onPostingNotify", event);
        };
        window.onReceiveData = function(event) {
            console.log("onReceiveData", event);
        };
        window.onShowingSettings = function(event) {
            console.log("onShowingSettings", event);
        };
    };
    registerGlobalHandlers();

    var inspect = function(movie) {
      var props = {
        'preload':'boolean','autoplay':'boolean','loop':'boolean','controls':'boolean',
        'url':'string','play':'string','publish':'string','group':'string',
        'record':'boolean','live':'boolean','playing':'boolean','recording':'boolean','bidirection':'boolean',
        'microphone':'boolean','codec':'string','encodeQuality':'number', 'rate':'number',
        'framesPerPacket':'number','gain':'number','level':'number',
        'echoSuppression':'boolean', 'silenceLevel':'number', 'echoCancel':'boolean',
        'sound':'boolean','volume':'number',
        'camera':'boolean','cameraLoopback':'boolean','videoCodec':'string',
        'cameraWidth':'number','cameraHeight':'number',
        'cameraFPS':'number','keyFrameInterval':'number','cameraQuality':'number',
        'privacyEvent':'boolean','deviceAllowed':'boolean', 'detectActivity':'boolean',
        'display':'boolean','videoWidth':'number','videoHeight':'number','currentFPS':'number',
        'cameraBandwidth':'number','mirrored':'boolean','zoom':'string','smoothing':'boolean',
        'enableFullscreen':'boolean','fullscreen':'boolean',
        'currentTime':'number','duration':'number','bytesLoaded':'number','bytesTotal':'number','playerState':'string',
        'quality':'number', 'bandwidth':'number', 'bufferTime':'number', 'bufferTimeMax':'number'
      };
      var data = {};
      
      for (var name in props) {
          data.name = movie.getProperty(name);
      }
      console.log(data);
    };
    var init = function (movie, options) {
            console.log("Juhuu, the flash is ready!!!!");
            movies[movie.attr('id')] = movie;
            $.each(options, function (property, value) {
                if (property !== 'defaults') {
                    movie[0].setProperty(property, value);
                } else {
                    movie.defaults = value;
                }
            });
            console.log("setting parameters");
        };
    var initControls = function (movie) {
        console.log("initControls");
        if(movie.enableControls === undefined) {
            movie.enableControls = function(enableArray) {
                $.each(movie.controls, 
                       function(key,element){
                           if($.inArray(key, enableArray)>-1){
                               element.removeAttr('disabled');
                           }else{
                               element.attr('disabled','disabled');
                           }
                       });
            };
        }
        movie.propertyElements.each(
            function(index){
                var el = $(this);
                var type = el.data("videoioProperty");
                if(movie.propertyElements === undefined) {
                    movie.propertyElements = {};
                }
                if(movie.propertyElements[type] === undefined) {
                    movie.propertyElements[type] = [];
                }
                movie.propertyElements[type].push(el);
            });
        
        movie.actionElements.each(
            function (index) {
                var el = $(this);
                var type = el.data("videoio");
                if(movie.controls === undefined) {
                    movie.controls = {};
                }
                movie.controls[type] = el;
                switch (type) {
                case "play":
                    el.click(
                        function (e) {
                            console.log("play", movie.defaults.baseUrl + "?play=" + movie.defaults.filename);
                            movie[0].setProperty("src", null);
                            movie[0].setProperty("src", movie.defaults.baseUrl + "?play=" + movie.defaults.filename);
                            movie[0].setProperty('currentTime',0);
                            movie[0].setProperty('paying',true);
                        });
                    break;
                case "record":
                    el.click(
                        function (e) {
                            console.log("record", movie.defaults.baseUrl + "?publish=" + movie.defaults.filename + "&record=true");
                            movie[0].setProperty("src", movie.defaults.baseUrl + "?publish=" + movie.defaults.filename + "&record=true");
                        });
                    break;
                case "stop":
                    el.click(
                        function (e) {
                            console.log("stop", null);
                            movie[0].setProperty("src", null);
                            movie[0].setProperty("live", true);
                        });
                    break;
                case "save":
                    el.click(
                        function(event){
                            if(typeof movie.defaults.onComplete === 'function') {
                                var streamUrl = movie.defaults.streamBaseUrl + movie.defaults.filename +".flv";
                                console.log("save",streamUrl);
                                movie.defaults.onComplete(streamUrl);
                            }
                        });
                    break;
                case "cancel":
                    el.click(
                        function(event){
                            if(typeof movie.defaults.onCancel === 'function') {
                                console.log("cancel");
                                movie[0].setProperty("src", null);
                                movie[0].setProperty("live", true);
                                movie.defaults.onCancel();
                            }                            
                        });
                };
                console.log("found type: " + type);
            });
    };
     
     $.fn.videoIOSetup = function (options) {
         if (options === undefined) {
             options = {};
         }
         console.log("Welcome to the VideoIO Controls");
         // ok, lets find the configuration
         this.actionElements = $("button[data-videoio]");
         this.propertyElements = $("*[data-videoio-property]");
         // lets wait until the object is ready
         var movie = this;
         var checkForReadyness = setInterval(
             function () {
                 if (typeof movie[0].setProperty === 'function') {
                     clearInterval(checkForReadyness);
                     init(movie, options);
                     initControls(movie);
                 } else {
                     console.log("not ready yet");
                 }
             }, 100);
     };
     // 
 })(jQuery);
