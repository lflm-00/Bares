
const { palindrome } = require('../utils/for_testing');

test.skip('palindrome of luis' , () =>{
    const result = palindrome('luis')

    expect(result).toBe('siul')
})

test.skip('palindrome of empty string', () => {
    const result = palindrome('')

   expect(result).toBe('')
})