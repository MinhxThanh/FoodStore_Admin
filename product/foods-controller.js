app.controller('foods-controller', function ($scope, $http, $window) {
    $scope.message = ""
    $scope.error = ""
    $scope.items=[]
    $scope.form = {}
    $scope.categories = []
    $scope.getcategoryFood = {}
    $scope.imageFood = ''
    $scope.listImageFood = []

    $scope.categoryFoodList = []
    $scope.listCategories = []
    $scope.categoryFood = {}

    $scope.reset = function (){
        $scope.message = ""
        $scope.error = ""
        $scope.listCategories = {}
        $scope.listCategoriesChose = []
        $scope.form = {
            createDate: new Date(),
            display: true,
            image: 'XOsX.gif'
        }
        $scope.getcategoryFood = {}
    }
    
    $scope.initialize = function (){
        $http.get("http://localhost:8080/rest/food").then(resp =>{
            $scope.items = resp.data;
            console.log("Food: ",resp.data)
        })
        $http.get('http://localhost:8080/rest/categories').then(resp =>{
            $scope.categories = resp.data
        })
        $http.get('http://localhost:8080/rest/categoryFood').then(resp =>{
            $scope.categoryFoodList = resp.data
        })
    }
    // $scope.listImageFood = function(){
    //     let item = angular.copy($scope.form)
    //     $http.get(`http://localhost:8080/rest/imageFood/${item.id}`).then(resp => {
    //         $scope.listImageFood = resp.data
    //         console.log("listImageFood: ", $scope.listImageFood)
    //     })
    // }

    $scope.listCategoriesChose = []
    $scope.create = async function () {
        let CreateFoodID = ""
        let item = {
            name: $scope.form. name,
            price: $scope.form.price,
            createDate: $scope.form.createDate,
            quantityLimit: $scope.form.quantityLimit,
            quantitySell: $scope.form.quantitySell,
            viewCount: $scope.form.viewCount,
            display: $scope.form.display,
            description: $scope.form.description,
            createBy: sessionStorage.getItem('username')
        }
    
        console.log("Before: ", item)
        $http.post(`http://localhost:8080/rest/food`, item).then(resp => {
            $scope.items.push(resp.data)
            $scope.items.forEach(item =>{
                item.createDate = new Date(item.createDate)
            })
            
            CreateFoodID = resp.data.id
            let foodID = CreateFoodID
            $scope.createCategoryFood(foodID)
            $scope.createImageFood(foodID)
            // $scope.updateCategory(item.id)
            // $scope.reset()
            $scope.message = "Save Food success!"
            console.log("Food", resp)
        }).catch(err => {
            $scope.error = "Fail to save Food!"
            console.log('Error', err)
        })

        // $window.location.reload();
        console.log("CreateFoodID 1: " + CreateFoodID)
    }
    $scope.food = {
        itemDelete: {},
        edit(food){
            this.reset()
            let item = {
                id: food.id,
                name: food.name,
                price: food.price,
                createDate: food.createDate,
                quantityLimit: food.quantityLimit,
                quantitySell: food.quantitySell,
                viewCount: food.viewCount,
                display: food.display,
                description: food.description,
                createBy: sessionStorage.getItem('username'),
                listCategories: food.category,
                imageFood: food.imageName
            }
            $http.get(`http://localhost:8080/rest/categories/getAllCategoriesByFoodID/${item.id}`).then(resp =>{
                $scope.listCategoriesChose =  angular.copy(resp.data)
                console.log("edit id", resp.data)
            })
            $http.get(`http://localhost:8080/rest/imageFood/${item.id}`).then(resp => {
                        $scope.listImageFood = resp.data
                    })
            // $http.get(`http://localhost:8080/rest/imageFood/${item.id}`).then(resp => {
            //             $scope.listImageFood = resp.data
            //             console.log("listImageFood: ", $scope.listImageFood)
            //         })

            $scope.form = angular.copy(item)

            console.log("isDisplay: ", food)
            console.log("Category: ", food.category.id)
            console.log("Category form: "+$scope.form.listCategories)
        },
        reset(){
        $scope.message = ""
        $scope.error = ""
        $scope.form = {
            createDate: new Date(),
            available: true,
            image: 'XOsX.gif'
            // createBy: sessionStorage.getItem('username')
        }
        
        },
        liveToastBtn(){
            var lastMessage = document.querySelector('.toast:last-child');
            new window.bootstrap.Toast(lastMessage).show();
        }
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
    $scope.createCategoryFood = function (foodID) {
        console.log("$scope.listCategories: ",$scope.listCategories)
        if($scope.listCategories.id.length > 0){
            for (let i = 0; i < $scope.listCategories.id.length; i++) {
                let id = $scope.listCategories.id[i];
                console.log("ID: " + id)
                $scope.categoryFood = {
                    food: {id: parseInt(foodID)},
                    category: {id: parseInt(id)}
                }
                let category = angular.copy($scope.categoryFood)
                $http.post(`http://localhost:8080/rest/categoryFood`, category).then(resp => {
                    $scope.items.push(resp.data)
                    $scope.reset()
                    console.log('createCategoryFood: ', resp.data)
                }).catch(err => {
                    $scope.error = "Fail to save Category!"
                    console.log('Error create Category', err)
                })
            }
        }
    }

    // create image
    $scope.createImageFood = function (food) {
        let item = {
            imageName: $scope.imageFood,
            foodId: food
        }
        $http.post(`http://localhost:8080/rest/imageFood/add`, item).then(resp => {
                    $scope.reset()
                    $scope.listImageFood.push(resp.data)
                    console.log('Success', resp)
                }).catch(err => {
                    $scope.error = "Fail to save Category!"
                    console.log('Error createImageFood', err)
                })
       
    }
    
    $scope.deleteImageFood = async function(item){
        $http.delete(`http://localhost:8080/rest/imageFood/${item.id}`).then(resp => {
            let index = $scope.listImageFood.findIndex(im => im.food.id == item.id)
            $scope.listImageFood.splice(index, 1)
            $scope.reset()
            console.log("deleteImageFood: ",item.id)
            console.log("deleteImageFood: ", "success")
        }).catch(err => {
            $scope.error = "Fail to Deleted!"
            console.log("Error: ", err)
        })
    }
    $scope.update = async function () {
        let CreateFoodID = ""
        let item = angular.copy($scope.form)
        $http.put(`http://localhost:8080/rest/food/update/${item.id}`, item).then(resp => {
            let index = $scope.items.findIndex(food => food.id == item.id)
            $scope.items[index] = item
            CreateFoodID = resp.data.id

            let foodID = CreateFoodID
            
            $scope.createImageFood(CreateFoodID)
            $scope.createCategoryFood(CreateFoodID)
            
            $scope.message = "Updated success!"
        }).catch(err => {
            $scope.error = "Fail to updated!"
            console.log("Error: ", err)
        })

        
        // await $scope.sleep(500)
        $window.location.reload();
    }
    
    $scope.delete = function (item){
        var r = confirm("Are you sure you want to delete this item?");
        
            $http.delete(`http://localhost:8080/rest/food/delete/${item.id}`).then(resp =>{
           let index = $scope.items.findIndex(food => food.id == item.id)
            $scope.items.splice(index, 1)
            $scope.reset()
            alert("Xóa sản phẩm thành công!");
            $scope.message = "Deleted success!"
			
        }).catch(err =>{
            $scope.error = "Fail to Deleted!"
            console.log("Error: ", err)
            alert("Xóa sản phẩm that bai!");
        })
        
    }
    

    $scope.deleteCategory = function (cid, pid) {
        console.log("Food id: " + pid + " - cate: " + cid)

        $http.get(`http://localhost:8080/rest/categoryFood/${cid}/${pid}`).then(resp =>{
            $scope.getcategoryFood = resp.data
        })

        $http.delete(`http://localhost:8080/rest/categoryFood/${cid}/${pid}`).then(resp =>{
            console.log("deleteCategory", resp.data)

            let index = $scope.categoryFoodList.findIndex(item => item.id == $scope.getcategoryFood.id)
            $scope.categoryFoodList.splice(index, 1)

            let indexCate2 = $scope.listCategoriesChose.findIndex(item => item.id == cid)
            console.log("indexCate2", indexCate2)
            $scope.listCategoriesChose.splice(indexCate2, 1)
            $scope.message = "Deleted category of food success!"
        }).catch(err =>{
            $scope.error = "Fail to Deleted category of food!"
            console.log("Error: ", err)
        })
    }
    $scope.sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
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
        $http.post('http://localhost:8080/rest/upload/images/product', dataImage, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(resp =>{
            $scope.imageFood = resp.data.name
            console.log("name image: ", resp.data.name)
            console.log("name image: ", $scope.form.imageFood)
        }).catch(err =>{
            $scope.error = "The field file exceeds its maximum permitted size of 1048576 bytes!"
            console.log('Error', err)
        })
    }

    $scope.updateSelect= function (category) {
        console.log("0: " + $scope.listCategories.id)
        console.log("-------")
    };
    $scope.initialize();
    $scope.reset()
    
})
