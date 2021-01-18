const puppeteer = require('puppeteer');
const config = require('./config.json');

(async () => {
  //New Session   
  const browser = await puppeteer.launch({
        headless: false,
         ignoreHTTPSErrors: true,
         defaultViewport: null, 
         args: ['--start-maximized'],
         
         });


  //const context = browser.defaultBrowserContext();
  //context.overridePermissions('https://www.amazon.in/', []); --For Popups

   const page = await browser.newPage();
   
   //Defining Login Function
   async function Login() {

   qb_url='http://'+config.canvas.host+'.in/'
   console.log("qb_url is ", qb_url);
   //await page.goto(qb_url, {waitUntil: 'load'}); 
   await page.goto(qb_url, {timeout:120000} );
   console.log('FOUND!', page.url());
   await page.click('#nav-link-accountList');
   await page.waitForSelector('#ap_email');
   await page.type('#ap_email', config.canvas.email, {delay: 100});
   await page.click('.a-button-input');
   await page.waitForNavigation();
   await page.waitForSelector('#ap_password');
   await page.type('#ap_password', config.canvas.password, {delay: 100});
   await page.click('#auth-signin-button');
   await page.waitForNavigation();
   console.log('Succesfully Logged In as:', page.url());
   }
   //Definig Navigation function
    async function Navigate() {

    await page.waitForSelector('#nav-link-accountList');
    await page.click('#nav-link-accountList');
    // wait for element defined by XPath appear in page
    await page.waitForXPath("(//a[@class='ya-card__whole-card-link'])");
    console.log('Successfully navigated to Your Account!');
    // evaluate XPath expression of the target selector (it return array of ElementHandle)
    const elHandle = await page.$x("(//a[@class='ya-card__whole-card-link'])");  
    await elHandle[4].click();
    console.log('Successfully navigated to Payment Options!');
    await page.waitForNavigation();
    //for(let i=0;i<elHandle.length;i++){
    //   if(i==4){
    //     console.log("--------------------------");
    //     console.log(elHandle[i].getProperty("innerText"));
    //     console.log("********");
    //     console.log(elHandle[i]);
    //     console.log("--------------------------");
  }

    // Defining Payment Options Function
    
    async function Payment() {
      //Scroll to Add Payment Method
      await page.$eval('input[name="ppw-accountHolderName"]', 
      e => {e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' })})
     //Input card holder name
      await page.waitForSelector('input[name="ppw-accountHolderName"]');
      
      await page.type('input[name="ppw-accountHolderName"]', config.canvas.cardName, {delay: 100});
      
     //Input Card number
      await page.type('input[type="tel"]', config.canvas.cardNNumber, {delay: 100});
      
     //Input card date details
      await page.select('select[name="ppw-expirationDate_month"]', '2');
      await page.select('select[name="ppw-expirationDate_year"]', '2023');
      
      await page.click('.a-button-input');

      console.log("Successfully added your card details");

      }

    

  //Run this code
  try {
       await Login()
       await Navigate()
       await Payment()



   } catch(err) {

   console.log("Our error", err);

   }

  

  })();

   