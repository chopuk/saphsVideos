import { Component, ViewChild } from '@angular/core'
import { IonContent } from '@ionic/angular'
import { Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx'
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx'
import { YoutubeService } from "../youtube.service"

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent) content: IonContent

  saphdata: any[]
  remainingSaphdata: any[]
  filteredSaphdata: any[]
  virtualFilteredSaphdata: any[]
  searchString: string[]
  pageNo = 0
  itemsToDisplay = 20
  scrollingComplete = false

  constructor( private router: Router, 
                private youTubeService: YoutubeService,
                private speechRecognition: SpeechRecognition,
                private screenOrientation: ScreenOrientation ) {}

  async ionViewWillEnter() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    this.resetDisplay()
    this.saphdata = await this.youTubeService.getFirstVideos()
    this.filteredSaphdata = Object.assign([],this.saphdata)
    this.loadData("")
    this.remainingSaphdata = await this.youTubeService.getRemainingVideos()
    this.saphdata = [...this.saphdata, ...this.remainingSaphdata]
    this.filteredSaphdata = Object.assign([],this.saphdata)
  }

  resetDisplay() {
    this.pageNo = 0
    this.virtualFilteredSaphdata = []
    this.scrollingComplete = false
  }

  async filterVideos() {

    this.searchString = await this.speechRecognition.startListening({prompt:"Filter By Title", showPopup:true}).pipe(take(1)).toPromise()

    this.filteredSaphdata = await this.youTubeService.filterVideos(this.searchString[0])
    this.resetDisplay()
    this.loadData("")
    this.content.scrollToTop()
  }

  async sortDate(direction) {
    
    if (direction === "ascending") {
      this.filteredSaphdata = Object.assign([],this.saphdata.sort((a,b) => {return new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime()}))
    } else {
      this.filteredSaphdata = Object.assign([],this.saphdata.sort((a,b) => {return new Date(a.snippet.publishedAt).getTime() - new Date(b.snippet.publishedAt).getTime()}))
    }
    this.resetDisplay()
    this.loadData("")
    this.content.scrollToTop()
  }

  async sortViews(direction) {
    
    if (direction === "ascending") {
      this.filteredSaphdata = Object.assign([],this.saphdata.sort((a,b) => {return (b.viewsInt - a.viewsInt)}))
    } else {
      this.filteredSaphdata = Object.assign([],this.saphdata.sort((a,b) => {return (a.viewsInt - b.viewsInt)}))
    }
    this.resetDisplay()
    this.loadData("")
    this.content.scrollToTop()
  }

  openMyVideo(id){
    this.router.navigateByUrl(`/video/${id}`)
  }

  loadData(event) {

    for (var i = (this.pageNo * this.itemsToDisplay); (i < (this.pageNo * this.itemsToDisplay) + this.itemsToDisplay); i++) {
      if (i < this.filteredSaphdata.length) {
        this.virtualFilteredSaphdata.push(this.filteredSaphdata[i])
      }
    }
    if (this.pageNo !== 0) {
      event.target.complete()
    }
    this.pageNo = this.pageNo + 1
    if (this.virtualFilteredSaphdata.length == this.filteredSaphdata.length) {
      this.scrollingComplete = true
    }

  }

}
