app.controller('review-controller', function ($scope, $http, $window) {
    $scope.form = {
        isDisplay: true,
        createDate: new Date(),
        createBy: sessionStorage.getItem('username')
    }
    $scope.items = []

    $scope.message = ""
    $scope.error = ""

    $scope.review = {
        itemDelete: {},
        // create(){
        //     let item = angular.copy($scope.form)
        //     console.log("item: ", item)
        //     $http.post(`http://localhost:8080/rest/review/create`, item).then(resp =>{
        //         $scope.items.push(resp.data)
        //         this.reset()
        //         console.log("category1", resp.data)
        //         $scope.message = "Create blog successfully!"
        //     }).catch(err => {
        //         $scope.error = "Error create blog!"
        //         console.log("create error:", err)
        //     })
        //     this.liveToastBtn()
        // },
        // update(){
        //     let item = angular.copy($scope.form)

        //     $http.put(`http://localhost:8080/rest/blog/update`, item).then(resp =>{
        //         let index = $scope.items.findIndex(item => item.id == resp.data.id)
        //         $scope.items[index] = item
        //         this.reset()
        //         $scope.message = "Update blog successfully!"
        //         $window.location.reset()
        //     }).catch(err => $scope.error = "Error blog category!")
        //     this.liveToastBtn()
        // },
        // clickDelete(item){
        //     this.itemDelete = item
        // },
        // confirmDelete() {
        //     $http.delete(`http://localhost:8080/rest/blog/delete/${this.itemDelete.id}`).then(resp =>{
        //         let index = $scope.items.findIndex(item => item.id == this.itemDelete.id)
        //         $scope.items.splice(index, 1)
        //         this.reset()
        //         $scope.message = "Delete blog successfully!"
        //     }).catch(err => $scope.error = "Error blog category!")
        //     this.liveToastBtn()
        // },
        edit(review){
            this.reset()
            $scope.form= {}
            let item = {
                id: blog.id,

                title: blog.title,
                content: blog.content,
                isDisplay: blog.isDisplay,
                createBy: blog.user.username,
                viewCount: blog.viewCount,
                createDate: new Date(blog.createDate), // can format
                status: blog.status,




                // <th scope="row">{{$index + 1}}</th>
                
                //     <td class="text-center">{{c.id}}</td>

                //     <td class="text-center">{{c.food.name}}</td>

                //     <td class="text-center">{{c.customer.email}}</td>

                //     <td class="text-center">{{c.rating}}</td>

                //     <td class="text-center">{{c.createDate | date:'dd-MM-yyyy'}}</td>
                    
                //     <td class="text-center">{{c.updateDate | date:'dd-MM-yyyy'}}</td>

                //     <td class="text-center">{{c.isFavorite?'No':'Yes'}}</td>

                //     <td class="text-center">{{c.isDisplay?'No':'Yes'}}</td>
            }
            console.log("isDisplay: ", blog.isDisplay)
            // console.log('12',item)
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
            this.incrementLimit(true)
        },
        prev() {
            this.incrementLimit(false)
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
        $http.get(`http://localhost:8080/rest/review/getAll`).then(resp =>{
            $scope.items = resp.data
            console.log('list: ', resp.data)
        })

    }
    $scope.initialize()
})

