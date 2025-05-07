import puppeteer from "puppeteer"

export const sessionVerification = async (sessionId)=>{
    const browser = await puppeteer.launch({
        headless: true,
    })
    const page = await browser.newPage()

    try {
        await page.goto('https://www.instagram.com/accounts/edit/', { waitUntil: 'domcontentloaded' })

        const client = await page.createCDPSession();
        await client.send('Network.enable');
        await client.send('Network.setCookie', {
            name: 'sessionid',
            value: sessionId,
            domain: '.instagram.com',
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Lax'
        });
        
        await page.goto('https://www.instagram.com/accounts/edit/', { waitUntil: 'networkidle2' })

        const username = await page.evaluate(()=>{
            const input = document.querySelector("div .x1lliihq");
            return input ? input.textContent : null
        })
        

        await browser.close()

        if(username){
            return {valid: true, username}
        }else{
            return {valid: false}
        }

    } catch (error) {
        await browser.close();
        return { valid: false };
    }

}