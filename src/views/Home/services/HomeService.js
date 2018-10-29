import { serviceurl } from '../../../config/serviceurl.js'

export default class HomeService {
    
    dashboardUrl = serviceurl.apiURLDatiGov + "/dashboards";
    storyUrl =  serviceurl.apiURLDatiGov + "/user-stories";
    iframesOpenUrl = serviceurl.apiURLDatiGov + '/dashboard/open-iframes';
    iframesUrl = serviceurl.apiURLDatiGov + '/dashboard/iframes';
    homeUrl = serviceurl.apiURLDatiGov + '/elasticsearch/home';
    publicHomeUrl = serviceurl.apiURLDatiGov + '/public/elasticsearch/home';

    constructor() {

    }

    async iframesOpen() {
        const response = await fetch(this.iframesOpenUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        return response.json();
    }

    async iframes() {
      const response = await fetch(this.iframesUrl, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
      })
      return response.json();
    }

    async homeElements(){
        //var url = serviceurl.apiURLDatiGov + '/elasticsearch/home';
        var token = localStorage.getItem('token')
        const response = await fetch(this.homeUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        return response.json()
    }

    async publicHome(org){
      //var url = serviceurl.apiURLDatiGov + '/elasticsearch/home';
      var token = localStorage.getItem('token')
      var url = this.publicHomeUrl+(org?'?org='+org:'')
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          }
      })

      return response.json()
    }
} 