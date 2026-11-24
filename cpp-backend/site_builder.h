// =====================================================================
//  site_builder.h  -  Database theke WEBSITE er file banay (C++ diye)
//
//  Eta chalale ei file gulo toiri hoy:
//    data.js       -> website er search ei data pore
//    answer/*.html -> proti proshner alada page (Google e khuje pawar jonno)
//    answers.html  -> shob answer er ekta page
//    sitemap.xml   -> Google ke page list dey
//    robots.txt    -> Google ke bole dey ki kora jabe
//    index.html    -> shudhu SEO block ta update hoy
//
//  GitHub e upload korle GitHub Actions nijei C++ compile kore eta chalay.
// =====================================================================
#ifndef SITE_BUILDER_H
#define SITE_BUILDER_H

#include <string>
#include <fstream>
#include <sstream>
#include <ctime>
#include <filesystem>
#include "structs.h"
using namespace std;

// ---------- chhoto chhoto helper ----------

// htmlEscape : < > & " ke safe kore, jate HTML bhenge na jay
string htmlEscape(const string& s) {
    string out;
    for (size_t i = 0; i < s.size(); i++) {
        char c = s[i];
        if (c == '&') out += "&amp;";
        else if (c == '<') out += "&lt;";
        else if (c == '>') out += "&gt;";
        else if (c == '"') out += "&quot;";
        else if (c == '\'') out += "&#39;";
        else out += c;
    }
    return out;
}

// jsonString : text ke "..." er moddhe boshanor moto kore (JavaScript/JSON er jonno)
string jsonString(const string& s, bool safeForHtml = false) {
    string out = "\"";
    for (size_t i = 0; i < s.size(); i++) {
        unsigned char c = (unsigned char)s[i];
        if (c == '"') out += "\\\"";
        else if (c == '\\') out += "\\\\";
        else if (c == '\n') out += "\\n";
        else if (c == '\r') out += "\\r";
        else if (c == '\t') out += "\\t";
        else if (c < 0x20) { char buf[8]; snprintf(buf, sizeof(buf), "\\u%04x", c); out += buf; }
        else if (safeForHtml && c == '<') out += "\\u003c";
        else out += (char)c;
    }
    return out + "\"";
}

// oneLine : shob notun line / dhaka space ke ekta space kore
string oneLine(const string& s) {
    string out;
    bool space = false;
    for (size_t i = 0; i < s.size(); i++) {
        char c = s[i];
        if (c == ' ' || c == '\n' || c == '\r' || c == '\t') space = true;
        else { if (space && !out.empty()) out += ' '; space = false; out += c; }
    }
    return out;
}

// cutText : text ke n byte e kete dey (Bangla okkhor majhkhane vanga hole pichhone jay)
string cutText(const string& s, size_t n) {
    if (s.size() <= n) return s;
    while (n > 0 && ((unsigned char)s[n] & 0xC0) == 0x80) n--;
    return s.substr(0, n);
}

// urlEncode : link e boshanor jonno (space -> %20 ityadi)
string urlEncode(const string& s) {
    string out;
    const char* keep = "-_.!~*'()";
    for (size_t i = 0; i < s.size(); i++) {
        unsigned char c = (unsigned char)s[i];
        bool safe = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
        for (const char* k = keep; *k; k++) if (c == (unsigned char)*k) safe = true;
        if (safe) out += (char)c;
        else { char buf[8]; snprintf(buf, sizeof(buf), "%%%02X", c); out += buf; }
    }
    return out;
}

// makeSlug : proshno theke page er nam banay. "What is a Stack?" -> "what-is-a-stack"
// usedSlugs e ager nam gulo thake, same nam hole last e -2, -3 lagay
string makeSlug(const string& question, string usedSlugs[], int& usedCount) {
    string s;
    for (size_t i = 0; i < question.size(); i++) {
        unsigned char c = (unsigned char)question[i];
        if (c >= 'A' && c <= 'Z') c = c - 'A' + 'a';
        bool ok = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9');
        if (ok) s += (char)c;
        else if (s.empty() || s[s.size() - 1] != '-') s += '-';
    }
    while (!s.empty() && s[s.size() - 1] == '-') s.erase(s.size() - 1);
    while (!s.empty() && s[0] == '-') s.erase(0, 1);
    if (s.size() > 80) s = s.substr(0, 80);
    if (s.empty()) s = "answer";

    string result = s;
    int n = 2;
    for (;;) {
        bool taken = false;
        for (int i = 0; i < usedCount; i++) if (usedSlugs[i] == result) { taken = true; break; }
        if (!taken) break;
        result = s + "-" + to_string(n++);
    }
    usedSlugs[usedCount++] = result;
    return result;
}

// categoryTitle : "dsa" -> "Data Structures & Algorithms"
string categoryTitle(const string& cat) {
    if (cat == "university")  return "Varendra University";
    if (cat == "cse")         return "CSE Fundamentals";
    if (cat == "programming") return "Programming";
    if (cat == "dsa")         return "Data Structures & Algorithms";
    if (cat == "math")        return "Mathematics & Digital Systems";
    if (cat == "advanced")    return "Advanced CS";
    if (cat == "local")       return "Rajshahi & Varendra News";
    if (cat == "world")       return "World News";
    return cat;
}

// file pora / likha
string readWholeFile(const string& path) {
    ifstream f(path.c_str(), ios::binary);
    stringstream ss; ss << f.rdbuf();
    return ss.str();
}
bool writeWholeFile(const string& path, const string& content) {
    ofstream f(path.c_str(), ios::binary);
    if (!f.is_open()) return false;
    f << content;
    return true;
}

// ---------- HTML er tukro ----------

// logo (SVG chobi, shobkhane same)
string logoSvg() {
    return R"LOGO(<svg viewBox="0 0 120 120" width="44" height="44" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#52d6ff"/><stop offset="1" stop-color="#9b5cff"/></linearGradient></defs><circle cx="64" cy="54" r="34" fill="none" stroke="url(#g)" stroke-width="11"/><path d="M88 80 L106 102" stroke="url(#g)" stroke-width="11" stroke-linecap="round"/><ellipse cx="40" cy="30" rx="28" ry="9" transform="rotate(-30 40 30)" fill="#6fdcff"/><ellipse cx="62" cy="56" rx="22" ry="6" transform="rotate(40 62 56)" fill="#0b2766"/><circle cx="78" cy="42" r="8" fill="#0b2766"/><circle cx="80" cy="41" r="3" fill="#fff"/></svg>)LOGO";
}

// pageHead : proti static page er upor er ongsho (title, SEO meta, header)
string pageHead(const string& siteUrl, const string& title, const string& desc,
                const string& canonical, const string& pre, const string& extra) {
    string t = htmlEscape(title), d = htmlEscape(desc);
    return "<!DOCTYPE html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        "<title>" + t + "</title>\n"
        "<meta name=\"description\" content=\"" + d + "\">\n"
        "<link rel=\"canonical\" href=\"" + canonical + "\">\n"
        "<meta property=\"og:type\" content=\"article\"><meta property=\"og:site_name\" content=\"MosCutoe\"><meta property=\"og:title\" content=\"" + t +
        "\"><meta property=\"og:description\" content=\"" + d + "\"><meta property=\"og:url\" content=\"" + canonical +
        "\"><meta property=\"og:image\" content=\"" + siteUrl + "/img/og-image.jpg\">\n"
        "<meta name=\"theme-color\" content=\"#3d6bd6\"><link rel=\"icon\" href=\"" + pre + "img/icon-192.png\">\n"
        "<link rel=\"stylesheet\" href=\"" + pre + "style.css\">" + extra + "\n"
        "</head><body class=\"static\"><div class=\"wrap\">\n"
        "<header class=\"sh\"><a href=\"" + pre + "./\">" + logoSvg() + "<span class=\"brand\" style=\"font-size:26px\">Mos<b>Cutoe</b></span></a></header>";
}

string pageFoot() {
    return "<p style=\"opacity:.8;font-size:14px;margin-top:30px\">MosCutoe Search Project - Varendra University, Department of CSE</p></div></body></html>";
}

// imagesHtml : entry er chobi gulo HTML e (pre = "../" ba "")
string imagesHtml(const Entry& e, const string& pre) {
    if (e.imageCount == 0) return "";
    string out = "<div class=\"people\">";
    for (int i = 0; i < e.imageCount; i++) {
        out += "<figure><img loading=\"lazy\" src=\"" + pre + htmlEscape(e.images[i].src) + "\" alt=\"" + htmlEscape(e.images[i].name) +
               "\"><figcaption>" + htmlEscape(e.images[i].name) + "</figcaption></figure>";
    }
    return out + "</div>";
}

// ---------- data.js ----------

// buildDataJs : Array er shob entry ke website er data.js hishebe likhe
string buildDataJs(const EntryArray& db) {
    string out = "// =====================================================================\n"
                 "// AUTO-GENERATED: eta C++ program (cpp-backend) database.txt theke banaise.\n"
                 "// Eta hate edit korba na. Notun data dite cpp-backend/database.txt e dao.\n"
                 "// =====================================================================\n"
                 "window.MOSCUTOE_DB = [\n";
    for (int i = 0; i < db.count; i++) {
        const Entry& e = db.items[i];
        out += " {\n";
        out += "  \"q\": " + jsonString(e.question) + ",\n";
        out += "  \"a\": " + jsonString(e.answer) + ",\n";
        out += "  \"cat\": " + jsonString(e.cat) + ",\n";
        out += "  \"alt\": " + jsonString(e.alt) + ",\n";
        out += "  \"images\": [";
        for (int k = 0; k < e.imageCount; k++) {
            out += string(k ? "," : "") + "\n   { \"src\": " + jsonString(e.images[k].src) + ", \"name\": " + jsonString(e.images[k].name) + " }";
        }
        out += string(e.imageCount ? "\n  " : "") + "],\n";
        out += "  \"id\": " + jsonString(e.id);
        if (e.isNews)             out += ",\n  \"news\": true";
        if (!e.region.empty())    out += ",\n  \"region\": " + jsonString(e.region);
        if (!e.date.empty())      out += ",\n  \"date\": " + jsonString(e.date);
        if (!e.link.empty())      out += ",\n  \"link\": " + jsonString(e.link);
        if (!e.source.empty())    out += ",\n  \"source\": " + jsonString(e.source);
        if (!e.video.empty())     out += ",\n  \"video\": " + jsonString(e.video);
        if (!e.poster.empty())    out += ",\n  \"poster\": " + jsonString(e.poster);
        out += "\n }" + string(i + 1 < db.count ? "," : "") + "\n";
    }
    return out + "];\n";
}

// ---------- shob kichu ekshathe banano ----------

// buildWebsite : MAIN builder. siteDir = website er folder (jekhane index.html ache)
// siteUrl = jemon https://refat-75.github.io/moscutoe
// true = shofol
bool buildWebsite(const EntryArray& db, const string& siteDir, string siteUrl) {
    while (!siteUrl.empty() && siteUrl[siteUrl.size() - 1] == '/') siteUrl.erase(siteUrl.size() - 1);
    string dir = siteDir.empty() ? "." : siteDir;

    // 1) data.js
    if (!writeWholeFile(dir + "/data.js", buildDataJs(db))) return false;

    // 2) answer/ folder khali kore notun kore banai
    string answerDir = dir + "/answer";
    filesystem::create_directories(answerDir);
    for (auto& f : filesystem::directory_iterator(answerDir)) filesystem::remove(f.path());

    // 3) proti entry er jonno alada page
    string* slugs     = new string[db.count > 0 ? db.count : 1];   // proti entry r page er nam
    string* usedSlugs = new string[db.count > 0 ? db.count : 1];
    int usedCount = 0;
    string urls, today;
    { time_t now = time(nullptr); char buf[16]; strftime(buf, sizeof(buf), "%Y-%m-%d", gmtime(&now)); today = buf; }
    urls = "  <url><loc>" + siteUrl + "/</loc><lastmod>" + today + "</lastmod></url>\n  <url><loc>" + siteUrl + "/answers.html</loc><lastmod>" + today + "</lastmod></url>\n";

    for (int i = 0; i < db.count; i++) {
        const Entry& e = db.items[i];
        slugs[i] = makeSlug(e.question, usedSlugs, usedCount);
        string url  = siteUrl + "/answer/" + slugs[i] + ".html";
        urls += "  <url><loc>" + url + "</loc><lastmod>" + today + "</lastmod></url>\n";

        // Google er jonno Q&A structured data
        string ld = "{\"@context\":\"https://schema.org\",\"@type\":\"QAPage\",\"mainEntity\":{\"@type\":\"Question\",\"name\":" + jsonString(e.question, true) +
                    ",\"answerCount\":1,\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":" + jsonString(oneLine(e.answer), true) + "}}}";
        string html = pageHead(siteUrl, e.question + " | MosCutoe", cutText(oneLine(e.answer), 155), url, "../",
                               "\n<script type=\"application/ld+json\">" + ld + "</script>") +
            "<article class=\"card glass\"><h1>" + htmlEscape(e.question) + "</h1><p class=\"ans\" style=\"white-space:pre-line;line-height:1.7;font-size:17px;margin:0\">" +
            htmlEscape(e.answer) + "</p>" + imagesHtml(e, "../") + "</article>\n"
            "<div class=\"tools\"><a class=\"btn primary\" href=\"../?q=" + urlEncode(e.question) +
            "\">Search this on MosCutoe</a><a class=\"btn\" href=\"../answers.html\">All answers</a></div>" + pageFoot();
        if (!writeWholeFile(answerDir + "/" + slugs[i] + ".html", html)) return false;
    }

    // 4) answers.html : category onujayi shob answer
    string body = "<h1>All answers - MosCutoe</h1><p style=\"opacity:.9;line-height:1.6\">MosCutoe is a search engine built by Varendra University CSE students. "
                  "Here are all the questions and answers in our database. <a href=\"./\">Open the search engine</a>.</p>";
    const char* cats[] = { "university", "cse", "programming", "dsa", "math", "advanced", "local", "world" };
    for (int c = 0; c < 8; c++) {
        bool any = false;
        for (int i = 0; i < db.count; i++) {
            const Entry& e = db.items[i];
            if (e.cat != cats[c]) continue;
            if (!any) { body += "<h2 class=\"cat\">" + htmlEscape(categoryTitle(cats[c])) + "</h2>"; any = true; }
            body += "<article class=\"card glass\"><h3 style=\"margin:0 0 8px;font-size:19px\"><a href=\"answer/" + slugs[i] + ".html\">" + htmlEscape(e.question) +
                    "</a></h3><p style=\"white-space:pre-line;line-height:1.65;margin:0\">" + htmlEscape(e.answer) + "</p>" + imagesHtml(e, "") + "</article>";
        }
    }
    string all = pageHead(siteUrl, "All answers | MosCutoe - Varendra University CSE Search Engine",
                          "All questions and answers in the MosCutoe search engine: Varendra University, CSE, programming, data structures and more.",
                          siteUrl + "/answers.html", "", "") + body + pageFoot();
    writeWholeFile(dir + "/answers.html", all);

    // 5) sitemap.xml ar robots.txt
    writeWholeFile(dir + "/sitemap.xml", "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + urls + "</urlset>\n");
    writeWholeFile(dir + "/robots.txt", "User-agent: *\nAllow: /\n\nSitemap: " + siteUrl + "/sitemap.xml\n");

    // 6) index.html er SEO block update
    string idx = readWholeFile(dir + "/index.html");
    size_t a = idx.find("<!-- seo:start -->"), b = idx.find("<!-- seo:end -->");
    if (a != string::npos && b != string::npos && b > a) {
        string site = "{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"MosCutoe\",\"alternateName\":\"Mosquito The\",\"url\":\"" + siteUrl +
                      "/\",\"description\":\"A search engine built by Varendra University CSE students.\",\"potentialAction\":{\"@type\":\"SearchAction\",\"target\":\"" +
                      siteUrl + "/?q={search_term_string}\",\"query-input\":\"required name=search_term_string\"}}";
        string seo = "<!-- seo:start -->\n<link rel=\"canonical\" href=\"" + siteUrl + "/\">\n<meta property=\"og:url\" content=\"" + siteUrl +
                     "/\">\n<meta property=\"og:image\" content=\"" + siteUrl + "/img/og-image.jpg\">\n<script type=\"application/ld+json\">" + site +
                     "</script>\n<!-- seo:end -->";
        idx = idx.substr(0, a) + seo + idx.substr(b + string("<!-- seo:end -->").size());
        writeWholeFile(dir + "/index.html", idx);
    }
    delete[] slugs;
    delete[] usedSlugs;
    return true;
}

#endif
