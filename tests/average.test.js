const mongoose = require('mongoose');
const { server } = require('../index')
const { average } = require('../utils/for_testing');

describe.skip('average' , () =>{
    test('of one value  is  the value itself' , () =>{
        expect(average([1])).toBe(1)
    })
})


afterAll(() =>{
    mongoose.connection.close();
    server.close();
})
