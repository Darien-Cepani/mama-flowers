import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser to capture modal component...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  console.log('Navigating to http://localhost:5174...');
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
  
  console.log('Waiting for preloader and GSAP entrance animations to complete...');
  await new Promise(resolve => setTimeout(resolve, 4500));
  
  // Scroll down slightly to ensure the product grid is loaded in view
  console.log('Scrolling down to the product exhibition grid...');
  await page.evaluate(() => {
    const el = document.getElementById('shop-section');
    if (el) el.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Taking screenshot of the improved Vogue Minimal product card grid...');
  await page.screenshot({ path: 'screenshot_vogue_cards_grid.png' });
  console.log('Saved screenshot_vogue_cards_grid.png');

  console.log('Clicking the first product card to trigger the Product Details Modal...');
  const cards = await page.$$('.product-grid-card');
  if (cards.length > 0) {
    await cards[0].click();
    console.log('Clicked card. Waiting for modal open transition...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Taking screenshot of the updated E-commerce-free Product Details Modal...');
    await page.screenshot({ path: 'screenshot_vogue_modal_component.png' });
    console.log('Saved screenshot_vogue_modal_component.png');
  } else {
    console.log('Error: No product cards found on the page!');
  }

  await browser.close();
  console.log('Capture done successfully!');
})();
