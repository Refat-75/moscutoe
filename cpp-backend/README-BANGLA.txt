=====================================================================
 MosCutoe  -  C++ BACKEND  (Data Structures Lab, CSE 2103)
=====================================================================

EI FOLDER E KI ACHE
  database.txt    shob question-answer (ekhane data dao)
  structs.h       Array, Stack, Queue  (amader nijer banano, shob struct)
  text_tools.h    text bhanga, shobdo milano
  search.h        search engine
  database.h      database.txt pora ar likha
  site_builder.h  website er file banano (data.js, answer page, sitemap)
  main.cpp        menu (program ekhan theke shuru)

KIVABE CHALABE (Windows / Linux / Mac, terminal e)
  cd cpp-backend
  g++ -std=c++17 main.cpp -o moscutoe
  ./moscutoe            (Windows e:  moscutoe.exe)

  Menu theke: 1 Search, 2 Shob question, 3 Add, 4 Delete,
              5 History (Stack), 6 Undo (Stack pop), 7 Website banao

  Ek line e:   ./moscutoe search "who is the vice chancellor"
  Website file: ./moscutoe build https://refat-75.github.io/moscutoe

WEBSITE KIVABE C++ DIYE CHOLE
  Tumi database.txt e data dao ->
  GitHub e upload korle GitHub Actions nijei C++ compile kore chalay ->
  C++ program data.js, answer page, sitemap.xml banay ->
  GitHub Pages e website live hoy.
  (Mane: website er shob data ar page C++ backend theke ashe.
   Browser e search box er UI JavaScript e, karon GitHub Pages e C++ chole na.
   Ei same search engine C++ e ei folder e ache, terminal e chalaye dekhano jay.)

3 TA DATA STRUCTURE (structs.h) - MAMA KE BOLO
  1. ARRAY  (EntryArray)
     Shob question-answer ekta bor array te thake.
     Insert sheshe = O(1).  Delete majhe theke = O(n) (porer gulo shift hoy).
     Array bhore gele nijei double hoy (dynamic array).
  2. STACK  (HistoryStack)  LIFO - Last In First Out
     Search history rakhe. Sheshe kora search prothome ber hoy.
     push / pop / peek shob O(1).   "Undo last search" = pop.
  3. QUEUE  (ResultQueue)   FIFO - First In First Out, circular
     Search er bhalo result gulo line e thake, shera ta prothome ber hoy.
     enqueue / dequeue O(1).  % diye shesh theke abar shuru te ghore.

  Keno struct, class na?  Struct e shudhu data thake, function alada.
  Tai code e dekha jay: data kothay, kaj kothay. Bujhte shohoj.
  Kono STL (vector/stack/queue) use kora hoyni, shob nijer banano.
  Shudhu std::string use korechi text rakhar jonno.

SEARCH KIVABE KAJ KORE (search.h)
  1. User er text theke shobdo alada kori          (makeTokens)
  2. Proti entry ke number dei                     (scoreEntry)
       question e shobdo mille = 10, keyword e = 12, answer e = 2
       shob shobdo mille +12, pura line mille +25
       ek okkhor vul hole o kichu number paay (stak ~ stack)
  3. Number onujayi sajai - Insertion Sort         (searchEntries)
  4. Shera 6 ta Queue te dhukai, ekta ekta kore ber kori

NOTUN DATA DITE
  Option 1: database.txt khule ekta @entry ... @end block joda dao.
  Option 2: program chaliye menu theke "3. Notun question jora".
  Tarpor GitHub e database.txt upload korle website nijei update hoy.

VIVA TE JETA JIGGESH KORTE PARE
  Q: Array kothay?      A: EntryArray - database.
  Q: Stack kothay?      A: HistoryStack - search history ar undo.
  Q: Queue kothay?      A: ResultQueue - search result line.
  Q: Sorting kothay?    A: searchEntries e Insertion Sort (score onujayi).
  Q: Searching?         A: Linear search - proti entry check kore number dey, O(n).
