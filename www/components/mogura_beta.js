// 元のやつ
// ////////////// 情報設定 //////////////////////////////////
// var m_speed = 2;  //スピード
// var m_time = 30;  //ゲーム時間（秒）
// var m_max = 10;    //モグラの最大数
// //////////////////////////////////////////////////////////

// var tokutenn=0;//得点格納
// var m_toku_now = 0;	//現在の得点
// var m_time_now = m_time;//時間
// var m_kazu_now = 0;	//モグラの数
// var m_joutai = new Array(24);	//モグラの状態格納用

// //０～６  (３・４の時だけ当たり判定)

// for ( i = 0; i < 24; i++){
//     m_joutai[i] = 0;  
// } 
// var m_hits = new Array(24);	
// for ( i = 0; i < 24; i++){
//     m_hits[i] = 0;  
// }
// var m_j_point = new Array(24);	//モグラのポイント
// var s_flag = 0;	// 0･･･ゲーム停止 1･･･プレイ中
// m_speed *= 100;

// // ゲームスタートルーチン //

// function m_start(){
//   if (s_flag == 0) {
//     document.getElementById('countdown').classList.remove('hidden');
//     document.getElementById('black').classList.add('black_back');
//     document.getElementById('time').textContent = m_time_now;
//     document.getElementById('score').textContent = "0";
//     i = 3;
//     ti = setInterval("s_time()", 1000);
//     s_flag = 1;
//   }
// }
// function s_time(){
//   if (i == 0) {
//     document.getElementById('countdown').classList.add('hidden');
//     document.getElementById('black').classList.remove('black_back');
//     document.getElementById('start').value = "GO!";
//     clearInterval(ti);
//     ti = setInterval("time_kanri()",1000);
//     mogu_main();
//   }
//   else {
//     document.getElementById('countdown').textContent = i;
//     document.getElementById('start').value = i;
//     i--;
//   }	
// }

// ////////////////// ゲームメイン /////////////////////
// function mogu_main(){
//   if (m_kazu_now < m_max){
//     mogu = mogu_new(11);	//モグラ作成
//   }
//   if (m_kazu_now < m_max){
//     mogu2 = mogu_new(30);	//モグラ２匹目作成（確率低）
//   }
//   move = mogu_move(); 
//   mogu_ti = setTimeout("mogu_main()",m_speed);
// }

// ///////////////////////////////// 新規モグラ作成 /////////////////////
// function mogu_new(m){
//   rnd1 = Math.floor(Math.random() * m);
//   if (rnd1 <= 23){
//     if ( m_joutai[rnd1] == 0){ 	// rnd1番のモグラが未定義ならば
//       m_joutai[rnd1] = 1;  
//       m_kazu_now++;
//       // 何点のモグラになるかを決定
//       rnd2 = Math.floor(Math.random() * 14);	
//       if (rnd2 <= 2) { 
//         m_j_point[rnd1] = 30; 
//       }else if (rnd2 <= 6){
//         m_j_point[rnd1] = -10; 
//       }else {
//         m_j_point[rnd1] = 10;
//       }
//     }
//   }
// }

// // モグラの状態変化 //
// function mogu_move(){
//   for ( i = 0; i < 24; i++){
//     /////各状態ごとに画像の種類分け
//     if (m_hits[i] == 1){
//       xyz = 3; 	// 殴られ済みの時
//     }else if ((m_joutai[i] == 1)||(m_joutai[i] == 6)){
//       xyz = 0;
//     }else if ((m_joutai[i] == 2)||(m_joutai[i] == 5)){
//       xyz = 1;
//     }else if ((m_joutai[i] == 3)||(m_joutai[i] == 4)){
//       xyz = 2;
//     }
//     /////得点ごとに画像の種類分け
//     if ( m_joutai[i] == 0 ){
//       document.images["item" + i].src = ana_n.src;
//     }else if (m_j_point[i] == 10){ 
//       document.images["item" + i].src = ana_ten[xyz].src;
//       m_joutai[i]++;
//     }else if (m_j_point[i] == -10){ 
//       document.images["item" + i].src = ana_ten_m[xyz].src;
//       m_joutai[i]++;
//     }else if (m_j_point[i] == 30){ 
//       document.images["item" + i].src = ana_thr[xyz].src;
//       m_joutai[i]++;
//     }         
//     // モグラ消滅
//     if ( m_joutai[i] == 7){
//       m_joutai[i] = 0; m_kazu_now--; m_hits[i] = 0;
//     }
//   }
// }

// ////////////////////////////////// クリック時 ///////////////////////
// function mogu_click(n){
//   if ((m_joutai[n] == 1)||(m_joutai[n] == 2)||(m_joutai[n] == 3)||(m_joutai[n] == 4)||(m_joutai[n] == 5)||(m_joutai[n] == 6)){
//     if(m_hits[n] == 0){	// まだ殴られて無ければ
//       m_toku_now += m_j_point[n];
//       m_hits[n] = 1;
//     }
//   }	
// }		

// ////////////////////////////////// 時間管理 /////////////////////////
// function time_kanri() {
//   m_time_now--;
//   document.getElementById('time').textContent = m_time_now;
//   document.getElementById('score').textContent = m_toku_now;
//   if (m_time_now == 0){
//     clearTimeout(mogu_ti);
//     clearTimeout(ti);
//     s_flag = 0;
//     m_time_now = m_time;
//     tokutenn = m_toku_now;
//     m_toku_now = 0;

//     for ( i = 0; i < 24; i++){
//       document.images["item" + i].src = ana_n.src;
//     }

//     document.getElementById('time').classList.add('infohidden');
//     document.getElementById('score').classList.add('infohidden');
//     document.getElementById('stop').classList.remove('hidden');
//     document.getElementById('black').classList.add('black_back');
    
//   }
// }