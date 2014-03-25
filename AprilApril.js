var AprilApril = function(options){

    if(typeof options === 'object'){
        this.effects = {};
        for(var effect in options){
            if(options[effect] && this.effectTypes[effect]){
                this.effects[effect] = options[effect];
            }
        }
    }else{
        if(options in this.effectTypes){
            this.effect = options;
        }else{
            throw new Error('Effect name not recognized.');
        }
    }

};

AprilApril.prototype.effectTypes = {

    /**
     *   When the user's not looking, swap words around.
     */
    scrambleText: function(){
        var DELAY = 1000,
            paragraphs = [].slice.call(document.querySelectorAll('p'));

        var scrambler = function(){
            var randomParagraph = paragraphs[Math.round(Math.random() * (paragraphs.length - 1))],
            randomParagraphWords = randomParagraph.textContent.split(/\s/);

            if(!isElementInViewport(randomParagraph)){
                randomParagraph.textContent = switchRandomElements(randomParagraphWords).join(' ');
            }
        };

        var switchRandomElements = function(array){
            var firstRandomIndex = Math.round(Math.random() * (array.length - 1)),
            SecondRandomIndex = Math.round(Math.random() * (array.length - 1)),
            temp = array[firstRandomIndex];

            array[firstRandomIndex] = array[SecondRandomIndex];
            array[SecondRandomIndex] = temp;

            return array;
        };

        var isElementInViewport = function(el) {
            var rect = el.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
        };

        setInterval(scrambler, DELAY);
    },

    /**
     *   Grab all links on a page (that actually go somewhere) and swap their hrefs around.
     */
    scrambleLinks: function(){
        var links = [].slice.call(document.links),
            hrefs = [];

        var getRandomElement = function(array){
            var randomIndex = Math.round((Math.random() * (array.length - 1))),
            elementToReturn = array[randomIndex];

            array.splice(randomIndex, 1); //Gotta remove the element returned.

            return elementToReturn;
        };

        //Get all links from the page with an actual URL
        for(var i = 0, max = links.length; i < max; i++){
            var href = links[i].href;

            if(href !== window.location.href + '#' && href.match(/http/)){
                hrefs.push(href);
            }
        }

        //Set a new href for all links with an actual URL
        for(var i = 0, max = links.length; i < max; i++){
            var href = links[i].href;

            if(href !== window.location.href + '#' && href.match(/http/)){
                links[i].href = getRandomElement(hrefs);
            }
        }
    },

    /**
     *   Shrink the body element to 70% over the course of 30 minutes.
     */
    shrink: function(){
        var body = document.body,
            DURATION = '3600s',
            animPrefixes = ['webkitAnimation', 'MozAnimation', 'OAnimation', 'MSAnimation', 'animation'],
            keyframeRule = '@-webkit-keyframes shrink {100%{-webkit-transform: scale(.7);}}@-moz-keyframes shrink {100%{-moz-transform: scale(.7);}}@-o-keyframes shrink {100%{-o-transform: scale(.7);}}@keyframes shrink {100%{transform: scale(.7);}}';

        var injectCSS = function(css){
                var style = document.createElement('style');

                style.type = 'text/css';
                style.appendChild(document.createTextNode(css));
                document.getElementsByTagName('head')[0].appendChild(style);
        };

        injectCSS(keyframeRule);

        for(var i = 0; i < animPrefixes.length; i++){
            if([animPrefixes[i] + 'Duration'] in body.style){
                body.style[animPrefixes[i] + 'Duration'] = DURATION;
                body.style[animPrefixes[i] + 'FillMode'] = 'forwards';
                body.style[animPrefixes[i] + 'Name'] = 'shrink';
            }
        }
    },

    /**
     *   Replace all images on the page with random ones featuring kittens and Bill Murray.
     */
    replaceImages: function(){
        var images = document.querySelectorAll('img'),
            newImageBaseURLs = [
                'http://placekitten.com/',
                'http://www.fillmurray.com/',
                'http://www.nicenicejpg.com/',
                'http://www.placecage.com/',
                'http://www.stevensegallery.com/'];

        for(var i = 0, max = images.length; i < max; i++){
            var image  = images[i],
                width  = image.naturalWidth || image.clientWidth,
                height = image.naturalHeight || image.clientHeight;

            image.src = newImageBaseURLs[Math.round(Math.random() * (newImageBaseURLs.length - 1))] + width + '/' + height;
        }
    },

    sayPlease: function(){
        var links = [].slice.call(document.links),
            prompts = ['Say please.', 'My goodness, where are your manners? Say please.', 'Just say please. I can do this all day.', 'You\'re really not going to say it, are you?', 'OK, now you\'re just testing how many of these there are.', 'This is the last one. Say please.'],
            count = 0;

        for(var i = 0, max = links.length; i < max; i++){
            var link = links[i];

            link.addEventListener('click', function(e){
                e.preventDefault();

                var response = window.prompt(prompts[count]);

                if(response && response.toLowerCase() === 'please'){
                    window.location = this.href;
                }else{
                    if(count < prompts.length - 1){
                        count++;
                    }else{
                        count = 0;
                    }
                }

            }, false);
        }
    }
};

AprilApril.prototype.applyEffect = function(effect){
    this.effectTypes[effect].call();
};

AprilApril.prototype.fool = function(){
    if(this.effects){
        for(var effect in this.effects){
            this.applyEffect(effect);
        }
    }else{
        this.applyEffect(this.effect);
    }
};

