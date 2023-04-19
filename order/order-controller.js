app.controller('order-controller', function($scope, $http, $window, $route){
    $scope.order = []
    $scope.selectedStatus={}
    
    $scope.nameStatus = [
        {name:'Processed',id:1},
        {name:'Order received',id:2}, 
        {name:'Shipping',id:3},
        {name:'Order Shipped',id:4},
        {name:'Finished Order',id:5},
    ]

    $scope.orderDetail = {
        items: [],
        order: {},
        address: {},
        coupon: {},
        getDetailOrder(order) {
            $http.get(`http://localhost:8080/rest/orderDetail/getAllByOrderId/${order.id}`).then(resp =>{
                this.items = resp.data
                console.log("item:", resp.data )
            })
            $http.get(`http://localhost:8080/rest/order/findById/${order.id}`).then(resp =>{
                resp.data.shippedDate = moment(new Date(resp.data.shippedDate)).fromNow();
                resp.data.orderDate = moment(new Date(resp.data.orderDate)).fromNow();
                this.order = angular.copy(resp.data)
            })
            $http.get(`http://localhost:8080/rest/customerPhoneAddress/findById/${order.customerPhoneAddress.id}`).then(resp =>{
                this.address = resp.data
            }).catch(err => console.log("Error CustomerPhoneAddress: ", err))

            $http.get(`http://localhost:8080/rest/coupon/findById/${order.coupon.id}`).then(resp =>{
                this.coupon = resp.data
            }).catch(err => console.log("Error coupon: ", err))
        },
        get amount() {
            const totalAmount = this.items.reduce((total, item) => {
              return total + (item.quantity * item.newPrice);
            }, 0);
            
            return totalAmount;
          }
          
    }

    $scope.initialize = function(){
        let accessToken = sessionStorage.getItem('accessToken')
        if(accessToken == null) {
            location.href = "#!/security/login"
        }
        
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