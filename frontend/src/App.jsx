import { useState, useMemo, useCallback, useEffect, useRef } from "react";

const API = "http://localhost:5001/api";

// ============================================================
// TAG COLOR MAP
// ============================================================
const TAG = {
  CS:         { bg:"#CFE2FF", fg:"#084298" },
  GE:         { bg:"#E2E3E5", fg:"#41464B" },
  CFE:        { bg:"#E2D9F3", fg:"#432874" },
  FIT:        { bg:"#FFF3CD", fg:"#664D03" },
  NSTP:       { bg:"#F8D7DA", fg:"#842029" },
  CSE:        { bg:"#D0C9FF", fg:"#3D0E61" },
  "FOR LANG": { bg:"#D1FAE5", fg:"#065F46" },
};

const GROUP_ORDER = [
  "Year 1 - 1st Semester","Year 1 - Short Term","Year 1 - 2nd Semester",
  "Year 2 - 1st Semester","Year 2 - Short Term","Year 2 - 2nd Semester",
  "Year 3 - 1st Semester","Year 3 - Short Term","Year 3 - 2nd Semester",
  "Year 4 - 1st Semester","Year 4 - 2nd Semester","Electives Pool",
];

function groupKey(c) {
  if (c.year === 5) return "Electives Pool";
  if (c.sem === 3)  return `Year ${c.year} - Short Term`;
  return `Year ${c.year} - ${c.sem === 1 ? "1st" : "2nd"} Semester`;
}

// ============================================================
// API CALLS
// ============================================================
async function fetchCourses(finished) {
  const param = Array.from(finished).map(c => c.toLowerCase()).join(",");
  const res = await fetch(`${API}/courses?finished=${encodeURIComponent(param)}`);
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

async function fetchSingle(code, finished) {
  const param = Array.from(finished).map(c => c.toLowerCase()).join(",");
  const res = await fetch(
    `${API}/check?course=${encodeURIComponent(code.toLowerCase())}&finished=${encodeURIComponent(param)}`
  );
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

// ============================================================
// COMPONENTS
// ============================================================
function CourseCard({ data, isDone, onToggle }) {
  const border = isDone ? "#28A745" : data.status === "eligible" ? "#0D6EFD" : "#DC3545";
  const tag = TAG[data.type] ?? { bg:"#eee", fg:"#333" };

  return (
    <div
       onClick={() => {
       if (data.status === "locked") return;
       onToggle(data.code);
       }}

      style={{
        background:"#fff", border:`1.5px solid ${border}`, borderRadius:10,
        padding:"12px 14px", display:"flex", flexDirection:"column", gap:5,
        cursor:"pointer", transition:"box-shadow .12s",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,.11)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", flex:1, minWidth:0 }}>
              <input
        type="checkbox"
        checked={isDone}
        disabled={data.status === "locked"}
        onChange={e => {
          e.stopPropagation();
          if (data.status === "locked") return;
          onToggle(data.code);
        }}
        onClick={e => e.stopPropagation()}
        style={{
          width:15,
          height:15,
          accentColor:"#28A745",
          cursor: data.status === "locked" ? "not-allowed" : "pointer",
          flexShrink:0
        }}
      />

          <span style={{ fontWeight:700, fontSize:12.5, color:"#212529", whiteSpace:"nowrap" }}>
            {data.code.toUpperCase()}
          </span>
          <span style={{
            background:tag.bg, color:tag.fg, fontSize:9.5, fontWeight:700,
            borderRadius:4, padding:"2px 5px", whiteSpace:"nowrap"
          }}>{data.type}</span>
        </div>
        <div style={{ flexShrink:0 }}>
          {isDone
            ? <span style={{ color:"#28A745", fontWeight:700, fontSize:11 }}>✔ Done</span>
            : data.status === "eligible"
              ? <span style={{ background:"#0D6EFD", color:"#fff", borderRadius:5, padding:"2px 9px", fontSize:11, fontWeight:700 }}>Check</span>
              : <span style={{ color:"#DC3545", fontWeight:700, fontSize:11 }}>✕ Locked</span>
          }
        </div>
      </div>
      {/* Title */}
      <div style={{ fontSize:12, color:"#212529", lineHeight:1.35 }}>{data.title}</div>
      {/* Units */}
      <div style={{ fontSize:10.5, color:"#6C757D" }}>{data.units} units</div>
      {/* Missing prereqs */}
      {!isDone && data.status === "locked" && data.missing && data.missing.length > 0 && (
        <div style={{ fontSize:10.5, color:"#DC3545", fontWeight:600 }}>
          Missing: {data.missing.map(m =>
            m === "third_year_standing" ? "3rd Year Standing"
            : m === "fourth_year_standing" ? "4th Year Standing"
            : m.toUpperCase()
          ).join(", ")}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, margin:"20px 0 10px" }}>
      <div style={{ width:4, height:20, background:"#003366", borderRadius:2 }} />
      <span style={{ fontWeight:700, fontSize:13.5, color:"#003366" }}>{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, bg, fg }) {
  return (
    <div style={{ flex:1, background:bg, borderRadius:10, padding:"14px 18px" }}>
      <div style={{ fontSize:11.5, color:fg, fontWeight:500, marginBottom:4 }}>{icon} {label}</div>
      <div style={{ fontSize:28, fontWeight:800, color:fg, lineHeight:1 }}>{value}</div>
    </div>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"5px 12px", borderRadius:6, fontSize:11.5, fontWeight:600, cursor:"pointer",
      border: active ? "none" : "1px solid #dee2e6",
      background: active ? "#212529" : "#fff",
      color: active ? "#fff" : "#495057",
    }}>{label}</button>
  );
}

function CheckResult({ result, isDone, loading }) {
  if (loading) return (
    <div style={{ padding:"14px 0", textAlign:"center", color:"#6C757D", fontSize:12 }}>
      ⏳ Checking with Prolog...
    </div>
  );
  if (!result) return null;
  if (result.error === "course_not_found") return (
    <div style={{ background:"#F8D7DA", border:"1px solid #f5c2c7", borderRadius:8, padding:14, marginTop:10 }}>
      <div style={{ fontWeight:700, color:"#842029", fontSize:13 }}>❌ Course Not Found</div>
      <div style={{ fontSize:11.5, color:"#842029", marginTop:3 }}>Please check the code and try again.</div>
    </div>
  );
  if (result.error) return (
    <div style={{ background:"#F8D7DA", borderRadius:8, padding:14, marginTop:10 }}>
      <div style={{ fontWeight:700, color:"#842029", fontSize:12 }}>⚠ {result.error}</div>
    </div>
  );
  if (isDone) return (
    <div style={{ background:"#D1E7DD", border:"1px solid #badbcc", borderRadius:8, padding:14, marginTop:10 }}>
      <div style={{ fontWeight:700, color:"#0F5132", fontSize:13 }}>✔ Completed</div>
      <div style={{ fontSize:11.5, color:"#0F5132", marginTop:3 }}>
        You have already finished {result.code?.toUpperCase()}.
      </div>
    </div>
  );
  if (result.status === "eligible") return (
    <div style={{ background:"#D1E7DD", border:"1px solid #badbcc", borderRadius:8, padding:14, marginTop:10 }}>
      <div style={{ fontWeight:700, color:"#0F5132", fontSize:13 }}>✔ Eligible!</div>
      <div style={{ fontSize:11.5, color:"#0F5132", marginTop:3 }}>
        You can enroll in {result.code?.toUpperCase()}.
      </div>
    </div>
  );
  return (
    <div style={{ background:"#F8D7DA", border:"1px solid #f5c2c7", borderRadius:8, padding:14, marginTop:10 }}>
      <div style={{ fontWeight:700, color:"#842029", fontSize:13 }}>❌ Not Eligible</div>
      <div style={{ fontSize:11.5, color:"#842029", marginTop:3, marginBottom:8 }}>Complete prerequisites first.</div>
      <div style={{ fontSize:11, fontWeight:700, color:"#842029", marginBottom:5 }}>Missing Prerequisites:</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
        {(result.missing ?? []).map(m => (
          <span key={m} style={{ background:"#DC3545", color:"#fff", fontSize:10, fontWeight:700, borderRadius:4, padding:"2px 7px" }}>
            {m === "third_year_standing" ? "3rd Year Standing"
             : m === "fourth_year_standing" ? "4th Year Standing"
             : m.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServerStatus({ status }) {
  const colors = { checking:"#6C757D", ok:"#0F5132", error:"#842029" };
  const bg     = { checking:"#e9ecef",   ok:"#D1E7DD", error:"#F8D7DA" };
  const icons  = { checking:"⏳", ok:"✅", error:"❌" };
  const msgs   = { checking:"Connecting to Prolog backend...", ok:"Prolog backend connected", error:"Cannot reach backend — is server.py running?" };
  return (
    <div style={{
      background:bg[status], color:colors[status],
      fontSize:11.5, fontWeight:600, padding:"6px 14px",
      borderBottom:"1px solid #e9ecef", textAlign:"center"
    }}>
      {icons[status]} {msgs[status]}
      {status === "error" && <span style={{ fontWeight:400 }}> · <code>python server.py</code></span>}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [allData, setAllData]           = useState([]);
  const [finished, setFinished]         = useState(new Set());
  const [loading, setLoading]           = useState(true);
  const [serverStatus, setServerStatus] = useState("checking");
  const [filterType, setFilterType]     = useState("ALL");
  const [searchQuery, setSearchQuery]   = useState("");
  const [checkerInput, setCheckerInput] = useState("");
  const [checkResult, setCheckResult]   = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const debounceRef = useRef(null);

  // ── Fetch full course list from Prolog backend ──────────────
  const refreshCourses = useCallback(async (fin = finished) => {
    setLoading(true);
    try {
      const data = await fetchCourses(fin);
      setAllData(data);
      setServerStatus("ok");
    } catch (e) {
      setServerStatus("error");
      console.error("Backend error:", e);
    } finally {
      setLoading(false);
    }
  }, [finished]);

  // Initial load
  useEffect(() => { refreshCourses(new Set()); }, []);

  // ── Toggle course ───────────────────────────────────────────
const COURSE_PAIRS = {
  CS111: "CS111L", CS111L: "CS111",
  CS112: "CS112L", CS112L: "CS112",
  CS122: "CS122L", CS122L: "CS122",
  CS123: "CS123L", CS123L: "CS123",
  CS211: "CS211L", CS211L: "CS211",
  CS212: "CS212L", CS212L: "CS212",
  CS221: "CS221L", CS221L: "CS221",
  CS222: "CS222L", CS222L: "CS222",
  CS231: "CS231L", CS231L: "CS231",
  CS311: "CS311L", CS311L: "CS311",
  CS312: "CS312L", CS312L: "CS312",
  CS322: "CS322L", CS322L: "CS322",
  CS323: "CS323L", CS323L: "CS323",
};

const toggleCourse = useCallback((code) => {
  setFinished(prev => {
    const next = new Set(prev);
    const upper = code.toUpperCase();
    const pair = COURSE_PAIRS[upper];

    if (next.has(upper)) {
      next.delete(upper);
      if (pair) next.delete(pair);
    } else {
      next.add(upper);
      if (pair) next.add(pair);
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => refreshCourses(next), 120);

    return next;
  });
}, [refreshCourses]);


  // ── Sidebar checker ─────────────────────────────────────────
  const handleCheck = useCallback(async () => {
    const q = checkerInput.trim();
    if (!q) return;
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const data = await fetchSingle(q, finished);
      setCheckResult(data);
    } catch (e) {
      setCheckResult({ error: e.message });
    } finally {
      setCheckLoading(false);
    }
  }, [checkerInput, finished]);

  // ── Filter + group ───────────────────────────────────────────
  const groups = useMemo(() => {
    const g = {};
    for (const c of allData) {
      if (filterType !== "ALL" && c.type !== filterType) continue;
      const q = searchQuery.trim().toLowerCase();
      if (q && !c.code.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) continue;
      const key = groupKey(c);
      (g[key] = g[key] || []).push(c);
    }
    return g;
  }, [allData, filterType, searchQuery]);

  // ── Stats ────────────────────────────────────────────────────
  const doneCount     = finished.size;
  const eligibleCount = allData.filter(c =>
    c.status === "eligible" && !finished.has(c.code.toUpperCase())
  ).length;
  const totalCount    = allData.length;
  const checkIsDone   = checkResult && !checkResult.error &&
                        finished.has(checkResult.code?.toUpperCase());

  return (
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", background:"#F8F9FA", minHeight:"100vh" }}>
      {/* SERVER STATUS */}
      <ServerStatus status={serverStatus} />

      {/* HEADER */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e9ecef", padding:"14px 24px", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:22 }}>🎓</span>
        <div>
          <div style={{ fontWeight:800, fontSize:17, color:"#003366" }}>BSCS Curriculum Enrollment Checker</div>
          <div style={{ fontSize:12, color:"#6C757D" }}>Saint Louis University · Prolog-powered</div>
        </div>
        {loading && <span style={{ marginLeft:"auto", fontSize:12, color:"#6C757D" }}>⏳ Updating...</span>}
      </div>

      {/* STATS */}
      <div style={{ padding:"14px 24px 0", display:"flex", gap:12 }}>
        <StatCard icon="✅" label="Completed"     value={doneCount}     bg="#D1E7DD" fg="#0F5132" />
        <StatCard icon="📘" label="Eligible"      value={eligibleCount} bg="#CFE2FF" fg="#084298" />
        <StatCard icon="📋" label="Total Courses" value={totalCount}    bg="#E2D9F3" fg="#432874" />
      </div>

      {/* BODY */}
      <div style={{ display:"flex", padding:"16px 24px 40px", gap:20, alignItems:"flex-start" }}>

        {/* LEFT */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e9ecef", padding:"18px 18px 22px" }}>
            <div style={{ fontWeight:700, fontSize:15.5, color:"#212529", marginBottom:14 }}>Course Curriculum</div>

            {/* Search */}
            <div style={{ position:"relative", marginBottom:10 }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#adb5bd", pointerEvents:"none" }}>🔍</span>
              <input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width:"100%", boxSizing:"border-box", paddingLeft:32, paddingRight:12,
                  paddingTop:8, paddingBottom:8, border:"1px solid #dee2e6", borderRadius:8,
                  fontSize:13, outline:"none", background:"#f8f9fa", color: "black"
                }}
              />
            </div>

            {/* Filters */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:4 }}>
              {["ALL","CS","GE","CFE","FIT","NSTP","FOR LANG","CSE"].map(t => (
                <FilterBtn key={t} label={t} active={filterType === t} onClick={() => setFilterType(t)} />
              ))}
            </div>

            {/* Course Groups */}
            {serverStatus === "error" ? (
              <div style={{ textAlign:"center", padding:"48px 0", color:"#DC3545" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔌</div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>Backend not connected</div>
                <div style={{ fontSize:12, color:"#6C757D" }}>Run <code>python server.py</code> then refresh</div>
              </div>
            ) : GROUP_ORDER
              .filter(key => groups[key] && groups[key].length > 0)
              .map(key => (
                <div key={key}>
                  <SectionHeader label={key} />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                    {groups[key].map(c => (
                      <CourseCard
                        key={c.code}
                        data={c}
                        isDone={finished.has(c.code.toUpperCase())}
                        onToggle={toggleCourse}
                      />
                    ))}
                  </div>
                </div>
              ))
            }

            {serverStatus === "ok" &&
              GROUP_ORDER.every(k => !groups[k] || groups[k].length === 0) && (
              <div style={{ textAlign:"center", color:"#6C757D", padding:"48px 0", fontSize:14 }}>
                No courses match your search or filter.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width:290, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>

          {/* Enrollment Checker */}
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e9ecef", padding:18 }}>
            <div style={{ fontWeight:700, fontSize:14.5, color:"#212529", marginBottom:12 }}>Enrollment Checker</div>
            <div style={{ fontWeight:600, fontSize:11.5, color:"#495057", marginBottom:6 }}>Check Course Eligibility</div>
            <input
              placeholder="e.g. CS211, GMATH, CSE18..."
              value={checkerInput}
              onChange={e => setCheckerInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              style={{
                width:"100%", boxSizing:"border-box", padding:"8px 10px",
                border:"1px solid #dee2e6", borderRadius:7, fontSize:12.5, outline:"none",
                marginBottom:7, background:"#f8f9fa", color: "black"
              }}
            />
            <button onClick={handleCheck} style={{
              width:"100%", padding:"8px 0", background:"#003366", color:"#fff",
              border:"none", borderRadius:7, fontSize:12.5, fontWeight:600, cursor:"pointer", marginBottom:7
            }}>Check Eligibility</button>
            <div style={{ fontSize:10.5, color:"#6C757D" }}>Or click any course card to toggle completion</div>
            <CheckResult result={checkResult} isDone={checkIsDone} loading={checkLoading} />
          </div>

          {/* Quick Actions */}
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e9ecef", padding:18 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#212529", marginBottom:10 }}>Quick Actions</div>
            <button onClick={() => { setFinished(new Set()); refreshCourses(new Set()); }} style={{
              width:"100%", padding:"7px 0", background:"#fff", color:"#DC3545",
              border:"1px solid #dee2e6", borderRadius:7, fontSize:12.5, fontWeight:600, cursor:"pointer", marginBottom:7
            }}>Clear All Completed</button>
            <button onClick={() => { setCheckerInput(""); setCheckResult(null); }} style={{
              width:"100%", padding:"7px 0", background:"#fff", color:"#212529",
              border:"1px solid #dee2e6", borderRadius:7, fontSize:12.5, fontWeight:600, cursor:"pointer"
            }}>Reset Checker</button>
          </div>

          {/* Legend */}
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e9ecef", padding:18 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#212529", marginBottom:10 }}>Legend</div>
            {[
              { color:"#28A745", label:"Completed" },
              { color:"#0D6EFD", label:"Eligible to enroll" },
              { color:"#DC3545", label:"Locked (missing prereqs)" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:7 }}>
                <div style={{ width:13, height:13, borderRadius:3, background:color }} />
                <span style={{ fontSize:12, color:"#212529" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Prolog Info */}
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e9ecef", padding:18 }}>
            <div style={{ fontWeight:700, fontSize:13, color:"#432874", marginBottom:8 }}>🔮 Prolog Backend</div>
            <div style={{ fontSize:11, color:"#6C757D", lineHeight:1.6 }}>
              All prerequisite checking is handled by <strong>SWI-Prolog</strong> running <code>curriculum.pl</code>.<br />
              The Flask API calls <code>get_status_json/1</code> and <code>check_single_json/2</code> via subprocess.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
