const express = require("express");
const constants = require("./constants");
const Crawler = require("./crawler");

const app = express();
const port = 3000;

app.set("json spaces", 4);

app.get("/", (req, res) =>
  res.send(
    "API: /reviews?link={validLink} \n" +
      "Example, localhost:3000/reviews?link=http://www.tigerdirect.com/applications/searchtools/item-details.asp?edpno=3415697"
  )
);

app.get("/reviews", async (req, res, next) => {
  const queryLink = req.query.link
    ? decodeURIComponent(req.query.link.toLowerCase())
    : "";
  if (constants.REVIEW_LINK_REGEX.exec(queryLink.trim())) {
    try {
      console.log("Fetching review data...");
      const data = await Crawler(queryLink);
      console.log("Review data fetched...");
      res.json({ reviews: data });
    } catch (err) {
      console.log("Oops! Looks like we have a bug!" + err);
      res
        .status(500)
        .json(getErrorResponse(constants.ERROR_MESSAGES.SOMETHING_WENT_WRONG));
    }
  } else {
    res
      .status(500)
      .json(getErrorResponse(constants.ERROR_MESSAGES.INVALID_LINK));
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function getErrorResponse(err) {
  return {
    error: err
  };
}
