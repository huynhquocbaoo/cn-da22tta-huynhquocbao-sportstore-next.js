import fetch from 'node-fetch';

async function testProductsAPI() {
  try {
    console.log('Testing products API...');
    
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    
    console.log('📦 Products from API:');
    data.products.forEach(product => {
      console.log(`  ${product.name} (ID: ${product.id})`);
      console.log(`  Average Rating: ${product.average_rating || 'undefined'}`);
      console.log(`  Total Reviews: ${product.total_reviews || 'undefined'}`);
      console.log('  ---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testProductsAPI();
