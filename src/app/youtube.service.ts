import { Injectable } from '@angular/core'
import { HttpClient } from "@angular/common/http"
import { forkJoin } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  apiKey = "AIzaSyBr85GK67KCTN92VT1rTPZ2W8UzuD93RAE"
  playlistId = "UUrbrN66-0KK6DaLJg2t5fvQ"
  part = "snippet,contentDetails"
  statistics = "statistics"
  maxResults = "50"

  playlistItemsUrl   = "https://www.googleapis.com/youtube/v3/playlistItems"
  videoStatisticsUrl = "https://www.googleapis.com/youtube/v3/videos"

  videoList = []
  remainingVideoList = []

  mydata
  data
  myStatistics
  stats
  videoIds
  nextPageToken

  constructor( private http: HttpClient) { }

  async getFirstVideos() {
    
    this.data = await this.http.get(this.playlistItemsUrl + "?key=" + this.apiKey + "&playlistId=" + this.playlistId + 
      "&part=" + this.part + "&maxResults=" + this.maxResults).toPromise()

    this.mydata = this.data.items
    this.nextPageToken = this.data.nextPageToken

    this.videoList = Object.assign([],this.mydata)

    this.videoIds = []
    this.videoList.forEach(video => {
      this.videoIds.push(video.contentDetails.videoId)
    })

    let firstList = this.videoIds.splice(0)
    let getFirstList = this.http.get(this.videoStatisticsUrl + "?key=" + this.apiKey + "&id=" + firstList + "&part=" + this.statistics)
    let stats = await forkJoin([getFirstList]).toPromise()
    this.myStatistics = stats[0]
    this.mydata = this.myStatistics.items

    for (let index=0; index < this.videoList.length; index++) {
      this.videoList[index].views = parseInt(this.mydata[index].statistics.viewCount).toLocaleString('en')
      this.videoList[index].likes = parseInt(this.mydata[index].statistics.likeCount).toLocaleString('en')
      this.videoList[index].viewsInt = parseInt(this.mydata[index].statistics.viewCount)
      this.videoList[index].likesInt = parseInt(this.mydata[index].statistics.likeCount)
      this.videoList[index].dateUploaded = this.convertUploadedDate(this.videoList[index].snippet.publishedAt)
    }

    return this.videoList

  }

  async getRemainingVideos() {

    this.data = await this.http.get(this.playlistItemsUrl + "?key=" + this.apiKey + "&playlistId=" + this.playlistId + 
      "&part=" + this.part + "&maxResults=" + this.maxResults + "&pageToken=" + this.nextPageToken).toPromise()
    this.mydata = this.data.items

    this.data = await this.http.get(this.playlistItemsUrl + "?key=" + this.apiKey + "&playlistId=" + this.playlistId + 
      "&part=" + this.part + "&maxResults=" + this.maxResults + "&pageToken=" + this.data.nextPageToken).toPromise()
    this.mydata = [...this.mydata, ...this.data.items]

    this.data = await this.http.get(this.playlistItemsUrl + "?key=" + this.apiKey + "&playlistId=" + this.playlistId + 
      "&part=" + this.part + "&maxResults=" + this.maxResults + "&pageToken=" + this.data.nextPageToken).toPromise()
    this.mydata = [...this.mydata, ...this.data.items]

    this.data = await this.http.get(this.playlistItemsUrl + "?key=" + this.apiKey + "&playlistId=" + this.playlistId + 
      "&part=" + this.part + "&maxResults=" + this.maxResults + "&pageToken=" + this.data.nextPageToken).toPromise()
    this.mydata = [...this.mydata, ...this.data.items]

    this.remainingVideoList = Object.assign([],this.mydata)

    this.videoIds = []
    this.remainingVideoList.forEach(video => {
      this.videoIds.push(video.contentDetails.videoId)
    })

    let fourthList = this.videoIds.splice(150)
    let thirdList = this.videoIds.splice(100)
    let secondList = this.videoIds.splice(50)
    let firstList = this.videoIds.splice(0)
    let getFirstList = this.http.get(this.videoStatisticsUrl + "?key=" + this.apiKey + "&id=" + firstList + "&part=" + this.statistics)
    let getSecondList = this.http.get(this.videoStatisticsUrl + "?key=" + this.apiKey + "&id=" + secondList + "&part=" + this.statistics)
    let getThirdList = this.http.get(this.videoStatisticsUrl + "?key=" + this.apiKey + "&id=" + thirdList + "&part=" + this.statistics)
    let getFourthList = this.http.get(this.videoStatisticsUrl + "?key=" + this.apiKey + "&id=" + fourthList + "&part=" + this.statistics)
    let stats = await forkJoin([getFirstList,getSecondList,getThirdList,getFourthList]).toPromise()
    this.myStatistics = stats[0]
    this.mydata = this.myStatistics.items
    this.myStatistics = stats[1]
    this.mydata = [...this.mydata, ...this.myStatistics.items]
    this.myStatistics = stats[2]
    this.mydata = [...this.mydata, ...this.myStatistics.items]
    this.myStatistics = stats[3]
    this.mydata = [...this.mydata, ...this.myStatistics.items]
    

    for (let index=0; index < this.remainingVideoList.length; index++) {
      this.remainingVideoList[index].views = parseInt(this.mydata[index].statistics.viewCount).toLocaleString('en')
      this.remainingVideoList[index].likes = parseInt(this.mydata[index].statistics.likeCount).toLocaleString('en')
      this.remainingVideoList[index].viewsInt = parseInt(this.mydata[index].statistics.viewCount)
      this.remainingVideoList[index].likesInt = parseInt(this.mydata[index].statistics.likeCount)
      this.remainingVideoList[index].dateUploaded = this.convertUploadedDate(this.remainingVideoList[index].snippet.publishedAt)
    }

    this.videoList = [...this.videoList, ...this.remainingVideoList]

    return this.remainingVideoList

  }

  async filterVideos(searchString) {

    if ( searchString.toLowerCase() === "reset") {
      return await this.videoList
    } else {
      return await this.videoList.filter(video => 
        video.snippet.title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
    }
    
  }

  convertUploadedDate(dateString) {

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    let timestamp = new Date(dateString).getTime()
    let Day = new Date(timestamp).getDate()
    let MonthNumber = new Date(timestamp).getMonth()
    let Month = monthNames[MonthNumber]
    let Year = new Date(timestamp).getFullYear()

    let convertedDate

    if (Day.toString().length == 1) {
      convertedDate = `0${Day}-${Month}-${Year}`
    } else {
      convertedDate = `${Day}-${Month}-${Year}`
    }
    
    return convertedDate
  }

}
