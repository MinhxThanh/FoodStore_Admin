app.controller('order-controller', function($scope, $http, $window, $route){
    $scope.order = []
    $scope.selectedStatus={}
    
    $scope.nameStatus = [
        {name:'Đang xử lý',id:1},
        {name:'Đã nhận đơn',id:2}, 
        {name:'Đang vận chuyển',id:3},
        {name:'Đã giao hàng',id:4},
        {name:'Hủy đơn',id:5}
    ]
    $scope.initialize = function(){
        $http.get(`http://localhost:8080/rest/order/findAll`).then(resp => {
            $scope.order = resp.data
        })
        $http.get(`http://localhost:8080/rest/paymentmethod/findAll`).then(resp => {
            $scope.paymentmethod = resp.data
        })
    }
    $scope.reloadPage = function() {
        $route.reload();
      }
    $scope.updateStatus = function(selectedStatus,order){
        $http.put(`http://localhost:8080/rest/order/status/${selectedStatus.id}/${order.id}`, order).then(resp => {
            console.log("status change success: ", resp.data)
        }).catch(err => {
            console.log("fail status change: ", err)
        })
    }
    $scope.findById = function(order){
        $http.get(`http://localhost:8080/rest/order/findById/${order.id}`).then(resp => {
            $scope.byId = resp.data
        })
    }
    $scope.nameStatus_of = function (status,ca) {
        if(ca.id == status){
            return true
        }
    }
    $scope.pager = {
        page: 0,
        size: 5,
        get count(){
            return Math.ceil(1.0 * $scope.order.length / this.size)
        },
        get length(){
          return $scope.order.length
        },
        first(){
            this.page = 0
        },
        prev(){
            this.page--
            if (this.page < 0)
                this.last()
        },
        next(){
            this.page++
            if (this.page >= this.count)
                this.first()
        },
        last(){
            this.page = this.count - 1
        }
    }
    $scope.optionChanged = function(selectOption){
        if(selectOption == null){
            $scope.reloadPage()
        }else{
        $http.get(`http://localhost:8080/rest/order/findByPaymentmethodId/${selectOption.id}`).then(resp => {
            $scope.order = resp.data
            console.log("findByPaymentmethodId success ", resp.data)
        }).catch(err => {
            console.log("fail findByPaymentmethodId: ",err)
        })
        }
    }
    $scope.selectOrderDate = function(orderDate){
        if(orderDate == null){
            $scope.reloadPage()
        }else{
        $http.get(`http://localhost:8080/rest/order/findByOrderDate/${orderDate}`).then(resp => {
            $scope.order = resp.data
            console.log("findByOrderDate success ", resp.data)
        }).catch(err => {
            console.log("fail findByOrderDate: ",err)
        })
        }
    }
    $scope.selectShippedDate = function(shippedDate){
        if(shippedDate == null){
            $scope.reloadPage()
        }else{
        $http.get(`http://localhost:8080/rest/order/findByShippedDate/${shippedDate}`).then(resp => {
            $scope.order = resp.data
            console.log("findByShippedDate success ", resp.data)
        }).catch(err => {
            console.log("fail findByShippedDate: ",err)
        })
        }
    }
    $scope.initialize()
})