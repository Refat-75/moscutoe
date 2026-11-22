// =====================================================================
// MosCutoe DATABASE  -  ekhane sob answer thake.
// Notun data dite: niche list er sheshe ekta { ... }, joda dao (comma dao).
//
//  q      = proshno (question)                         [dorkar]
//  a      = uttor (answer)                             [dorkar]
//  cat    = university | cse | programming | dsa | math | advanced   [dorkar]
//  alt    = onno shobdo jeta diye keu khujte pare      [optional]
//  images = [ {src:'img/chobi.jpg', name:'Nam'} ]      [optional, chobi img/ folder e rakho]
//  news   = true   -> Home page er "Feed" ar News tab e dekhabe        [optional]
//  date   = '22 Nov 2026'  (news er tarikh)                            [optional]
//  video  = 'https://www.youtube.com/watch?v=XXXX'  -> Videos tab e    [optional]
//
// Data dewar por:  node build.mjs https://USER.github.io/REPO   (GitHub e upload korle auto hoye jabe)
// =====================================================================
window.MOSCUTOE_DB = [
 {
  "q": "Who is the founder of Mosquito The (MosCutoe)?",
  "a": "The three students of Varendra University in the CSE Department are the founders of Mosquito The (MosCutoe): Md Refat Hossain, Rijonty Moitra and Iemam Hossain Shaon.",
  "cat": "university",
  "alt": "founders creator creators developer developers owner owners made built team moscutoe mosquito the moscuto mos cutoe who made",
  "images": [
   {
    "src": "img/refat.jpg",
    "name": "Md Refat Hossain"
   },
   {
    "src": "img/rijonty.jpg",
    "name": "Rijonty Moitra"
   },
   {
    "src": "img/shaon.jpg",
    "name": "Iemam Hossain Shaon"
   }
  ],
  "id": "b1"
 },
 {
  "q": "What is MosCutoe?",
  "a": "MosCutoe (Mosquito The) is a search engine built by three Computer Science and Engineering students of Varendra University as their Data Structure Lab project (CSE 2103). Its tagline is \"Search Beyond Limits\".",
  "cat": "university",
  "alt": "about moscutoe mosquito the moscuto search engine project",
  "id": "b2"
 }
];
