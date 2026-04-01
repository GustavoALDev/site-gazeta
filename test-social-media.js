// Test script to verify the convertEmptyStringsToNull function
function convertEmptyStringsToNull(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const converted = { ...obj };
  
  Object.keys(converted).forEach(key => {
    if (converted[key] === '') {
      converted[key] = null;
    }
  });

  return converted;
}

// Test cases
const testCases = [
  {
    name: 'All empty strings',
    input: { instagram: '', facebook: '', youtube: '', whatsapp: '' },
    expected: { instagram: null, facebook: null, youtube: null, whatsapp: null }
  },
  {
    name: 'Mixed values',
    input: { instagram: 'https://instagram.com/test', facebook: '', youtube: null, whatsapp: '+5511999999999' },
    expected: { instagram: 'https://instagram.com/test', facebook: null, youtube: null, whatsapp: '+5511999999999' }
  },
  {
    name: 'All valid URLs',
    input: { instagram: 'https://instagram.com/test', facebook: 'https://facebook.com/test', youtube: 'https://youtube.com/test' },
    expected: { instagram: 'https://instagram.com/test', facebook: 'https://facebook.com/test', youtube: 'https://youtube.com/test' }
  },
  {
    name: 'Empty object',
    input: {},
    expected: {}
  }
];

testCases.forEach(testCase => {
  const result = convertEmptyStringsToNull(testCase.input);
  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
  
  console.log(`Test: ${testCase.name}`);
  console.log(`Input: ${JSON.stringify(testCase.input)}`);
  console.log(`Expected: ${JSON.stringify(testCase.expected)}`);
  console.log(`Result: ${JSON.stringify(result)}`);
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('---');
});
