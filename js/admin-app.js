const app = angular.module('adminApp', ['ngRoute', 'ngAnimate'])
app.controller('mainController', function($scope, $location, $window){
    $scope.username = sessionStorage.getItem('username')
    $scope.avatar = sessionStorage.getItem('avatar')

    $scope.logout = function(){
        sessionStorage.removeItem('username')
        $scope.username = ''
        $window.location.reload();
        location.href = "index.html"
    }

    $scope.isActive = function(url){
       return url === $location.path()
    }
})

app.config(function ($routeProvider){
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
        .when("/createFood", {
            templateUrl: "product/createFood.html?" + Math.random(),
            controller: "foods-controller"
        })
        .otherwise({
            templateUrl: "/404.html?" + Math.random(),
            controller: 'home-controller'
        })
})

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.factory('sessionInjector', function() {  
    var sessionInjector = {
        request: function(config) {
            config.headers['Authorization'] = 'Bearer '+ sessionStorage.getItem('accessToken');
            return config;
        }
    };
    return sessionInjector;
});

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
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
