var multipleCardCarousel = document.querySelector(
  ".products-slider #carouselExampleControls"
);
if (window.matchMedia("(min-width: 768px)").matches) {
  var carousel = new bootstrap.Carousel(multipleCardCarousel, {
    interval: false,
  });
  var carouselWidth = $(".products-slider .carousel-inner")[0].scrollWidth;
  var cardWidth = $(".products-slider .carousel-item").width();
  var scrollPosition = 0;
  $(".products-slider .carousel-control-next").on("click", function () {
    if (scrollPosition < carouselWidth - cardWidth * 4) {
      scrollPosition += cardWidth;

      $(".products-slider .carousel-inner").animate(
        { scrollLeft: scrollPosition },
        600
      );
    }
  });
  $(".products-slider .carousel-control-prev").on("click", function () {
    if (scrollPosition > 0) {
      scrollPosition -= cardWidth;
      $(".products-slider .carousel-inner").animate(
        { scrollLeft: scrollPosition },
        600
      );
    }
  });
} else {
  $(multipleCardCarousel).addClass("slide");
}
