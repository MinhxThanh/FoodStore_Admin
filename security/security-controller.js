app.controller('security-controller', function ($scope, $http, $window) {
    $scope.message = ""
    $scope.error = ""
    $scope.login = {
        loginInfo: {},
        loginAccount(){
            console.log("user", this.loginInfo)
            $http.post(`http://localhost:8080/rest/auth/login`, this.loginInfo).then(async resp =>{
                sessionStorage.setItem('email', resp.data.email)
                sessionStorage.setItem('accessToken', resp.data.accessToken)
                sessionStorage.setItem('username', resp.data.username)
                sessionStorage.setItem('avatar', resp.data.avatar)
                sessionStorage.setItem('user', resp.data.user)
                $scope.message = "Login success!!"
                await $scope.sleep(1000)
                $window.location.reload();
            }).catch(err => {
                console.log("Err", err)
                $scope.error = "Wrong email or password!"
            })
        }
    }

    $scope.register = {
        isEmail: false,
        isUsername: false,
        item: {},
        registerController(){
            $http.post(`http://localhost:8080/rest/auth/register`, this.item).then(resp =>{
                $scope.message = "Register successfully!"
            }).catch(err => {
                console.log("Err", err)
                $scope.error = "Please enter correctly!"
            })
        },
        searchEmail(){
            $http.get(`http://localhost:8080/rest/user/searchByEmailOrUsername/${this.item.email}`).then(resp =>{
                if (resp.data.email != null) {
                    this.isEmail = true
                } else {
                    this.isEmail = false
                }
            }).catch(err => $scope.error = "Please enter email correctly!")
        },
        searchUsername(){
            $http.get(`http://localhost:8080/rest/user/searchByEmailOrUsername/${this.item.username}`).then(resp =>{
                if (resp.data.email != null) {
                    this.isUsername = true
                } else {
                    this.isUsername = false
                }
            }).catch(err => $scope.error = "Please enter username correctly!")
        }
    }


    $scope.sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})
