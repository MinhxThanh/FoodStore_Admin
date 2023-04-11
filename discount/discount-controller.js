app.controller('discount-controller', function ($scope, $http, $window, $route) {
    $scope.items = []
    $scope.item=[]
    $scope.getSelected={}
    $scope.form = {}
    $scope.food = []
    $scope.foodSelected = {}
    $scope.detailFood = []
    $scope.discountId = {}
    $scope.imageFoodId = {}
    $scope.imageByFoodId = {}
    $scope.percentPrice = ''
    $scope.listFood = {}
    $scope.foodById = {}
    $scope.foods = []
    $scope.foodIdById = {}
    $scope.foodDiscount = {}
    $scope.allDiscount = []
    $scope.discountIdCurrent = {}

    $scope.form = {
        fixed: true,
        display: true,
        createDate: new Date(),
        createBy: sessionStorage.getItem('username')
    }
    
    $scope.reset = function(){
        $scope.form = {
            fixed: true,
            display: true,
            createDate: new Date(),
            createBy: sessionStorage.getItem('username')
        }
    }

    $scope.initialize = function (){
        $http.get(`http://localhost:8080/rest/discount`).then(resp =>{
            $scope.items = resp.data;
        })
        $http.get(`http://localhost:8080/rest/food/findAll`).then(resp => {
            $scope.food = resp.data
        })
    }
    $scope.initialize()
    $scope.findAllFood = function(discount){
        $scope.discountIdCurrent = discount
        $http.get(`http://localhost:8080/rest/food/findAll`).then(resp => {
            $scope.foods = resp.data
        })
        const foodDiscountId = discount.name.replace(/%/g, '')
        console.log("foodDiscountId: ",foodDiscountId)
        $http.get(`http://localhost:8080/rest/discount/findAllFoodDiscount/${foodDiscountId}`).then(resp => {
            $scope.foodDiscount = resp.data
            for(let i=0; i< resp.data.length; i++){
                $scope.isChecked = function(f){
                    return $scope.foodDiscount.includes(f.id)
                }
                console.log("d: ",resp.data[i])
            }
            console.log("foodDiscount: ",resp.data)
        }).catch(err => {
            console.log("Err findAllFoodDiscount: ",err)
        })
    }
    $scope.discount_changed = function (f) {
        let isCheck = $scope.isChecked(f)
        if (isCheck){
            $scope.revoke_discount($scope.discountIdCurrent,f)
        } else {
            $scope.grant_discount($scope.discountIdCurrent,f)
        }
        console.log("discountCurrent discount_changed: ",$scope.discountIdCurrent)
    }
    $scope.grant_discount = function (discount,f) {
        let idDiscount = parseInt(discount.id)
        console.log("discountCurrent grant_discount: ",discount.id)
        $http.get(`http://localhost:8080/rest/discount/findById/${idDiscount}`).then(resp => {
            $scope.findById = resp.data
            console.log('Success findById: ',resp.data)

            let discount = {
                name: $scope.findById.name,
                percentDiscount: $scope.findById.percentDiscount,
                fixed: $scope.findById.fixed,
                startDate: $scope.findById.startDate,
                createDate: $scope.findById.createDate,
                endDate: $scope.findById.endDate,
                createBy: sessionStorage.getItem('username'),
                display: $scope.findById.display,
                food: f.id,
                percentDiscount: $scope.findById.percentDiscount
            }
            $http.post(`http://localhost:8080/rest/discount`, discount).then(resp => {
                console.log('Success grant_category: ',resp.data)
                }).catch(err => {
                    console.log('Error post grant_category: ', err)
                })
        }).catch(err => {
            console.log('Error grant_category: ', err)
        })
    }          
    $scope.revoke_discount = function (discount,food) {
        let idDiscount = parseInt(discount.id)
        console.log("discountCurrent revoke_discount: ",discount.id)
        $http.delete(`http://localhost:8080/rest/discount/delete/${idDiscount}`).then(resp =>{
            let index = $scope.allDiscount.findIndex(d => d.id == idDiscount)
            $scope.allDiscount.splice(index, 1)

            console.log('delete success revoke category: ',resp.data)
            $scope.message = "Delete authority success!"
            // $scope.liveToastBtn()
        }).catch(err =>{
            console.log("Error delete revoke category", err)
        })
    }
    $scope.displayChange = function(discount){
        let display = ''
            if(discount.display == true){
                display = 'false'
                $http.put(`http://localhost:8080/rest/discount/display/${display}/${discount.id}`, discount).then(resp => {
                    console.log("Display Discount false ok")
                    $scope.reload()
                })

                }
            if(discount.display == false){
                display = 'true'
                $http.put(`http://localhost:8080/rest/discount/display/${display}/${discount.id}`, discount).then(resp => {
                    console.log("Display Discount true ok")
                    $scope.reload()
                })
                }
    }
    $scope.fixedChange = function(discount){
        let fixed = ''
        if(discount.fixed == true){
            fixed = 'false'
            $http.put(`http://localhost:8080/rest/discount/fixed/${fixed}/${discount.id}`, discount).then(resp => {
                console.log("fixed Discount false ok")
                
            })
            }
        if(discount.fixed == false){
            fixed = 'true'
            $http.put(`http://localhost:8080/rest/discount/fixed/${fixed}/${discount.id}`, discount).then(resp => {
                console.log("fixed Discount true ok")
                
            })
            }
    }
    $scope.edit = function(discount){
        $scope.form = {
            id: discount.id,
            food: discount.food.id,
            name: discount.name,
            createDate:discount.createDate,
            startDate: new Date(discount.startDate),
            endDate: new Date(discount.endDate),
            percentDiscount: discount.percentDiscount,
            fixed: discount.fixed,
            display: discount.display,
            createBy: sessionStorage.getItem('username')
        }
        console.log("edit: ",$scope.form)
        $scope.findImageFoodByFoodId(discount)
        $('#nav-tab button:eq(1)').tab('show')
    }
    // if($scope.checkedFoodId === 'true'){
        //     conf = alert("bạn cần chọn food name")
        // }else{
        //     return $scope.fId = f.id
        //     // console.log("check: ",$scope.fId)
        // }
        $scope.test = function(){
            console.log("test: ",foodSelected)
        }
    $scope.create = function(){
        let item = {
            name: $scope.form.name,
            percentDiscount: $scope.form.percentDiscount,
            fixed: $scope.form.fixed,
            startDate: $scope.form.startDate,
            createDate: new Date(),
            endDate: $scope.form.endDate,
            createBy: sessionStorage.getItem('username'),
            display: $scope.form.display,
            food: $scope.selectedFood,
            percentDiscount: $scope.form.percentDiscount
        }
        $http.post(`http://localhost:8080/rest/discount`, item).then(resp => {
            $scope.items.push(resp.data)
            console.log("create success: ", resp.data)
        }).catch(err => {
            $scope.error = "Fail to save Discount!"
            console.log('Error Discount', err)
        })
        $scope.reset()
    }
    $scope.pager = {
        page: 0,
        size: 5,
        get count(){
            return Math.ceil(1.0 * $scope.items.length / this.size)
        },
        get length(){
          return $scope.items.length
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
    $scope.update = function(){
        let item = angular.copy($scope.form)
        console.log("update before: ",item)
        $http.put(`http://localhost:8080/rest/discount/update/${item.id}`, item).then(resp => {
            let index = $scope.items.findIndex(discount => discount.id == item.id)
            $scope.items[index] = item
            $scope.message = "Updated success!"
            console.log("update: ",resp.data)
            console.log("Update success")

            alert("Update Discount Success")
            $scope.load()
        }).catch(err => {
            $scope.error = "Fail to updated!"
            console.log("Error update: ", err)
        })
        
    }
    $scope.viewDiscount = function(discount){
        console.log("view: ", discount)
        $http.get(`http://localhost:8080/rest/discount/findById/${discount.id}`).then(resp => {
            $scope.discountId = resp.data
        })
        
    }
    $scope.$watch('discountId.food.id', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.findImageFoodByFoodId(newVal);
        }
    })
    $scope.findImageFoodByFoodId = function(foodId){
        $http.get(`http://localhost:8080/rest/imageFood/${foodId}`).then(resp => {
            $scope.imageFoodId = resp.data
        })
    }
    $scope.$watch('foods', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          angular.forEach(newVal, function(food) {
            $scope.findImageByFoodId(food.id)
          })
        }
      })
    $scope.findImageByFoodId = function(foodId){
        $http.get(`http://localhost:8080/rest/imageFood/${foodId}`).then(resp => {
            $scope.imageByFoodId[foodId] = resp.data
            console.log("imageByFoodId: ",$scope.imageByFoodId)
        })
    }
    $scope.findAllDiscount = function(){
        $http.get(`http://localhost:8080/rest/discount`).then(resp => {
            $scope.allDiscount = resp.data
        })
    }
    
    $scope.updateSelect = function(form){
        $http.put(`http://localhost:8080/rest/discount/updateFoodId/${form.food}/${form.id}`, form).then(resp => {
            console.log("updateFoodId success: ",resp.data)
        }).catch(err => {
            console.log("fail updateSelect: ",err)
        })
    }
        
    $scope.selectedCreateDate = function(createDate){
        if(createDate == null){
            $scope.load()
        }else{
        $http.get(`http://localhost:8080/rest/discount/findByCreateDate/${createDate}`).then(resp => {
            $scope.items = resp.data
            console.log("findByCreateDate success ", resp.data)
        }).catch(err => {
            console.log("fail findByCreateDate: ",err)
        })
        }
    }
    $scope.selectedStartDate = function(startDate){
        if(startDate == null){
            $scope.load()
        }else{
        $http.get(`http://localhost:8080/rest/discount/findByStartDate/${startDate}`).then(resp => {
            $scope.items = resp.data
            console.log("findByStartDate success ", resp.data)
        }).catch(err => {
            console.log("fail findByStartDate: ",err)
        })
        }
    }
    $scope.load = function(){
        $route.reload();
    }
    $scope.selectedEndDate = function(endDate){
        if(endDate == null){
            $scope.load()
        }else{
        $http.get(`http://localhost:8080/rest/discount/findByEndDate/${endDate}`).then(resp => {
            $scope.items = resp.data
            console.log("findByEndDate success ", resp.data)
        }).catch(err => {
            console.log("fail findByEndDate: ",err)
        })
        }
    }
    $scope.selectedName = function(selectedOption){
        if(selectedOption == null){
            $scope.load()
        }else{
            $http.get(`http://localhost:8080/rest/discount/findByName/${selectedOption.name}`).then(resp => {
                $scope.items = resp.data
            }).catch(err => {
                console.log("fail discount find name: ",err)
            })
        }
    }
    $scope.delete = function(discount){
        let conf = confirm("Do you want to delete this discount ?")
        if(conf == true){
            $http.delete(`http://localhost:8080/rest/discount/delete/${discount.id}`).then(resp => {
                $scope.load()
                console.log("delete succes")
                }).catch(err => {
                    console.log("fail delete: ",err)
                })
                
        }
    }
})