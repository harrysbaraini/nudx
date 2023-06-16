"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@oclif/test");
describe('hooks', () => {
    test_1.test
        .stdout()
        .hook('init', { id: 'mycommand' })
        .do(output => (0, test_1.expect)(output.stdout).to.contain('example hook running mycommand'))
        .it('shows a message');
});
