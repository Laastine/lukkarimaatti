describe('e2e test', function () {
    'use strict';

    var ptor;

    beforeEach(function () {
        ptor = protractor.getInstance();
        ptor.get('/');
    });

    it('Should do tricks', function () {

    });

});