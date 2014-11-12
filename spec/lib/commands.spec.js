'use strict';

var Commands = source('commands');

describe("Commands", function() {
  it('exports an array of SalesForce commands', function() {
    expect(Commands).to.be.an('array');

    Commands.forEach(function(command) {
      expect(command).to.be.a('string');
    });
  });
});
