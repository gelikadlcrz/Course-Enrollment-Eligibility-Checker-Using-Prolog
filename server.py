"""
backend/server.py
Flask REST API that delegates all logic to SWI-Prolog (curriculum.pl).

Endpoints:
  GET  /api/courses?finished=cs111,cs112,...   → full course list with status
  GET  /api/check?course=cs211&finished=...    → single course check
  GET  /api/health                             → verify swipl is available
"""

import json
import os
import shutil
import subprocess
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React dev server on :3000 to reach us on :5001

# Path to curriculum.pl — adjust if you move files around
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROLOG_FILE = os.path.join(BASE_DIR, "curriculum.pl")


# ------------------------------------------------------------------
# Locate SWI-Prolog binary
# ------------------------------------------------------------------
def find_swipl():
    path = shutil.which("swipl")
    if path:
        return path
    common = [
        "/opt/homebrew/bin/swipl",   # macOS Apple Silicon (Homebrew)
        "/usr/local/bin/swipl",      # macOS Intel (Homebrew)
        "/usr/bin/swipl",            # Linux
        r"C:\Program Files\swipl\bin\swipl.exe",  # Windows
    ]
    for p in common:
        if os.path.isfile(p):
            return p
    return None


# ------------------------------------------------------------------
# Run a Prolog goal and return stdout as a string
# ------------------------------------------------------------------
def run_prolog(goal: str) -> str:
    swipl = find_swipl()
    if not swipl:
        raise RuntimeError("SWI-Prolog (swipl) not found. Install it and ensure it's on your PATH.")

    cmd = [
        swipl,
        "-q",                  # quiet — suppress banners
        "-f", PROLOG_FILE,     # load knowledge base
        "-g", goal,            # goal to execute
        "-t", "halt",          # exit after goal
    ]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=15,
    )

    if result.returncode not in (0, 1):  # Prolog exits 1 on halt/0
        raise RuntimeError(f"Prolog error:\n{result.stderr}")

    return result.stdout.strip()


# ------------------------------------------------------------------
# Parse a comma-separated finished list into a Prolog list atom string
# e.g. "cs111,cs112" → "[cs111,cs112]"
# ------------------------------------------------------------------
def parse_finished(raw: str) -> str:
    if not raw or not raw.strip():
        return "[]"
    codes = [c.strip().lower() for c in raw.split(",") if c.strip()]
    return "[" + ",".join(codes) + "]"


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------
@app.route("/api/health")
def health():
    swipl = find_swipl()
    if swipl:
        return jsonify({"status": "ok", "swipl": swipl})
    return jsonify({"status": "error", "message": "swipl not found"}), 500


@app.route("/api/courses")
def get_courses():
    """
    Returns the full curriculum with eligibility status.
    Query param: finished  (comma-separated course codes already passed)
    """
    raw = request.args.get("finished", "")
    prolog_list = parse_finished(raw)
    goal = f"get_status_json({prolog_list})"

    try:
        output = run_prolog(goal)
        data = json.loads(output)
        return jsonify(data)
    except json.JSONDecodeError as e:
        return jsonify({"error": "JSON parse error", "detail": str(e), "raw": output}), 500
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/check")
def check_course():
    """
    Checks eligibility for a single course.
    Query params: course (code), finished (comma-separated)
    """
    course_code = request.args.get("course", "").strip().lower()
    raw = request.args.get("finished", "")
    prolog_list = parse_finished(raw)

    if not course_code:
        return jsonify({"error": "Missing 'course' parameter"}), 400

    goal = f"check_single_json({course_code},{prolog_list})"

    try:
        output = run_prolog(goal)
        data = json.loads(output)
        return jsonify(data)
    except json.JSONDecodeError as e:
        return jsonify({"error": "JSON parse error", "detail": str(e), "raw": output}), 500
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------------------
if __name__ == "__main__":
    swipl = find_swipl()
    if not swipl:
        print("ERROR: SWI-Prolog not found. Install it first:", file=sys.stderr)
        print("  macOS:  brew install swi-prolog", file=sys.stderr)
        print("  Ubuntu: sudo apt install swi-prolog", file=sys.stderr)
        print("  Windows: https://www.swi-prolog.org/download/stable", file=sys.stderr)
        sys.exit(1)

    print(f"✅ SWI-Prolog found: {swipl}")
    print(f"📚 Loading: {PROLOG_FILE}")
    print("🚀 Starting Flask server on http://localhost:5001")
app.run(debug=True, port=5001, host='0.0.0.0')