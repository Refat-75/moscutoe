// =====================================================================
//  structs.h  -  MosCutoe er 3 ta Data Structure (shob STRUCT, kono class na)
//
//  Kono STL container (vector, stack, queue, map) use kora hoyni.
//  Shudhu std::string use korechi text rakhar jonno.
//
//    1. EntryArray   -> ARRAY  : shob question-answer ekhane thake
//    2. HistoryStack -> STACK  : search history (LIFO). "Undo last search" er jonno
//    3. ResultQueue  -> QUEUE  : search er best result gulo line e thake (FIFO)
//
//  Ekta struct mane: kichu variable ekshathe rakha. Function gulo alada,
//  struct er baire lekha. Tai bujhte shohoj.
// =====================================================================
#ifndef STRUCTS_H
#define STRUCTS_H

#include <string>
using namespace std;

const int MAX_IMAGES   = 6;     // ekta answer e maximum koyta chobi
const int MAX_ENTRIES  = 1000;  // database e maximum koyta question
const int HISTORY_SIZE = 50;    // Stack e maximum koyta search mone rakhbe
const int QUEUE_SIZE   = 20;    // Queue te maximum koyta result thakbe

// ---------------------------------------------------------------------
//  Image : ekta chobi (file er path + chobir nam)
// ---------------------------------------------------------------------
struct Image {
    string src;    // jemon "img/refat.jpg"
    string name;   // jemon "Md Refat Hossain"
};

// ---------------------------------------------------------------------
//  Entry : database er ekta record = ekta question + tar answer
// ---------------------------------------------------------------------
struct Entry {
    string id;         // unique nam, jemon "u1"
    string cat;        // category: university, cse, programming, dsa ...
    string question;   // proshno
    string answer;     // uttor
    string alt;        // onno shobdo (keyword) jeta diye keu khujte pare

    Image  images[MAX_IMAGES];   // chobi gulo (array er bhetore array)
    int    imageCount = 0;       // koyta chobi ache

    // Nicher gulo shudhu News / Video er jonno (na thakle khali)
    bool   isNews = false;       // news hole true
    string region;               // "local" ba "world"
    string date;                 // news er tarikh
    string link;                 // news er source link
    string source;               // source er nam
    string video;                // video file er path
    string poster;               // video er cover chobi
};

// =====================================================================
//  1. ARRAY  -  EntryArray
//  Ekta bor array, jar size dorkar hole nijei baray (dynamic array).
//    items    = array er shuru (heap e rakha memory)
//    count    = ekhon koyta entry ache
//    capacity = koyta entry dhorbe (full hole double kore)
// =====================================================================
struct EntryArray {
    Entry* items    = nullptr;
    int    count    = 0;
    int    capacity = 0;
};

// Array ta shuru kora (prothome memory newa)
void arrayInit(EntryArray& arr) {
    arr.capacity = 16;
    arr.items    = new Entry[arr.capacity];
    arr.count    = 0;
}

// INSERT (sheshe jora) -> O(1). Full hole capacity double kore (O(n) shudhu tokhon)
// false dey jodi MAX_ENTRIES cross kore (overflow)
bool arrayPush(EntryArray& arr, const Entry& e) {
    if (arr.count >= MAX_ENTRIES) return false;
    if (arr.count == arr.capacity) {                 // jayga shesh, boro array nao
        int   newCap   = arr.capacity * 2;
        Entry* bigger  = new Entry[newCap];
        for (int i = 0; i < arr.count; i++) bigger[i] = arr.items[i];  // purono gulo copy
        delete[] arr.items;                          // purono memory felo
        arr.items    = bigger;
        arr.capacity = newCap;
    }
    arr.items[arr.count] = e;
    arr.count++;
    return true;
}

// DELETE (index theke) -> O(n), karon porer gulo ke ekta kore bame shift korte hoy
// false dey jodi index thik na hoy (not found)
bool arrayRemoveAt(EntryArray& arr, int index) {
    if (index < 0 || index >= arr.count) return false;
    for (int i = index; i < arr.count - 1; i++) {
        arr.items[i] = arr.items[i + 1];             // porer ta ke age niye ashi
    }
    arr.count--;
    return true;
}

// Program shesh e memory chhere deya
void arrayFree(EntryArray& arr) {
    delete[] arr.items;
    arr.items    = nullptr;
    arr.count    = 0;
    arr.capacity = 0;
}

// =====================================================================
//  2. STACK  -  HistoryStack  (LIFO = Last In, First Out)
//  Je search sheshe korechi, shetai prothome ber hobe.
//  Jemon: boi er stup, shobar upor er boi ta prothome nei.
//    push = upore rakha, pop = upor theke tola, peek = shudhu dekha
// =====================================================================
struct HistoryStack {
    string items[HISTORY_SIZE];   // fixed size array
    int    top = -1;              // -1 mane stack khali
};

bool stackIsEmpty(const HistoryStack& s) { return s.top == -1; }

// PUSH -> O(1). Full hole shobcheye purono ta felei dey (jate notun ta jay)
void stackPush(HistoryStack& s, const string& text) {
    if (s.top == HISTORY_SIZE - 1) {
        for (int i = 0; i < HISTORY_SIZE - 1; i++) s.items[i] = s.items[i + 1];
        s.top--;
    }
    s.top++;
    s.items[s.top] = text;
}

// POP -> O(1). Upor er ta ber kore 'out' e dey. Khali hole false
bool stackPop(HistoryStack& s, string& out) {
    if (stackIsEmpty(s)) return false;   // underflow
    out = s.items[s.top];
    s.top--;
    return true;
}

// PEEK -> shudhu upor er ta dekhay, ber kore na
bool stackPeek(const HistoryStack& s, string& out) {
    if (stackIsEmpty(s)) return false;
    out = s.items[s.top];
    return true;
}

// =====================================================================
//  3. QUEUE  -  ResultQueue  (FIFO = First In, First Out, circular)
//  Search er best result prothome dhuke, prothome ber hoy.
//  Jemon: line e dariye thaka manush, je age dariyeche se age jay.
//    enqueue = line er sheshe dhoka, dequeue = line er shuru theke ber hoa
//  Circular mane: shesh e pouchhe abar shuru te ghure ashe (jayga nosto hoy na).
// =====================================================================
struct Result {
    int    index = 0;     // Array er kon number entry
    double score = 0;     // koto number pelo (beshi = bhalo match)
};

struct ResultQueue {
    Result items[QUEUE_SIZE];
    int front = 0;        // prothom jon er jayga
    int rear  = -1;       // shesh jon er jayga
    int count = 0;        // ekhon koyta ache
};

bool queueIsEmpty(const ResultQueue& q) { return q.count == 0; }
bool queueIsFull (const ResultQueue& q) { return q.count == QUEUE_SIZE; }

// ENQUEUE -> O(1). Full hole false (overflow)
bool queueEnqueue(ResultQueue& q, const Result& r) {
    if (queueIsFull(q)) return false;
    q.rear = (q.rear + 1) % QUEUE_SIZE;   // % diye shesh e gele abar 0 te jay
    q.items[q.rear] = r;
    q.count++;
    return true;
}

// DEQUEUE -> O(1). Shamne er ta ber kore 'out' e dey. Khali hole false (underflow)
bool queueDequeue(ResultQueue& q, Result& out) {
    if (queueIsEmpty(q)) return false;
    out = q.items[q.front];
    q.front = (q.front + 1) % QUEUE_SIZE;
    q.count--;
    return true;
}

#endif
