export function initialize( /* application*/ ) {
  /* To support  Chromium > 48, since the same from the API below can be performed using getScreenCTM
  https://groups.google.com/forum/#!topic/jointjs/qIKIiJCEClI */

  /* Unfortunately the most recent beta version of chrome (48.0.2564.23) removes
  SVGElement.prototype.getTransformToElement which is used when creating edges.
   The motivation behind removing this feature can be found ('https://lists.w3.org/Archives/Public/www-svg/2015Aug/att-0009/SVGWG-F2F-minutes-20150824.html#item02')
   with the actual Google Chrome issue tracking this ("https://www.chromestatus.com/feature/5736166087196672") */
  if (!SVGElement.prototype.getTransformToElement) {
    SVGElement.prototype.getTransformToElement = function(toElement) {
      return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };
  }
}

export default {
  name: 'polyfill-svg',
  initialize
};
