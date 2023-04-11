app.controller('foods-controller', function($scope, $http, $window,$route,$location){
    $scope.items = []
    $scope.listCategories = {}
    $scope.categoryFood = {}
    $scope.form = {}
    $scope.category = []
    $scope.listImageFood = {}
    $scope.imageFood = ''
    $scope.foodId = {}
    $scope.categoryFoodId = []
    $scope.categories = {}
    $scope.createBy = {}
    $scope.foodDetail = {}
    $scope.imageName = ''
    $scope.ima = {}
    $scope.images = []
    $scope.imageMapping = {}
    $scope.form = {
        createDate: new Date(),
        display: true,
        createBy: sessionStorage.getItem('username'),
        image: 'XOsX.gif'
    }
    // $scope.deleteImage = function(i) {
        // var encodedImageName = encodeURI(i.imageName)
        // console.log("delete image: ",i)
        // var url = 'http://' + $location.host() + ':8080/rest/imageFood/delete/' + encodedImageName;
        // $http.delete(url).then(resp => {
        //     let index = $scope.items.findIndex(food => food.id == i.id)
        //     $scope.items.splice(index, 1)
        //     console.log("delete image success")
        // }).catch(err => {
        //     console.log("delete image: ",err)
        // })
    //   }
    $scope.deleteImage = function(i) {
        $http.delete(`http://localhost:8080/rest/imageFood/${i.id}`).then(resp => {
                let index = $scope.items.findIndex(food => food.id == i.id)
                $scope.items.splice(index, 1)
                i.deleted = true
                console.log("delete image success")
            }).catch(err => {
                console.log("delete image: ",err)
            })
    }
    $scope.reset = function(){
        $scope.form = {
            createDate: new Date(),
            display: true,
            createBy: sessionStorage.getItem('username'),
            image: 'XOsX.gif'
        }
    }
    $scope.initialize = function (){
        $http.get(`http://localhost:8080/rest/food/findAll`).then(resp => {
            $scope.items = resp.data
        })
        $http.get(`http://localhost:8080/rest/category/getAll`).then(resp => {
            $scope.category = resp.data
            console.log("categories: ", $scope.category)
        })
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
            $scope.findImageNameByFoodId = function(foodId){
                $http.get(`http://localhost:8080/rest/imageFood/${foodId}`).then(resp => {
                    $scope.imageMapping = resp.data
                    console.log("findImageNameByFoodId: ",resp.data)
                })
            }
            $scope.findAllImageFood = function(){
                $http.get(`http://localhost:8080/rest/imageFood/findAll`).then(resp =>{
                    $scope.images = resp.data
                })
            }
            $scope.food = {
                create() {
                    let item = angular.copy($scope.form)
                    let createFoodId = ""
                    console.log("create image create: ",$scope.imageName)
                    $http.post(`http://localhost:8080/rest/food/create`, item).then(resp => {
                        resp.data.createDate = new Date(resp.data.createDate)
                        $scope.items.push(resp.data)
            
                        createFoodId = resp.data.id
                        $scope.createCategoryFood(createFoodId)
                        console.log("create check: ", $scope.imageName)

                            let item = {
                                imageName: $scope.imageName,
                                foodId: createFoodId
                            }
                            console.log("imageNameInput: ", item)
                            console.log("item createImageFood: ",item)
                            $http.post(`http://localhost:8080/rest/imageFood/add`, item).then(resp =>{
                                this.images.push(resp.data)
                                $scope.message = "Add image Food successfully!"
                                console.log("imageNameInput add: ",resp.data)
                                // $scope.blog.liveToastBtn()
                            })
                        // $scope.imageFoods.createImageFood(createFoodId,$scope.imageName)
                    })
                    $scope.reset()
                },
                update() {
                    let createFoodId = ""
                    let item = angular.copy($scope.form)

                    console.log("update ima: ",item.id)
                    $http.put(`http://localhost:8080/rest/food/update/${item.id}`, item).then(resp => {
                        let index = $scope.items.findIndex(food => food.id == item.id)
                        $scope.items[index] = item
                        createFoodId = resp.data.id
            
                        let itemImage = {
                            imageName: $scope.images.imageName,
                            foodId: createFoodId
                        }
                        $http.post(`http://localhost:8080/rest/imageFood/add`, itemImage).then(resp =>{
                            this.images.push(resp.data)
                            $scope.message = "Add image Food successfully!"
                            console.log("imageNameInput add: ",resp.data)
                            // $scope.blog.liveToastBtn()
                        })
                        alert("Update Food Success")
                        console.log("update success")
                        $route.reload()
                    }).catch(err => {
                        $scope.error = "Fail to updated!"
                        console.log("Error food: ", err)
                    })
                }
            }
            $scope.imageFoods = {
                images: [],
                food: {},
                findAllByImageId(food){
                    this.food = food
                    console.log('getFood:', this.food)
        
                    $http.get(`http://localhost:8080/rest/imageFood/${food.id}`).then(resp =>{
                        this.images = angular.copy(resp.data)
                    })
                },
                imageChanged(files){
                    let dataImage = new FormData()
                    dataImage.append('file', files[0])
                    $http.post('http://localhost:8080/rest/upload/firebase', dataImage, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).then(resp =>{
                       this.createImageBlog(resp.data.name)
                    }).catch(err =>{
                        $scope.error = "The field file exceeds its maximum permitted size of 1048576 bytes!"
                        console.log('Error', err)
                    })
                },
                createImageFood(foodId,imageNameInput){
                    let item = {
                        imageName: imageNameInput,
                        foodId: foodId
                    }
                    console.log("imageNameInput: ", imageNameInput)
                    
                    console.log("item createImageFood: ",item)
                    $http.post(`http://localhost:8080/rest/imageFood/add`, item).then(resp =>{
                        this.images.push(resp.data)
                        $scope.message = "Add image Food successfully!"
                        console.log("imageNameInput add: ",resp.data)
                        // $scope.blog.liveToastBtn()
                    })
                }
            }
    $scope.delete = function(item){
        $http.delete(`http://localhost:8080/rest/food/delete/${item.id}`).then(resp => {
            let index = $scope.items.findIndex(food => food.id == item.id)
            $scope.items.splice(index, 1)
        })
    }
    $scope.createCategoryFood = function(foodId){
        for(let i = 0; i < $scope.listCategories.id.length; i++){
            let id = $scope.listCategories.id[i]
            $scope.categoryFood = {
                category: {id: parseInt(id)},
                food: {id: parseInt(foodId)}
            }
        }
        let category = angular.copy($scope.categoryFood)
        $http.post(`http://localhost:8080/rest/categoryFood`, category).then(resp => {
            console.log("createCategoryFood success ")
        }).catch(err =>{
            console.log("createCategoryFood fail: ", err)
        })
    }
    $scope.updateSelect = function(listCategories){
        console.log("updateSelect: ", $scope.listCategories.id)
    }
    // $scope.createImageFood = function (food) {
    //     let item = {
    //         imageName: $scope.imageFood,
    //         foodId: food
    //     }
    //     $http.post(`http://localhost:8080/rest/imageFood/add`, item).then(resp => {
    //         // $scope.reset()
    //         $scope.listImageFood.push(resp.data)
    //     }).catch(err => {
    //         $scope.error = "Fail to save Category!"
    //         console.log('Error createImageFood', err)
    //     })
    // }
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
        $http.post(`http://localhost:8080/rest/upload/firebase`, dataImage, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(resp =>{
            $scope.imageFood = resp.data.name
            console.log("imageupload success: ", $scope.imageFood)
        }).catch(err =>{
            $scope.error = "The field file exceeds its maximum permitted size of 1048576 bytes!"
            console.log('Error', err)
        })
    }
    $scope.uploadFile = function() {
        var file = $scope.file;
        var uploadUrl = `http://localhost:8080/rest/upload/firebase`;
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
        .success(function(data) {
          console.log(data);
        })
        .error(function(data) {
          console.log(data);
        });
      };
    $scope.edit = function(food){
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
            $http.get(`http://localhost:8080/rest/imageFood/${item.id}`).then(resp => {
                    $scope.imageMapping = resp.data
                    console.log("findImageNameByFoodId: ",resp.data)
                })

        $http.get(`http://localhost:8080/rest/category/categories/getAllCategoriesByFoodID/${item.id}`).then(resp =>{
            $scope.listCategoriesChose =  angular.copy(resp.data)
        })
        $http.get(`http://localhost:8080/rest/imageFood/findImageFoodByFoodId/${item.id}`).then(resp => {
            $scope.listImageFood = resp.data
            console.log("listImageFood: ", resp.data)
        })
        $scope.form = angular.copy(food)
        $('#myTab button:eq(1)').tab('show')
    }
    $scope.reloadPage = function() {
        $route.reload();
      }
    
    $scope.category_of = function (ca) {
    let items = angular.copy($scope.listCategoriesChose)
    for (let item of items) {
        if(ca.id == item.id){
            return true
        }
    }
    
    }
        
    $scope.category_changed = function (ca, foodId) {
        let category = $scope.category_of(ca)
        if (category){
            $scope.revoke_category(ca,foodId)
        } else {
            $scope.grant_category(ca, foodId)
        }
    }
    $scope.grant_category = function (category, foodId) {
        let idFood = parseInt(foodId)
        $http.post(`http://localhost:8080/rest/categoryFood/${category.id}/${idFood}`, category).then(resp => {
            console.log('Success grant_category')
        }).catch(err => {
            $scope.error = "Fail to save Category!"
            console.log('Error create Category', err)
        })
    }          
    $scope.revoke_category = function (category, foodId) {
        let idFood = parseInt(foodId)
        $http.delete(`http://localhost:8080/rest/categoryFood/${category.id}/${idFood}`, category).then(resp =>{
            console.log('Success revoke category')
            $scope.message = "Delete authority success!"
            $scope.liveToastBtn()
        }).catch(err =>{
            console.log("Error revoke category", err)
        })
    }
    $scope.viewFood = function(food){
        console.log("food id: ",food.id)
        $http.get(`http://localhost:8080/rest/food/findById/${food.id}`).then(resp => {
            $scope.foodId = resp.data
            console.log("foodId: ",resp.data)
        })
        $http.get(`http://localhost:8080/rest/categoryFood/${food.id}`).then(resp => {
            $scope.categoryFoodId = resp.data
        })
        $http.get(`http://localhost:8080/rest/imageFood/searchByFoodId/${food.id}`).then(resp => {
            $scope.imageName = resp.data
            console.log("ImageName: ", $scope.imageName)
        })
    }
    $scope.selectCreateDate = function(createDate){
        if(createDate == null){
            $scope.reloadPage()
        }else{
        $http.get(`http://localhost:8080/rest/food/findByCreateDate/${createDate}`).then(resp => {
            $scope.items = resp.data
            console.log("findByCreateDate success ", resp.data)
        }).catch(err => {
            console.log("fail findByCreateDate: ",err)
        })
        }
    }
    $scope.liveToastBtn = function() {
        var lastMessage = document.querySelector('.toast:last-child');
        new window.bootstrap.Toast(lastMessage).show();
    }
    $scope.initialize()
})
