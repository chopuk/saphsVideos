import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx'

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {
  
  youTubeString

  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private screenOrientation: ScreenOrientation) { }

    ngOnInit() {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE)
      let videoId = this.activatedRoute.snapshot.paramMap.get('id')
      this.youTubeString = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + videoId + "?autoplay=1")
    }
  
    goBack() {
      this.router.navigateByUrl('/home');
    }

}
