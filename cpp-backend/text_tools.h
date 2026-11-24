// =====================================================================
//  text_tools.h  -  text ke bhango, shoja koro, duita shobdo milay kina dekho
//  Search er ekdom shuru te eta lage: user ja likhlo tar shobdo gulo alada kora.
// =====================================================================
#ifndef TEXT_TOOLS_H
#define TEXT_TOOLS_H

#include <string>
using namespace std;

const int MAX_WORDS = 300;   // ekta text e maximum koyta shobdo dhorbe

// WordList : shobdo er list (ekta array, ekdom shohoj)
struct WordList {
    string items[MAX_WORDS];
    int    count = 0;
};

// Shobdo er moddhe thakar moto okkhor kina? (a-z, 0-9, + , #, ar Bangla/UTF-8 byte)
// Keno: "c++" ar "c#" er + # ke rakhte hobe, noyto "c" hoye jabe.
bool isWordChar(unsigned char c) {
    return (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '+' || c == '#' || c >= 128;
}

// normalizeText : boro hater okkhor ke chhoto kore, symbol muche, majhe ekta space rakhe
// Jemon "What is   C++?"  ->  "what is c++"
string normalizeText(const string& text) {
    string out;
    bool pendingSpace = false;
    for (size_t i = 0; i < text.size(); i++) {
        unsigned char c = (unsigned char)text[i];
        if (c >= 'A' && c <= 'Z') c = c - 'A' + 'a';        // boro hater -> chhoto hater
        if (isWordChar(c)) {
            if (pendingSpace && !out.empty()) out += ' ';   // age space baki thakle dao
            pendingSpace = false;
            out += (char)c;
        } else {
            pendingSpace = true;                            // symbol/space -> ekta space
        }
    }
    return out;
}

// Stop word = "the, is, what" er moto shobdo. Egulo search e kaj kore na, tai bad dei.
bool isStopWord(const string& w) {
    static const char* STOP[] = {
        "a","an","the","is","are","was","were","of","in","at","on","to","for","and","or","who",
        "what","which","how","many","much","there","do","does","did","can","could","i","me","my",
        "you","your","it","its","this","that","with","by","from","be","tell","about","please",
        "give","show","define","explain","meaning","has","have","would","will","whom","whose",
        "when","where","why" };
    int n = sizeof(STOP) / sizeof(STOP[0]);
    for (int i = 0; i < n; i++) if (w == STOP[i]) return true;
    return false;
}

// makeTokens : text theke dorkari shobdo gulo ber kore WordList e rakhe
// (stop word bad, duplicate bad, 1 okkhor er shobdo bad - shudhu "c" chhara)
void makeTokens(const string& text, WordList& out) {
    out.count = 0;
    string clean = normalizeText(text);
    string word;
    for (size_t i = 0; i <= clean.size(); i++) {
        if (i < clean.size() && clean[i] != ' ') { word += clean[i]; continue; }
        // ekhane ekta shobdo shesh hoyeche
        if (!word.empty() && (word.size() >= 2 || word == "c") && !isStopWord(word)) {
            bool seen = false;
            for (int k = 0; k < out.count; k++) if (out.items[k] == word) { seen = true; break; }
            if (!seen && out.count < MAX_WORDS) { out.items[out.count] = word; out.count++; }
        }
        word = "";
    }
}

bool startsWith(const string& s, const string& prefix) {
    return s.size() >= prefix.size() && s.compare(0, prefix.size(), prefix) == 0;
}

// withinOneEdit : duita shobdo ki "ek okkhor er vul" er moddhe? (jemon "stack" ar "stak")
bool withinOneEdit(const string& a, const string& b) {
    if (a == b) return true;
    int la = (int)a.size(), lb = (int)b.size();
    if (la - lb > 1 || lb - la > 1) return false;
    int i = 0, j = 0, diff = 0;
    while (i < la && j < lb) {
        if (a[i] == b[j]) { i++; j++; continue; }
        diff++;
        if (diff > 1) return false;
        if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
    }
    if (i < la || j < lb) diff++;
    return diff <= 1;
}

// wordSimilarity : duita shobdo koto kachakachi?
//   1.0 = ekdom same (ba s/es add)    0.8 = ekta aarekta diye shuru    0.6 = ek okkhor vul    0 = mile na
double wordSimilarity(const string& w, const string& x) {
    if (w == x) return 1.0;
    if (w + "s" == x || x + "s" == w || w + "es" == x || x + "es" == w) return 1.0;
    if (w.size() >= 4 && x.size() >= 4 && (startsWith(x, w) || startsWith(w, x))) return 0.8;
    if (w.size() >= 5 && x.size() >= 5 && withinOneEdit(w, x)) return 0.6;
    return 0.0;
}

// bestMatch : ekta shobdo ke list er shob shobdor sathe milie shobcheye bhalo number ta dey
double bestMatch(const string& w, const WordList& list) {
    double best = 0;
    for (int i = 0; i < list.count; i++) {
        double s = wordSimilarity(w, list.items[i]);
        if (s > best) { best = s; if (best == 1.0) break; }   // 1.0 er beshi hoy na, thamo
    }
    return best;
}

#endif
