var expect = require('expect');
var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var res = generateMessage('Oluwatobi', 'How are you?');

        expect(res.from).toEqual('Oluwatobi');
        expect(res.text).toEqual('How are you?');
        expect(res.createdAt).toBeA("number");
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var res = generateLocationMessage('Admin', '40.7953745', '-73.5022512');

        expect(res.from).toEqual('Admin');
        expect(res.url).toEqual(`https://www.google.com/maps?q=40.7953745,-73.5022512`);
        expect(res.createdAt).toBeA("number");
    });
});