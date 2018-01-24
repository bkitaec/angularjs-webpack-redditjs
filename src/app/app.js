import angular from 'angular';
import 'angular-paging'
import 'reddit.js/reddit.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/app.css';

let reddit = window.reddit;

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor($scope) {
    this.author = 'https://uptowork.com/mycv/bkitaec';
    this._scope = $scope;
    this._scope.imagesList = [];
    this._scope.searchQuery = '';

    this._scope.after = null;
    this._scope.before = null;
    this.haveResults();
  }

  onSearch (after = null, before = null) {
    let q = reddit.search(this._scope.searchQuery)
    this.haveResults();
    
    if (after) {
      q.after(after);
    }

    if(before) {
      q.before(before);
    }

    q.limit(9).fetch(res => {
      const data = res.data.children;
      const dataLastId = res.data.children.length - 1
      this._scope.imagesList = data;
      this._scope.after = res.data.after;
      this._scope.before = res.data.before; 
      if(dataLastId <= 0){
        this._scope.$apply(() => {this._scope.noresults = true;});
      }       
    });
  };

  nextPage () {
    this.onSearch(this._scope.after, null);
  } 
  prevPage () {
    this.onSearch(null, this._scope.before);
  } 

  $onInit () {
    this.loadTop();
  }

  loadTop() {
    this._scope.searchQuery = ''; 
    this.haveResults();
    reddit.top('funny').t('all').limit(9).fetch(res => {
      this._scope.$apply(() => {this._scope.imagesList = res.data.children});
    });    
  }

  haveResults () {
    this._scope.noresults = false; 
  }

}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['bw.paging'])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;