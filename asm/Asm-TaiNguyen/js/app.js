const app = angular.module("myApp", ["ngRoute"]);
let cart = [];
user = JSON.parse(localStorage.getItem("userLogin")) || {};
cart = JSON.parse(localStorage.getItem("cart")) || {};

console.log("user user user", user);
function logout() {
  localStorage.removeItem("userLogin");
  localStorage.removeItem("cart");
}

app.config(function ($routeProvider) {
  $routeProvider.when("/trongnuoc", {
    templateUrl: "./dulichtrongnuoc.html",
    controller: "travelitemsinner",
  });
  $routeProvider.when("/nuocngoai", {
    templateUrl: "./dulichnuocngoai.html",
    controller: "travelitemsforeign",
  });
  $routeProvider.when("/home", {
    templateUrl: "./home.html",
    controller: "home",
  });
  $routeProvider.when("/contact", {
    templateUrl: "./contact.html",
  });
  $routeProvider
    .when("/tintuc", {
      templateUrl: "./detailsnew.html",
    })
    .when("/login", {
      templateUrl: "./login.html",
      controller: "auth",
    })
    .when("/signup", {
      templateUrl: "./signup.html",
      controller: "auth",
    })
    .when("/", {
      templateUrl: "./home.html",
      controller: "home",
    })
    .when("/profile", {
      templateUrl: "./profile.html",
    })
    .when("/detail/:id", {
      templateUrl: "./details.html",
      controller: "travelDetail",
    })
    .when("/navbar", {
      templateUrl: "./home.html",
      controller: "navbar",
    })
    .when("/cart/:username", {
      templateUrl: "./cart-product-detail.html",
      controller: "cart",
    });
});

app.controller("navbar", function ($scope, $rootScope, $location) {
  $rootScope.user = user;
  $scope.logout = function () {
    logout();
    $rootScope.user = {};
    user = {};
    console.log($rootScope.user);
    $location.path("/login");
  };
  if ($rootScope.isLogin) {
    $rootScope.isLogin = false;
    $location.path("/home");
  }
});

console.log("vao duoc day");
app.controller("home", function ($scope, $rootScope, $http, $location) {
  $rootScope.user = user;
  $rootScope.cart = cart;

  if (user && !cart) {
    $http
      .post("http://localhost:3000/cart", {
        username: $rootScope.user.username,
        travels: [],
      })
      .then((response) => {
        localStorage.setItem("cart", response.data[0]);
      });
  }
  if (!$rootScope.user.username) {
    console.log("tao da voa duoc day");
    $location.path("/login");
  }
  $scope.travel_hot = [];

  $http.get("http://localhost:3000/tours").then(function (response) {
    $scope.travel_hot = response.data;
    console.log($scope.travel_hot);
  });
});
app.controller(
  "travelitemsforeign",
  function ($scope, $rootScope, $location, $http) {
    if (!$rootScope.user.username) {
      $location.path("/login");
    }
    $scope.category = "all";
    $scope.sortType = "none";

    $scope.travel_hot = [];
    $scope.location = [];
    $scope.type_nation = "Việt Nam";
    $http.get("http://localhost:3000/tours").then(function (response) {
      console.log("tyiwrfoiwfe", $scope.type_nation);
      $scope.travel_hot = response.data.filter((item) => {
        console.log($scope.type_nation != item.name_nation);

        return item.name_nation != $scope.type_nation;
      });
      console.log("trasjfksjfsdf", $scope.travel_hot);
      $scope.location = response.data.filter(
        (item) => item.name_nation != $scope.type_nation
      );
      console.log($scope.travel_hot);
      $scope.begin = 0;
      console.log("length length", $scope.travel_hot.length);
      $scope.pageCount = Math.ceil($scope.travel_hot.length / 9);
    });
    $scope.travel_hot = $scope.travel_hot.sort((a, b) => a.price - b.price);
    $scope.orderBy = "asc";
    $scope.begin = 0;

    $scope.sort = function (type) {
      console.log("type: " + type);
      console.log(type === "asc");
      console.log(type === "desc");
      console.log(type === "default");

      switch (type) {
        case "asc":
          $scope.orderBy = "price";
          // $scope.travel_hot = $scope.travel_hot.sort((a, b) => a.price - b.price);
          // console.log("asc", $scope.travel_hot);
          break;
        case "desc":
          $scope.orderBy = "-price";
          // $scope.travel_hot = $scope.travel_hot.sort((a, b) => b.price - a.price);
          // console.log("desc", $scope.travel_hot);
          break;
        default:
          $scope.orderBy = "price";
      }
    };
    $scope.handleCategory = function (type) {
      console.log("type ", type);

      $http.get("http://localhost:3000/tours").then(function (response) {
        if (type === "all") {
          $scope.travel_hot = response.data.filter(
            (item) => item.name_nation != $scope.type_nation
          );
          return;
        }
        // $scope.travel_hot = response.data.filter(
        //   (item) => item.name_country == type
        // );
        $scope.travel_hot = response.data.filter(
          (item) =>
            item.name_nation != $scope.type_nation && item.name_country == type
        );
        console.log($scope.travel_hot);
      });
    };

    $scope.pageCurrent = 1;
    $scope.last = function () {
      $scope.begin = ($scope.pageCount - 1) * 9;
      $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
    };
    $scope.first = function () {
      $scope.begin = 0;
      $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
    };
    $scope.next = function () {
      if ($scope.begin < ($scope.pageCount - 1) * 9) {
        $scope.begin += 9;
        $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
      }
    };
    $scope.prev = function () {
      if ($scope.begin > 0) {
        $scope.begin -= 9;
        $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
      }
    };
  }
);

app.controller(
  "travelitemsinner",
  function ($scope, $rootScope, $location, $http) {
    if (!$rootScope.user.username) {
      $location.path("/login");
    }
    $scope.category = "all";
    $scope.sortType = "none";

    $scope.travel_hot = [];
    $scope.location = [];
    $scope.type_nation = "Việt Nam";
    $http.get("http://localhost:3000/tours").then(function (response) {
      console.log("tyiwrfoiwfe", $scope.type_nation);
      $scope.travel_hot = response.data.filter((item) => {
        console.log($scope.type_nation == item.name_nation);

        return item.name_nation == $scope.type_nation;
      });
      console.log("trasjfksjfsdf", $scope.travel_hot);
      $scope.location = response.data.filter(
        (item) => item.name_nation == $scope.type_nation
      );
      console.log($scope.travel_hot);
      $scope.begin = 0;
      console.log("length length", $scope.travel_hot.length);
      $scope.pageCount = Math.ceil($scope.travel_hot.length / 9);
    });
    $scope.travel_hot = $scope.travel_hot.sort((a, b) => a.price - b.price);
    $scope.orderBy = "asc";
    $scope.begin = 0;

    $scope.sort = function (type) {
      console.log("type: " + type);
      console.log(type === "asc");
      console.log(type === "desc");
      console.log(type === "default");

      switch (type) {
        case "asc":
          $scope.orderBy = "price";
          // $scope.travel_hot = $scope.travel_hot.sort((a, b) => a.price - b.price);
          // console.log("asc", $scope.travel_hot);
          break;
        case "desc":
          $scope.orderBy = "-price";
          // $scope.travel_hot = $scope.travel_hot.sort((a, b) => b.price - a.price);
          // console.log("desc", $scope.travel_hot);
          break;
        default:
          $scope.orderBy = "price";
      }
    };
    $scope.handleCategory = function (type) {
      console.log("type ", type);

      $http.get("http://localhost:3000/tours").then(function (response) {
        if (type === "all") {
          $scope.travel_hot = response.data.filter(
            (item) => item.name_nation == $scope.type_nation
          );
          return;
        }
        // $scope.travel_hot = response.data.filter(
        //   (item) => item.name_country == type
        // );
        $scope.travel_hot = response.data.filter(
          (item) =>
            item.name_nation == $scope.type_nation && item.name_country == type
        );
        console.log($scope.travel_hot);
      });
    };

    $scope.pageCurrent = 1;
    $scope.last = function () {
      $scope.begin = ($scope.pageCount - 1) * 9;
      $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
    };
    $scope.first = function () {
      $scope.begin = 0;
      $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
    };
    $scope.next = function () {
      if ($scope.begin < ($scope.pageCount - 1) * 9) {
        $scope.begin += 9;
        $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
      }
    };
    $scope.prev = function () {
      if ($scope.begin > 0) {
        $scope.begin -= 9;
        $scope.pageCurrent = Math.ceil($scope.begin / 9) + 1;
      }
    };
  }
);

// detail travel
app.controller(
  "travelDetail",
  function ($scope, $rootScope, $routeParams, $http, $location) {
    $rootScope.cart = JSON.parse(localStorage.getItem("cart"));

    $scope.travelDetail = undefined;

    $http
      .get(`http://localhost:3000/tours/${$routeParams.id}`)
      .then(function (response) {
        $scope.travelDetail = response.data;
        console.log($scope.travelDetail.images[0]);
      });

    $scope.addCart = function (travel, event) {
      console.log("vao add cart");
      console.log("root", $rootScope.cart);
      console.log("root", $rootScope.user);
      $http
        .get(`http://localhost:3000/cart/${$rootScope.cart.id}`)
        .then((response) => {
          $rootScope.cart = response.data[0];
        });

      if ($rootScope.cart.travels.some((item) => item.id == travel.id)) {
        $rootScope.cart.travels = $rootScope.cart.travels.map((item) => {
          if (item.id == travel.id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      } else {
        travel.quantity = 1;
        $rootScope.cart.travels.push(travel);
      }
      localStorage.setItem("cart", JSON.stringify($rootScope.cart));
      $http.put(
        `http://localhost:3000/cart/${$rootScope.cart.id}`,
        $rootScope.cart
      );
    };
  }
);

// authentication
app.controller(
  "auth",
  function ($scope, $rootScope, $routeParams, $http, $location) {
    console.log("vao lna thu n");
    $scope.checkbox = false;

    $scope.handleCheckbox = function () {
      $scope.checkbox = !$scope.checkbox;
    };
    $scope.getFileName = function (file) {
      console.log($scope.fileModel);
      console.log(file.files[0].name);
    };
    $scope.selectAvatar = function (index) {
      $scope.imagesAvatar.forEach(function (image, i) {
        image.isActive = i === index;
      });
      $scope.selectedImage = $scope.imagesAvatar[index];
    };

    $scope.imagesAvatar = [
      { src: "../images/avatar1.jpg", isActive: false },
      { src: "../images/avatar2.jpg", isActive: false },
    ];

    console.log($scope.getFileName);
    $scope.username = "";
    $scope.password = "";
    $scope.text_error = false;
    $scope.handleKeyPress = function () {
      this.text_error = false;
    };
    $scope.login = function () {
      $http
        .get(`http://localhost:3000/users?username=${$scope.username}`)
        .then(function (response) {
          if (!response.data || $scope.username == "") {
            $scope.text_error = true;
          } else {
            if (response.data[0].password == $scope.password) {
              console.log(response.data[0]);
              localStorage.setItem(
                "userLogin",
                JSON.stringify(response.data[0])
              );

              user = response.data[0];
              $rootScope.user = user;
              console.log("sjdfkjsdfuser", user);
              $http
                .get(`http://localhost:3000/cart`)
                .then(function (response) {
                  console.log("responsereponse", response);
                  data = response.data.filter(
                    (item) => item.user_username == user.username
                  );
                  console.log(data);
                  console.log("datadata ", Boolean(data));
                  console.log();
                  if (data.length == 0) {
                    $http
                      .post("http://localhost:3000/cart", {
                        id: $rootScope.user.username,
                        user_username: $rootScope.user.username,
                        travels: [],
                      })
                      .then((response) => {
                        $rootScope.cart = response.data[0];
                      });
                  } else {
                    $rootScope.cart = data[0];
                  }
                  localStorage.setItem("cart", JSON.stringify($rootScope.cart));
                  console.log("cart cart ", $rootScope.cart);
                })
                .catch(function (error) {
                  // $http.post("http://localhost:3000/cart", {
                  //   username: $rootScope.user.username,
                  //   travels: [],
                  // });
                });
              console.log("sfjksjfcart", $rootScope.cart);
              localStorage.setItem("cart", JSON.stringify($rootScope.cart));
              $rootScope.isLogin = true;
              $location.path("/navbar");
            } else {
              $scope.text_error = true;
            }
          }
        });
    };

    $scope.usernameRegister = "";
    $scope.passwordRegister = "";
    $scope.confirmPassword = "";
    $scope.firstName = "";
    $scope.lastName = "";

    // signup

    $scope.error_signup = {
      firstName: false,
      lastName: false,
      username: false,
      password: false,
      confirmPassword: false,
    };

    $scope.handleKeyPressSignup = function (type) {
      switch (type) {
        case "firstName":
          $scope.error_signup.firstName = false;
          break;
        case "lastName":
          $scope.error_signup.lastName = false;
          break;
        case "username":
          $scope.error_signup.username = false;
          break;
        case "password":
          $scope.error_signup.password = false;
          break;
        case "confirmPassword":
          $scope.error_signup.confirmPassword = false;
          break;
        default:
          // Trường hợp mặc định, nếu không khớp với bất kỳ case nào
          console.log("Unknown field type: ", type);
          break;
      }
    };
    $scope.gender = "name";

    $scope.firstAccess = true;
    $scope.register = function () {
      var avatarSrc = $scope.selectedImage ? $scope.selectedImage.src : "";
      $scope.error_signup = {
        firstName: false,
        lastName: false,
        username: false,
        password: false,
        confirmPassword: false,
      };
      console.log($scope.error_signup);
      $scope.firstAccess = false;
      error = false;
      if ($scope.usernameRegister == "") {
        error = true;
        $scope.error_signup.username = true;
      }
      console.log($scope.error_signup);
      if ($scope.passwordRegister == "") {
        error = true;
        $scope.error_signup.password = true;
      }
      if ($scope.confirmPassword != $scope.passwordRegister) {
        error = true;
        $scope.error_signup.confirmPassword = true;
      }
      if ($scope.lastName == "") {
        error = true;
        $scope.error_signup.lastName = true;
      }
      if ($scope.firstName == "") {
        error = true;
        $scope.error_signup.firstName = true;
      }

      if (!error) {
        // GET request để kiểm tra xem username đã tồn tại hay chưa
        $http
          .get(
            `http://localhost:3000/users?username=${$scope.usernameRegister}`
          )
          .then(function (response) {
            console.log(
              `http://localhost:3000/users?username=${$scope.usernameRegister}`
            );

            if (response.data.length != 0) {
              // Nếu username đã tồn tại, đặt cờ lỗi
              console.log(response.data);
              $scope.error_signup.username = true;
            } else {
              // Nếu username không tồn tại, thực hiện POST request để tạo người dùng mới
              if (!$scope.checkbox) {
                alert("Bạn phải chấp nhận điều khoản trước khi đăng ký");
                return;
              }
              $http
                .post("http://localhost:3000/users", {
                  username: $scope.usernameRegister,
                  password: $scope.passwordRegister,
                  firstName: $scope.firstName,
                  lastName: $scope.lastName,
                  avatar: avatarSrc,
                })
                .then(function (response) {
                  console.log("User registered successfully:", response.data);
                  // Chuyển hướng đến trang home sau khi đăng ký thành công
                  $location.path("/login");
                })
                .catch(function (error) {
                  console.error("Error during registration:", error);
                });
            }
          })
          .catch(function (error) {
            console.error("Error during GET request:", error);
          });
      }
    };
  }
);

app.controller(
  "cart",
  function ($scope, $rootScope, $location, $routeParams, $http) {
    if (!$rootScope.user.username) {
      console.log("tao da voa duoc day");
      $location.path("/login");
    }

    $scope.totalAmount = 0;
    $scope.quantityTotal = 0;
    $http
      .get(`http://localhost:3000/cart?user_username=${$routeParams.username}`)
      .then(function (response) {
        console.log(
          `http://localhost:3000/cart?user_username=${$routeParams.username}`
        );
        $scope.cartData = response.data[0];
        $rootScope.cart = $scope.cartData;
        $scope.cartData.travels.forEach((item) => {
          $scope.quantityTotal += item.quantity;
          $scope.totalAmount += item.quantity * item.price;
        });
      });

    $scope.handleQuantity = function (travel, type) {
      $scope.totalAmount = 0;
      $scope.quantityTotal = 0;
      if (type == "increase") {
        $rootScope.cart.travels = $rootScope.cart.travels.map((item) => {
          $scope.totalAmount += item.price * item.quantity;
          $scope.quantityTotal += item.quantity;

          if (item.id == travel.id) {
            console.log(item.quantity);
            return {
              ...item,
              quantity: (item.quantity += 1),
            };
          } else {
            return item;
          }
        });
        console.log($rootScope.cart.travels);
        $scope.cartData = $rootScope.cart;
        $http
          .put(
            `http://localhost:3000/cart/${$rootScope.cart.id}`,
            $rootScope.cart
          )
          .then((response) => {
            console.log("thanh cong thanh cong thanh cong");
          })
          .catch((error) => {
            console.log("that bai that bai");
          });
      } else if (type == "decrease") {
        console.log("vao decrease");
        $rootScope.cart.travels = $rootScope.cart.travels.map((item) => {
          $scope.totalAmount += item.price * item.quantity;
          $scope.quantityTotal += item.quantity;

          if (item.id == travel.id) {
            if (item.quantity <= 0) {
              return {
                ...item,
                quantity: 0,
              };
            } else {
              return {
                ...item,
                quantity: (item.quantity -= 1),
              };
            }
          } else {
            return item;
          }
        });
        $scope.cartData = $rootScope.cart;
        $http
          .put(
            `http://localhost:3000/cart/${$rootScope.cart.id}`,
            $rootScope.cart
          )
          .then((response) => {
            console.log("thanh cong thanh cong thanh cong");
          })
          .catch((error) => {
            console.log("that bai that bai");
          });
      }
    };

    $scope.removeCart = function (travel) {
      $rootScope.cart.travels = $rootScope.cart.travels.filter(
        (item) => item.id != travel.id
      );
      console.log($rootScope.cart);
      $scope.cartData = $rootScope.cart;
      localStorage.setItem("cart", JSON.stringify($scope.cartData));
      $http.put(
        `http://localhost:3000/cart/${$rootScope.cart.id}`,
        $rootScope.cart
      );
    };
    $scope.bookSticket = function () {
      $rootScope.cart.travels = [];

      $scope.cartData = $rootScope.cart;
      localStorage.setItem("cart", JSON.stringify($scope.cartData));
      $http.put(
        `http://localhost:3000/cart/${$rootScope.cart.id}`,
        $rootScope.cart
      );
    };
  }
);
