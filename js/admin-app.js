const app = angular.module('adminApp', ['ngRoute', 'ngAnimate'])
app.controller('mainController', function ($scope, $location, $window) {
    $scope.username = sessionStorage.getItem('username')
    $scope.avatar = sessionStorage.getItem('avatar')
    $scope.admin = sessionStorage.getItem('admin')

    $scope.logout = function () {
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('avatar')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('admin')
        $scope.username = ''
        $window.location.reload();
        location.href = "index.html"
    }
        $scope.isActive = function(url){
        return url === $location.path()
    }
})

app.config(function ($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "home/index.html?" + Math.random(),
            controller: "home-controller"
        })
        .when("/security/login", {
            templateUrl: "security/login.html?" + Math.random(),
            controller: "security-controller"
        })
        .when("/security/register", {
            templateUrl: "security/register.html?" + Math.random(),
            controller: "security-controller"
        })
        .when("/security/forgot-password", {
            templateUrl: "security/forgot-password.html?" + Math.random(),
            controller: "security-controller"
        })
        .when("/category", {
            templateUrl: "category/index.html?" + Math.random(),
            controller: "category-controller"
        })
        .when("/coupon", {
            templateUrl: "coupon/index.html?" + Math.random(),
            controller: "coupon-controller"
        })
        .when("/authority", {
            templateUrl: "authority/index.html?" + Math.random(),
            controller: "authority-controller"
        })
        .when("/category", {
            templateUrl: "category/index.html?" + Math.random(),
            controller: "category-controller"
        })
        .when("/food", {
            templateUrl: "product/index.html?" + Math.random(),
            controller: "foods-controller"
        })
        .when("/edit", {
            templateUrl: "product/edit.html?" + Math.random(),
            controller: "foods-controller"
        })
        .when("/edit", {
            templateUrl: "product/edit.html?" + Math.random(),
            controller: "foods-controller"
        })
        .when("/createDiscount", {
            templateUrl: "discount/create.html?" + Math.random(),
            controller: "discount-controller"
        })
        .when("/edit", {
            templateUrl: "discount/edit.html?" + Math.random(),
            controller: "discount-controller"
        })
        .when("/discount", {
            templateUrl: "discount/index.html?" + Math.random(),
            controller: "discount-controller"
        })
        .when("/order", {
            templateUrl: "order/order.html?" + Math.random(),
            controller: "order-controller"
        })
        .when("/createFood", {
            templateUrl: "product/createFood.html?" + Math.random(),
            controller: "foods-controller"
        })
        .when("/blog", {
            templateUrl: "blog/index.html?" + Math.random(),
            controller: "blog-controller"
        })
        .when("/customer", {
            templateUrl: "customer/index.html?" + Math.random(),
            controller: "customer-controller"
        })
        .when("/review", {
            templateUrl: "review/index.html?" + Math.random(),
            controller: "review-controller"
        })
        .when("/report", {
            templateUrl: "report/index.html?" + Math.random(),
            controller: "report-controller"
        })
        .when("/user-profile", {
            templateUrl: "profile/index.html?" + Math.random(),
            controller: "user-controller"
        })
        .otherwise({
            templateUrl: "home/index.html?" + Math.random(),
            controller: 'home-controller'
        })
})

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.factory('sessionInjector', function () {
    var sessionInjector = {
        request: function (config) {
            config.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('accessToken');
            return config;
        }
    };
    return sessionInjector;
});

var compareTo = function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);

// app.config(['$httpProvider', function($httpProvider) {
//     if(localStorage.getItem('accessToken') != null)
//         $httpProvider.interceptors.push('sessionInjector');
// }]);
