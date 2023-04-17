app.controller('coupon-controller', function ($scope, $http, $window,$route) {
    $scope.form = {
        isDisplay: true,
        isFixed: true,
        createDate: new Date(),
        createBy: sessionStorage.getItem('username')
    }
    $scope.items = []

    $scope.message = ""
    $scope.error = ""

    $scope.coupon = {

        itemDelete: {},

        create(){
            let item = angular.copy($scope.form)
            
            console.log("item: ", item)
            $http.post(`http://localhost:8080/rest/coupon/create`, item).then(resp =>{
                $scope.items.push(resp.data)
                this.reset()
                console.log("category1", resp.data)
                $scope.message = "Create coupon successfully!"
            }).catch(err => {
                $scope.error = "Error create coupon!"
                console.log("create error:", err)
            })
            this.liveToastBtn()
        },
        update(){
            let item = angular.copy($scope.form)

            $http.put(`http://localhost:8080/rest/coupon/update`, item).then(resp =>{
                let index = $scope.items.findIndex(item => item.id == resp.data.id)
                $scope.items[index] = item
                this.reset()
                $scope.message = "Update coupon successfully!"
                $window.location.reset()
            }).catch(err => $scope.error = "Error coupon category!")
            this.liveToastBtn()
        },
        clickDelete(item){
            this.itemDelete = item
        },
        confirmDelete() {
            $http.delete(`http://localhost:8080/rest/coupon/delete/${this.itemDelete.id}`).then(resp =>{
                let index = $scope.items.findIndex(item => item.id == this.itemDelete.id)
                $scope.items.splice(index, 1)
                this.reset()
                $scope.message = "Delete coupon successfully!"
            }).catch(err => $scope.error = "Error coupon category!")
            this.liveToastBtn()
        },
        edit(coupon){
            this.reset()
            $scope.form= {}
            let item = {
                id: coupon.id,
                name: coupon.name,
                description: coupon.description,
                // isDisplay: coupon.isDisplay = 'Yes' ? true:false,
                isDisplay: coupon.isDisplay,
               
                createDate: coupon.createDate,
                
                createBy: coupon.user.username,

                percentCoupon: coupon.percentCoupon,
                // name: coupon.code,

                endDate: new Date(coupon.endDate), // can format

                amountMoneyCoupon: coupon.amountMoneyCoupon,
                isFixed: coupon.isFixed ,
                startDate: new Date(coupon.startDate),

                status: coupon.status,
                userLimit: coupon.userLimit

            }
            console.log("isDisplay: ", coupon.isDisplay)

            console.log('12',item)

            $scope.form = angular.copy(item)
        },
        reset(){
            $scope.form = {
                isDisplay: true,
                isFixed: true,
                createDate: new Date(),
                createBy: sessionStorage.getItem('username')
            }
            this.itemDelete = {}
            $scope.message = ""
            $scope.error = ""
        },
        liveToastBtn(){
            var lastMessage = document.querySelector('.toast:last-child');
            new window.bootstrap.Toast(lastMessage).show();
        }
    }

    $scope.pager = {
        page: 0,
        size: 10,
        get count(){
            return Math.ceil(1.0 * $scope.items.length / this.size)
        },
        get length(){
            return $scope.items.length
        },
        first(){
            this.page = 0
        },
        last(){
            this.page = this.count - 1
        },
        next() {
            this.page++
            if (this.page >= this.count)
                this.first()
        },
        prev() {
            this.page--
            if (this.page < 0)
                this.last()
        },
        incrementLimit(up) {
            if (up) {
              (this.page <= ($scope.items.length - this.size)) ? this.page += 10: this.page = 0;
            } else {
              this.page > 10 ? this.page -= 10 : this.page = 0;
        
            }
        }
    }

    $scope.initialize = function (){
        $http.get(`http://localhost:8080/rest/coupon/getAll`).then(resp =>{
            $scope.items = resp.data
        })
        // $http.get(`http://localhost:8080/rest/customer/getAll`).then(resp =>{
        //         $scope.customerCoupon.customer = resp.data
        // })
        $http.get(`http://localhost:8080/rest/customerCoupon/getAll`).then(resp => {
            $scope.customerCoupon.customerCoupon = resp.data
            })
    }
    $scope.initialize()
    $scope.openModal = function(form){
        $http.get(`http://localhost:8080/rest/customer/getAll`).then(resp =>{
                $scope.customer = resp.data
        })
        $http.get(`http://localhost:8080/rest/customerCoupon/getAll`).then(resp => {
            $scope.customerCoupon = resp.data
            })
        $scope.isChecked = function(cus){
            return $scope.customerCoupon.find(item => item.customer.email===cus.email && item.coupon.id===form.id)
        }
        $scope.customerCoupon_changed = function(cus){
            let checked = $scope.isChecked(cus)
            if(checked){
                $scope.delete_customerCoupon(cus,form)
            }else{
                $scope.add_customerCoupon(cus,form)
            }
        }
        $scope.delete_customerCoupon = function(cus,form){
            $http.delete(`http://localhost:8080/rest/customerCoupon/delete/${cus.email}/${form.id}`).then(resp => {
              console.log("delete ewvoke_customerCoupon success ")
              this.openModal(form)
            }).catch(err => {
                console.log("fail customerCoupon: ",err)
            })
            
        }
        $scope.add_customerCoupon = function(cus,form){
            let cusC = {
                        customerEmail: cus.email,
                        couponId: form.id,
                        createDate: new Date(),
                        status: cus.status
                        }
            $http.post(`http://localhost:8080/rest/customerCoupon/add`,cusC).then(resp => {
                $scope.customerCoupon.push(cusC)
                console.log("post customerCoupon success")
                this.openModal(form)
            }).catch(err => {
                console.log("fail grant_customerCoupon: ",err)
            })
        }
    }
    $scope.getDeletedCouponId = function() {
        // Lấy ID sản phẩm đã xóa từ biểu mẫu ẩn
        // return $scope.deletedCouponId;
        console.log("getDeletedCouponId: ",$scope.deletedCouponId)
    }
    $scope.load = function(){
        $route.reload();
    }
})

