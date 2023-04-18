app.controller('review-controller', function ($scope, $http, $window) {
    $scope.imageFoodId = {}
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
       
        clickDelete(item) {
            this.itemDelete = item
        },
        confirmDelete() {
            $http.delete(`http://localhost:8080/rest/review/delete/${this.itemDelete.id}`).then(resp => {
                let index = $scope.items.findIndex(item => item.id == this.itemDelete.id)
                $scope.items.splice(index, 1)
                this.reset()
                $scope.message = "Delete review successfully!"
            }).catch(err => $scope.error = "Error review category!")
            this.liveToastBtn()
        },
        edit(review) {
            this.reset()
            $scope.form = {}
            let item = {
                id: blog.id,

                title: blog.title,
                content: blog.content,
                isDisplay: blog.isDisplay,
                createBy: blog.user.username,
                viewCount: blog.viewCount,
                createDate: new Date(blog.createDate), // can format
                status: blog.status,

            }
            $scope.form = angular.copy(item)
        },
        reset() {
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
    $scope.viewReview = function (review) {
        $http.get(`http://localhost:8080/rest/review/findById/${review.food.id}`).then(resp => {
            $scope.reviewFood = resp.data
            console.log(resp.data)

        })

    }
    $scope.initialize = function () {
        $http.get(`http://localhost:8080/rest/review/getAll`).then(resp => {
            $scope.items = resp.data
            console.log(resp.data)
        })


    }
    $scope.initialize()
})

