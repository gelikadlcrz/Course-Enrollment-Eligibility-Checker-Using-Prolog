# BSCS Curriculum Enrollment Checker
**Saint Louis University — Prolog-powered**

## Architecture
```
React Frontend (port 3000)
       ↕  HTTP/REST
Flask Backend  (port 5000)  server.py
       ↕  subprocess
SWI-Prolog  curriculum.pl   ← all logic lives here
```

## Prerequisites

### 1. SWI-Prolog
| OS | Command |
|----|---------|
| macOS | `brew install swi-prolog` |
| Ubuntu/Debian | `sudo apt install swi-prolog` |
| Windows | Download from https://www.swi-prolog.org/download/stable |

Verify: `swipl --version`

### 2. Python 3.9+
```bash
pip install -r requirements.txt
```

### 3. Node.js 18+ (for the React frontend)
```bash
# In the frontend/ folder:
npm install
```

---

## Running the App

### Terminal 1 — Start the Flask/Prolog backend
```bash
cd bscs_app/
python server.py
```
You should see:
```
✅ SWI-Prolog found: /usr/bin/swipl
📚 Loading: /path/to/curriculum.pl
🚀 Starting Flask server on http://localhost:5000
```

Test it works:
```bash
curl "http://localhost:5000/api/health"
curl "http://localhost:5000/api/courses?finished=cs111,cs112"
curl "http://localhost:5000/api/check?course=cs211&finished=cs112,cs113"
```

### Terminal 2 — Start the React frontend
```bash
cd bscs_app/frontend/
npm install   # first time only
npm run dev   # or: npm start
```

Open **http://localhost:3000** in your browser.

---

## File Structure
```
bscs_app/
├── curriculum.pl       ← Prolog knowledge base & logic (THE BRAIN)
├── server.py           ← Flask REST API, calls swipl via subprocess
├── requirements.txt    ← Python deps (flask, flask-cors)
└── frontend/
    └── src/
        └── App.jsx     ← React UI
```

## How it works

Every time you check/uncheck a course, the frontend calls:

```
GET /api/courses?finished=cs111,cs112,...
```

Flask runs:
```bash
swipl -q -f curriculum.pl -g "get_status_json([cs111,cs112,...])" -t halt
```

Which executes the Prolog predicate `get_status_json/1` that:
1. Iterates every `course/6` fact
2. Calls `check_course/4` → `prerequisite/2` → `check_reqs/3`
3. Evaluates `has_standing/2` for 3rd/4th year standing
4. Returns a JSON array of all courses with `status` and `missing`

The React UI renders the result with color-coded cards.

## API Reference

| Endpoint | Params | Returns |
|----------|--------|---------|
| `GET /api/health` | — | `{status, swipl}` |
| `GET /api/courses` | `finished` (csv) | Array of course objects |
| `GET /api/check` | `course`, `finished` | Single course object |

### Course Object
```json
{
  "code": "cs211",
  "title": "Data Structures",
  "units": 2,
  "year": 2,
  "sem": 1,
  "type": "CS",
  "status": "eligible",
  "missing": []
}
```
`status` is either `"eligible"` or `"locked"`.  
`missing` lists the Prolog atoms of unsatisfied prerequisites.
