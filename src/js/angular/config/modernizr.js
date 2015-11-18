/**
 * @ngInject
 */
function modernizr() {
    Modernizr.load([
    {
        test: Modernizr.mq('only all'),
        nope: 'http://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js'
    }
    ]);
}