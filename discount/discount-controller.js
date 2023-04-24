app.controller('discount-controller', function ($scope, $http, $window, $route) {
    $scope.items = []
    $scope.item = []
    $scope.getSelected = {}
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

    $scope.form = {
        fixed: true,
        display: true,
        createDate: new Date(),
        createBy: sessionStorage.getItem('username')
    }

    $scope.reset = function () {
        $scope.form = {
            fixed: true,
            display: true,
            createDate: new Date(),
            createBy: sessionStorage.getItem('username')
        }
    }

    $scope.initialize = function () {
        let accessToken = sessionStorage.getItem('accessToken')
        if (accessToken == null) {
            location.href = "#!/security/login"
        }

        let email = sessionStorage.getItem('email')
        let admin = sessionStorage.getItem('admin')
        if (admin == 'false') {
            $http.get(`http://localhost:8080/rest/discount/findAllByUserEmail/${email}`).then(resp => {
                $scope.items = resp.data
            })
        } else {
            $http.get(`http://localhost:8080/rest/discount`).then(resp => {
                $scope.items = resp.data;
            })
        }

        $http.get(`http://localhost:8080/rest/food/findAll`).then(resp => {
            $scope.food = resp.data
        })
    }
    $scope.initialize()
    $scope.findAllFood = function (discount) {
        $http.get(`http://localhost:8080/rest/food/findAll`).then(resp => {
            $scope.foods = resp.data
        })
        $http.get(`http://localhost:8080/rest/discount`).then(resp => {
            $scope.discounts = resp.data
        })
        const foodDiscountId = discount.name.replace(/%/g, '')
        $http.get(`http://localhost:8080/rest/discount/findAllFoodDiscount/${foodDiscountId}`).then(resp => {
            $scope.foodDiscount = resp.data
        }).catch(err => {
            console.log("Err findAllFoodDiscount: ", err)
        })
        $scope.isChecked = function (f) {
            // return $scope.foodDiscount.includes(f.id)
            return $scope.foodDiscount.includes(f.id)
        }

        $scope.discount_changed = function (f) {
            let isCheck = $scope.isChecked(f)
            if (isCheck) {
                $scope.revoke_discount(discount, f)
            } else {
                $scope.grant_discount(discount, f)
            }
        }
        $scope.grant_discount = function (dis, f) {
            let disc = {
                name: dis.name,
                percentDiscount: dis.percentDiscount,
                fixed: dis.fixed,
                startDate: dis.startDate,
                createDate: dis.createDate,
                endDate: dis.endDate,
                createBy: sessionStorage.getItem('username'),
                display: dis.display,
                food: f.id,
                percentDiscount: dis.percentDiscount
            }
            $http.post(`http://localhost:8080/rest/discount`, disc).then(resp => {
                console.log('Success grant_category: ', resp.data)

            }).catch(err => {
                console.log('Error post grant_category: ', err)
            })
        }
        $scope.revoke_discount = function (dis, food) {
            let id = parseInt(dis.food.id)
            const name = dis.name.replace(/%/g, '')
            console.log("delete: ", dis)
            $http.delete(`http://localhost:8080/rest/discount/delete/${name}/${id}`).then(resp => {
                // let index = $scope.allDiscount.findIndex(d => d.id == idDiscount)
                // $scope.discounts.splice(index, 1)

                console.log('delete success revoke category: ', resp.data)
                $scope.message = "Delete authority success!"
            }).catch(err => {
                console.log("Error delete revoke category", err)
            })
        }
    }



    // $scope.findAllFood = function(discount){
    //     $http.get(`http://localhost:8080/rest/food/findAll`).then(resp => {
    //                 $scope.foods = resp.data
    //     })
    //     $http.get(`http://localhost:8080/rest/discount`).then(resp => {
    //         $scope.discounts = resp.data
    //     })
    //     $scope.isChecked = function(f){
    //         return $scope.discounts.find(item => item.food.id===f.id && item.id===discount.id)
    //     }
    //     $scope.discount_changed = function(f){
    //         let checked = $scope.isChecked(f)
    //         if(checked){
    //             $scope.deleteDiscountFood(discount)
    //         }else{
    //             $scope.addDiscountFood(discount,f)
    //         }
    //     }
    //     $scope.deleteDiscountFood = function(discount){
    //         $http.delete(`http://localhost:8080/rest/discount/delete/${discount.id}`).then(resp =>{
    //         let index = $scope.discounts.findIndex(d => d.id == discount.id)
    //         $scope.discounts.splice(index, 1)

    //         console.log('delete success revoke category: ',resp.data)
    //         $scope.message = "Delete authority success!"

    //         this.findAllFood(dis)
    //     }).catch(err =>{
    //         console.log("Error delete revoke category", err)
    //     })
    //     }
    //     $scope.addDiscountFood = function(discount,f){
    //         let item = {
    //             name: discount.name,
    //             percentDiscount: discount.percentDiscount,
    //             fixed: discount.fixed,
    //             startDate: discount.startDate,
    //             createDate: discount.createDate,
    //             endDate: discount.endDate,
    //             createBy: sessionStorage.getItem('username'),
    //             display: discount.display,
    //             food: f.id,
    //             percentDiscount: discount.percentDiscount
    //         }
    //         $http.post(`http://localhost:8080/rest/discount`, item).then(resp => {

    //             console.log('Success grant_category: ',resp.data)
    //             $scope.findAllFood(dis)
    //             }).catch(err => {
    //                 console.log('Error post grant_category: ', err)
    //         })
    //     }
    // }
    $scope.displayChange = function (discount) {
        let display = ''
        if (discount.display == true) {
            display = 'false'
            $http.put(`http://localhost:8080/rest/discount/display/${display}/${discount.id}`, discount).then(resp => {
                console.log("Display Discount false ok")
            })

        }
        if (discount.display == false) {
            display = 'true'
            $http.put(`http://localhost:8080/rest/discount/display/${display}/${discount.id}`, discount).then(resp => {
                console.log("Display Discount true ok")
            })
        }
    }
    $scope.fixedChange = function (discount) {
        let fixed = ''
        if (discount.fixed == true) {
            fixed = 'false'
            $http.put(`http://localhost:8080/rest/discount/fixed/${fixed}/${discount.id}`, discount).then(resp => {
                console.log("fixed Discount false ok")

            })
        }
        if (discount.fixed == false) {
            fixed = 'true'
            $http.put(`http://localhost:8080/rest/discount/fixed/${fixed}/${discount.id}`, discount).then(resp => {
                console.log("fixed Discount true ok")

            })
        }
    }
    $scope.edit = function (discount) {
        $scope.form = {
            id: discount.id,
            food: discount.food.id,
            name: discount.name,
            createDate: discount.createDate,
            startDate: new Date(discount.startDate),
            endDate: new Date(discount.endDate),
            percentDiscount: discount.percentDiscount,
            fixed: discount.fixed,
            display: discount.display,
            createBy: sessionStorage.getItem('username')
        }
        console.log("edit: ", $scope.form)
        $scope.findImageFoodByFoodId(discount)
        $('#nav-tab button:eq(1)').tab('show')
    }
    // if($scope.checkedFoodId === 'true'){
    //     conf = alert("bạn cần chọn food name")
    // }else{
    //     return $scope.fId = f.id
    //     // console.log("check: ",$scope.fId)
    // }
    $scope.test = function () {
        console.log("test: ", foodSelected)
    }
    $scope.create = function () {
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
        get count() {
            return Math.ceil(1.0 * $scope.items.length / this.size)
        },
        get length() {
            return $scope.items.length
        },
        first() {
            this.page = 0
        },
        prev() {
            this.page--
            if (this.page < 0)
                this.last()
        },
        next() {
            this.page++
            if (this.page >= this.count)
                this.first()
        },
        last() {
            this.page = this.count - 1
        }
    }
    $scope.update = function () {
        let item = angular.copy($scope.form)
        console.log("update before: ", item)
        $http.put(`http://localhost:8080/rest/discount/update/${item.id}`, item).then(resp => {
            let index = $scope.items.findIndex(discount => discount.id == item.id)
            $scope.items[index] = item
            $scope.message = "Updated success!"
            console.log("update: ", resp.data)
            console.log("Update success")

            alert("Update Discount Success")
            $scope.load()
        }).catch(err => {
            $scope.error = "Fail to updated!"
            console.log("Error update: ", err)
        })

    }
    $scope.viewDiscount = function (discount) {
        console.log("view: ", discount)
        $http.get(`http://localhost:8080/rest/discount/findById/${discount.id}`).then(resp => {
            $scope.discountId = resp.data
        })

    }
    $scope.$watch('discountId.food.id', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.findImageFoodByFoodId(newVal);
        }
    })
    $scope.findImageFoodByFoodId = function (foodId) {
        $http.get(`http://localhost:8080/rest/imageFood/${foodId}`).then(resp => {
            $scope.imageFoodId = resp.data
        })
    }
    $scope.$watch('foods', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            angular.forEach(newVal, function (food) {
                $scope.findImageByFoodId(food.id)
            })
        }
    })
    $scope.findImageByFoodId = function (foodId) {
        $http.get(`http://localhost:8080/rest/imageFood/${foodId}`).then(resp => {
            $scope.imageByFoodId[foodId] = resp.data
            console.log("imageByFoodId: ", $scope.imageByFoodId)
        })
    }
    $scope.findAllDiscount = function () {
        $http.get(`http://localhost:8080/rest/discount`).then(resp => {
            $scope.allDiscount = resp.data
        })
    }

    $scope.updateSelect = function (form) {
        $http.put(`http://localhost:8080/rest/discount/updateFoodId/${form.food}/${form.id}`, form).then(resp => {
            console.log("updateFoodId success: ", resp.data)
        }).catch(err => {
            console.log("fail updateSelect: ", err)
        })
    }

    $scope.selectedCreateDate = function (createDate) {
        if (createDate == null) {
            $scope.load()
        } else {
            $http.get(`http://localhost:8080/rest/discount/findByCreateDate/${createDate}`).then(resp => {
                $scope.items = resp.data
                console.log("findByCreateDate success ", resp.data)
            }).catch(err => {
                console.log("fail findByCreateDate: ", err)
            })
        }
    }
    $scope.selectedStartDate = function (startDate) {
        if (startDate == null) {
            $scope.load()
        } else {
            $http.get(`http://localhost:8080/rest/discount/findByStartDate/${startDate}`).then(resp => {
                $scope.items = resp.data
                console.log("findByStartDate success ", resp.data)
            }).catch(err => {
                console.log("fail findByStartDate: ", err)
            })
        }
    }
    $scope.load = function () {
        $route.reload();
    }
    $scope.selectedEndDate = function (endDate) {
        if (endDate == null) {
            $scope.load()
        } else {
            $http.get(`http://localhost:8080/rest/discount/findByEndDate/${endDate}`).then(resp => {
                $scope.items = resp.data
                console.log("findByEndDate success ", resp.data)
            }).catch(err => {
                console.log("fail findByEndDate: ", err)
            })
        }
    }
    $scope.selectedName = function (selectedOption) {
        if (selectedOption == null) {
            $scope.load()
        } else {
            $http.get(`http://localhost:8080/rest/discount/findByName/${selectedOption.name}`).then(resp => {
                $scope.items = resp.data
            }).catch(err => {
                console.log("fail discount find name: ", err)
            })
        }
    }
    $scope.delete = function (discount) {
        let conf = confirm("Do you want to delete this discount ?")
        if (conf == true) {
            $http.delete(`http://localhost:8080/rest/discount/delete/${discount.id}`).then(resp => {
                $scope.load()
                console.log("delete succes")
            }).catch(err => {
                console.log("fail delete: ", err)
            })

        }
    }
    $scope.isDisabledupdate = true
    $scope.exportDiscount = function(){
        var wb = XLSX.utils.table_to_book(document.getElementById('exportDiscount'), {sheet:"Sheet JS"})
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'array'})

        saveAs(new Blob([wbout], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"}), "Discounts.xlsx")
    }
    $scope.exportPdfDiscount = function(){
        const element = document.getElementById('exportDiscount');
        html2pdf()
        .from(element)
        .set({
            margin: [0.5, 0.5],
            pagebreak: {
            mode: ['avoid-all']
            },
            filename: 'Discounts.pdf',
            image: { type: 'jpeg', quality: 0.98 }
        })
        .save();
    }
})
