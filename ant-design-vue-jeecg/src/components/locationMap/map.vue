<template>
  <div class="aw-loaction-map">
    <div class="map-wrapper" id="mapContainer"></div>
    <div id="map-search">
      <input type="text" v-model="address" id="keyword" autocomplete="off"/>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name:"location-map",
  props: {
    mapKey: String,
    location: Object
  },
  data() {
    return {
      locationMap: undefined,
      autoComplete: undefined,
      placeSearch: undefined,
      geocoder: undefined,
      marker:null,
      address:''
    }
  },
  mounted() {

    AMapLoader.load({
      "key": this.mapKey,  
      "version": "2.0",
      "plugins": ['AMap.PlaceSearch','AMap.AutoComplete','AMap.Marker','AMap.Geocoder'] //
    }).then((AMap)=>{
      this.locationMap = new AMap.Map('mapContainer',{
        
      })
      this.autoComplete = new AMap.AutoComplete({
          input: "keyword"
      });
      this.autoComplete.on("select",this.search)

      this.placeSearch = new AMap.PlaceSearch({
            map: this.locationMap
      });  //构造地点查询类

      this.geocoder = new AMap.Geocoder();


      if(this.location.longitude != '') {
        this.address = this.location.title
        let lnglat = [this.location.longitude,this.location.latitude]
        this.moveMarker(lnglat)
      }

    }).catch(e=>{
        console.log(e)
    })
  },
  methods: {
    moveMarker(location) {
      this.marker = new AMap.Marker({
        position: location,
        draggable: true,
        cursor: 'move'
      })
      this.marker.setMap(this.locationMap)
      this.locationMap.setFitView()
      this.marker.on('dragend', evt => {
        this.geocoder.getAddress(evt.lnglat, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
              this.address = result.regeocode.formattedAddress;
              this.emitData({
                name: this.address,
                lng: evt.lnglat.lng,
                lat: evt.lnglat.lat,
              })
          } else {
            console.error('根据经纬度查询地址失败')
          }
        })
      })
    },
    search(e) {
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
      this.placeSearch.setCity(e.poi.adcode);
      this.placeSearch.getDetails(e.poi.id,(status,result) => {
        let current = result.poiList.pois[0]
        this.emitData({
          name: current.name,
          lng: current.location.lng,
          lat: current.location.lat,
        })
        this.moveMarker(current.location)
        
      })
    },
    emitData(data) {
      this.$emit("end",data)
    }
  },
  destroyed() {
    this.marker.off('dragend')
  }
}
</script>

<style lang="less">
.aw-loaction-map {
  width: 100%;
  position: relative;
  .map-wrapper {
    width: 100%;
    height: 400px;
  }

  #map-search {
    color: #333;
    border: 1px solid silver;
    position: absolute;
    top: 10px;
    left: 20px;
    right: 20px;
    overflow: hidden;
    line-height: 28px;
    input {
      width: 100%;
      border:none;
      outline: none;
    }
  }


}
</style>