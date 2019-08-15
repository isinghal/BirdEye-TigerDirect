const puppeteer = require("puppeteer");
const Selectors = require("./constants").SELECTORS;

/**
 * Async Generator Function which asynchronously iterates over Reviews
 * @returns  ReviewData JSON objects
 */
async function reviewsGenerator(page) {}

async function crawler(url) {
  try {
    url = url.toLowerCase().trim();
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let reviews = [];

    await page.goto(url);

    let reviewTab = await page.$(Selectors.reviewTabSelector);
    if (reviewTab) {
      await reviewTab.click();
      let rwDivs = await page.$$(Selectors.reviewDivs);

      while (rwDivs.length > 0) {
        const rwDiv = rwDivs.shift();
        const rating = await rwDiv.$eval(
          ".itemReview > dd:nth-of-type(1) > .itemRating",
          ratingDiv => ratingDiv.innerText
        );
        const comment = await rwDiv.$eval(
          "p",
          commentDiv => commentDiv.innerText
        );
        const reviewer = await rwDiv.$eval(
          ".reviewer > dd:nth-of-type(1)",
          commentDiv => commentDiv.innerText
        );
        const date = await rwDiv.$eval(
          ".reviewer > dd:nth-of-type(2)",
          commentDiv => commentDiv.innerText
        );

        reviews.push({ rating, comment, reviewer, date });

        if (rwDivs.length == 0) {
          const paginationBtns = await page.$$(Selectors.paginationBtns);
          if (paginationBtns.length > 0) {
            // Only if there are Previous/Next buttons in the DOM
            let nextBtnExists = false;
            for (const pageBtn of paginationBtns)
              if (
                (nextBtnExists = (await page.evaluate(
                  el => el.innerText,
                  pageBtn
                )).includes("Next"))
              )
                break;

            if (nextBtnExists) {
              // Only if next button exists in DOM
              const nextBtnSelector =
                paginationBtns.length == 1
                  ? Selectors.nextBtnSelector
                  : Selectors.nextBtnSelector2;
              // Click on next button
              try {
                await Promise.all([
                  page.waitForNavigation({ waitUntil: "networkidle2" }),
                  page.click(nextBtnSelector)
                ]);
                rwDivs = await page.$$(Selectors.reviewDivs);
              } catch (err) {
                throw new Error(
                  "Error encountered while clicking Next button. Aborting!"
                );
              }
            }
          }
        }
      }
    }

    await browser.close();
    return reviews;
  } catch (error) {
    throw error;
  }
}

module.exports = crawler;
