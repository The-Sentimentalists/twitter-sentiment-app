import { Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as $ from 'jquery';

// Tutorials: 
// https://towardsdatascience.com/how-to-use-angular-to-deploy-tensorflow-web-apps-5675b5a042cc
// https://medium.com/@alyafey22/sentiment-classification-from-keras-to-the-browser-7eda0d87cdc6
// https://medium.com/@dhormale/integrate-machine-learning-tensorflow-model-with-angular-d72ec9287520

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Twitter Sentiment App';
  sentimenttext = 'Put something here';
  sentiment = '';
  threshold = 0.5;
  changeLog: any;
  model;
  dict: string;
  word_index;
  predictions;
  prediction = 0;

  public async ngOnInit() {
    this.dict = await $.ajax({url: '/assets/dict.csv',dataType: 'text',});
    console.log('dict type',typeof this.dict);
    this.model = await tf.loadLayersModel('/assets/model.json');
    console.log('model type',typeof this.model);
    // console.log(this.model.summary());
    this.word_index = await success(this.dict);
    console.log('word_index type',typeof this.word_index);
  }

  process(txt){
      var out = txt.replace(/[^a-zA-Z0-9\s]/, '');
      out = out.trim().split(/\s+/);
      for (var i = 0 ; i < out.length ; i++)
        out[i] = out[i].toLowerCase();
      return out
  }

  create_sequences(txt){
      var max_tokens = 40;
      var tokens = [];
      var words = this.process(txt);
      var seq = Array.from(Array(max_tokens), () => 0) 
      var start = max_tokens-words.length
      for(var i= 0 ; i< words.length ; i++){
          if (Object.keys(this.word_index).includes(words[i])){
              seq[i+start] = this.word_index[words[i]]
          }    
          
      }
      return seq
  }

  textchanged(value) {
    this.sentimenttext = value;
    // this.predict();
  }

  predict() {
    this.prediction = 0;
    console.log('Button Clicked')
    var seq = this.create_sequences(this.sentimenttext);
    console.log('Seq Created');
    var input = tf.tensor(seq);
    input = input.expandDims(0);
    console.log('Input Created');
    const output = this.model.predict(input);
    this.predictions = Array.from(output.dataSync());
    console.log('predictions type',typeof this.predictions);
    this.prediction = this.predictions[0];
    if (this.prediction < this.threshold) {
      this.sentiment = 'Negative';
    } else {
      this.sentiment = 'Positive';
    }
    // this.prediction = this.predictions.toFloat();
    console.log('Model output');
    // console.log('predictions ', this.predictions);
    // console.log('prediction ', this.prediction);
  }
};

async function success(data){
  var wd_idx = new Object();
  var lst = data.split(/\r?\n|\r/);
  for(var i = 0 ; i < lst.length ;i++){
      var key = (lst[i]).split(',')[0];
      var value = (lst[i]).split(',')[1];
      if(key == "")
          continue
      wd_idx[key] = parseInt(value);
  }
  return wd_idx
}