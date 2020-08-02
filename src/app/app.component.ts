import { Component} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Twitter Sentiment App';
  sentimenttext = 'Put something here';
  prediction = 0;
  changeLog: any;

  textchanged(value) {
    this.sentimenttext = value;
    this.predict();
  }

  predict() {
    if (this.sentimenttext.length < 10) {
      this.prediction = this.sentimenttext.length;
    } else {
      this.prediction = -this.sentimenttext.length;
    }
  }
}