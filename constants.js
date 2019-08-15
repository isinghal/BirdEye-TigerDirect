module.exports = {
  REVIEW_LINK_REGEX: /^http(s)?:\/\/www\.tigerdirect\.com\/applications\/searchtools\/item-details\.asp\?edpno=.*$/gm,
  ERROR_MESSAGES: {
    QUERY_NOT_PRESENT: "",
    INVALID_LINK: "Invalid URL",
    SOMETHING_WENT_WRONG: "Something Went Wrong! Please try again later."
  },
  SELECTORS: {
    reviewTabSelector: "#reviewtab > a",
    reviewDivs: "#CustomerReviewsBlock > #customerReviews > #customerReviews",
    paginationBtns:
      "#customerReviews > .reviewsPagination:nth-of-type(1) dd > a",
    nextBtnSelector:
      "#customerReviews > .reviewsPagination:nth-of-type(1) dd > a",
    nextBtnSelector2:
      "#customerReviews > .reviewsPagination:nth-of-type(1) dd > a:nth-of-type(2)",
    paginationTotal:
      "#CustomerReviewsBlock .reviewsPagination:nth-of-type(1) .reviewPage dt"
  }
};
