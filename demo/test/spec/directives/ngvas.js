'use strict';

describe('Directive: NgVas', function () {

  // load the directive's module
  beforeEach(module('ngVasApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-ng-vas></-ng-vas>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the NgVas directive');
  }));
});
