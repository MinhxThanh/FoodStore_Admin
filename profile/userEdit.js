app.controller('user-controller', function ($scope, $http, $window) {
    $scope.form = {};
    $scope.user = {};
    $scope.message = ""
    $scope.error = ""
        $scope.profile = [];

        $scope.imageUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
            $scope.imageChanged(files)
           
        }
    
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.img = e.target.result;            
            });
        }
    
        $scope.imageChanged = function (files){
            let dataImage = new FormData()
            dataImage.append('file', files[0])
            $http.post('http://localhost:8080/rest/upload/firebase', dataImage, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(resp =>{
                $scope.user.avatar = resp.data.name
                console.log("name image: ", resp.data.name)
                console.log("name image: ", $scope.form.image)
            }).catch(err =>{
                $scope.error = "The field file exceeds its maximum permitted size of 1048576 bytes!"
                console.log('Error', err)
            })
        }

        $scope.initialize = function (){
            var userId = sessionStorage.getItem("email");
            
            $http.get(`http://localhost:8080/rest/user/getUser/${userId}`).then(resp =>{
                resp.data.birthday = new Date(resp.data.birthday)
                $scope.user = resp.data;
                
                $scope.img = resp.data.avatar
                console.log('list: ', resp.data)
            }).catch(err => {
                $scope.error = "Fail to get!"
                
            })
    
        },
        $scope.update = function (){
          
            var user = angular.copy($scope.user)
            console.log(  " lỗi ava" , user)
            $http.put(`http://localhost:8080/rest/user/updateUser`, user).then(resp =>{
                resp.data.birthday = new Date(resp.data.birthday)
                $scope.user = resp.data;
                $scope.message = "Update user " + resp.data.username + " successful!"
                sessionStorage.setItem('avatar', resp.data.avatar)
                $scope.img = $scope.user.avatar
                this.liveToastBtn()
            }).catch(err => {
                $scope.error = "Fail to get!"
                alert("Error get: ", err)
            })
    
        }

        $scope.liveToastBtn = function(){
            var lastMessage = document.querySelector('.toast:last-child');
            new window.bootstrap.Toast(lastMessage).show();
        }

        $scope.initialize();
        $scope.edit = function() {
            $scope.form = angular.copy($scope.profile);
    
        }
}  

)