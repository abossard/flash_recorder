(function ($) {
    var movies = {};
    $.fn.videoIOControlsDefaults = {};
    var registerGlobalHandlers = function() {
        window.onPropertyChange = function(event) {
           console.log(event.objectID + ": " + event.property + " = " + event.newValue);
           var propertyElement = movies[event.objectID].propertyElements[event.property];
           if(propertyElement) {
               $.each(propertyElement, 
                      function(index, element){
                          element.text(event.newValue);
                      });
           }
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
            movies[movie.id] = movie;
            $.each(options, function (property, value) {
                if (property !== 'defaults') {
                    movie.setProperty(property, value);
                } else {
                    movie.defaults = value;
                }
            });
            console.log("setting parameters");
        };
    var initControls = function (movie) {
            console.log("initControls");
            $("*[data-videoio-property]").each(
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
                    console.log(movie.propertyElements);
                });

            $("button[data-videoio]").each(function (index) {
                var el = $(this);
                var type = el.data("videoio");
                if(movie.controls === undefined) {
                    movie.controls = {};
                }
                movie.controls[type] = el;
                switch (type) {
                case "play":
                    el.click(function (e) {
                        console.log("play", movie.defaults.baseUrl + "?play=" + movie.defaults.filename);
                        movie.setProperty("src", movie.defaults.baseUrl + "?play=" + movie.defaults.filename);
                    });
                    break;
                case "record":
                    el.click(function (e) {
                        console.log("record", movie.defaults.baseUrl + "?publish=" + movie.defaults.filename + "&record=true");
                        movie.setProperty("src", movie.defaults.baseUrl + "?publish=" + movie.defaults.filename + "&record=true");
                    });
                    break;
                case "stop":
                    el.click(function (e) {
                        console.log("stop", null);
                        movie.setProperty("src", null);
                        movie.setProperty("live", true);
                    });
                    break;
                };
                console.log("found type: " + type);
            });
        };

    $.fn.videoIOControls = function (options) {
        if (options === undefined) {
            options = {};
        }
        console.log("Welcome to the VideoIO Controls");
        // ok, lets find the configuration
        this.inputElements = $("input [data-property]");
        this.actionElements = $("button [data-videoio]");
        this.outputElements = $(".property [data-property]");
        // lets wait until the object is ready
        var movie = this[0];
        var checkForReadyness = setInterval(function () {
            if (typeof movie.setProperty === 'function') {
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
