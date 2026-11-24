// =====================================================================
//  search.h  -  MosCutoe er SEARCH ENGINE (mul kaj ekhane)
//
//  Kivabe kaj kore:
//    1) User er text theke shobdo gulo ber kori            (makeTokens)
//    2) Array er proti entry ke number (score) dei         (scoreEntry)
//    3) Number onujayi bhalo theke kharap e sajai          (insertion sort)
//    4) Shobcheye bhalo gulo ke Queue te dhukai            (queueEnqueue)
// =====================================================================
#ifndef SEARCH_H
#define SEARCH_H

#include <string>
#include "structs.h"
#include "text_tools.h"
using namespace std;

// scoreEntry : ekta entry ke user er proshner sathe koto mile - tar number dey
//   question e shobdo mille   -> 10 number    (shobcheye dami)
//   keyword (alt) e mille     -> 12 number
//   answer e mille            -> 2 number     (kom dami)
//   shob shobdo mille         -> +12 bonus
//   pura line mille           -> +25 bonus
//   0 mane kichui mile ni
double scoreEntry(const WordList& queryWords, const string& queryNorm, const Entry& e) {
    WordList qWords, aWords, kWords;
    makeTokens(e.question, qWords);   // entry er question er shobdo
    makeTokens(e.answer,   aWords);   // entry er answer er shobdo
    makeTokens(e.alt,      kWords);   // entry er keyword er shobdo

    double score = 0;
    int matched = 0;
    for (int i = 0; i < queryWords.count; i++) {
        const string& w = queryWords.items[i];
        double inQuestion = bestMatch(w, qWords) * 10;
        double inKeyword  = bestMatch(w, kWords) * 12;
        double inAnswer   = bestMatch(w, aWords) * 2;
        double v = inQuestion;                       // 3 tar moddhe shobcheye boro ta nao
        if (inKeyword > v) v = inKeyword;
        if (inAnswer  > v) v = inAnswer;
        if (v > 0) { matched++; score += v; }
    }
    if (matched == 0) return 0;

    // question er je shobdo user lekhe ni, proti ta er jonno 0.8 number kato
    int extra = 0;
    for (int i = 0; i < qWords.count; i++) {
        if (bestMatch(qWords.items[i], queryWords) == 0) extra++;
    }
    score -= extra * 0.8;

    if (matched == queryWords.count) score += 12;                          // shob shobdo mille
    if (!queryNorm.empty() && normalizeText(e.question).find(queryNorm) != string::npos)
        score += 25;                                                       // pura line mille
    return score < 0.5 ? 0.5 : score;
}

// inScope : Local / Worldwide chip er jonno chhaikha
//   scope 'a' = shob    'l' = Local Area (University + Rajshahi news)    'w' = Worldwide (baki gulo)
bool inScope(const Entry& e, char scope) {
    bool isLocal = (e.cat == "university" || e.cat == "local");
    if (scope == 'l') return isLocal;
    if (scope == 'w') return !isLocal;
    return true;
}

// searchEntries : mul search function.
//   database = shob entry (Array),  query = user ja likhlo,  scope = a/l/w
//   results  = bhalo result gulo ei Queue te dhukbe (best prothome)
// Koyta result peyechi seta return kore.
int searchEntries(const EntryArray& database, const string& query, char scope,
                  ResultQueue& results, int limit = 6) {
    results.front = 0; results.rear = -1; results.count = 0;   // Queue ta khali kore nao

    WordList queryWords;
    makeTokens(query, queryWords);
    if (queryWords.count == 0) return 0;
    string queryNorm = normalizeText(query);

    // Step 1+2: proti entry ke number dao, jara mile tader ekta temporary array te rakho
    Result* found = new Result[database.count > 0 ? database.count : 1];
    int foundCount = 0;
    for (int i = 0; i < database.count; i++) {
        const Entry& e = database.items[i];
        if (!inScope(e, scope)) continue;
        double s = scoreEntry(queryWords, queryNorm, e);
        if (s > 0) { found[foundCount].index = i; found[foundCount].score = s; foundCount++; }
    }

    // Step 3: INSERTION SORT - beshi number age (descending)
    // Ekta ekta kore nei, tar age er chhoto number gulo ke dane shift kori.
    for (int i = 1; i < foundCount; i++) {
        Result key = found[i];
        int j = i - 1;
        while (j >= 0 && found[j].score < key.score) { found[j + 1] = found[j]; j--; }
        found[j + 1] = key;
    }

    // Step 4: shobcheye bhalo number er 20% er niche gele bad, ar limit porjonto Queue te dhukao
    int added = 0;
    if (foundCount > 0) {
        double top = found[0].score;
        double minimum = top * 0.2 > 1 ? top * 0.2 : 1;
        for (int i = 0; i < foundCount && added < limit; i++) {
            if (found[i].score < minimum) break;
            if (queueEnqueue(results, found[i])) added++;
        }
    }
    delete[] found;
    return added;
}

#endif
