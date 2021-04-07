const { TestScheduler } = require('@jest/core');
const { palindrome } = require('../utils/for_testing');

test('palindrome of luis' , () =>{
    const result = palindrome('luis')

    expect(result).toBe('siul')
})

test('palindrome of empty string', () => {
    const result = palindrome('')

   expect(result).toBe('')
})