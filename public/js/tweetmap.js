function initMap() {
  const mapContainer = document.getElementById("map")

  if (mapContainer) {
    window.tweetMap = new TweetMap(mapContainer)
    window.tweetMap.centerOnBrowser()
    window.tweetMap.fetchTweets()
  }
}

class TweetMap {
  constructor(container) {
    const center = {
      lat: 41.38623,
      lng: 2.17498
    };

    this.markers = []

    this.map = new google.maps.Map(container, {
      zoom: 13,
      center
    });
  }

  centerOnBrowser() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition((position) => {
      const center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.map.setCenter(center)
    });
  }

  addTweet(tweet) {
    const [lng, lat] = tweet.location.coordinates

    const tweetMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map
    });

    const infoWindow = new google.maps.InfoWindow({
      maxWidth: 300,
      content: `
        <p>${tweet.body}</p>
      `
    });

    tweetMarker.addListener('click', function () {
      infoWindow.open(this.map, tweetMarker);
    });

    this.markers.push(tweetMarker)
  }

  fetchTweets() {
    axios.get('/tweets/locations')
      .then(response => {
        const tweets = response.data
        
        tweets.forEach(tweet => {
          this.addTweet(tweet)
        })
      })
      .catch(err => console.error(err))
  }
}
