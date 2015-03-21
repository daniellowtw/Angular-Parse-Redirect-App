var app = angular.module('redirect', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/none.html',
                controller: 'mainCtrl'
            })
            .when('/add', {
                templateUrl: 'views/add.html',
                controller: 'addCtrl'
            })
            .when('/delete/:name', {
                templateUrl: 'views/delete.html',
                controller: 'addCtrl'
            })
            .when('/:id', {
                templateUrl: 'views/redirect.html',
                controller: 'redirectCtrl',
                resolve: {
                    link: function($q, $route) {
                        var id = $route.current.params.id
                        var Redirect = Parse.Object.extend("redirects");
                        var myLink = $q.defer();
                        var query = new Parse.Query(Redirect);
                        query.equalTo("name", id);
                        query.find({
                            success: function(results) {
                                if (results.length) {
                                    var link = results[0].get('link')
                                    myLink.resolve({
                                        message: "You will now be redirected. If you have disabled JavaScript, please click on the following link: ",
                                        link: link
                                    })
                                } else {
                                    myLink.resolve({
                                        message: "There is no such link",
                                        link: ""
                                    })
                                }
                            },
                            error: function(error) {
                                myLink.reject("Error: " + error.code + " " + error.message);
                            }
                        });
                        return myLink.promise
                    }
                }
            })
            // This along with .htaccess file will allow redirects to be of the form http://server/r/short_code rather than http://server/r/#/short_code. Need to check whether this works as expected for browsers that don't support html5.
        $locationProvider.html5Mode(true)
    })
    .run(function($routeParams) {
        Parse.initialize(API_KEY, JAVASCRIPT_KEY);
    });

app.controller('mainCtrl', function($scope, $routeParams) {})
app.controller('redirectCtrl', function($scope, $routeParams, link) {
    if (link.message) {
        $scope.message = link.message
    }
    if (link.link) {
        $scope.link = link.link;
        document.location = link.link
    }
})

app.controller('addCtrl', function($scope, $routeParams) {
    $scope.submitFunction = function(r, l, h) {
        // Probably need do this on server before save.
        if (CryptoJS.SHA512(h).toString() != SECRETHASH) {
            $scope.error = {
                msg: "Wrong code"
            }
            return
        }

        if (!r || !l) {
            $scope.error = {
                msg: "Failed to save to database."
            }
            return
        }
        var RedirectObject = Parse.Object.extend("redirects");
        var rObject = new RedirectObject();
        rObject.save({
            name: r,
            link: l
        }).then(function(object) {
            $scope.$apply(function() {
                $scope.success = {
                    msg: "Success! Link is now live " + l
                }
            })
        });
    }

    $scope.submitDelete = function(h) {
        // Probably need do this on server before save.
        if (CryptoJS.SHA512(h).toString() != SECRETHASH) {
            $scope.error = {
                msg: "Wrong code"
            }
            return
        }
        var Redirect = Parse.Object.extend("redirects");
        var query = new Parse.Query(Redirect);
        query.equalTo("name", $routeParams['name']);
        query.find({
            success: function(results) {
                if (results.length) {
                    var link = results[0].destroy({
                        success: function(myObject) {
                            $scope.$apply(function() {
                                $scope.success = {
                                    msg: "Successfully removed link"
                                }
                            })
                        },
                        error: function(myObject, error) {
                            $scope.$apply(function() {
                                $scope.error = {
                                    msg: error.message
                                }
                            })
                        }
                    })

                } else {
                    $scope.$apply(function() {
                        $scope.error = {
                            msg: "Error! There is no such link"
                        }
                    })
                }

            },
            error: function(error) {
                $scope.$apply(function() {
                    $scope.error = {
                        msg: "Error: " + error.code + " " + error.message
                    }
                })
            }
        });
    }
})