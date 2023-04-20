app.controller('userEdit', function ($scope, $http, $window) {
    $scope.form = {};
    $scope.user = {};
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
                $scope.user = resp.data;
                
                //
                $scope.img = $scope.user.avatar
                console.log('as: ', resp.data)
            }).catch(err => {
                $scope.error = "Fail to get!"
                alert("Error get: ", err)
            })
    
        },
        $scope.initialize();
        $scope.edit = function() {
            $scope.form = angular.copy($scope.profile);
    
        }
}  

)
// app.controller('userEdit', function ($scope, $http, $window, $route, $location) {
//     $scope.items = []
//     $scope.listCategories = {}
//     $scope.categoryFood = {}
//     $scope.form = {}
//     $scope.category = []
//     $scope.foodId = {}
//     $scope.categoryFoodId = []
//     $scope.categories = {}
//     $scope.createBy = {}
//     $scope.foodDetail = {}
//     $scope.form = {
//         quantitySell: 0,
//         createDate: new Date(),
//         display: true,
//         createBy: sessionStorage.getItem('username'),
//         quantityLimit: 1
//     }
    
//     $scope.message = ''
//     $scope.error = ''

//     $scope.imageUpload = function (event) {
//         var files = event.target.files;

//         $scope.imageFood.imageChanged(files)
//     }

//     $scope.imageFood = {
//         images: [],
//         food: {},

//         findAllByFoodId(food){
//             this.food = food

//             $http.get(`http://localhost:8080/rest/imageFood/findAllByFoodId/${food.id}`).then(resp =>{
//                 this.images = angular.copy(resp.data)
//             })
//         },
//         imageChanged(files){
//             let dataImage = new FormData()
//             dataImage.append('file', files[0])
//             $http.post('http://localhost:8080/rest/upload/firebase', dataImage, {
//                 transformRequest: angular.identity,
//                 headers: {'Content-Type': undefined}
//             }).then(resp =>{
//                this.createImageFood(resp.data.name)
//             }).catch(err =>{
//                 $scope.error = "The field file exceeds its maximum permitted size of 1048576 bytes!"
//                 console.log('Error', err)
//             })
//         },
//         deleteImage(image){
//             $http.delete(`http://localhost:8080/rest/imageFood/deleteById/${image.id}`).then(resp =>{
//                 let index = this.images.findIndex(item => item.id == image.id)
//                 this.images.splice(index, 1)
//                 $scope.message = "Delete image food successfully!"
//                 $scope.liveToastBtn()
//             })
//         },
//         createImageFood(imageName){
//             let item = {
//                 imageName: imageName,
//                 food: this.food
//             }
//             console.log("item: ", item)
//             $http.post(`http://localhost:8080/rest/imageFood/create`, item).then(resp =>{
//                 this.images.push(resp.data)
//                 $scope.message = "Add image food successfully!"
//                 $scope.liveToastBtn()
//             })
//         }
//     }

    
//     $scope.food = {
//         create() {
//             $scope.form.description = tinymce.get("foodDescription").getContent();
//             let item = angular.copy($scope.form)
//             console.log("item: ", item)

//             $http.post(`http://localhost:8080/rest/food/create`, item).then(resp => {
//                 resp.data.createDate = new Date(resp.data.createDate)
//                 $scope.items.push(resp.data)

//             })
//             $scope.reset()
//         },
//         update() {
//             $scope.form.description = tinymce.get("foodDescription").getContent();
//             let item = angular.copy($scope.form)

//             console.log("update ima: ", item)
//             $http.put(`http://localhost:8080/rest/food/update`, item).then(resp => {
//                 let index = $scope.items.findIndex(food => food.id == item.id)
//                 $scope.items[index] = item
            
//                 alert("Update Food Success")
//                 console.log("update success")
//                 $route.reload()
//             }).catch(err => {
//                 $scope.error = "Fail to updated!"
//                 console.log("Error food: ", err)
//             })
//         }
//     }
     
//     $scope.delete = function (item) {
//         $http.delete(`http://localhost:8080/rest/food/delete/${item.id}`).then(resp => {
//             let index = $scope.items.findIndex(food => food.id == item.id)
//             $scope.items.splice(index, 1)
//         })
//     }

   
//     $scope.edit = function (food) {
//         let item = {
//             id: food.id,
//             name: food.name,
//             price: food.price,
//             createDate: food.createDate,
//             quantityLimit: food.quantityLimit,
//             quantitySell: food.quantitySell,
//             viewCount: food.viewCount,
//             display: food.display,
//             description: tinymce.get("foodDescription").setContent(food.description),
//             createBy: food.user.username,
//         }

//         $scope.imageFood.findAllByFoodId(food)
//         var item2 = sessionStorage.getItem(user);
//         $http.get(`http://localhost:8080/rest/user/GetUser/${item2.id}`).then(resp => {
//             $scope.listCategoriesChose = angular.copy(resp.data)
//         })
//         $scope.form = angular.copy(item)
//         $('#myTab button:eq(1)').tab('show')
//     }
//     $scope.reloadPage = function () {
//         $route.reload();
//     }

//     $scope.category_of = function (ca) {
//         var items = angular.copy($scope.listCategoriesChose)
//         for (let item of items) {
//             if (ca.id == item.id) {
//                 return true
//             }
//         }

//     }

//     $scope.category_changed = function (ca, foodId) {
//         let category = $scope.category_of(ca)
//         if (category) {
//             $scope.revoke_category(ca, foodId)
//         } else {
//             $scope.grant_category(ca, foodId)
//         }
//     }
//     $scope.grant_category = function (category, foodId) {
//         let idFood = parseInt(foodId)
//         $http.post(`http://localhost:8080/rest/categoryFood/${category.id}/${idFood}`, category).then(resp => {
//             console.log('Success grant_category')
//         }).catch(err => {
//             $scope.error = "Fail to save Category!"
//             console.log('Error create Category', err)
//         })
//     }
//     $scope.revoke_category = function (category, foodId) {
//         let idFood = parseInt(foodId)
//         $http.delete(`http://localhost:8080/rest/categoryFood/${category.id}/${idFood}`, category).then(resp => {
//             console.log('Success revoke category')
//             $scope.message = "Delete category success!"
//             $scope.liveToastBtn()
//         }).catch(err => {
//             console.log("Error revoke category", err)
//         })
//     }
//     $scope.viewFood = function (food) {
//         console.log("food id: ", food.id)
//         food = sessionStorage.getItem("item");
//         $http.get(`http://localhost:8080/rest/user/getUser/${food.id}`).then(resp => {
//             $scope.foodId = resp.data
//             console.log("foodId: ", resp.data)
//         })
//         $http.get(`http://localhost:8080/rest/categoryFood/${food.id}`).then(resp => {
//             $scope.categoryFoodId = resp.data
//         })
       
//     }
//     $scope.selectCreateDate = function (createDate) {
//         if (createDate == null) {
//             $scope.reloadPage()
//         } else {
//             $http.get(`http://localhost:8080/rest/food/findByCreateDate/${createDate}`).then(resp => {
//                 $scope.items = resp.data
//                 console.log("findByCreateDate success ", resp.data)
//             }).catch(err => {
//                 console.log("fail findByCreateDate: ", err)
//             })
//         }
//     }

//     $scope.reset = function () {
//         $scope.form = {
//             quantityLimit: 1,
//             quantitySell: 0,
//             createDate: new Date(),
//             display: true,
//             createBy: sessionStorage.getItem('username'),
//         }
//         $scope.imageFood.images = []
//         tinymce.get("foodDescription").setContent("<p></p>")
//     }
    
//     $scope.getListCategories = function(){
//         $http.get(`http://localhost:8080/rest/category/getAll`).then(resp => {
//             $scope.category = resp.data
//             console.log("categories: ", $scope.category)
//         })
//     }

//     $scope.pager = {
//         page: 0,
//         size: 5,
//         get count() {
//             return Math.ceil(1.0 * $scope.items.length / this.size)
//         },
//         get length() {
//             return $scope.items.length
//         },
//         first() {
//             this.page = 0
//         },
//         prev() {
//             this.page--
//             if (this.page < 0)
//                 this.last()
//         },
//         next() {
//             this.page++
//             if (this.page >= this.count)
//                 this.first()
//         },
//         last() {
//             this.page = this.count - 1
//         }
//     }

//     $scope.selectCreate = function () {
//         $('#profile-tab').click()
//     }

//     $scope.liveToastBtn = function () {
//         var lastMessage = document.querySelector('.toast:last-child');
//         new window.bootstrap.Toast(lastMessage).show();
//     }

//     $scope.initialize = function () {
//         $http.get(`http://localhost:8080/rest/food/findAll`).then(resp => {
//             $scope.items = resp.data
//         })
//         tinymce.init({
//             selector: "#foodDescription",
//             menubar: false,
//             toolbar_location: "bottom",
//             plugins: "autoresize link lists emoticons image",
//             autoresize_bottom_margin: 70,
//             max_height: 500,
//             placeholder: "Enter content here . . .",
//             toolbar: "bold italic strikethrough link numlist bullist blockquote emoticons image"
//         });
//     }

//     $scope.initialize()
// })