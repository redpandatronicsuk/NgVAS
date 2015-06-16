(function (window, angular, undefined) {
  'use strict';

  var d = $('<div/>').css({ position: 'absolute', top : '-1cm', left : '-1cm', height : '1cm', width : '1cm' }).appendTo('body');
  var pxPerCm = d.height();
  d.remove();
  function px2cm(px) {
    return px / pxPerCm;
  }

/**
 * @ngdoc directive
 * @name ngVas.directive:NgVas
 * @description
 * # NgVas
 */
 angular.module('ngVas',[])
 .directive('ngVas', function ($compile) {
  return {
    template: '<div class="ng-vas" ng-class="clss"></div>',
    restrict: 'E',
    scope: {
      ngModel: '=',
      min: '=',
      max: '=',
      cmLength: '=?'
    },
    replace: true,
    link: function postLink(scope, element, attrs) {
            // Set default min and max if not given as attributes
            scope.opts = {
             height: '40px',
             width: '100%',
             lineHeight: 3,
             markerType: 'cross',
             markerColor: 'blue',
             min: 0,
             max: 100
           };
           scope.clss = {
            dragging: false,
            clicked: false
          };
          scope.cmLength = undefined;
          // scope.cmLength = '';
          angular.extend(scope.opts, attrs);
          element.css('height', scope.opts.height);
          element.css('width', scope.opts.width);
        //Append horizontal line and marker:
        if (scope.opts.markerType === 'cross') {
          scope.makerStr = '<g class="vas-mark" stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line ng-attr-x1="{{markerPos-4}}" y1="1" ng-attr-x2="{{markerPos+4}}" y2="9"/><line ng-attr-x1="{{markerPos+4}}" y1="1" ng-attr-x2="{{markerPos-4}}" y2="9"/></g>';
        } else if (scope.opts.markerType === 'line') {
          scope.makerStr = '<line class="vas-mark" stroke="' + scope.opts.markerColor + '" ng-show="showMarker" id="vas-line" x1="{{markerPos}}" y1="1" x2="{{markerPos}}" y2="9"/>';
        } else if (scope.opts.markerType === 'point') {
          scope.makerStr = '<circle class="vas-mark" stroke="' + scope.opts.markerColor + '" ng-show="showMarker" cx="{{markerPos}}" cy="5" r="2""/>';
        } else if (scope.opts.markerType === 'arrow-down') {
          scope.makerStr = '<g class="vas-mark" stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line ng-attr-x1="{{markerPos}}" y1="1" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{markerPos-2}}" y1="3" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{markerPos+2}}" y1="3" ng-attr-x2="{{markerPos}}" y2="5"/></g>';
        } else if (scope.opts.markerType === 'arrow-up') {
          scope.makerStr = '<g class="vas-mark" stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line ng-attr-x1="{{markerPos}}" y1="9" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{markerPos-2}}" y1="7" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{markerPos+2}}" y1="7" ng-attr-x2="{{markerPos}}" y2="5"/></g>';
        } else if (scope.opts.markerType === 'arrow-left') {
          scope.makerStr = '<g class="vas-mark" stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line ng-attr-x1="{{markerPos+4}}" y1="5" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{2 + markerPos}}" y1="3" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{2 + markerPos}}" y1="7" ng-attr-x2="{{markerPos}}" y2="5"/></g>';
        } else if (scope.opts.markerType === 'arrow-right') {
          scope.makerStr = '<g class="vas-mark" stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line ng-attr-x1="{{markerPos-4}}" y1="5" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{markerPos - 2}}" y1="3" ng-attr-x2="{{markerPos}}" y2="5"/><line ng-attr-x1="{{markerPos - 2}}" y1="7" ng-attr-x2="{{markerPos}}" y2="5"/></g>';
        }
        element.append($compile('<svg preserveAspectRatio="none" stroke="black" stroke-linecap="round" viewBox="0 0 100 10" style="width:100%;height:100%;'  +
          'px;position:relative;background-clip: padding-box;">' +
          '<rect onmousedown="return false" id="vas-line-horz" style="cursor:pointer;" x="0" ng-attr-y="{{5 - opts.lineHeight/2}}" width="100" ng-attr-height="{{opts.lineHeight}}"/>' +
          scope.makerStr +
          '</svg>')(scope));
        var mc = new Hammer(element.children('svg').children('#vas-line-horz')[0],{
          preventDefault: true,
          drag: true
        });
        var range = scope.opts.max - scope.opts.min;
        mc.on('tap pan panstart panend', function(ev){
          scope.clss.clicked = true;
          // Computed inner left offset (padding-left and left-border-width, margin is already part of offset)
          var tmpComputedStyle = getComputedStyle(ev.target.parentNode.parentNode);
          var leftInnerOffset = parseFloat(tmpComputedStyle.paddingLeft, 10) + parseFloat(tmpComputedStyle.borderLeftWidth, 10);
          var clickLengthInPixels = (ev.pointers[0].clientX - (element.offset().left + leftInnerOffset));
          var normalisedClick = Math.min(1, Math.max(clickLengthInPixels / element.width(),0));
          var tmpw = angular.element(ev.target.parentNode).children('.vas-marker').width();
          angular.element(ev.target.parentNode).children('.vas-marker').css('left', (ev.pointers[0].clientX - (element.offset().left + (tmpw/2)))+'px');
          scope.$apply(function() {
            scope.markerPos = normalisedClick * 100;
            scope.ngModel = normalisedClick * range + Number(scope.opts.min);
            scope.cmLength = px2cm(clickLengthInPixels);
            scope.showMarker = true;
            if (ev.type === 'panstart') {
              scope.clss.dragging = true;
            } else if (ev.type === 'panend') {
              scope.clss.dragging = false;
            }
          });
        });
}
};
});
})(window, window.angular);