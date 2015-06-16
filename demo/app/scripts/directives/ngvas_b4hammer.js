'use strict';

/**
 * @ngdoc directive
 * @name ngVasApp.directive:NgVas
 * @description
 * # NgVas
 */
 var qq;
 angular.module('ngVasApp')
 .directive('ngVas', function ($compile) {
 	return {
 		template: '<div></div>',
 		restrict: 'E',
 		replace: true,
 		link: function postLink(scope, element, attrs) {
 			scope.opts = {
 				height: '40px',
 				width: '200px',
 				lineHeight: 3,
 				markerType: 'cross',
 				markerColor: 'blue'
 			};
 			scope.onClick = function($event) {
 				console.log('onclick',$event);
 				var normalisedClick = ($event.pointers[0].clientX - element.offset().left) / element.width();
 				console.log($event.clientX - element.offset().left, 'normalisedClick', normalisedClick);
      		//qq = $event;
      		var tmpw = angular.element($event.target.parentNode).children('.vas-marker').width();
      		angular.element($event.target.parentNode).children('.vas-marker').css('left', ($event.pointers[0].clientX - (element.offset().left + (tmpw/2)))+'px');
      		scope.markerPos = normalisedClick * 100;
      		scope.showMarker = true;
      	};
      	qq = element;
      	angular.extend(scope.opts, attrs);
      	element.css('height', scope.opts.height);
      	element.css('width', scope.opts.width);
      	element.css('background', 'red');
        //Append horizontal line and marker:
        if (scope.opts.markerType === 'cross') {
        	scope.makerStr = '<g stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line x1="{{markerPos-4}}" y1="1" x2="{{markerPos+4}}" y2="9"/><line x1="{{markerPos+4}}" y1="1" x2="{{markerPos-4}}" y2="9"/></g>';
        } else if (scope.opts.markerType === 'line') {
        	scope.makerStr = '<line stroke="' + scope.opts.markerColor + '" ng-show="showMarker" id="vas-line" x1="{{markerPos}}" y1="1" x2="{{markerPos}}" y2="9"/>';
        } else if (scope.opts.markerType === 'point') {
        	scope.makerStr = '<circle stroke="' + scope.opts.markerColor + '" ng-show="showMarker" cx="{{markerPos}}" cy="5" r="2""/>';
        } else if (scope.opts.markerType === 'arrow-down') {
        	scope.makerStr = '<g stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line x1="{{markerPos}}" y1="1" x2="{{markerPos}}" y2="5"/><line x1="{{markerPos-2}}" y1="3" x2="{{markerPos}}" y2="5"/><line x1="{{markerPos+2}}" y1="3" x2="{{markerPos}}" y2="5"/></g>';
        } else if (scope.opts.markerType === 'arrow-up') {
        	scope.makerStr = '<g stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line x1="{{markerPos}}" y1="9" x2="{{markerPos}}" y2="5"/><line x1="{{markerPos-2}}" y1="7" x2="{{markerPos}}" y2="5"/><line x1="{{markerPos+2}}" y1="7" x2="{{markerPos}}" y2="5"/></g>';
        } else if (scope.opts.markerType === 'arrow-left') {
        	scope.makerStr = '<g stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line x1="{{markerPos+4}}" y1="5" x2="{{markerPos}}" y2="5"/><line x1="{{2 + markerPos}}" y1="3" x2="{{markerPos}}" y2="5"/><line x1="{{2 + markerPos}}" y1="7" x2="{{markerPos}}" y2="5"/></g>';
        } else if (scope.opts.markerType === 'arrow-right') {
        	scope.makerStr = '<g stroke="' + scope.opts.markerColor + '" ng-show="showMarker"><line x1="{{markerPos-4}}" y1="5" x2="{{markerPos}}" y2="5"/><line x1="{{markerPos - 2}}" y1="3" x2="{{markerPos}}" y2="5"/><line x1="{{markerPos - 2}}" y1="7" x2="{{markerPos}}" y2="5"/></g>';
        }
        element.append($compile('<svg preserveAspectRatio="none" stroke="black" stroke-linecap="round" viewBox="0 0 100 10" style="width:100%;height:100%;' 
        	+ 'px;position:relative;background-clip: padding-box;">'
        	+ '<rect onmousedown="return false" id="vas-line-horz" style="cursor:pointer;" x="0" ng-attr-y="{{5 - opts.lineHeight/2}}" width="100" ng-attr-height="{{opts.lineHeight}}"/>'
        	+ scope.makerStr
        	+'</svg>')(scope));
        console.log('line-horz', element.children('svg').children('#vas-line-horz'));
        var mc = new Hammer(element.children('svg').children('#vas-line-horz')[0],{
        	preventDefault: true,
        	drag: true
        });
        mc.on('tap pan', function(ev){
        	console.log('hammer', ev);
        	var normalisedClick = Math.min(1, Math.max((ev.pointers[0].clientX - element.offset().left) / element.width(),0));
        	var tmpw = angular.element(ev.target.parentNode).children('.vas-marker').width();
        	angular.element(ev.target.parentNode).children('.vas-marker').css('left', (ev.pointers[0].clientX - (element.offset().left + (tmpw/2)))+'px');
        	scope.$apply(function() {
        		scope.markerPos = normalisedClick * 100;
        		scope.showMarker = true;
        	});
        });
    }
};
});