import puppeteer from "puppeteer";

export const scrapeFollowers = async (username, sessionId) => {
    try {
        if(sessionId){
            const browser = await puppeteer.launch({headless: true})   
            const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    
            let page = await browser.newPage()
    
            await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'domcontentloaded' })
    
            const client = await page.createCDPSession();
            await client.send('Network.enable');
            await client.send('Network.setCookie', {
                name: 'sessionid',
                value: sessionId,
                domain: '.instagram.com',
                httpOnly: true,
                secure: true,
            });
            
            await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle2' })
    
            const followerButton = await page.$$("ul li a")
            await followerButton[0].click()
            
            // Wait for followers popup
            const dialogSelector = 'div[role="dialog"] .xyi19xy';
            await page.waitForSelector(dialogSelector);
    
            // lets wait for the dialog box to open
            await sleep(1500);
    
            console.log("Scroll Started");
            
    
            // Scroll the modal to load more followers
            let previousHeight = 0;
            let sameHeightCount = 0;
    
            while (sameHeightCount < 3) {
                const currentHeight = await page.evaluate(sel => {
                    const scrollBox = document.querySelector(sel);
                    scrollBox.scrollTop = scrollBox.scrollHeight;
                    return scrollBox.scrollHeight;
                }, dialogSelector);
    
                if (currentHeight === previousHeight) {
                    sameHeightCount++;
                } else {
                    sameHeightCount = 0;
                    previousHeight = currentHeight;
                }
    
                await sleep(1500);
            }        
    
            const usernames = await page.evaluate(()=>{
                const usernameElements = document.querySelectorAll('div[role="dialog"] a.notranslate');
                return Array.from(usernameElements).map(link => link.textContent.trim());
            })
    
            browser.close()
    
            return usernames;
        }else{
            return false

        }

    
    } catch (error) {
        console.log(error);
    }
}