// =====================================================================
//  MosCutoe  -  "Search Beyond Limits"
//  Data Structures Lab Project (CSE 2103), Varendra University
//
//  Eta website er BACKEND, shob C++ e. Kono class nai, shudhu struct.
//
//  Ei program ki kore:
//    * database.txt theke shob question-answer pore, ARRAY te rakhe
//    * search kore, bhalo result gulo QUEUE te rakhe
//    * search history STACK e rakhe (Undo last search)
//    * website er file (data.js, answer pages, sitemap) toiri kore
//
//  File gulo:
//    structs.h       -> Array, Stack, Queue (amader nijer data structure)
//    text_tools.h    -> text bhanga, shobdo milano
//    search.h        -> search engine (number deya, sajano)
//    database.h      -> database.txt pora / likha
//    site_builder.h  -> website er file banano
//    main.cpp        -> menu (ei file)
//
//  Compile (terminal e):   g++ -std=c++17 main.cpp -o moscutoe
//  Chalate:                ./moscutoe            (Windows: moscutoe.exe)
//  Website banate:         ./moscutoe build https://refat-75.github.io/moscutoe
//  Ek line e search:       ./moscutoe search "who is the vice chancellor"
// =====================================================================
#include <iostream>
#include <string>
#include <fstream>
#include "structs.h"
#include "text_tools.h"
#include "search.h"
#include "database.h"
#include "site_builder.h"
#include <cstdlib>
using namespace std;

const string DEFAULT_SITE_URL = "https://refat-75.github.io/moscutoe";

// ---------------------------------------------------------------------
//  Path khuje ber kora: program kon folder theke chalano hocche tar upor
//  database.txt ar website er folder onno jayga e thakte pare.
// ---------------------------------------------------------------------
bool fileExists(const string& path) {
    ifstream f(path.c_str());
    return f.is_open();
}

// findDatabasePath : database.txt kothay ache khuje dey
string findDatabasePath() {
    if (fileExists("cpp-backend/database.txt"))    return "cpp-backend/database.txt";   // repo er root theke chalale
    if (fileExists("database.txt"))                return "database.txt";                // cpp-backend folder theke chalale
    if (fileExists("../cpp-backend/database.txt")) return "../cpp-backend/database.txt";
    return "";
}

// findSiteDir : website folder (jekhane index.html) kothay khuje dey
string findSiteDir() {
    if (fileExists("index.html"))    return ".";
    if (fileExists("../index.html")) return "..";
    return "";
}

// ---------------------------------------------------------------------
//  Dekhano (print) er function gulo
// ---------------------------------------------------------------------

// printLine : ekta lomba dag
void printLine() { cout << "------------------------------------------------------------\n"; }

// printEntry : ekta entry er question, answer, chobi, link dekhay
void printEntry(const Entry& e) {
    cout << "\n  Q: " << e.question << "\n";
    cout << "  A: " << e.answer << "\n";
    for (int i = 0; i < e.imageCount; i++) cout << "  [Chobi " << (i + 1) << "] " << e.images[i].src << "\n";
    if (!e.video.empty()) cout << "  [Video] " << e.video << "\n";
    if (!e.link.empty())  cout << "  [Source] " << e.link << "\n";
}

// printAllQuestions : Array er upor ghure (traverse) shob question dekhay. O(n)
void printAllQuestions(const EntryArray& db) {
    printLine();
    for (int i = 0; i < db.count; i++) {
        cout << " " << (i + 1) << ". [" << db.items[i].cat << "] " << db.items[i].question << "\n";
    }
    cout << "Total: " << db.count << " ta entry\n";
}

// ---------------------------------------------------------------------
//  Menu er kaj gulo
// ---------------------------------------------------------------------

// doSearch : user er text newa -> search -> Queue theke ekta ekta kore dekhano -> Stack e history
void doSearch(const EntryArray& db, HistoryStack& history, const string& query, char scope) {
    ResultQueue results;                                   // Queue toiri
    int found = searchEntries(db, query, scope, results);  // search chalao, Queue te result dhukbe
    stackPush(history, query);                             // Stack e history rakho

    printLine();
    if (found == 0) {
        cout << "Kono answer paini: \"" << query << "\"\n";
        return;
    }
    cout << found << " ta result paoa gelo \"" << query << "\" er jonno:\n";
    Result r;
    int rank = 1;
    while (queueDequeue(results, r)) {                     // Queue theke serial e ber koro (FIFO)
        cout << "\n=== Result " << rank << "  (score: " << r.score << ")";
        if (rank == 1) cout << "   <-- Best answer";
        cout << " ===";
        printEntry(db.items[r.index]);
        rank++;
    }
}

// askScope : Local / Worldwide / All jiggesh kore
char askScope() {
    cout << "Kothay khujbo?  1 = Shob   2 = Local Area (Varendra/Rajshahi)   3 = Worldwide : ";
    string c; getline(cin, c);
    if (c == "2") return 'l';
    if (c == "3") return 'w';
    return 'a';
}

// showHistory : Stack er shob search dekhay (sheshe kora ta prothome), Stack ke nosto na kore
void showHistory(const HistoryStack& history) {
    printLine();
    if (stackIsEmpty(history)) { cout << "History khali.\n"; return; }
    cout << "Search history (notun ta upore):\n";
    for (int i = history.top; i >= 0; i--) cout << "  " << (history.top - i + 1) << ". " << history.items[i] << "\n";
}

// undoLastSearch : Stack er pop - sheshe kora search ta tule felo
void undoLastSearch(HistoryStack& history) {
    string last;
    if (stackPop(history, last)) cout << "Undo hoyeche: \"" << last << "\" history theke muche gelo.\n";
    else cout << "Undo korar moto kichu nai (history khali).\n";
}

// addNewEntry : notun question-answer niye Array te jora + database.txt te save
void addNewEntry(EntryArray& db, const string& dbPath) {
    Entry e;
    cout << "Proshno: ";                        getline(cin, e.question);
    cout << "Uttor: ";                          getline(cin, e.answer);
    cout << "Category (university/cse/programming/dsa/math/advanced): "; getline(cin, e.cat);
    cout << "Keyword (onno shobdo, khali rakhte paro): "; getline(cin, e.alt);
    if (e.question.empty() || e.answer.empty()) { cout << "Proshno ar uttor dui ta e lagbe.\n"; return; }
    if (e.cat.empty()) e.cat = "cse";
    e.id = "n" + to_string(db.count + 1);

    if (!arrayPush(db, e)) { cout << "Database full! (maximum " << MAX_ENTRIES << ")\n"; return; }
    if (saveDatabase(dbPath, db)) cout << "Jora hoyeche ar database.txt e save hoyeche. (Website e dekhate 'Build' koro)\n";
    else cout << "Save kora gelo na!\n";
}

// deleteEntry : number diye Array theke muche feli (shift hoy) + save
void deleteEntry(EntryArray& db, const string& dbPath) {
    printAllQuestions(db);
    cout << "Koto number ta delete korbe? (0 = cancel): ";
    string s; getline(cin, s);
    int n = atoi(s.c_str());
    if (n <= 0) return;
    if (arrayRemoveAt(db, n - 1)) { saveDatabase(dbPath, db); cout << "Delete hoyeche.\n"; }
    else cout << "Ei number e kichu nai.\n";
}

// doBuild : website er file banay
void doBuild(const EntryArray& db, const string& url) {
    string siteDir = findSiteDir();
    if (siteDir.empty()) { cout << "index.html pai nai! Website folder theke program chalao.\n"; return; }
    if (buildWebsite(db, siteDir, url)) {
        cout << "Shesh! " << db.count << " ta entry theke website file toiri hoyeche (" << url << ")\n";
        cout << "  data.js, answers.html, answer/*.html, sitemap.xml, robots.txt\n";
    } else {
        cout << "Build e somossa hoyeche!\n";
    }
}

// ---------------------------------------------------------------------
//  main : program ekhan theke shuru hoy
// ---------------------------------------------------------------------
int main(int argc, char* argv[]) {
#ifdef _WIN32
    system("chcp 65001 > nul");   // Windows console e UTF-8 text thik dekhanor jonno
#endif

    // 1) database.txt khuje pore Array te rakho
    string dbPath = findDatabasePath();
    if (dbPath.empty()) { cout << "database.txt khuje paini! cpp-backend folder e rakho.\n"; return 1; }

    EntryArray database;
    arrayInit(database);
    if (!loadDatabase(dbPath, database)) { cout << "database.txt kholte parlam na.\n"; return 1; }

    HistoryStack history;   // Stack toiri (shuru te khali)

    // 2) Command line theke chalale (menu chhara)
    if (argc >= 2) {
        string cmd = argv[1];
        if (cmd == "build") {
            doBuild(database, argc >= 3 ? argv[2] : DEFAULT_SITE_URL);
        } else if (cmd == "search" && argc >= 3) {
            doSearch(database, history, argv[2], 'a');
        } else {
            cout << "Use: moscutoe | moscutoe build <site-url> | moscutoe search \"text\"\n";
        }
        arrayFree(database);
        return 0;
    }

    // 3) Menu (loop jotokkhon user 0 na dey)
    cout << "\n  MosCutoe - Search Beyond Limits\n";
    cout << "  " << database.count << " ta question-answer load hoyeche\n";
    for (;;) {
        printLine();
        cout << " 1. Search koro\n";
        cout << " 2. Shob question dekho (Array)\n";
        cout << " 3. Notun question jora (Array insert)\n";
        cout << " 4. Question delete koro (Array delete)\n";
        cout << " 5. Search history dekho (Stack)\n";
        cout << " 6. Last search undo koro (Stack pop)\n";
        cout << " 7. Website file banao (Build)\n";
        cout << " 0. Bondho\n";
        cout << "Tomar choice: ";
        string choice;
        if (!getline(cin, choice)) break;

        if (choice == "1") {
            char scope = askScope();
            cout << "Ki khujbe? ";
            string q; getline(cin, q);
            doSearch(database, history, q, scope);
        }
        else if (choice == "2") printAllQuestions(database);
        else if (choice == "3") addNewEntry(database, dbPath);
        else if (choice == "4") deleteEntry(database, dbPath);
        else if (choice == "5") showHistory(history);
        else if (choice == "6") undoLastSearch(history);
        else if (choice == "7") {
            cout << "Site URL (Enter dile: " << DEFAULT_SITE_URL << "): ";
            string url; getline(cin, url);
            doBuild(database, url.empty() ? DEFAULT_SITE_URL : url);
        }
        else if (choice == "0") { cout << "Dhonnobad!\n"; break; }
        else cout << "Vul choice, abar chesta koro.\n";
    }

    arrayFree(database);   // memory chhere deya
    return 0;
}
