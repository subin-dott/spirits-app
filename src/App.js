


import { useState, useEffect, useRef, startTransition } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, CartesianGrid
} from "recharts";

const C = {
  bg: "#0b0804", surface: "#181210", card: "#201610",
  border: "#35200f", accent: "#c8783a", gold: "#d4a843",
  text: "#ecdcbc", textSec: "#7a5e3e", green: "#3a7a4a",
  purple: "#6a5a8a", red: "#8a3a2a",
};

const SPIRIT_TYPES = [
  { id: "whisky",   label: "위스키",        icon: "🥃", color: "#c8783a" },
  { id: "gin",      label: "진",            icon: "🌿", color: "#4a9a7a" },
  { id: "rum",      label: "럼",            icon: "🌴", color: "#3a8a5a" },
  { id: "cognac",   label: "꼬냑",          icon: "🍇", color: "#9a5a8a" },
  { id: "calvados", label: "칼바도스",      icon: "🍏", color: "#6a8a3a" },
  { id: "agave",    label: "아가베 스피릿", icon: "🌵", color: "#8a9a3a" },
  { id: "other",    label: "기타",          icon: "🍶", color: "#7a6a5a" },
];

const STATUS_CFG = {
  owned:    { label: "보유 중",     color: "#3a7a4a", icon: "🏠" },
  tasted:   { label: "마셔봄",     color: "#c8783a", icon: "✅" },
  wishlist: { label: "위시리스트", color: "#6a5a8a", icon: "✨" },
};

const BODY_LABELS = ["라이트", "미디엄-라이트", "미디엄", "미디엄-풀", "풀 바디"];

const DRINK_COLORS = [
  { name: "페일 스트로", hex: "#f5eec8" }, { name: "페일 골드", hex: "#e8d060" },
  { name: "골드",        hex: "#d4a843" }, { name: "딥 골드",   hex: "#c49030" },
  { name: "앰버",        hex: "#c8783a" }, { name: "딥 앰버",   hex: "#9e5828" },
  { name: "레드 앰버",   hex: "#8a3820" }, { name: "마호가니",  hex: "#6b2818" },
  { name: "크리스탈",    hex: "#e8f0f5" }, { name: "페일 그린", hex: "#d4e8c8" },
];

const SPIRIT_CFG = {
  whisky: {
    regions: ["스페이사이드","하이랜드","아일라","로우랜드","캠벨타운","아이리시","버번","라이","재패니즈","타이완","인디안","기타"],
    nose:    ["바닐라","꿀","꽃향","사과","배","시트러스","스파이시","스모키","피트","흙향","견과류","캐러멜","오크","건과일","가죽","해양","민트","초콜릿","헤더","이탄"],
    palate:  ["달콤함","드라이","스파이시","과일향","스모키","피트","오키","크리미","견과류","시트러스","허브","약품향","버터","곡물","당밀","후추","진저"],
    finish:  ["짧음","중간","길고 여운있음","드라이","달콤함","워밍","스파이시","스모키","클린","소금기","오일리","쌉쌀함"],
  },
  gin: {
    regions: ["런던 드라이","플리머스","올드 탐","뉴 웨스턴","진에버","슈타인헤거","기타"],
    nose:    ["주니퍼","코리앤더","안젤리카","시트러스","레몬","라임","오렌지","장미","라벤더","오이","민트","후추","카다멈","계피","바이올렛","홉","허브","꽃향","생강","파인"],
    palate:  ["주니퍼","드라이","달콤함","시트러스","스파이시","허브","크리미","미네랄","꽃향","과일향","쓴맛","버터","진저","우디"],
    finish:  ["짧음","중간","길고 여운있음","드라이","쓴 여운","주니퍼","시트러스","스파이시","클린","허브향","따뜻함"],
  },
  rum: {
    regions: ["자메이카","바베이도스","쿠바","트리니다드","과테말라","마르티니크 (AOC)","바하마","파나마","베네수엘라","도미니카","기타"],
    nose:    ["당밀","사탕수수","바나나","열대과일","파인애플","망고","코코넛","바닐라","캐러멜","오크","가죽","초콜릿","커피","흙향","스파이시","꽃향","시트러스","버터","훈연","풀향"],
    palate:  ["달콤함","드라이","과일향","스파이시","크리미","오키","열대향","당밀","바나나","코코넛","바닐라","초콜릿","버터","허브","탄닌감"],
    finish:  ["짧음","중간","길고 여운있음","달콤함","드라이","스파이시","과일향","따뜻함","클린","오일리"],
  },
  cognac: {
    regions: ["그랑 샹파뉴","프티 샹파뉴","보르드리","팽 부아","봉 부아","아르마냑","기타"],
    nose:    ["꽃향","장미","아카시아","바닐라","살구","복숭아","자두","건포도","무화과","오크","가죽","담배","초콜릿","커피","랑시오","버터","꿀","시트러스","스파이시"],
    palate:  ["달콤함","드라이","과일향","스파이시","크리미","오키","탄닌감","꽃향","견과류","버터","캐러멜","랑시오","허브","초콜릿"],
    finish:  ["짧음","중간","길고 우아함","드라이","과일향","스파이시","꽃향","오키","따뜻함","랑시오","쌉쌀함"],
  },
  calvados: {
    regions: ["칼바도스 (AOC)","페이 도쥬","도멘프롱","기타 노르망디"],
    nose:    ["신선한 사과","구운 사과","배","퀸스","살구","복숭아","시트러스","꽃향","바닐라","계피","넛맥","오크","가죽","버터","캐러멜","꿀","흙향","허브"],
    palate:  ["달콤함","드라이","사과향","과일향","스파이시","탄닌감","크리미","오키","꽃향","버터","캐러멜","견과류","신선함"],
    finish:  ["짧음","중간","길고 여운있음","드라이","달콤함","사과향","스파이시","클린","따뜻함","탄닌감"],
  },
  agave: {
    regions: ["할리스코 (블랑코)","할리스코 (레포사도)","할리스코 (아녜호)","오악사카 (메스칼)","게레로","두랑고","소노라","기타"],
    nose:    ["아가베","풀향","시트러스","라임","자몽","흙향","미네랄","스모키","스파이시","바닐라","꽃향","허브","후추","열대과일","코코아","크림","짚향","재향"],
    palate:  ["아가베","풀향","스모키","스파이시","달콤함","드라이","미네랄","시트러스","허브","흙향","과일향","크리미","쌉쌀함","짭짤함","후추"],
    finish:  ["짧음","중간","길고 여운있음","드라이","달콤함","스모키","스파이시","아가베","미네랄","클린","쌉쌀함","재향"],
  },
  other: {
    regions: [],
    nose:    ["달콤함","스파이시","과일향","꽃향","흙향","스모키","허브","견과류","시트러스","바닐라","오크","크리미","미네랄"],
    palate:  ["달콤함","드라이","스파이시","과일향","크리미","오키","허브","쓴맛","탄닌감","미네랄"],
    finish:  ["짧음","중간","길고 여운있음","드라이","달콤함","스파이시","클린","따뜻함","쌉쌀함"],
  },
};

const AI_SOURCES = {
  whisky:   "whiskybase.com, masterofmalt.com, or whiskynotes.be",
  gin:      "masterofmalt.com, theginkin.com, or diffordsguide.com",
  rum:      "rumratings.com or masterofmalt.com",
  cognac:   "cognac-expert.com or masterofmalt.com",
  calvados: "calvados.com or masterofmalt.com",
  agave:    "mezcalreviews.com or tequilaadvocate.com",
  other:    "masterofmalt.com",
};

function newNote(spiritType = "whisky") {
  return {
    id: null, spiritType,
    name: "", distillery: "", region: "", abv: "", vintage: "",
    agaveType: "", production: "",
    status: "tasted", color: "#d4a843", body: 3,
    nose: { tags: [], text: "" },
    palate: { tags: [], text: "" },
    finish: { tags: [], text: "" },
    rating: 80,
    date: new Date().toISOString().split("T")[0],
    location: "", price: "", repurchase: false, aiNotes: null,
  };
}

const getCfg  = (t) => SPIRIT_CFG[t]  || SPIRIT_CFG.other;
const getType = (t) => SPIRIT_TYPES.find(s => s.id === t) || SPIRIT_TYPES[SPIRIT_TYPES.length - 1];

function TagBtn({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "4px 11px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: `1px solid ${active ? color : C.border}`, background: active ? color + "28" : "transparent", color: active ? color : C.textSec, transition: "all .15s" }}>{label}</button>
  );
}
function TagSelector({ tags, selected, onToggle, color }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{tags.map(t => <TagBtn key={t} label={t} active={selected.includes(t)} color={color} onClick={() => onToggle(t)} />)}</div>;
}
function Sec({ title, children, accent = C.accent }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 16, background: accent, borderRadius: 2 }} />
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: accent }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
function Inp({ label, ...p }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, color: C.textSec, marginBottom: 5 }}>{label}</div>}
      <input {...p} style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 14, outline: "none", ...p.style }}
        onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
    </div>
  );
}
function Txta({ label, ...p }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <div style={{ fontSize: 11, color: C.textSec, marginBottom: 5 }}>{label}</div>}
      <textarea {...p} style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", resize: "vertical", minHeight: 68, fontFamily: "inherit", ...p.style }}
        onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
    </div>
  );
}
function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, color: C.textSec, marginBottom: 5 }}>{label}</div>}
      <select value={value} onChange={onChange} style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 14, outline: "none", cursor: "pointer" }}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}
function Btn({ children, onClick, variant = "primary", small, style = {} }) {
  const bg  = variant === "primary" ? C.accent : variant === "gold" ? C.gold : variant === "danger" ? C.red : C.surface;
  const col = variant === "ghost" ? C.textSec : "#fff";
  return (
    <button onClick={onClick} style={{ background: bg, color: col, border: `1px solid ${variant === "ghost" ? C.border : bg}`, borderRadius: 8, padding: small ? "6px 14px" : "10px 20px", fontSize: small ? 12 : 14, fontWeight: 600, cursor: "pointer", transition: "opacity .15s", fontFamily: "inherit", ...style }}
      onMouseOver={e => e.currentTarget.style.opacity = ".8"} onMouseOut={e => e.currentTarget.style.opacity = "1"}>
      {children}
    </button>
  );
}

function TypeSelectScreen({ onSelect }) {
  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ fontSize: 13, color: C.textSec, marginBottom: 20, textAlign: "center" }}>어떤 종류를 기록할까요?</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {SPIRIT_TYPES.map(s => (
          <button key={s.id} onClick={() => onSelect(s.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "24px 16px", borderRadius: 16, cursor: "pointer", border: `1px solid ${C.border}`, background: C.card, transition: "all .18s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = s.color + "18"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}>
            <span style={{ fontSize: 38 }}>{s.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AddEditView({ note, onChange, onSave, onCancel }) {
  const cfg = getCfg(note.spiritType);
  const st  = getType(note.spiritType);
  const toggleTag = (field, tag) => {
    const cur = note[field].tags;
    onChange(field, { ...note[field], tags: cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag] });
  };
  const vintageLabel = { whisky: "숙성 / 빈티지", gin: "증류 방식", rum: "숙성 / 빈티지", cognac: "등급 (VS/VSOP/XO)", calvados: "숙성 연수", agave: "종류 (블랑코/메스칼)", other: "기타" }[note.spiritType];

  return (
    <div style={{ padding: "0 16px 80px", maxWidth: 600, margin: "0 auto" }}>
      <Sec title="기본 정보">
        <Inp label="이름 *" value={note.name} onChange={e => onChange("name", e.target.value)} placeholder={{ whisky:"e.g. Lagavulin 16", gin:"e.g. Hendrick's", rum:"e.g. Appleton 12", cognac:"e.g. Hennessy XO", calvados:"e.g. Père Magloire", agave:"e.g. Del Maguey Vida", other:"이름" }[note.spiritType]} />
        <Inp label="증류소 / 브랜드" value={note.distillery} onChange={e => onChange("distillery", e.target.value)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {cfg.regions.length > 0
            ? <Sel label="지역" value={note.region} onChange={e => onChange("region", e.target.value)} options={["", ...cfg.regions].map(r => ({ value: r, label: r || "선택" }))} />
            : <Inp label="지역 / 원산지" value={note.region} onChange={e => onChange("region", e.target.value)} />}
          <Inp label="ABV (%)" value={note.abv} onChange={e => onChange("abv", e.target.value)} placeholder="43.0" type="number" />
        </div>
        {note.spiritType === "agave" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="아가베 품종" value={note.agaveType} onChange={e => onChange("agaveType", e.target.value)} placeholder="블루, 에스파딘..." />
            <Inp label="생산 방식" value={note.production} onChange={e => onChange("production", e.target.value)} placeholder="타호나, 오토클레이브..." />
          </div>
        ) : (
          <Inp label={vintageLabel} value={note.vintage} onChange={e => onChange("vintage", e.target.value)} />
        )}
        <Sel label="컬렉션 상태" value={note.status} onChange={e => onChange("status", e.target.value)} options={Object.entries(STATUS_CFG).map(([v, c]) => ({ value: v, label: c.label }))} />
      </Sec>

      <Sec title="색상">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {DRINK_COLORS.map(c => (
            <div key={c.hex} onClick={() => onChange("color", c.hex)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.hex, border: `3px solid ${note.color === c.hex ? "#fff" : "transparent"}`, boxShadow: note.color === c.hex ? `0 0 0 2px ${c.hex}` : "none", transition: "all .15s" }} />
              <span style={{ fontSize: 9, color: C.textSec, textAlign: "center", maxWidth: 46 }}>{c.name}</span>
            </div>
          ))}
        </div>
      </Sec>

      <Sec title="바디감">
        <input type="range" min={1} max={5} value={note.body} onChange={e => onChange("body", Number(e.target.value))} style={{ width: "100%", accentColor: C.accent, marginBottom: 6 }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {BODY_LABELS.map((l, i) => <span key={i} style={{ fontSize: 10, color: note.body === i + 1 ? C.accent : C.textSec, fontWeight: note.body === i + 1 ? 700 : 400 }}>{l}</span>)}
        </div>
      </Sec>

      <Sec title="향 (Nose)" accent="#6a9a7a">
        <TagSelector tags={cfg.nose} selected={note.nose.tags} color="#6a9a7a" onToggle={t => toggleTag("nose", t)} />
        <Txta value={note.nose.text} onChange={e => onChange("nose", { ...note.nose, text: e.target.value })} placeholder="향을 자유롭게 묘사해보세요..." style={{ marginTop: 8 }} />
      </Sec>
      <Sec title="맛 (Palate)" accent={st.color}>
        <TagSelector tags={cfg.palate} selected={note.palate.tags} color={st.color} onToggle={t => toggleTag("palate", t)} />
        <Txta value={note.palate.text} onChange={e => onChange("palate", { ...note.palate, text: e.target.value })} placeholder="맛을 묘사해보세요..." style={{ marginTop: 8 }} />
      </Sec>
      <Sec title="피니시 (Finish)" accent="#9a7a4a">
        <TagSelector tags={cfg.finish} selected={note.finish.tags} color="#9a7a4a" onToggle={t => toggleTag("finish", t)} />
        <Txta value={note.finish.text} onChange={e => onChange("finish", { ...note.finish, text: e.target.value })} placeholder="피니시를 묘사해보세요..." style={{ marginTop: 8 }} />
      </Sec>

      <Sec title="평점">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
          <input type="range" min={50} max={100} value={note.rating} onChange={e => onChange("rating", Number(e.target.value))} style={{ flex: 1, accentColor: C.gold }} />
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 800, color: C.gold, minWidth: 52, textAlign: "center" }}>{note.rating}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSec }}>
          <span>50</span><span>60</span><span>70</span><span>80</span><span>90</span><span>100</span>
        </div>
      </Sec>

      <Sec title="기록">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Inp label="날짜" type="date" value={note.date} onChange={e => onChange("date", e.target.value)} />
          <Inp label="가격" value={note.price} onChange={e => onChange("price", e.target.value)} placeholder="85,000원" />
        </div>
        <Inp label="장소 / 바" value={note.location} onChange={e => onChange("location", e.target.value)} placeholder="강남 어느 바..." />
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onChange("repurchase", !note.repurchase)}>
          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${note.repurchase ? C.green : C.border}`, background: note.repurchase ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {note.repurchase && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: 14, color: C.text }}>재구매 의사 있음</span>
        </div>
      </Sec>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <Btn onClick={onSave} style={{ flex: 1 }}>💾 저장하기</Btn>
        <Btn onClick={onCancel} variant="ghost" style={{ flex: 1 }}>취소</Btn>
      </div>
    </div>
  );
}

function NoteCard({ note: w, onClick }) {
  const cfg = STATUS_CFG[w.status];
  const st  = getType(w.spiritType);
  return (
    <div onClick={onClick} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${st.color}22`; }}
      onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
      <div style={{ height: 5, background: `linear-gradient(90deg,${st.color},${w.color}88)` }} />
      <div style={{ padding: "12px 12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <span style={{ fontSize: 9, background: st.color + "22", color: st.color, padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>{st.icon} {st.label}</span>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 18, color: C.gold }}>{w.rating}</div>
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 3 }}>{w.name || "이름 없음"}</div>
        <div style={{ fontSize: 11, color: C.textSec }}>{w.distillery}</div>
        {w.region && <div style={{ fontSize: 11, color: C.textSec, marginTop: 2 }}>📍 {w.region}</div>}
        <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, background: cfg.color + "22", color: cfg.color, padding: "1px 6px", borderRadius: 8 }}>{cfg.icon} {cfg.label}</span>
          {w.repurchase && <span style={{ fontSize: 9, color: C.green, background: C.green + "22", padding: "1px 6px", borderRadius: 8 }}>♻️ 재구매</span>}
        </div>
      </div>
    </div>
  );
}

function CollectionView({ notes, onSelect, onAdd, filter, setFilter, typeFilter, setTypeFilter, search, setSearch }) {
  const filtered = notes
    .filter(w => filter === "all" || w.status === filter)
    .filter(w => typeFilter === "all" || w.spiritType === typeFilter)
    .filter(w => !search || w.name.toLowerCase().includes(search.toLowerCase()) || (w.distillery || "").toLowerCase().includes(search.toLowerCase()));

  const typeCounts = {};
  SPIRIT_TYPES.forEach(s => { typeCounts[s.id] = notes.filter(n => n.spiritType === s.id).length; });
  const sc = { all: notes.length, owned: 0, tasted: 0, wishlist: 0 };
  notes.forEach(w => sc[w.status]++);

  return (
    <div style={{ padding: "0 16px 88px" }}>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textSec }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름 또는 증류소 검색..."
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px 10px 38px", color: C.text, fontSize: 14, outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4 }}>
        <button onClick={() => setTypeFilter("all")} style={{ whiteSpace: "nowrap", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", background: typeFilter === "all" ? C.accent + "22" : "transparent", border: `1px solid ${typeFilter === "all" ? C.accent : C.border}`, color: typeFilter === "all" ? C.accent : C.textSec }}>
          전체 ({notes.length})
        </button>
        {SPIRIT_TYPES.filter(s => typeCounts[s.id] > 0).map(s => (
          <button key={s.id} onClick={() => setTypeFilter(s.id)} style={{ whiteSpace: "nowrap", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", background: typeFilter === s.id ? s.color + "22" : "transparent", border: `1px solid ${typeFilter === s.id ? s.color : C.border}`, color: typeFilter === s.id ? s.color : C.textSec }}>
            {s.icon} {s.label} ({typeCounts[s.id]})
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {[{ id: "all", label: "전체", color: C.accent, icon: "🍶" }, ...Object.entries(STATUS_CFG).map(([v, c]) => ({ id: v, ...c }))].map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)} style={{ whiteSpace: "nowrap", padding: "5px 11px", borderRadius: 20, fontSize: 11, cursor: "pointer", background: filter === s.id ? s.color + "22" : "transparent", border: `1px solid ${filter === s.id ? s.color : C.border}`, color: filter === s.id ? s.color : C.textSec, fontWeight: filter === s.id ? 600 : 400 }}>
            {s.icon} {s.label} ({sc[s.id]})
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.textSec }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍶</div>
          <div style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>아직 기록이 없어요</div>
          <div style={{ fontSize: 13 }}>+ 버튼으로 첫 테이스팅 노트를 추가해보세요</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
          {filtered.map(w => <NoteCard key={w.id} note={w} onClick={() => onSelect(w.id)} />)}
        </div>
      )}
      <button onClick={onAdd} style={{ position: "fixed", bottom: 72, right: 20, width: 56, height: 56, borderRadius: 28, background: `linear-gradient(135deg,${C.accent},${C.gold})`, border: "none", color: "#fff", fontSize: 28, cursor: "pointer", boxShadow: `0 4px 24px ${C.accent}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
    </div>
  );
}

function DetailView({ note: w, onEdit, onDelete, onFetchAI, aiLoading }) {
  const cfg = STATUS_CFG[w.status];
  const st  = getType(w.spiritType);
  const tagCount = w.nose.tags.length + w.palate.tags.length + w.finish.tags.length;
  const allTags = [...w.nose.tags, ...w.palate.tags, ...w.finish.tags];

  const radarData = [
    { subject: "바디",   value: w.body * 20 },
    { subject: "복잡도", value: Math.min(100, tagCount / 12 * 100) },
    { subject: "피니시", value: w.finish.tags.includes("길고 여운있음") ? 90 : w.finish.tags.includes("중간") ? 60 : 30 },
    { subject: "달콤함", value: Math.min(100, allTags.filter(t => ["달콤함","꿀","바닐라","캐러멜","당밀","사과향"].includes(t)).length * 28) },
    { subject: "스모키", value: Math.min(100, allTags.filter(t => ["스모키","피트","이탄","훈연","재향"].includes(t)).length * 35) },
    { subject: "과일향", value: Math.min(100, allTags.filter(t => ["과일향","사과","배","시트러스","건과일","열대과일","바나나","살구","복숭아"].includes(t)).length * 25) },
  ];

  return (
    <div style={{ padding: "0 16px 80px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ background: `linear-gradient(135deg,${st.color}22,${C.card})`, borderRadius: 16, border: `1px solid ${st.color}44`, padding: "20px 20px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, background: st.color + "22", color: st.color, padding: "3px 8px", borderRadius: 10, fontWeight: 700 }}>{st.icon} {st.label}</span>
              <span style={{ fontSize: 11, background: cfg.color + "22", color: cfg.color, padding: "3px 8px", borderRadius: 10, fontWeight: 600 }}>{cfg.icon} {cfg.label}</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 6px", lineHeight: 1.2 }}>{w.name}</h1>
            <div style={{ color: C.textSec, fontSize: 13 }}>{[w.distillery, w.region, w.abv && `${w.abv}%`, w.vintage, w.agaveType, w.production].filter(Boolean).join(" · ")}</div>
          </div>
          <div style={{ textAlign: "center", marginLeft: 16 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 50, fontWeight: 800, color: C.gold, lineHeight: 1, textShadow: `0 0 30px ${C.gold}44` }}>{w.rating}</div>
            <div style={{ fontSize: 10, color: C.textSec }}>/ 100</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: w.color, border: `2px solid ${C.border}`, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.textSec }}>{DRINK_COLORS.find(c => c.hex === w.color)?.name} · {BODY_LABELS[w.body - 1]}</span>
          {w.date     && <span style={{ fontSize: 12, color: C.textSec }}>📅 {w.date}</span>}
          {w.location && <span style={{ fontSize: 12, color: C.textSec }}>📍 {w.location}</span>}
          {w.price    && <span style={{ fontSize: 12, color: C.textSec }}>💰 {w.price}</span>}
          {w.repurchase && <span style={{ fontSize: 12, color: C.green }}>♻️ 재구매 의향</span>}
        </div>
      </div>

      {tagCount > 2 && (
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: "14px 8px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: st.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, paddingLeft: 8 }}>테이스팅 프로필</div>
          <ResponsiveContainer width="100%" height={170}>
            <RadarChart data={radarData} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: C.textSec, fontSize: 10 }} />
              <Radar dataKey="value" fill={st.color} fillOpacity={0.25} stroke={st.color} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {[{ key: "nose", label: "향 (Nose)", color: "#6a9a7a" }, { key: "palate", label: "맛 (Palate)", color: st.color }, { key: "finish", label: "피니시", color: "#9a7a4a" }].map(({ key, label, color }) =>
        (w[key].tags.length > 0 || w[key].text) && (
          <div key={key} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{label}</div>
            {w[key].tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: w[key].text ? 8 : 0 }}>
                {w[key].tags.map(t => <span key={t} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, background: color + "20", color, border: `1px solid ${color}44` }}>{t}</span>)}
              </div>
            )}
            {w[key].text && <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6, fontStyle: "italic" }}>"{w[key].text}"</p>}
          </div>
        )
      )}

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.gold}44`, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em" }}>🤖 AI 테이스팅 노트</div>
            <div style={{ fontSize: 10, color: C.textSec, marginTop: 2 }}>웹 검색 후 한국어 번역</div>
          </div>
          <Btn small onClick={() => onFetchAI(w)} variant="gold" style={{ minWidth: 80 }}>
            {aiLoading ? "⏳ 검색 중..." : w.aiNotes ? "🔄 새로고침" : "🔍 검색하기"}
          </Btn>
        </div>
        {aiLoading && (
          <div style={{ color: C.textSec, fontSize: 13, textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
            {AI_SOURCES[w.spiritType]}에서 리뷰를 찾고 있어요...
          </div>
        )}
        {!aiLoading && w.aiNotes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["향", "#6a9a7a", w.aiNotes.nose], ["맛", st.color, w.aiNotes.palate], ["피니시", "#9a7a4a", w.aiNotes.finish], ["종합", C.gold, w.aiNotes.overall]].map(([lbl, col, val]) => val && (
              <div key={lbl} style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: col, minWidth: 32, paddingTop: 2 }}>{lbl}</span>
                <span style={{ fontSize: 13, color: C.text, lineHeight: 1.7, flex: 1 }}>{val}</span>
              </div>
            ))}
            {w.aiNotes.source && <div style={{ fontSize: 10, color: C.textSec, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>📎 출처: {w.aiNotes.source}</div>}
          </div>
        )}
        {!aiLoading && !w.aiNotes && (
          <div style={{ color: C.textSec, fontSize: 13, lineHeight: 1.6 }}>
            버튼을 누르면 전문가 테이스팅 노트를<br />검색해서 한국어로 번역해드려요.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={onEdit} style={{ flex: 1 }}>✏️ 수정</Btn>
        <Btn onClick={onDelete} variant="danger" small>🗑️ 삭제</Btn>
      </div>
    </div>
  );
}

function CompareView({ notes }) {
  const [ids, setIds] = useState([null, null]);
  const sel = ids.map(id => notes.find(w => w.id === id) || null);
  const allTags = sel.some(Boolean) ? [...new Set(sel.flatMap(w => w ? [...w.nose.tags, ...w.palate.tags, ...w.finish.tags] : []))] : [];
  const hasTag = (w, tag) => w && [...w.nose.tags, ...w.palate.tags, ...w.finish.tags].includes(tag);

  return (
    <div style={{ padding: "0 16px 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[0, 1].map(i => (
          <div key={i}>
            <div style={{ fontSize: 11, color: C.textSec, marginBottom: 6 }}>드링크 {i + 1}</div>
            <select value={ids[i] || ""} onChange={e => { const n = [...ids]; n[i] = e.target.value || null; setIds(n); }}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none" }}>
              <option value="">선택하세요</option>
              {notes.map(w => <option key={w.id} value={w.id}>{getType(w.spiritType).icon} {w.name}</option>)}
            </select>
          </div>
        ))}
      </div>
      {sel.every(Boolean) ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {sel.map((w, i) => {
              const st = getType(w.spiritType);
              return (
                <div key={i} style={{ background: C.card, borderRadius: 14, border: `1px solid ${st.color}44`, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{st.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 3 }}>{w.name}</div>
                  <div style={{ fontSize: 11, color: st.color, marginBottom: 8 }}>{st.label}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 800, color: C.gold }}>{w.rating}</div>
                </div>
              );
            })}
          </div>
          {[{ label: "바디감", vals: sel.map(w => w.body), max: 5, fmt: v => BODY_LABELS[v - 1] }, { label: "평점", vals: sel.map(w => w.rating), max: 100, fmt: v => v }].map(({ label, vals, max, fmt }) => (
            <div key={label} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "12px 16px", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.textSec, marginBottom: 10 }}>{label}</div>
              {vals.map((v, i) => (
                <div key={i} style={{ marginBottom: i === 0 ? 10 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.text }}>{sel[i].name}</span>
                    <span style={{ fontSize: 12, color: i === 0 ? C.accent : C.gold, fontWeight: 700 }}>{fmt(v)}</span>
                  </div>
                  <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                    <div style={{ height: "100%", borderRadius: 3, background: i === 0 ? C.accent : C.gold, width: `${v / max * 100}%`, transition: "width .4s" }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
          {allTags.length > 0 && (
            <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: C.textSec, marginBottom: 12 }}>노트 비교 — ★ 공통 태그</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allTags.slice(0, 18).map(tag => {
                  const inA = hasTag(sel[0], tag), inB = hasTag(sel[1], tag);
                  return (
                    <div key={tag} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ flex: 1, textAlign: "right" }}>{inA ? <span style={{ background: C.accent + "22", color: C.accent, padding: "2px 8px", borderRadius: 10, fontSize: 12 }}>{tag}</span> : <span style={{ color: C.border, fontSize: 12 }}>—</span>}</span>
                      <span style={{ fontSize: 12, color: inA && inB ? C.gold : C.border, minWidth: 18, textAlign: "center" }}>{inA && inB ? "★" : ""}</span>
                      <span style={{ flex: 1 }}>{inB ? <span style={{ background: C.gold + "22", color: C.gold, padding: "2px 8px", borderRadius: 10, fontSize: 12 }}>{tag}</span> : <span style={{ color: C.border, fontSize: 12 }}>—</span>}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "50px 0", color: C.textSec }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⚖️</div>
          <div>두 드링크를 선택하면 비교해드려요</div>
        </div>
      )}
    </div>
  );
}

function StatsView({ notes }) {
  const tasted = notes.filter(w => w.status !== "wishlist");
  const avg = tasted.length ? (tasted.reduce((s, w) => s + w.rating, 0) / tasted.length).toFixed(1) : 0;
  const typeData = SPIRIT_TYPES.map(s => {
    const arr = tasted.filter(n => n.spiritType === s.id);
    return { label: s.icon + " " + s.label, count: arr.length, avg: arr.length ? +(arr.reduce((a, n) => a + n.rating, 0) / arr.length).toFixed(1) : 0 };
  }).filter(d => d.count > 0);
  const tagFreq = {};
  tasted.forEach(w => [...w.nose.tags, ...w.palate.tags, ...w.finish.tags].forEach(t => tagFreq[t] = (tagFreq[t] || 0) + 1));
  const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const bins = [{ r: "50-69", f: w => w.rating < 70 }, { r: "70-79", f: w => w.rating >= 70 && w.rating < 80 }, { r: "80-89", f: w => w.rating >= 80 && w.rating < 90 }, { r: "90+", f: w => w.rating >= 90 }].map(({ r, f }) => ({ range: r, count: tasted.filter(f).length }));
  const timeline = [...tasted].filter(w => w.date).sort((a, b) => a.date > b.date ? 1 : -1).slice(-12).map(w => ({ date: w.date.slice(5), rating: w.rating, name: w.name }));

  if (!notes.length) return <div style={{ textAlign: "center", padding: "80px 16px", color: C.textSec }}><div style={{ fontSize: 48, marginBottom: 12 }}>📊</div><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18 }}>아직 데이터가 없어요</div></div>;

  return (
    <div style={{ padding: "0 16px 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        {[{ label: "총 기록", val: notes.length, icon: "📚" }, { label: "마셔봄", val: tasted.length, icon: "✅" }, { label: "평균 평점", val: avg, icon: "⭐" }].map(({ label, val, icon }) => (
          <div key={label} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, color: C.gold }}>{val}</div>
            <div style={{ fontSize: 10, color: C.textSec, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      {typeData.length > 0 && (
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>종류별 현황</div>
          {typeData.map(d => (
            <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: C.text, minWidth: 118 }}>{d.label}</span>
              <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3 }}>
                <div style={{ height: "100%", borderRadius: 3, background: C.accent, width: `${d.count / Math.max(...typeData.map(x => x.count)) * 100}%` }} />
              </div>
              <span style={{ fontSize: 11, color: C.textSec, minWidth: 52, textAlign: "right" }}>{d.count}개 · {d.avg}점</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>평점 분포</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={bins} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="range" tick={{ fill: C.textSec, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.textSec, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} />
            <Bar dataKey="count" fill={C.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {topTags.length > 0 && (
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>선호 향/맛 TOP 10</div>
          {topTags.map(([tag, count], i) => (
            <div key={tag} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: C.textSec, minWidth: 20 }}>#{i + 1}</span>
              <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{tag}</span>
              <div style={{ flex: 2, height: 5, background: C.border, borderRadius: 3 }}>
                <div style={{ height: "100%", borderRadius: 3, background: `hsl(${30 + i * 11},55%,52%)`, width: `${count / topTags[0][1] * 100}%` }} />
              </div>
              <span style={{ fontSize: 11, color: C.textSec, minWidth: 18, textAlign: "right" }}>{count}</span>
            </div>
          ))}
        </div>
      )}
      {timeline.length > 1 && (
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>평점 히스토리</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={timeline} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: C.textSec, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: C.textSec, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={(v, n, p) => [v, p.payload.name]} labelFormatter={() => ""} />
              <Line type="monotone" dataKey="rating" stroke={C.gold} strokeWidth={2} dot={{ fill: C.gold, r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view,       setView]       = useState("collection");
  const [notes,      setNotes]      = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editNote,   setEditNote]   = useState(null);
  const [filter,     setFilter]     = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);
  const [aiLoading,  setAiLoading]  = useState(false);

  const notesRef = useRef([]);
  useEffect(() => { notesRef.current = notes; }, [notes]);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("spirits_v2");
        if (r) setNotes(JSON.parse(r.value));
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const save = async (updated) => {
    setNotes(updated);
    notesRef.current = updated;
    try { await window.storage.set("spirits_v2", JSON.stringify(updated)); } catch (e) {}
  };

  const handleSave = (note) => {
    if (!note.name.trim()) { alert("이름을 입력해주세요"); return; }
    const cur = notesRef.current;
    const updated = note.id && cur.find(w => w.id === note.id)
      ? cur.map(w => w.id === note.id ? note : w)
      : [...cur, { ...note, id: Date.now().toString(36) + Math.random().toString(36).slice(2) }];
    save(updated);
    setView("collection");
    setEditNote(null);
  };

  const handleDelete = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("정말 삭제하시겠어요?")) return;
    save(notesRef.current.filter(w => w.id !== id));
    setView("collection");
    setSelectedId(null);
  };

  const handleFetchAI = async (note) => {
    if (aiLoading) return;
    setAiLoading(true);
    const st      = getType(note.spiritType);
    const sources = AI_SOURCES[note.spiritType] || "masterofmalt.com";
    const prompt  =
      `Search for professional tasting notes for the ${st.label} "${note.name}"` +
      (note.distillery ? ` by ${note.distillery}` : "") +
      `. Search on ${sources}. ` +
      `Translate and summarize the key tasting notes into Korean. ` +
      `Reply with ONLY a JSON object, no markdown fences, no preamble:\n` +
      `{"nose":"향 노트","palate":"맛 노트","finish":"피니시 노트","overall":"종합 평가","source":"참고 사이트"}`;
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!resp.ok) throw new Error(`API 오류: HTTP ${resp.status}`);
      const data = await resp.json();
      const fullText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      const jsonStr = fullText.match(/\{[\s\S]*?\}/)?.[0];
      if (!jsonStr) throw new Error("응답에서 JSON을 찾을 수 없어요.");
      const parsed = JSON.parse(jsonStr);
      const updated = notesRef.current.map(w => w.id === note.id ? { ...w, aiNotes: parsed } : w);
      await save(updated);
    } catch (err) {
      console.error(err);
      alert(`AI 노트 검색 실패:\n${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleChange = (field, value) => setEditNote(prev => ({ ...prev, [field]: value }));
  const selectedNote = notes.find(w => w.id === selectedId);
  const showNav = !["add", "detail", "add-select"].includes(view);
  const NAV = [
    { id: "collection", icon: "🍶", label: "컬렉션" },
    { id: "stats",      icon: "📊", label: "통계" },
    { id: "compare",    icon: "⚖️", label: "비교" },
  ];

  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, fontFamily: "'Playfair Display',serif", fontSize: 22 }}>
      🍶 불러오는 중...
    </div>
  );

  const pageTitle =
    view === "add-select" ? "종류 선택" :
    view === "add"        ? (editNote?.id ? "노트 수정" : "노트 추가") :
    view === "detail"     ? (selectedNote?.name || "상세보기") :
    view === "stats"      ? "통계 & 분석" :
    view === "compare"    ? "비교" : "🍶 스피릿 저널";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Sans',sans-serif", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea,button{font-family:inherit}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:${C.border};outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${C.accent};cursor:pointer;border:2px solid ${C.bg}}
        input[type=date]{color-scheme:dark}
        select option{background:${C.surface};color:${C.text}}
      `}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${C.bg}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "14px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {["add", "detail", "add-select"].includes(view) && (
            <button onClick={() => { setView("collection"); setEditNote(null); setSelectedId(null); }}
              style={{ background: "transparent", border: "none", color: C.accent, fontSize: 22, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>←</button>
          )}
          <h1 style={{
            fontFamily: "'Playfair Display',serif", fontSize: view === "collection" ? 20 : 18, fontWeight: 800, flex: 1, lineHeight: 1.2,
            background: view === "collection" ? `linear-gradient(90deg,${C.text},${C.gold})` : "none",
            WebkitBackgroundClip: view === "collection" ? "text" : "none",
            WebkitTextFillColor: view === "collection" ? "transparent" : C.text,
          }}>{pageTitle}</h1>
        </div>
      </div>

      <div style={{ paddingTop: 8 }}>
        {view === "collection" && (
          <CollectionView notes={notes} filter={filter} setFilter={setFilter}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            search={search} setSearch={setSearch}
            onSelect={id => { setSelectedId(id); setView("detail"); }}
            onAdd={() => setView("add-select")} />
        )}
        {view === "add-select" && <TypeSelectScreen onSelect={type => { setEditNote(newNote(type)); setView("add"); }} />}
        {view === "add" && editNote && (
          <AddEditView note={editNote} onChange={handleChange}
            onSave={() => handleSave(editNote)}
            onCancel={() => { setView("collection"); setEditNote(null); }} />
        )}
        {view === "detail" && selectedNote && (
          <DetailView note={selectedNote}
            onEdit={() => { setEditNote({ ...selectedNote }); setView("add"); }}
            onDelete={() => handleDelete(selectedNote.id)}
            onFetchAI={handleFetchAI}
            aiLoading={aiLoading} />
        )}
        {view === "stats"   && <StatsView   notes={notes} />}
        {view === "compare" && <CompareView notes={notes} />}
      </div>

      {showNav && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `${C.surface}f0`, backdropFilter: "blur(12px)", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0 14px", zIndex: 99 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", cursor: "pointer", color: view === n.id ? C.accent : C.textSec, transition: "color .15s", flex: 1, padding: "4px 0" }}>
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: view === n.id ? 600 : 400 }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
