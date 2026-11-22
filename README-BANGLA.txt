MosCutoe  -  Website (GitHub + Google)
=======================================

এই ফোল্ডারটাই আপনার পুরো ওয়েবসাইট। কোনো সার্ভার/ইনস্টল লাগে না।

--------------------------------------------------
১) নতুন ডাটা (প্রশ্ন-উত্তর, ছবি) যোগ করার নিয়ম
--------------------------------------------------
ফাইল: data.js   (Notepad দিয়ে খুলুন)
শেষের ]; এর আগে একটা নতুন { } ব্লক বসান, আগের ব্লকের পরে কমা (,) দিন:

 {
  "q": "Who is the Vice Chancellor of Varendra University?",
  "a": "Prof. Dr. ... is the Vice Chancellor of Varendra University.",
  "cat": "university",
  "alt": "vc vice chancellor"
 },

* cat = university | cse | programming | dsa | math | advanced
  (university = "Local Area" বাটনে দেখায়, বাকিগুলো "Worldwide" এ)
* alt = অন্য যে শব্দ দিয়ে মানুষ খুঁজতে পারে (না দিলেও চলে)
* ছবি দিতে: ছবি img/ ফোল্ডারে রাখুন, তারপর
    "images": [ {"src":"img/abc.jpg","name":"নাম"} ]
  একাধিক ছবি দিলে "Image" ট্যাবে সবগুলো আসবে।
* News/Feed: "news": true, "date": "22 Nov 2026"  যোগ করুন → Home এর Feed ও News ট্যাবে আসবে।
* Video: "video": "https://www.youtube.com/watch?v=XXXXXXXXXXX" → Videos ট্যাবে আসবে।

সাইট চালু অবস্থায় "+" বাটন দিয়েও ডাটা যোগ করা যায়, কিন্তু সেটা শুধু ওই ব্রাউজারে থাকে।
সবার জন্য স্থায়ী করতে "Copy code" চেপে কোডটা data.js এ বসান।

--------------------------------------------------
২) GitHub এ আপলোড (Google এ দেখানোর প্রথম ধাপ)
--------------------------------------------------
1. github.com এ একাউন্ট খুলুন → New repository → নাম দিন  moscutoe  → Public → Create.
2. "uploading an existing file" চাপুন। এই website ফোল্ডারের ভেতরের সব ফাইল ও ফোল্ডার
   (index.html, data.js, img, .github সহ) টেনে ছেড়ে দিন → Commit changes।
   (.github ফোল্ডার না গেলে: Add file → Create new file → নাম লিখুন
    .github/workflows/pages.yml → এই প্যাকেজের ফাইলটা কপি-পেস্ট করুন।)
3. Repository → Settings → Pages → Source = "GitHub Actions" সিলেক্ট করুন।
4. Actions ট্যাবে ১-২ মিনিট অপেক্ষা করুন (সবুজ টিক)।
5. আপনার সাইট: https://আপনার-ইউজারনেম.github.io/moscutoe/
   (সাইটম্যাপ, প্রতিটি উত্তরের আলাদা পেজ, robots.txt সব অটো তৈরি হয়ে যায়।)

পরে data.js বা ছবি বদলালে শুধু GitHub এ ফাইল আপডেট করুন, সাইট নিজেই আপডেট হবে।

--------------------------------------------------
৩) Google এ সাবমিট
--------------------------------------------------
1. search.google.com/search-console এ যান → Add property → "URL prefix" →
   https://আপনার-ইউজারনেম.github.io/moscutoe/
2. Verify: "HTML tag" অপশনে একটা <meta name="google-site-verification" ...> দেবে।
   সেটা index.html এ  "Google Search Console" লেখা কমেন্টের ঠিক নিচের ফাঁকা লাইনে বসান
   → GitHub এ সেভ করুন → ১ মিনিট পর Console এ Verify চাপুন।
3. Sitemaps → লিখুন  sitemap.xml → Submit।
4. URL Inspection এ হোমপেজের লিংক বসিয়ে "Request indexing" চাপুন।
5. Google এ আসতে কয়েক দিন থেকে কয়েক সপ্তাহ লাগে — এটা Google এর হাতে, কেউ দ্রুত করতে পারে না।
   "moscutoe" লিখে সার্চ দিলে প্রথমে আসার জন্য নামটা ইউনিক, তাই তুলনামূলক সহজ হবে।

--------------------------------------------------
৪) সত্য কথা (সীমাবদ্ধতা)
--------------------------------------------------
* OTP লগইন এখন ডেমো: কোডটা স্ক্রিনেই দেখায়, SMS/Email যায় না।
  সত্যিকারের OTP চাইলে Firebase Authentication (বিনামূল্যে ইমেইল লিংক; ফোন SMS এ খরচ লাগে)
  যোগ করতে হবে। app.js এর  Otp  অবজেক্ট বদলালেই হবে।
* "AI Mood" হলো আপনার ডাটাবেস থেকে খুঁজে উত্তর দেওয়া — ChatGPT-র মতো AI নয়।
* Create Image আর Camera বাটন "coming soon"।
* GitHub Pages এ C++ চলে না, তাই ওয়েবসাইটের সার্চ JavaScript এ লেখা (একই বুদ্ধি)।
  C++ ব্যাকএন্ড ল্যাব/ম্যাম এর জন্য cpp-lab ফোল্ডারে আছে।
