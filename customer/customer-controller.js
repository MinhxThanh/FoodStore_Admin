app.controller('customer-controller', function ($scope, $http, $window) {
    $scope.form = {
        isDisplay: true,
        gender: true,
        createDate: new Date(),
        createBy: sessionStorage.getItem('username')
    }
    $scope.items = []

    $scope.message = ""
    $scope.error = ""

    $scope.customer = {
        itemDelete: {},
        create() {
            let item = angular.copy($scope.form)
            console.log("item: ", item)
            $http.post(`http://localhost:8080/rest/customer/create`, item).then(resp => {
                //lấy id của customer vừa tạo=> tạo
                $scope.items.push(resp.data)
                this.reset()
                console.log("category1", resp.data)
                $scope.message = "Create customer successfully!"
            }).catch(err => {
                $scope.error = "Error create customer!"
                console.log("create error:", err)
            })
            this.liveToastBtn()
        },
        update() {
            let item = angular.copy($scope.form)

            $http.put(`http://localhost:8080/rest/customer/update`, item).then(resp => {
                let index = $scope.items.findIndex(item => item.id == resp.data.id)
                $scope.items[index] = item
                this.reset()
                $scope.message = "Update customer successfully!"
                $window.reset()
            }).catch(err => $scope.error = "Error customer update!")
            this.liveToastBtn()
        },
        clickDelete(item) {
            this.itemDelete = item
        },
        confirmDelete() {
            $http.delete(`http://localhost:8080/rest/customer/delete/${this.itemDelete.email}`).then(resp => {
                let index = $scope.items.findIndex(item => item.email == this.itemDelete.email)
                $scope.items.splice(index, 1)
                this.reset()
                $scope.message = "Delete customer successfully!"
            }).catch(err => $scope.error = "Error customer category!")
            this.liveToastBtn()
        },
        edit(customer) {
            this.reset()
            $scope.form = {}
            let item = {
                email: customer.email,
                createDate: new Date(customer.createDate), // can format
                avatar: customer.avatar,
                birthday: new Date(customer.birthday),
                firstName: customer.firstName,
                fullname: customer.fullname,
                lastName: customer.lastName,
                gender: customer.gender,

                isDisplay: customer.isDisplay,
                
                password: customer.password,
                rememberToken: customer.rememberToken,
                status: customer.status,
            }
            // console.log("isDisplay: ", customer.isDisplay)
            // console.log('12',item)
            $scope.form = angular.copy(item)
        },
        reset() {
            $scope.form = {
                isDisplay: true,
                isFixed: true,
                gender: true,
                createDate: new Date(),
                createBy: sessionStorage.getItem('username')
            }
            this.itemDelete = {}
            $scope.message = ""
            $scope.error = ""
        },
        liveToastBtn() {
            var lastMessage = document.querySelector('.toast:last-child');
            new window.bootstrap.Toast(lastMessage).show();
        }
    }

    $scope.pager = {
        page: 0,
        size: 10,
        get count() {
            return Math.ceil(1.0 * $scope.items.length / this.size)
        },
        get length() {
            return $scope.items.length
        },
        first() {
            this.page = 0
        },
        last() {
            this.page = this.count - 1
        },
        next() {
            this.incrementLimit(true)
        },
        prev() {
            this.incrementLimit(false)
        },
        incrementLimit(up) {
            if (up) {
                (this.page <= ($scope.items.length - this.size)) ? this.page += 10 : this.page = 0;
            } else {
                this.page > 10 ? this.page -= 10 : this.page = 0;

            }
        }
    }

    $scope.initialize = function () {
        $http.get(`http://localhost:8080/rest/customer/getAll`).then(resp => {
            $scope.items = resp.data
            console.log('list: ', resp.data)
        })

    }
    $scope.initialize()
})

