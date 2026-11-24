// =====================================================================
//  database.h  -  database.txt file theke data pora (load) ar likha (save)
//
//  database.txt er format (proti entry ekta block):
//      @entry
//      id: u1
//      cat: university
//      q: Proshno
//      a: Uttor (notun line er jonno \n)
//      image: img/a.jpg | Chobir nam
//      @end
// =====================================================================
#ifndef DATABASE_H
#define DATABASE_H

#include <fstream>
#include <string>
#include "structs.h"
using namespace std;

// trimText : string er shuru ar shesh er faka (space, \r) muche dey
string trimText(const string& s) {
    size_t a = 0, b = s.size();
    while (a < b && (s[a] == ' ' || s[a] == '\t' || s[a] == '\r' || s[a] == '\n')) a++;
    while (b > a && (s[b - 1] == ' ' || s[b - 1] == '\t' || s[b - 1] == '\r' || s[b - 1] == '\n')) b--;
    return s.substr(a, b - a);
}

// unescapeNewlines : file e "\n" (2 ta okkhor) lekha thake, eta ke asol notun line banay
string unescapeNewlines(const string& s) {
    string out;
    for (size_t i = 0; i < s.size(); i++) {
        if (s[i] == '\\' && i + 1 < s.size() && s[i + 1] == 'n') { out += '\n'; i++; }
        else out += s[i];
    }
    return out;
}

// escapeNewlines : ulta kaj. Asol notun line ke "\n" banay (file e ek line e rakhar jonno)
string escapeNewlines(const string& s) {
    string out;
    for (size_t i = 0; i < s.size(); i++) {
        if (s[i] == '\n') out += "\\n";
        else if (s[i] != '\r') out += s[i];
    }
    return out;
}

// loadDatabase : file pore proti @entry block ke ekta Entry banay, Array te rakhe
// true = shofol, false = file kholte parlo na
bool loadDatabase(const string& path, EntryArray& database) {
    ifstream file(path.c_str());
    if (!file.is_open()) return false;

    string line;
    bool inside = false;     // ekhon ki @entry block er bhetore achi?
    Entry current;

    while (getline(file, line)) {
        line = trimText(line);
        if (line.empty() || line[0] == '#') continue;           // faka ba comment line

        if (line == "@entry") { current = Entry(); inside = true; continue; }
        if (line == "@end")   { if (inside) arrayPush(database, current); inside = false; continue; }
        if (!inside) continue;

        size_t colon = line.find(':');                           // "key: value" bhangi
        if (colon == string::npos) continue;
        string key   = trimText(line.substr(0, colon));
        string value = trimText(line.substr(colon + 1));

        if      (key == "id")     current.id       = value;
        else if (key == "cat")    current.cat      = value;
        else if (key == "q")      current.question = value;
        else if (key == "a")      current.answer   = unescapeNewlines(value);
        else if (key == "alt")    current.alt      = value;
        else if (key == "news")   current.isNews   = (value == "yes");
        else if (key == "region") current.region   = value;
        else if (key == "date")   current.date     = value;
        else if (key == "link")   current.link     = value;
        else if (key == "source") current.source   = value;
        else if (key == "video")  current.video    = value;
        else if (key == "poster") current.poster   = value;
        else if (key == "image" && current.imageCount < MAX_IMAGES) {
            size_t bar = value.find('|');                        // "path | nam"
            Image img;
            img.src  = trimText(bar == string::npos ? value : value.substr(0, bar));
            img.name = trimText(bar == string::npos ? "" : value.substr(bar + 1));
            current.images[current.imageCount] = img;
            current.imageCount++;
        }
    }
    return true;
}

// writeLine : "key: value" line likhe (value khali hole kichu likhe na)
void writeLine(ofstream& out, const string& key, const string& value) {
    if (!value.empty()) out << key << ": " << value << "\n";
}

// saveDatabase : Array er shob entry abar database.txt te likhe (notun add / delete korle lage)
bool saveDatabase(const string& path, const EntryArray& database) {
    ofstream out(path.c_str());
    if (!out.is_open()) return false;

    out << "# MosCutoe DATABASE (database.txt)\n";
    out << "# Format: @entry ... @end . Notun line er jonno \\n. Image: image: path | nam\n\n";
    for (int i = 0; i < database.count; i++) {
        const Entry& e = database.items[i];
        out << "@entry\n";
        writeLine(out, "id",  e.id);
        writeLine(out, "cat", e.cat);
        writeLine(out, "q",   e.question);
        writeLine(out, "a",   escapeNewlines(e.answer));
        writeLine(out, "alt", e.alt);
        for (int k = 0; k < e.imageCount; k++) out << "image: " << e.images[k].src << " | " << e.images[k].name << "\n";
        if (e.isNews) out << "news: yes\n";
        writeLine(out, "region", e.region);
        writeLine(out, "date",   e.date);
        writeLine(out, "link",   e.link);
        writeLine(out, "source", e.source);
        writeLine(out, "video",  e.video);
        writeLine(out, "poster", e.poster);
        out << "@end\n\n";
    }
    return true;
}

#endif
