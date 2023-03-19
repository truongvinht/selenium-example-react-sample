// userProfile.js
// Selenium Test for User Profile.
// ==================

const { By, Key, Builder, until } = require("selenium-webdriver");
const assert =require('assert');

class UserProfile {

    constructor(website) {
        this.url = `${website}/user-profile`;
    }

    async checkTitleIn(browser) {
        //To wait for browser to build and launch properly
        let driver = await new Builder().forBrowser(browser).build();
        try {
            await driver.get(this.url);

            //Verify the page title and print it
            var title = await driver.getTitle();
            assert.equal(title, 'Variantenpflege');
        } finally {
            //It is always a safe practice to quit the browser after execution
            await driver.quit();
        }
    }
    async createEntry(browser) {

        //To wait for browser to build and launch properly
        let driver = await new Builder().forBrowser(browser).build();

        try {
            await driver.get(this.url);

            const rootNode = await driver.findElement(By.id('root'));
            const containerNode = await rootNode.findElement(By.id('app-container'));
            const formNode = await containerNode.findElement(By.css('form'));
            const gridRowNode = await formNode.findElement(By.css('groupui-grid-row'));
            
            // aggrid before
            let rowElements = await containerNode.findElements(By.css('.ag-row'));
            let numRows = rowElements.length;

            assert.equal(numRows, 1);

            // all grid items
            const gridColNodes = await gridRowNode.findElements(By.css('groupui-grid-col'));

            await this.sendInputKeys(driver, gridColNodes, 'Vorname', 'Max');
            await this.sendInputKeys(driver, gridColNodes, 'Nachname', 'Mustermann');
            await this.sendInputKeys(driver, gridColNodes, 'Geburtsdatum', '24.12.2000');
            await this.sendInputKeys(driver, gridColNodes, 'Email', 'test@test.test');
            await this.sendAreaKeys(driver, gridColNodes, 'Beschreibung', 'Neuer Kollege fuer die Tests.');


            // button for save
            const saveButton = await driver.findElement(By.xpath("//*[@id='app-container']/form/div[1]/groupui-button[1]"));
            await saveButton.click();

            // dismiss alert
            await driver.wait(until.alertIsPresent());
            await driver.switchTo().alert().dismiss();
            await driver.switchTo().defaultContent();

            // validate entry numbers
            rowElements = await containerNode.findElements(By.css('.ag-row'));
            numRows = rowElements.length;

            //console.log(`Number of rows: ${numRows}`);
            assert.equal(numRows, 2);
        } finally {
            //It is always a safe practice to quit the browser after execution
            await driver.quit();
        }
    }

    async findChildInputByLabel(list, label) {
        for (let node of list) {
            // input
            try{
                const inputElement = await node.findElement(By.css('groupui-input'));
                const spanElement = await inputElement.findElement(By.css('span'));
                const elementTitle = await spanElement.getAttribute('textContent');

                if (label === elementTitle) {
                    return inputElement;
                }
                // console.log(elementTitle)
            }catch(ex) {
                // ignore error
            }

            // textarea
            try{
                const inputElement = await node.findElement(By.css('groupui-textarea'));
                const spanElement = await inputElement.findElement(By.css('span'));
                const elementTitle = await spanElement.getAttribute('textContent');

                if (label === elementTitle) {
                    return inputElement;
                }
                // console.log(elementTitle)
            }catch(ex) {
                // ignore error
            }
        }
    }

    async sendInputKeys(driver, list, label, value) {
        const field = await this.findChildInputByLabel(list, label);

        driver.executeScript("arguments[0].value = '';", field)

        const shadowRoot = await driver.executeScript('return arguments[0].shadowRoot', field);
        const shadowElement = await shadowRoot.findElement(By.css('div'));

        const wrapper = await shadowElement.findElement(By.id("input-wrapper"));
        const other = await wrapper.findElement(By.css("input"));
        other.sendKeys(value);
    }

    async sendAreaKeys(driver, list, label, value) {
        const field = await this.findChildInputByLabel(list, label);

        driver.executeScript("arguments[0].value = '';", field)

        const shadowRoot = await driver.executeScript('return arguments[0].shadowRoot', field);
        const shadowElement = await shadowRoot.findElement(By.css('div'));

        const wrapper = await shadowElement.findElement(By.id("input-wrapper"));
        const other = await wrapper.findElement(By.css("textarea"));
        other.sendKeys(value);
    }
};

module.exports = UserProfile;