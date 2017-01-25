(function () {

    'use strict';

    function homeController(appConfig, $state, auth, api, alertService, core, $scope) {

        if (!auth.authentication.isLogged) {
            $state.go('login');
            return;
        }

        var that = this;

        that.restaurantsList = [];

        that.m = {
            order_by: "id",
            order_way: "ASC",
            paginationOffset: 0,
            paginationCount: 3,
            inRequest: false,
            search_by: null
        };


        that.search = function (keyword) {

            that.inRequest = true;

            var m = {
                order_by: that.m.order_by,
                order_way: that.m.order_way,
                paginationOffset: that.m.paginationOffset,
                paginationCount: that.m.paginationCount,
                search_by: that.m.search_by
            };

            for (var i in m) {
                if (!m[i]) {
                    delete  m[i]
                }
            }

            if (keyword) {
                if (that.m.order_by == keyword) {
                    that.m.order_way = m.order_way == 'ASC' ? 'DESC' : 'ASC';
                    m.order_way = m.order_way == 'ASC' ? 'DESC' : 'ASC'
                } else {
                    that.m.order_by = keyword;
                    m.order_by = keyword;
                }
            }
            if (m.paginationOffset > 0 && !keyword) {
                m.paginationOffset = (m.paginationOffset - 1) * m.paginationCount;
            }


            api.get_restaurants(m).then(function (res) {
                try {
                    that.restaurantsList = res.data.data.restaurants_list;
                    that.paginationTotal = res.data.data.total;
                } catch (e) {
                    console.log(e);
                }
                that.m.inRequest = false;
            }, function (e) {
                console.log(e);
                that.m.inRequest = false;
            })
        };

        that.search();

        that.searchByWord = function (word) {
            that.m.search_by = word || '';
        };

        $scope.$watch('$ctr.m', function () {
            that.search();
        }, true);


    }

    homeController.$inject = ['appConfig', '$state', 'auth', 'api', 'alertService', 'core', '$scope'];

    angular.module('inspinia').component('homeComponent', {
        templateUrl: 'js/components/home/home.html',
        controller: homeController,
        controllerAs: '$ctr',
        bindings: {}
    });

})();