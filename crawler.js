require("chromedriver");
const webdriver = require("selenium-webdriver");
const Selectors = require("./constants").SELECTORS;
const By = webdriver.By;
async function crawler(url) {
  let browser;
  try {
    url = url.toLowerCase().trim();
    browser = await new webdriver.Builder().forBrowser("chrome").build();
    await browser.get(url);
    let reviews = [];
    let reviewTab = await browser.findElement(
      By.css(Selectors.reviewTabSelector)
    );
    if (reviewTab) {
      await reviewTab.click();
      let rwDivs = await browser.findElements(By.css(Selectors.reviewDivs));

      while (rwDivs.length > 0) {
        const rwDiv = rwDivs.shift();
        const rating = await (await rwDiv.findElement(
          By.css(".itemReview > dd:nth-of-type(1) > .itemRating")
        )).getText();
        const comment = await (await rwDiv.findElement(By.css("p"))).getText();
        const reviewer = await (await rwDiv.findElement(
          By.css(".reviewer > dd:nth-of-type(1)")
        )).getText();
        const date = await (await rwDiv.findElement(
          By.css(".reviewer > dd:nth-of-type(2)")
        )).getText();
        reviews.push({ rating, comment, reviewer, date });
      }
    }
    await browser.quit();
    return reviews;
  } catch (error) {
    if (browser) {
      await browser.quit();
    }
    throw error;
  }
}

module.exports = crawler;
