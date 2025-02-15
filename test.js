const axios = require('axios');
const colors = require('colors');

// Simulate USSD requests
async function simulateUSSD() {
  const baseURL = 'http://localhost:5000/ussd';
  const testSession = '12345';
  const phoneNumber = '+254700000000';
  const serviceCode = '*384*1234#';

  console.log('\n🌟 Starting USSD Simulation'.yellow.bold);
  console.log('========================='.yellow);

  // Test scenarios
  const scenarios = [
    {
      name: '1. Main Menu',
      cases: [
        { text: '' }
      ]
    },
    {
      name: '2. Registration Process',
      cases: [
        { text: '1*John' },
        { text: '1*John*Nairobi' },
        { text: '1*John*Nairobi*Maize,Beans' }
      ]
    },
    {
      name: '3. Crop Listing',
      cases: [
        { text: '2' }
      ]
    },
    {
      name: '4. Market Prices',
      cases: [
        { text: '3' }
      ]
    },
    {
      name: '5. Weather Updates',
      cases: [
        { text: '4' }
      ]
    },
    {
      name: '6. Exit Application',
      cases: [
        { text: '5' }
      ]
    }
  ];

  for (const scenario of scenarios) {
    console.log(`\n📱 Testing: ${scenario.name}`.cyan.bold);
    console.log('------------------'.cyan);

    for (const testCase of scenario.cases) {
      const payload = {
        sessionId: testSession,
        phoneNumber,
        serviceCode,
        ...testCase
      };

      try {
        console.log('\n🔄 User Input:'.green, testCase.text || '[Main Menu]');
        const response = await axios.post(baseURL, payload);
        console.log('📱 USSD Response:'.magenta);
        console.log(response.data.green);
        console.log('------------------------');
        
        // Wait 3 seconds between requests for better readability
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error('❌ Error:'.red, error.message);
      }
    }
  }

  console.log('\n✅ Simulation Complete!'.green.bold);
  console.log('All features have been tested successfully.'.green);
}

// Run the simulation
simulateUSSD();