// APIキーの設定とSDK初期化
var ncmb = new NCMB("0c9a82e830db0ad436ded1fe381fc5e425f03a2bbf094646cb3ab55ad2de5282","012325c75e891197034ff06d13928b66ba75a54d7936719c6507599d6173028b");


//スコアの保存
// ハイスコアのクラス作成
var ScoreClass = ncmb.DataStore("HighScore");

// スコア格納用
let scores = [0,0,0,0,0];

//現在のランキングの取得
var highScore = ncmb.DataStore("HighScore");highScore.order("score", true)
.limit(5)
.fetchAll()
.then(function(results){
  //ランキング取得後の処理
  for (let i = 0; i < results.length; i++) {
    let object= results[i];
    scores[i] = object.score;
    console.log(scores[i]);
  }
})
.catch(function(err){
  //エラー時の処理
});


///////////// 画像位置指定 /////
var ana_n = new Image(); 
ana_n.src = "./img/ana01.gif";  //穴だけの画像  

var ana_ten = new Array(3);
ana_ten[0] = new Image(); ana_ten[0].src = "./img/ana101.gif";//
ana_ten[1] = new Image(); ana_ten[1].src = "./img/ana102.gif";//10点画像
ana_ten[2] = new Image(); ana_ten[2].src = "./img/ana103.gif";//
ana_ten[3] = new Image(); ana_ten[3].src = "./img/ana104.gif";//10点画像破壊後

var ana_thr = new Array(3);
ana_thr[0] = new Image(); ana_thr[0].src = "./img/ana301.gif";//
ana_thr[1] = new Image(); ana_thr[1].src = "./img/ana302.gif";//30点画像
ana_thr[2] = new Image(); ana_thr[2].src = "./img/ana303.gif";//
ana_thr[3] = new Image(); ana_thr[3].src = "./img/ana304.gif";//30点画像破壊後

var ana_ten_m = new Array(3);
ana_ten_m[0] = new Image(); ana_ten_m[0].src = "./img/ana111.gif";//
ana_ten_m[1] = new Image(); ana_ten_m[1].src = "./img/ana112.gif";//-10点画像
ana_ten_m[2] = new Image(); ana_ten_m[2].src = "./img/ana113.gif";//
ana_ten_m[3] = new Image(); ana_ten_m[3].src = "./img/ana114.gif";//-10点画像破壊後

let stage = 0;//ステージ変数
let tokutenn=0;//得点格納

const rank_img  = [
  "./img/ranking_1.png",
  "./img/ranking_2.png",
  "./img/ranking_3.png",
  "./img/ranking_4.png",
  "./img/ranking_5.png"
];

//////////////////////////モグラたたきメイン//////ここから↓////////////////////
class Main{
  constructor(m_speed,m_time,m_max){
    ////////////// 情報設定 //////////////////////////////////
    this.m_speed = m_speed;  //スピード
    this.m_time = m_time;  //ゲーム時間（秒）
    this.m_max = m_max;    //モグラの最大数
    /////////////////////////////////////////////////////////
    
    this.m_toku_now = 0;	//現在の得点
    this.m_time_now = this.m_time;//時間
    this.m_kazu_now = 0;	//モグラの数
    this.m_joutai = new Array(24);	//モグラの状態格納用

    for (let i = 0; i < 24; i++){
      this.m_joutai[i] = 0;  
    } 

    // 当たったかどうかの記録
    //当たっていたら1、当たっていない場合は0
    this.m_hits = new Array(24);	
    // すべて0に初期化
    for (let i = 0; i < 24; i++){
      this.m_hits[i] = 0;  
    }

    this.m_j_point = new Array(24);	//モグラのポイント
    this.s_flag = 0;	// 0･･･ゲーム停止 1･･･プレイ中
    this.m_speed *= 100;

    this.countdown = document.getElementById('countdown');
    this.black = document.getElementById('black');
    this.time = document.getElementById('time');
    this.score = document.getElementById('score');
    this.start = document.getElementById('start');
    this.stop = document.getElementById('stop');
  }

  // ゲームスタートルーチン //
  m_start(){
    if (this.s_flag == 0) {

      if(this.countdown.classList.contains('hidden') === true){
        this.countdown.classList.remove('hidden');
      }
      this.time.textContent = this.m_time_now;
      this.score.textContent = "0";
      this.count = 3;
      this.timeOutId = setInterval(()=>{
        this.s_time();
      }, 1000);
      this.s_flag = 1;
    }
  }

  s_time(){
    if (this.count == 0) {
      if(this.countdown.classList.contains('hidden') === false){
        this.countdown.classList.add('hidden');
      }
      if(this.black.classList.contains('black_back') === true){
        this.black.classList.remove('black_back');
      }
      game_music.play();
      clearInterval(this.timeOutId);
      this.timeOutId = setInterval(()=>{
        this.time_kanri();
      },1000);
      this.mogu_main();
    }
    else {
      countdown_sound.play();
      document.getElementById('countdown').textContent =  this.count;
      document.getElementById('start').value = this.count;
      this.count--;
    }	
  }

  ////////////////// ゲームメイン /////////////////////
  mogu_main(){
    if (this.m_kazu_now < this.m_max){
      this.mogu = this.mogu_new(11);	//モグラ作成
    }
    if (this.m_kazu_now < this.m_max){
      this.mogu2 = this.mogu_new(30);	//モグラ２匹目作成（確率低）
    }
    this.move = this.mogu_move(); 
    this.mogu_ti = setTimeout(()=>{
      this.mogu_main();
    },this.m_speed);
  }

  ///////////////////////////////// 新規モグラ作成 /////////////////////
  mogu_new(m){
    this.rnd1 = Math.floor(Math.random() * m);
    if (this.rnd1 <= 23){
      if ( this.m_joutai[this.rnd1] == 0){ 	// rnd1番のモグラが未定義ならば
        this.m_joutai[this.rnd1] = 1;  
        this.m_kazu_now++;
        // 何点のモグラになるかを決定
        this.rnd2 = Math.floor(Math.random() * 14);	
        if (this.rnd2 <= 2) { 
          this.m_j_point[this.rnd1] = 30; 
        }else if (this.rnd2 <= 6){
          this.m_j_point[this.rnd1] = -10; 
        }else {
          this.m_j_point[this.rnd1] = 10;
        }
      }
    }
  }

  // モグラの状態変化 //
  mogu_move(){
    for (let i = 0; i < 24; i++){
      /////各状態ごとに画像の種類分け
      if (this.m_hits[i] == 1){
        this.xyz = 3; 	// 殴られ済みの時
      }else if ((this.m_joutai[i] == 1)||(this.m_joutai[i] == 6)){
        this.xyz = 0;
      }else if ((this.m_joutai[i] == 2)||(this.m_joutai[i] == 5)){
        this.xyz = 1;
      }else if ((this.m_joutai[i] == 3)||(this.m_joutai[i] == 4)){
        this.xyz = 2;
      }
      /////得点ごとに画像の種類分け
      if ( this.m_joutai[i] == 0 ){
        document.images["item" + i].src = ana_n.src;
      }else if (this.m_j_point[i] == 10){ 
        document.images["item" + i].src = ana_ten[this.xyz].src;
        this.m_joutai[i]++;
      }else if (this.m_j_point[i] == -10){ 
        document.images["item" + i].src = ana_ten_m[this.xyz].src;
        this.m_joutai[i]++;
      }else if (this.m_j_point[i] == 30){ 
        document.images["item" + i].src = ana_thr[this.xyz].src;
        this.m_joutai[i]++;
      }         
      // モグラ消滅
      if (this.m_joutai[i] == 7){
        this.m_joutai[i] = 0; 
        this.m_kazu_now--; 
        this.m_hits[i] = 0;
      }
    }
  }

  ////////////////////////////////// クリック時 ///////////////////////
  mogu_click(n){
    // bgm
    click_sound.play();

    if ((this.m_joutai[n] == 1)||(this.m_joutai[n] == 2)||(this.m_joutai[n] == 3)||(this.m_joutai[n] == 4)||(this.m_joutai[n] == 5)||(this.m_joutai[n] == 6)){
      if(this.m_hits[n] == 0){	// まだ殴られて無ければ
        this.m_toku_now += this.m_j_point[n];

        // ステージ2の場合、-10以外をタップしたら10点追加
        if(stage === 2 && this.m_j_point[n] !== -10){
          this.m_toku_now += 5;
        }

        this.m_hits[n] = 1;
      }
    }	
  }		

  ////////////////////////////////// 時間管理 /////////////////////////
  time_kanri() {
    this.m_time_now--;
    this.time.textContent = this.m_time_now;
    this.score.textContent = this.m_toku_now;
    if(stage == 1){
      if(this.m_time_now == 15){
        this.m_max = 7;
      }
      else if(this.m_time_now == 10){
        this.m_max = 10;
      }
    }
    if(stage == 2){
      if(this.m_time_now == 15){
        this.m_max = 5;
      }
      else if(this.m_time_now == 10){
        this.m_max = 7;
      }
    }

    if (this.m_time_now == 0){
      clearTimeout(this.mogu_ti);
      clearTimeout(this.timeOutId);
      this.s_flag = 0;
      this.m_time_now = this.m_time;
      tokutenn = this.m_toku_now;
      this.m_toku_now = 0;
      stage = 0;
      for (let i = 0; i < 24; i++){
        document.images["item" + i].src = ana_n.src;
      }

      // bgm
      whistle.play();
      game_music.pause();
      game_music.currentTime = 0;

      this.time.classList.add('infohidden');
      this.score.classList.add('infohidden');
      this.stop.classList.remove('hidden');
      this.black.classList.add('black_back');   
    }
  }
}
//////////////////////////モグラたたきメイン//////ここまで↑////////////////////

//////////////////////////////////////////////BGM//////////////
  const start_music = new Audio("./bgm/start.mp3");
  start_music.loop = true;
  start_music.addEventListener("ended",()=>{
    start_music.currentTime = 0;
    start_music.play();
  }, false);

  const game_music = new Audio('./bgm/たいへんだ〜！_2.mp3');
  game_music.loop = true;
  game_music.addEventListener("ended",()=>{
    game_music.currentTime = 0;
    game_music.play();   
  }, false);

  const click_sound = new Audio("./bgm/打撃音.mp3");
  click_sound.preload = "auto";

  const whistle = new Audio("./bgm/syuuryou.mp3");
  const countdown_sound = new Audio("./bgm/Countdown.mp3");


  const result_music = new Audio("./bgm/result.mp3");
  result_music.loop = true;
  result_music.addEventListener("ended",()=>{
    result_music.currentTime = 0;
    result_music.play();   
  }, false);

///////////////////////////////////////////////////////////////

////////////////////////////画面遷移//////////////////////////////////
document.addEventListener('init', function(event) {
  var page = event.target;

  //////////////////////////スタート画面/////////////////////////////////
  if (page.matches('#start-page')) {
    //bgm
    start_music.play();
    // ステージ選択画面へ
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#navigator').pushPage('stage_choose.html');
    };
  } 

  if (page.matches('#start-page')) {
    // ルール説明画面へ
    page.querySelector('#push-rule-button').onclick = function() {
      document.querySelector('#navigator').pushPage('rule.html');
    };
  } 
  if (page.matches('#start-page')) {
    // ルール説明画面へ
    page.querySelector('#push-ranking-button').onclick = function() {
      document.querySelector('#navigator').pushPage('ranking.html');
    };
  } 

  ///////////////////////////ゲーム画面(ステージ1)////////////////////////////
  if (page.matches('#game_stage1-page')) {
    // bgm
    start_music.pause();
    start_music.currentTime = 0;
    // インスタンス生成
    const main = new Main(2,30,5);//スピード,ゲーム時間（秒）,モグラの最大数
    // スタートボタンが押されたとき
    document.getElementById('start').addEventListener('click', ()=>{
      main.m_start();
    });
    //穴用配列
    const mogu_clicks = new Array(23);
    for(let i = 0;i<24;i++){
      // 要素取得
      mogu_clicks[i] = document.getElementById(`mogu_click${i}`);
      // 穴画像挿入
      mogu_clicks[i].src = "./img/ana01.gif";
    }
    // モグラの穴がタップされたとき
    mogu_clicks.forEach((mogu_click,index)=>{
      mogu_click.addEventListener('click',()=>{
        main.mogu_click(index);
      });
    });
    // リザルト画面へ
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#navigator').pushPage('result.html');
    };
  }
  ///////////////////////////ゲーム画面(ステージ2)////////////////////////////
  if (page.matches('#game_stage2-page')) {
    // bgm
    start_music.pause();
    start_music.currentTime = 0;
    // インスタンス生成
    const main = new Main(2,25,3);//スピード,ゲーム時間（秒）,モグラの最大数
    // スタートボタンが押されたとき
    document.getElementById('start').addEventListener('click', ()=>{
      main.m_start();
    });
    //穴用配列
    const mogu_clicks = new Array(23);
    for(let i = 0;i<24;i++){
      // 要素取得
      mogu_clicks[i] = document.getElementById(`mogu_click${i}`);
      // 穴画像挿入
      mogu_clicks[i].src = "./img/ana01.gif";
    }
    // モグラの穴がタップされたとき
    mogu_clicks.forEach((mogu_click,index)=>{
      mogu_click.addEventListener('click',()=>{
        main.mogu_click(index);
      });
    });
    // リザルト画面へ
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#navigator').pushPage('result.html');
    };
  }

  //////////////////////////////////////リザルト画面//////////////////////////
  if (page.matches('#result-page')) {


    /////////////////////スコア保存///////////////////
    console.log(tokutenn);
    // インスタンス生成
    var score = new ScoreClass();
    score.set("score", tokutenn);
    score.save()
     .then(function (){
         //保存成功時の処理
     })
     .catch(function (error){
         //失敗時の処理
     });
     //ランキングの取得
    highScore.order("score", true)
    .limit(5)
    .fetchAll()
    .then(function(results){
      //ランキング取得後の処理
      for (let i = 0; i < results.length; i++) {
        let object= results[i];
        scores[i] = object.score;
        console.log(scores[i]);
      }
    })
    .catch(function(err){
      //エラー時の処理
    });
    /////////////////////////////////////////////////
   
    //bgm
    result_music.play();
    //得点の入力
    document.getElementById('tokutenn').textContent = String(tokutenn);
    //スタート画面へ
    page.querySelector('#pop-button').onclick = function() {
      document.querySelector('#navigator').popPage({times: 3});
      //bgm
      result_music.pause();
      result_music.currentTime = 0;
      start_music.play();
    };

    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#navigator').pushPage('ranking.html');
    };
  }

  ///////////////////////////////////////追加要素/////////////////////////////

  //////////////////////ルール説明画面///////////////////////////////////////
  if (page.matches('#rule-page')) {
 
    // スタート画面へ
    page.querySelector('#pop-button').onclick = function() {
      document.querySelector('#navigator').popPage();
    };
  } 


  ///////////////////////ステージ選択画面////////////////////////////////////
  if (page.matches('#stage_choose-page')) {

    // ゲーム画面へ
    page.querySelector('#push-stage1-button').onclick = function() {
      document.querySelector('#navigator').pushPage('game_stage1.html');

      stage = 1;//ステージ1を登録
    };
  } 
  if (page.matches('#stage_choose-page')) {
    // ゲーム画面へ
    page.querySelector('#push-stage2-button').onclick = function() {
      document.querySelector('#navigator').pushPage('game_stage2.html');

      stage = 2;//ステージ2を登録
    };
  }

  ///////////////////////ランキング画面////////////////////////////////////
  if (page.matches('#ranking-page')) {
    
        
    //画像用要素配列
    const rank_img_numbers = new Array(4);
    // スコア用要素配列
    const rank_scores  = new Array(4);
    
    //王冠と点数の追加
    for(let i = 0;i < 5;i++){
      // 王冠追加
      rank_img_numbers[i] = document.createElement('img');
      rank_img_numbers[i].classList.add('rank_img');
      rank_img_numbers[i].src = rank_img[i];
      document.getElementById(`number${i+1}`).appendChild(rank_img_numbers[i]);
      
      // スコア追加
      rank_scores[i] = document.createElement('h2');
      rank_scores[i].classList.add('rank_score');
      rank_scores[i].textContent = scores[i] + '点';
      document.getElementById(`number${i+1}`).appendChild(rank_scores[i]);
    }

    // スタート画面へ
    page.querySelector('#pop-start-button').onclick = function() {
      document.querySelector('#navigator').popPage({times: 4});
      //bgm
      result_music.pause();
      result_music.currentTime = 0;
      start_music.play();
    };
  } 
});