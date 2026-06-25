import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  console.log('Navigating to http://localhost:5174...');
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
  
  console.log('Waiting for initial load and GSAP animations...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Scrolling slowly to trigger ScrollTrigger animations...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  
  console.log('Scrolling back to top...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Taking full page screenshot...');
  await page.screenshot({ path: 'screenshot_fullpage.png', fullPage: true });
  console.log('Fullpage screenshot saved.');

  console.log('Taking individual section screenshots...');
  const sections = await page.$$('section');
  for (let i = 0; i < sections.length; i++) {
    try {
      await sections[i].screenshot({ path: `screenshot_section_${i + 1}.png` });
      console.log(`Saved screenshot of section ${i + 1}`);
    } catch (e) {
      console.log(`Error taking screenshot of section ${i + 1}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Browser closed. Done!');
})();
