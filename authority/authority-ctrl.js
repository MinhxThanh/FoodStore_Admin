app.controller('authority-controller', function ($scope, $http, $location){
    $scope.roles = []
    $scope.admin = []
    $scope.authorities = []
    $scope.message = ""
    
    $scope.initialize = function () {
        $http.get('http://localhost:8080/rest/authority/getAllRoles').then(resp =>{
            $scope.roles = resp.data
        }).catch (err => console.log('Err', err))

        //load staff and directors (administrator)
        $http.get('http://localhost:8080/rest/authority/getAllUserAccounts').then(resp =>{
            $scope.admin = resp.data
        }).catch (err => console.log('Err', err))

        //load authorities of staffs and directors
        $http.get('http://localhost:8080/rest/authority/getAllUserRole').then(resp =>{
            $scope.authorities = resp.data
        }).catch (err => console.log('Err', err))

    }

    $scope.authority_of = function (acc, role) {
        if ($scope.authorities){
            return $scope.authorities.find(item => item.user.id == acc.id && item.role.id == role.id)
        }
    }

    $scope.authority_changed = function (acc, role) {
        let authority = $scope.authority_of(acc, role)
        if (authority){
            $scope.revoke_authority(authority)
        } else {
            authority = {user: acc, role: role}
            $scope.grant_authority(authority)
        }
    }
    
    $scope.grant_authority = function (authority) {
        $http.post('http://localhost:8080/rest/authority/createUserRole', authority).then(resp =>{
            $scope.authorities.push(resp.data)
            $scope.message = "Give authority success!"
            $scope.liveToastBtn()
        }).catch(err =>{
            console.log("Error", err)
        })
    }
    
    $scope.revoke_authority = function (authority) {
        $http.delete(`http://localhost:8080/rest/authority/deleteById/${authority.id}`, ).then(resp =>{
            let index = $scope.authorities.findIndex(item => item.id == authority.id)
            $scope.authorities.splice(index, 1)
            $scope.message = "Delete authority success!"
            $scope.liveToastBtn()
        }).catch(err =>{
            console.log("Error", err)
        })
    }
    $scope.liveToastBtn = function() {
        var lastMessage = document.querySelector('.toast:last-child');
        new window.bootstrap.Toast(lastMessage).show();
    }

    $scope.initialize();
})