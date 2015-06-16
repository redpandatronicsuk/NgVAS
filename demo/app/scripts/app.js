'use strict';

/**
 * @ngdoc overview
 * @name ngVasApp
 * @description
 * # ngVasApp
 *
 * Main module of the application.
 */
 angular
 .module('ngVasApp', [
  'color.picker',
  'ngDropdowns'
  ]);


 angular
 .module('ngVasApp').run(function($rootScope, $interval, $compile) {
  $rootScope.customID = 'my-vas';
  $rootScope.customModel = 'myModel';
  $rootScope.lineHeight = 0.1;
  $rootScope.width = '100%';
  $rootScope.height = '40px';
  $rootScope.backgroundColor = 'whitesmoke';
  $rootScope.markerType = 'cross';
  $rootScope.markerTypes = ['cross', 'line', 'point', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right'];
  $rootScope.markerColor = 'black',
  $rootScope.enableDrag = true;
  $rootScope.disableAfterClick = false;
  $rootScope.numberOfClicks = 1;
  $rootScope.showResetButton = false;
  $rootScope.borderRadius = 0;
  $rootScope.initialColor = 'white';
  $rootScope.clickedColor = 'grey';
  	$rootScope.disableColor = 'darkgrey';// Remove color stuff and just set classes as states, that can be styled with CSS
    $rootScope.draggingColor = 'pink';
    $rootScope.padding = '40px';
    $rootScope.borderRadius = '50px';

    $rootScope.withLabels = true;
    $rootScope.showFeedback = true;
    $rootScope.minLabel = 'cold';
    $rootScope.maxLabel = 'hot';
    $rootScope.min = 0;
    $rootScope.max = 1;
    $rootScope.precision = 5;
    $rootScope.cms = 'cms';

    $rootScope.ddSelectOptions = [
    {
      text: 'Cross',
      value: 'cross'
    },
    {
      text: 'Line',
      value: 'line'
    },
    {
      text: 'Point',
      value: 'point'
    },
    {
      text: 'Arrow-Up',
      value: 'arrow-up'
    },
    {
      text: 'Arrow-Down',
      value: 'arrow-down'
    },
    {
      text: 'Arrow-Left',
      value: 'arrow-left'
    },
    {
      text: 'Arrow-Right',
      value: 'arrow-right'
    }
    ];

    $rootScope.ddSelectSelected = {
      text: 'Cross',
      value: 'cross'
    };

    $rootScope.handOffset = 0;
    $interval(function() {
      $rootScope.handOffset = (Math.random() - 0.3) * 350;
    },1000);

    $rootScope.updateCustom = function() {

      var cc = '<ng-vas ' + 
      'id="' + $rootScope.customID +
      '" ng-model="' + $rootScope.customModel +
      '" width="'+ $rootScope.width +
      '" height="' + $rootScope.height +
      '" line-height="' + $rootScope.lineHeight +
      '" marker-type="' + $rootScope.ddSelectSelected.value +
      '" marker-color="' + $rootScope.markerColor +
      '" min="' + $rootScope.min +
      '" max="' + $rootScope.max +
      '" cm-length="' + $rootScope.cms +
      '"></ng-vas>';

      $rootScope.customCode = '<div class="vas-grid"><div ng-show="withLabels" class="min-label">{{minLabel}}</div>' + cc + '<div ng-show="withLabels" class="max-label">{{maxLabel}}</div></div><div ng-show="showFeedback" style="text-align: center;" class="output"><h5>{{' + $rootScope.customModel + ' | number:precision}} <small ng-show="cms">({{' + $rootScope.cms + ' | number:precision}} cm)</small></h5></div>';

      if ($rootScope.withLabels) {
        $rootScope.customCodeDisplay = '<div class="vas-grid"><div class="min-label">' + $rootScope.minLabel + '</div>' +
        cc + '<div class="max-label">' + $rootScope.maxLabel + '</div></div>';
      } else {
        $rootScope.customCode = cc;
        $rootScope.customCodeDisplay = cc;
      }

      if ($rootScope.showFeedback) {
        $rootScope.customCodeDisplay = $rootScope.customCodeDisplay +
        '<div style="text-align: center;" class="output"><h5>{{' + $rootScope.customModel + ' | number:' + $rootScope.precision + '}} <small ng-show="cms">({{' + $rootScope.cms + ' | number:' + $rootScope.precision + '}} cm)</small></h5></div>';
      }
      angular.element('#custom-output').html($compile($rootScope.customCode)($rootScope));
    };
  }); 
