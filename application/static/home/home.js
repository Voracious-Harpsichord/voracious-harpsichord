var home = angular.module('beautystash.home', ['infinite-scroll', 'angularMoment'])

home.controller('HomeController', function($scope, Feed){
  $scope.items = [];
  $scope.hashItems = {}

  $scope.loadMore = function() {
    Feed.loadEvents()
      .then(function(data) {
        for (var i=0; i < data.length; i++) {
          var timestamp = data[i].time_stamp

          if (!$scope.hashItems.hasOwnProperty(data[i].time_stamp)) {

            $scope.hashItems[data[i].time_stamp] = data[i]
            console.log(data[i])

            if (data[i].view_type === 'product') {
              var imageUrl = (data[i].data.product_image_url ? '../photos/sample2.jpg' : data[i].data.product_image_url)
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                type: 'product',
                location: data[i].user.location,
                time_stamp: timestamp,
                comments: data[i].comments,
                image: imageUrl,
                heading: data[i].data.brand_name,
                subheading1: data[i].data.product_name,
                subheading2: data[i].data.product_category,
                subheading3: data[i].data.product_description,
                subheading4: data[i].data.product_color,
                subheading5: data[i].data.product_status,
              })
            } else if (data[i].view_type === 'article') {
              var imageArticle = (data[i].data.image ? '../photos/sample2.jpg' : data[i].data.image)
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                type: 'article',
                location: data[i].user.location,
                time_stamp: timestamp,
                comments: data[i].comments,
                image: imageArticle,
                heading: data[i].data.article_name,
                subheading1: data[i].data.url
              })
            } else if (data[i].view_type === 'blog') {
              var imageBlog = (data[i].data.image ? '../photos/sample2.jpg' : data[i].data.image)
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                type: 'blog',
                location: data[i].user.location,
                time_stamp: timestamp,
                comments: data[i].comments,
                image: imageBlog,
                heading: data[i].data.site_name,
                subheading1: data[i].data.url
              })
            }
          }
        }
      })
      .catch(function(error) {
        console.error('Error:', error)
      })
  }
}); 
