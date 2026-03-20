


import { useState } from “react”;

const C = {
bg: “#0b0804”, surface: “#181210”, card: “#201610”,
border: “#35200f”, accent: “#c8783a”, gold: “#d4a843”,
text: “#ecdcbc”, textSec: “#7a5e3e”, green: “#3a7a4a”,
red: “#8a3a2a”,
};

const TENT_MENU = [
{
category: “🏴 Scotland”,
items: [
{ name: “Aberfeldy 21YO”, price: 32000 },
{ name: “Ardbeg Uigeadail”, price: 18000 },
{ name: “Ardbeg Corrybreckan”, price: 19500 },
{ name: “Ardbeg Smokiverse”, price: 25000 },
{ name: “Ardbeg Anthology 13YO The Harpy’s Tale”, price: 31000 },
{ name: “Ardbeg Anthology 15YO The Beithir’s Tale”, price: 29000 },
{ name: “Ardbeg Traigh Bhan 19YO B.7”, price: 46000 },
{ name: “Ardbeg Y2K 23Y”, price: 57000, note: “Half oz” },
{ name: “Ardbeg 25YO”, price: 170000 },
{ name: “Arran Sherry Cask CS”, price: 19000, soldOut: true },
{ name: “Arran Port Cask Finish”, price: 17000 },
{ name: “Arran Amarone Cask Finish”, price: 17000, soldOut: true },
{ name: “Arran 7YO Korea Edition Private cask”, price: 28000 },
{ name: “Arran 15YO Rare Batch Peated Sherry”, price: 58000 },
{ name: “Arran 17YO 2023 Limited Edition”, price: 41000 },
{ name: “Arran 21YO”, price: 43000 },
{ name: “Arran Machrie Moor 10YO”, price: 19500 },
{ name: “Arran Machrie Moor CS”, price: 20000 },
{ name: “Arran Signature Series Edition.1”, price: 32000 },
{ name: “Arran Signature Series Edition.2”, price: 32000 },
{ name: “Arran Signature Series Edition.3”, price: 32000 },
{ name: “Auchentoshan Three Wood”, price: 15500 },
{ name: “Auchentoshan Sauvignon blanc finish”, price: 15000 },
{ name: “Auchentoshan 18YO”, price: 20000 },
{ name: “Auchentoshan 21YO”, price: 38000 },
{ name: “Ancnoc Peated Sherry”, price: 17000 },
{ name: “Ancnoc Peatheart”, price: 22000 },
{ name: “Balvenie The creation of a Classic”, price: 19500 },
{ name: “Balvenie 14YO Caribbean Cask”, price: 19500 },
{ name: “Balvenie 16YO French Oak”, price: 26000, soldOut: true },
{ name: “Balvenie 25YO”, price: 145000 },
{ name: “Benromach 12YO CS”, price: 21000 },
{ name: “Benromach 15YO”, price: 17000 },
{ name: “Benromach Virgin Oak”, price: 17000 },
{ name: “Benromach 2014 Vintage B.2”, price: 25000 },
{ name: “Benromach 21YO”, price: 38000 },
{ name: “Bowmore 15YO”, price: 21000 },
{ name: “Bowmore 18YO”, price: 27000 },
{ name: “Bowmore Aston Martin 21YO Edition 4”, price: 72000 },
{ name: “Bruichladdich Islay barley”, price: 19000 },
{ name: “Bruichladdich Port charlotte 10YO”, price: 19000 },
{ name: “Bruichladdich 18YO”, price: 43000 },
{ name: “Bruichladdich Micro Provenance 14YO”, price: 49000, soldOut: true },
{ name: “Octomore 14.1”, price: 46000 },
{ name: “Octomore 14.2”, price: 47000 },
{ name: “Octomore 14.3”, price: 54000, soldOut: true },
{ name: “Octomore 15.1”, price: 43000, soldOut: true },
{ name: “Octomore 15.2”, price: 43000 },
{ name: “Octomore 15.3”, price: 59000, soldOut: true },
{ name: “Cardhu 16YO 2022SR”, price: 24500 },
{ name: “Dalmore 15YO”, price: 21000 },
{ name: “Dalmore King Alexander III”, price: 43000 },
{ name: “Edradour 1st Fill Merlot Casks”, price: 24000 },
{ name: “Edradour 1st Fill Pinot Noir Casks”, price: 24000 },
{ name: “Edradour 1st Fill Lagrein Casks”, price: 27000 },
{ name: “Edradour Small Batch 10YO PX Sherry Casks”, price: 27000 },
{ name: “Edradour Small Batch 13YO Sauternes Casks”, price: 27000 },
{ name: “Edradour 12YO CS B.6”, price: 28000 },
{ name: “Edradour Korea Single Cask 10YO”, price: 29000 },
{ name: “Edradour Vintage Ibisco Decanter 11YO”, price: 33000 },
{ name: “Edradour 21YO CS”, price: 155500 },
{ name: “Glenallachie 7YO Hungarian virgin oak”, price: 22000 },
{ name: “Glenallachie 9YO Rye wood finish”, price: 19500 },
{ name: “Glenallachie 10YO CS B.7”, price: 19000 },
{ name: “Glenallachie 10YO CS B.9”, price: 19000 },
{ name: “Glenallachie 10YO French virgin oak”, price: 18000 },
{ name: “Glenallachie 10YO Chinquapin virgin oak”, price: 18000 },
{ name: “Glenallachie 10YO Spanish virgin oak”, price: 25000 },
{ name: “Glenallachie 11YO Pedro Ximenez wood finish”, price: 18000 },
{ name: “Glenallachie 15YO”, price: 22000 },
{ name: “Glenallachie Sinteis (Chinquapin, Pedro Ximenez)”, price: 28000 },
{ name: “Glenallachie 17YO Mizunara, Oloroso finish”, price: 83000 },
{ name: “Glenallachie 21YO CS B.3”, price: 93000 },
{ name: “Glencadam 13Y Re-awakening”, price: 16000 },
{ name: “Glencadam 15Y”, price: 18000 },
{ name: “Glenglassaugh Portsoy”, price: 17000 },
{ name: “Glendronach 15YO”, price: 24000 },
{ name: “Glendronach 18YO”, price: 38000 },
{ name: “Glendronach 21YO”, price: 48000 },
{ name: “Glendronach Ode to valley”, price: 21000 },
{ name: “Glenfarclas 15YO”, price: 17000, soldOut: true },
{ name: “Glenfarclas 25YO”, price: 45500, soldOut: true },
{ name: “Glenfarclas 105 CS”, price: 18500, soldOut: true },
{ name: “Glenfiddich 15YO”, price: 18000 },
{ name: “Glenfiddich Aston Martin F1 Edition 16YO”, price: 20000 },
{ name: “Glenfiddich 18YO”, price: 23000 },
{ name: “Glengrant 15YO”, price: 16000 },
{ name: “Glengrant 18YO”, price: 24000 },
{ name: “Glengoyne Korea Edition 장승업 화가”, price: 89000 },
{ name: “Glenlivet 18YO”, price: 23000 },
{ name: “Glenmorangie 14YO Quinta ruban”, price: 15000 },
{ name: “Glenmorangie Nectar 16Y”, price: 19000 },
{ name: “Glenmorangie 18YO Infinita”, price: 24000 },
{ name: “Glenmorangie Signet”, price: 28000 },
{ name: “Glenmorangie Signet Reserve”, price: 49000 },
{ name: “Glenmorangie A tale of forest”, price: 23000 },
{ name: “Glenmorangie Vintage 1998”, price: 55000, note: “Half oz” },
{ name: “Glenscotia 18YO”, price: 29000 },
{ name: “Glenscotia Victoriana”, price: 25000 },
{ name: “Glenscotia 12YO Icons Of Campbeltown”, price: 38000 },
{ name: “Glenscotia 11YO Campbeltown malt festival 2023”, price: 23500 },
{ name: “Glenscotia 9YO Campbeltown malt festival 2024”, price: 24000 },
{ name: “Glenscotia 9YO Campbeltown malt festival 2025”, price: 24000, soldOut: true },
{ name: “Glenscotia For South Korea Oloroso Sherry 2022”, price: 21500 },
{ name: “Glenscotia For South Korea Tawny port 2022”, price: 21500 },
{ name: “Glenscotia For South Korea Bourbon 2023”, price: 27000 },
{ name: “Glenscotia For South Korea Oloroso Sherry 2023”, price: 29000 },
{ name: “Glenscotia For South Korea Jamaican Rum 2024”, price: 27000 },
{ name: “Glenscotia For South Korea Oloroso Sherry 2025”, price: 26000 },
{ name: “Glenscotia For Big Dream Ruby Port 2025”, price: 24000 },
{ name: “Glenscotia For Big Dream Tawny Port 2025”, price: 24000 },
{ name: “Highland Park Between You And I 16YO”, price: 33000 },
{ name: “Highland Park 18YO”, price: 26000, soldOut: true },
{ name: “Highland Park 21YO”, price: 72000 },
{ name: “Highland Park CS B.5”, price: 27000 },
{ name: “Inchgower 14YO”, price: 21000 },
{ name: “Johnnie Walker Blue”, price: 29000 },
{ name: “Kilchoman Machir bay”, price: 13000, soldOut: true },
{ name: “Kilchoman Sanaig”, price: 17000 },
{ name: “Kilchoman Loch gorm 2024”, price: 25000 },
{ name: “Kilchoman Sauternes 2024”, price: 25000 },
{ name: “Kilkerran 12YO”, price: 16000 },
{ name: “Kilkerran 16YO”, price: 27000 },
{ name: “Kilkerran 8YO CS Sherry B.10”, price: 28000 },
{ name: “Kilkerran Heavily Peated B.9”, price: 29000 },
{ name: “Kilkerran Heavily Peated B.10”, price: 29000 },
{ name: “Kilkerran Heavily Peated B.11”, price: 29000 },
{ name: “Kilkerran Heavily Peated B.12”, price: 29000 },
{ name: “Kilkerran 17YO Single cask 20th anniversary”, price: 53000 },
{ name: “Lagavulin 16YO”, price: 19500 },
{ name: “Lagavulin Distillers Edition 2021”, price: 21500 },
{ name: “Lagavulin Distillers Edition 2022”, price: 22000 },
{ name: “Lochlea Our Barley”, price: 19000 },
{ name: “Lochlea Ploughing Edition Third Crop”, price: 21000 },
{ name: “Lochlea Orchard Oak”, price: 21000, soldOut: true },
{ name: “Lochlea Smoke Without Fire”, price: 21000 },
{ name: “Lochlea Fallow Dark Briar”, price: 21000 },
{ name: “Lochlea Red Wine Cask”, price: 24000 },
{ name: “Lochlea CS B.3”, price: 27000 },
{ name: “Lochlea Single Cask From Big Dream”, price: 33000 },
{ name: “Laphroaig Lore”, price: 25000 },
{ name: “Laphroaig 34YO Ian Hunter”, price: 198000 },
{ name: “Linkwood 12YO”, price: 20000 },
{ name: “Macallan 12YO Sherry Cask”, price: 15000, soldOut: true },
{ name: “Macallan 12YO Double Cask”, price: 14000 },
{ name: “Macallan 12YO Triple Cask”, price: 19000 },
{ name: “Macallan 15YO Double Cask”, price: 21000 },
{ name: “Macallan 18YO Sherry Cask”, price: 51000 },
{ name: “Macallan A night on earth”, price: 26000 },
{ name: “Macallan Harmony Collection Intense Arabica”, price: 45000 },
{ name: “Macnair’s Lum Reek 10YO CS B.2”, price: 21000 },
{ name: “Mannochmore 12YO”, price: 18000 },
{ name: “Mortlach CS 2022SR”, price: 29500 },
{ name: “Mortlach 12YO”, price: 17000 },
{ name: “Mortlach 16YO”, price: 19000, soldOut: true },
{ name: “Oban 14YO”, price: 19000 },
{ name: “Oban Distillery Edition”, price: 23000 },
{ name: “Oban 10YO CS 2022SR”, price: 20000 },
{ name: “Old Pulteney 18YO”, price: 28500 },
{ name: “Singleton 19YO CS 2021SR”, price: 23000 },
{ name: “Singleton 15YO CS 2022SR”, price: 21000 },
{ name: “Strathmill 12YO”, price: 18000 },
{ name: “Talisker 8YO CS 2021SR”, price: 17500 },
{ name: “Tambhu Korea Edition European Oak”, price: 65000 },
]
},
{
category: “🇺🇸 America”,
items: [
{ name: “Baker’s 7YO”, price: 14000 },
{ name: “Barrell Foundation 5YO”, price: 20000 },
{ name: “Barrell Seagrass”, price: 22000 },
{ name: “Barrell Vantage”, price: 22000 },
{ name: “Barrell Dovetail”, price: 22000 },
{ name: “Blanton’s Gold Edition”, price: 38000 },
{ name: “Booker’s”, price: 29000 },
{ name: “Eagle Rare 10YO”, price: 16000 },
{ name: “Engel’s Envy 10th CS”, price: 38000 },
{ name: “James E. Pepper 1776 Barrel Proof Bourbon”, price: 23000 },
{ name: “James E. Pepper 1776 Barrel Proof Rye”, price: 23000 },
{ name: “Kentucky Owl St. Patrick’s Edition”, price: 57000 },
{ name: “Kentucky Owl Batch.10”, price: 76000 },
{ name: “Kentucky Owl Batch.11”, price: 76000 },
{ name: “Maker’s Mark CS”, price: 19000 },
{ name: “Maker’s Mark Cellar Aged 2023”, price: 38000 },
{ name: “Maker’s Mark Cellar Aged 2025”, price: 38000 },
{ name: “Michter’s Toasted Barrel Finish”, price: 31000 },
{ name: “Michter’s Barrel Strength Rye”, price: 29000 },
{ name: “Michter’s Straight Rye 10YO”, price: 43000 },
{ name: “Michter’s Straight Bourbon 10YO”, price: 43000 },
{ name: “Bomberger’s Declaration 2024”, price: 32000 },
{ name: “Bomberger’s Declaration 2025 P.F.G”, price: 39000, soldOut: true },
{ name: “Shenk’s Homestead 2024”, price: 29000 },
{ name: “Noah’s Mill”, price: 17000 },
{ name: “Redemption Wheated Bourbon”, price: 19000 },
{ name: “Redemption High Rye Bourbon”, price: 20000 },
{ name: “Redemption Barrel Proof Bourbon 9YO”, price: 30000 },
{ name: “Rossville Union Rye”, price: 19000 },
{ name: “Rowan’s Creek”, price: 17000 },
{ name: “Russell’s Reserve Single barrel Bourbon”, price: 17000 },
{ name: “Russell’s Reserve Single barrel Rye”, price: 22000 },
{ name: “Russell’s Reserve 13YO”, price: 38000 },
{ name: “Whistle pig 12YO”, price: 17500 },
{ name: “Whistle pig 15YO”, price: 24000 },
{ name: “Widow Jane Rye American oak”, price: 19000 },
{ name: “Wild Turkey 12YO”, price: 20000 },
{ name: “Wild Turkey Rare Breed”, price: 17000 },
{ name: “Weller 12YO”, price: 29000 },
{ name: “Willett Rye”, price: 19000 },
{ name: “Woodford Reserve Bourbon”, price: 13000 },
{ name: “Woodford Reserve Rye”, price: 13000 },
]
},
{
category: “🇯🇵 Japan”,
items: [
{ name: “Hakushu DR”, price: 17500, soldOut: true },
{ name: “Hakushu 12YO”, price: 29000 },
{ name: “Hakushu 18YO”, price: 89000 },
{ name: “Hibiki”, price: 19000 },
{ name: “Hibiki 21YO”, price: 99000 },
{ name: “Yamazaki DR”, price: 17500 },
{ name: “Yamazaki 12YO”, price: 29000 },
{ name: “Yamazaki 18YO”, price: 89000 },
{ name: “Komakatake 2020”, price: 27000 },
{ name: “Komakatake 2021”, price: 26000 },
{ name: “Komakatake 2022”, price: 24000 },
{ name: “Tsunuki 2022”, price: 21000 },
{ name: “Nagahama First Batch”, price: 31000 },
{ name: “Nagahama Second Batch”, price: 33000 },
{ name: “Nagahama Third Batch”, price: 33000 },
{ name: “Akkeshi Keichitsu”, price: 78000 },
{ name: “Kaiyo CS”, price: 23000 },
{ name: “Kanosuke Single Malt”, price: 27000 },
{ name: “Kanosuke Hioki Pot Still”, price: 28000 },
{ name: “Kanosuke Double Distillery”, price: 29000 },
{ name: “Ikawa Flora 2024”, price: 33000 },
{ name: “Ikawa Fauna 2025”, price: 38000 },
]
},
{
category: “🇮🇪 Ireland”,
items: [
{ name: “Writer’s Tears CS”, price: 26000, soldOut: true },
]
},
];

export default function BarMenuView({ notes, onAddToWishlist }) {
const [selectedCategory, setSelectedCategory] = useState(0);
const [search, setSearch] = useState(””);
const [added, setAdded] = useState({});

const inCollection = (name) => notes.some(n => n.name.toLowerCase() === name.toLowerCase());

const handleAdd = (item) => {
if (item.soldOut) return;
onAddToWishlist(item.name, item.price);
setAdded(prev => ({ …prev, [item.name]: true }));
setTimeout(() => setAdded(prev => ({ …prev, [item.name]: false })), 2000);
};

const allItems = TENT_MENU.flatMap(c => c.items.map(i => ({ …i, category: c.category })));
const searchResults = search.length > 1
? allItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
: null;

const currentItems = searchResults || TENT_MENU[selectedCategory].items;

return (
<div style={{ padding: “0 0 88px” }}>
{/* 바 헤더 */}
<div style={{ background: `linear-gradient(135deg, #2a1a0a, ${C.card})`, padding: “16px 16px 12px”, borderBottom: `1px solid ${C.border}`, marginBottom: 0 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<div>
<div style={{ fontFamily: “‘Playfair Display’,serif”, fontSize: 17, fontWeight: 800, color: C.gold }}>텐트충무로</div>
<div style={{ fontSize: 11, color: C.textSec, marginTop: 2 }}>서울 중구 충무로 · 탭하면 위시리스트에 추가</div>
</div>
<a href=“https://tentchungmuro.imweb.me” target=”_blank” rel=“noreferrer”
style={{ marginLeft: “auto”, fontSize: 11, color: C.accent, textDecoration: “none”, border: `1px solid ${C.accent}`, borderRadius: 8, padding: “4px 10px” }}>
메뉴 사이트 →
</a>
</div>
</div>

```
  {/* 검색 */}
  <div style={{ padding: "12px 16px 0" }}>
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textSec }}>🔍</span>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="메뉴 검색..."
        style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px 10px 36px", color: C.text, fontSize: 14, outline: "none" }} />
    </div>
  </div>

  {/* 카테고리 탭 */}
  {!search && (
    <div style={{ display: "flex", gap: 6, padding: "12px 16px 0", overflowX: "auto", paddingBottom: 4 }}>
      {TENT_MENU.map((cat, i) => (
        <button key={i} onClick={() => setSelectedCategory(i)} style={{
          whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
          background: selectedCategory === i ? C.accent + "22" : "transparent",
          border: `1px solid ${selectedCategory === i ? C.accent : C.border}`,
          color: selectedCategory === i ? C.accent : C.textSec,
        }}>
          {cat.category} ({cat.items.filter(x => !x.soldOut).length})
        </button>
      ))}
    </div>
  )}

  {/* 아이템 리스트 */}
  <div style={{ padding: "12px 16px 0" }}>
    {searchResults && (
      <div style={{ fontSize: 11, color: C.textSec, marginBottom: 8 }}>검색 결과 {searchResults.length}개</div>
    )}
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {currentItems.map((item, i) => {
        const alreadyIn = inCollection(item.name);
        const justAdded = added[item.name];
        return (
          <div key={i} onClick={() => handleAdd(item)} style={{
            background: item.soldOut ? C.surface : C.card,
            border: `1px solid ${alreadyIn ? C.gold + "66" : C.border}`,
            borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
            cursor: item.soldOut ? "default" : "pointer",
            opacity: item.soldOut ? 0.5 : 1,
            transition: "all .15s",
          }}
            onMouseOver={e => { if (!item.soldOut) e.currentTarget.style.borderColor = C.accent; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = alreadyIn ? C.gold + "66" : C.border; }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: item.soldOut ? C.textSec : C.text, fontWeight: 500, textDecoration: item.soldOut ? "line-through" : "none" }}>
                {item.name}
              </div>
              {item.note && <div style={{ fontSize:10, color: C.textSec, marginTop: 2 }}>{item.note}</div>}
              {searchResults && <div style={{ fontSize: 10, color: C.textSec, marginTop: 2 }}>{item.category}</div>}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: C.gold }}>
                {item.price.toLocaleString()}원
              </div>
              {item.soldOut
                ? <div style={{ fontSize: 9, color: C.red, marginTop: 2 }}>품절</div>
                : justAdded
                ? <div style={{ fontSize: 9, color: C.green, marginTop: 2 }}>✓ 추가됨</div>
                : alreadyIn
                ? <div style={{ fontSize: 9, color: C.gold, marginTop: 2 }}>⭐ 컬렉션 있음</div>
                : <div style={{ fontSize: 9, color: C.textSec, marginTop: 2 }}>+ 위시리스트</div>
              }
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>
```

);
}