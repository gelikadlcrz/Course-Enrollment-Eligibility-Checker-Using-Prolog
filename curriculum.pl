% ==============================================================================
%   BSCS CURRICULUM DATABASE & LOGIC — Saint Louis University
%   File: curriculum.pl
% ==============================================================================
:- use_module(library(http/json)).

% ==============================================================================
%   COURSE FACTS
%   Format: course(Code, Title, Units, Year, Sem, Type).
%   Sem: 1 = 1st Sem, 2 = 2nd Sem, 3 = Short Term, 0 = Elective Pool
% ==============================================================================

% --- YEAR 1: 1st Semester ---
course(cs111,    'Introduction to Computing',              2,   1, 1, 'CS').
course(cs111l,   'Introduction to Computing Lab',          1,   1, 1, 'CS').
course(cs112,    'Computer Programming 1',                 2,   1, 1, 'CS').
course(cs112l,   'Computer Programming 1 Lab',             1,   1, 1, 'CS').
course(cs113,    'Discrete Structures',                    3,   1, 1, 'CS').
course(gmath,    'Mathematics in the Modern World',        3,   1, 1, 'GE').
course(gart,     'Art Appreciation',                       3,   1, 1, 'GE').
course(ghist,    'Readings in Philippine History',         3,   1, 1, 'GE').
course(fithw,    'Physical Activity (Health & Wellness)',  2,   1, 1, 'FIT').
course(cfe101,   'God''s Journey with His People',         3,   1, 1, 'CFE').

% --- YEAR 1: Short Term ---
course(cs131,    'Software Modeling and Analysis',         3,   1, 3, 'CS').
course(cs132,    'Mathematics for Computer Science',       3,   1, 3, 'CS').

% --- YEAR 1: 2nd Semester ---
course(cs121,    'Digital Logic Design',                   3,   1, 2, 'CS').
course(cs122,    'Computer Programming 2',                 2,   1, 2, 'CS').
course(cs122l,   'Computer Programming 2 Lab',             1,   1, 2, 'CS').
course(cs123,    'Architecture and Organization',          2,   1, 2, 'CS').
course(cs123l,   'Architecture and Organization Lab',      1,   1, 2, 'CS').
course(gself,    'Understanding the Self',                 3,   1, 2, 'GE').
course(gpcom,    'Purposive Communication',                3,   1, 2, 'GE').
course(genvi,    'Environmental Science',                  3,   1, 2, 'GE').
course(fitcs,    'Physical Activity (Combative Sports)',   2,   1, 2, 'FIT').
course(cfe102,   'Christian Morality in Our Times',        3,   1, 2, 'CFE').

% --- YEAR 2: 1st Semester ---
course(cs211,    'Data Structures',                        2,   2, 1, 'CS').
course(cs211l,   'Data Structures Lab',                    1,   2, 1, 'CS').
course(cs212,    'Operating Systems',                      2,   2, 1, 'CS').
course(cs212l,   'Operating Systems Lab',                  1,   2, 1, 'CS').
course(cs213,    'Human Computer Interaction',             3,   2, 1, 'CS').
course(gsts,     'Science, Technology, and Society',       3,   2, 1, 'GE').
course(grva,     'Reading Visual Art',                     3,   2, 1, 'GE').
course(nstpcwts1,'Foundations of Service (NSTP 1)',        3,   2, 1, 'NSTP').
course(fitoa,    'Physical Activity (Outdoor & Adventure)',2,   2, 1, 'FIT').
course(cfe103,   'Catholic Foundation of Mission',         3,   2, 1, 'CFE').

% --- YEAR 2: Short Term ---
course(cs231,    'Computer Networks',                      2,   2, 3, 'CS').
course(cs231l,   'Computer Networks Lab',                  1,   2, 3, 'CS').
course(grizal,   'The Life and Works of Rizal',            3,   2, 3, 'GE').
course(gentrep,  'The Entrepreneurial Mind',               3,   2, 3, 'GE').

% --- YEAR 2: 2nd Semester ---
course(cs221,    'Information Management',                 2,   2, 2, 'CS').
course(cs221l,   'Information Management Lab',             1,   2, 2, 'CS').
course(cs222,    'Computer Programming 3',                 2,   2, 2, 'CS').
course(cs222l,   'Computer Programming 3 Lab',             1,   2, 2, 'CS').
course(cs223,    'Automata and Formal Languages',          3,   2, 2, 'CS').
course(gethics,  'Ethics',                                 3,   2, 2, 'GE').
course(goworld,  'The Contemporary World',                 3,   2, 2, 'GE').
course(nstpcwts2,'Social Awareness & Empowerment (NSTP 2)',3,   2, 2, 'NSTP').
course(fitaq,    'Physical Activity (Aquatics)',            2,   2, 2, 'FIT').
course(cfe104,   'CICM Missionary Identity',               3,   2, 2, 'CFE').

% --- YEAR 3: 1st Semester ---
course(cs311,    'Applications Development',               2,   3, 1, 'CS').
course(cs311l,   'Applications Development Lab',           1,   3, 1, 'CS').
course(cs312,    'Web Systems Development',                2,   3, 1, 'CS').
course(cs312l,   'Web Systems Development Lab',            1,   3, 1, 'CS').
course(cs313,    'Software Engineering',                   3,   3, 1, 'CS').
course(cs314,    'Social & Personal Dev in ICT Workplace', 3,   3, 1, 'CS').
course(cs315,    'Technology-Assisted Presentation',       3,   3, 1, 'CS').
course(csm316,   'Numerical Methods for Computer Science', 3,   3, 1, 'CS').
course(cfe105a,  'CICM in Action (Justice & Peace)',       1.5, 3, 1, 'CFE').

% --- YEAR 3: Short Term ---
course(cs331,    'Practicum',                              6,   3, 3, 'CS').

% --- YEAR 3: 2nd Semester ---
course(cs321,    'Artificial Intelligence',                3,   3, 2, 'CS').
course(cs322,    'Data Science',                           2,   3, 2, 'CS').
course(cs322l,   'Data Science Lab',                       1,   3, 2, 'CS').
course(cs323,    'Modeling and Simulation',                2,   3, 2, 'CS').
course(cs323l,   'Modeling and Simulation Lab',            1,   3, 2, 'CS').
course(cs324,    'Methods of Research in CS',              3,   3, 2, 'CS').
course(cs325,    'Structure of Programming Languages',     3,   3, 2, 'CS').
course(cfe105b,  'CICM in Action (Environment)',           1.5, 3, 2, 'CFE').

% --- YEAR 4: 1st Semester ---
course(cfe106a,  'Embracing the CICM Mission A',           1.5, 4, 1, 'CFE').
course(cs411,    'CS Thesis 1',                            3,   4, 1, 'CS').
course(cs412,    'Information Assurance and Security',     3,   4, 1, 'CS').
course(cs413,    'Professional Practice and Cyberethics',  3,   4, 1, 'CS').
course(cse_slot1,'CSE Elective 1',                         3,   4, 1, 'CSE').
course(cse_slot2,'CSE Elective 2',                         3,   4, 1, 'CSE').

% --- YEAR 4: 2nd Semester ---
course(cfe106b,  'Embracing the CICM Mission B',           1.5, 4, 2, 'CFE').
course(cs421,    'CS Thesis 2',                            3,   4, 2, 'CS').
course(cs422,    'Distributed Computing',                  3,   4, 2, 'CS').
course(forlang1, 'Foreign Language 1',                     3,   4, 2, 'FOR LANG').
course(cse_slot3,'CSE Elective 3',                         3,   4, 2, 'CSE').
course(cse_slot4,'CSE Elective 4',                         3,   4, 2, 'CSE').

% --- ELECTIVE POOL (Year=5, Sem=0 sentinel for filtering) ---
course(cse10, 'Advanced Computer Architecture',         3, 5, 0, 'CSE').
course(cse11, 'Advanced Operating Systems',             3, 5, 0, 'CSE').
course(cse12, 'Advanced Networking',                    3, 5, 0, 'CSE').
course(cse13, 'Advanced Information Management',        3, 5, 0, 'CSE').
course(cse14, 'Advanced Software Engineering',          3, 5, 0, 'CSE').
course(cse15, 'Data Mining',                            3, 5, 0, 'CSE').
course(cse16, 'Design and Analysis of Algorithms',      3, 5, 0, 'CSE').
course(cse17, 'Operations Research',                    3, 5, 0, 'CSE').
course(cse18, 'Machine Learning',                       3, 5, 0, 'CSE').
course(cse19, 'Compiler Design',                        3, 5, 0, 'CSE').
course(cse20, 'Advanced Security Concepts',             3, 5, 0, 'CSE').
course(cse21, 'Multimedia Systems',                     3, 5, 0, 'CSE').
course(cse22, 'Advanced Applications Development',      3, 5, 0, 'CSE').
course(cse23, 'Computer Graphics',                      3, 5, 0, 'CSE').
course(cse24, 'Game Design and Development',            3, 5, 0, 'CSE').
course(cse25, 'UX Design and Concepts',                 3, 5, 0, 'CSE').
course(cse26, 'Field Trips and Seminars',               3, 5, 0, 'CSE').
course(cse27, 'System Resource Management',             3, 5, 0, 'CSE').
course(cse28, 'Current Trends 1',                       3, 5, 0, 'CSE').
course(cse29, 'Current Trends 2',                       3, 5, 0, 'CSE').
course(cse30, 'Special Topics 1',                       3, 5, 0, 'CSE').
course(cse31, 'Special Topics 2',                       3, 5, 0, 'CSE').
course(cse32, 'Information Technology Certification',   3, 5, 0, 'CSE').

% ==============================================================================
%   PREREQUISITE RULES
%   Format: prerequisite(CourseCode, ListOfPrerequisites).
%   Special atoms: third_year_standing, fourth_year_standing
% ==============================================================================

% --- Year 1 ---
prerequisite(cs131,  [cs111]).
prerequisite(cs121,  [cs111]).
prerequisite(cs122,  [cs112]).
prerequisite(cs122l, [cs112]).
prerequisite(cs123,  [cs112]).
prerequisite(cs123l, [cs112]).

% --- Year 2 ---
prerequisite(cs211,     [cs112, cs113]).
prerequisite(cs211l,    [cs112, cs113]).
prerequisite(cs212,     [cs123, cs211]).
prerequisite(cs212l,    [cs123, cs211l]).
prerequisite(cs213,     [cs122]).
prerequisite(cfe103,    [cfe102]).
prerequisite(cs231,     [cs212]).
prerequisite(cs231l,    [cs212]).
prerequisite(cs221,     [cs211]).
prerequisite(cs221l,    [cs211]).
prerequisite(cs222,     [cs122]).
prerequisite(cs222l,    [cs122]).
prerequisite(cs223,     [cs132]).
prerequisite(nstpcwts2, [nstpcwts1]).
prerequisite(cfe104,    [cfe103]).

% --- Year 3 ---
prerequisite(cs311,   [cs122]).
prerequisite(cs311l,  [cs122]).
prerequisite(cs312,   [cs211]).
prerequisite(cs312l,  [cs211]).
prerequisite(cs313,   [cs131, cs221]).
prerequisite(cs314,   [cs111, gself]).
prerequisite(cs315,   [cs111, gpcom]).
prerequisite(csm316,  [cs132]).
prerequisite(cfe105a, [cfe103, cfe104]).
prerequisite(cs331,   [fourth_year_standing]).
prerequisite(cs321,   [cs132, cs211]).
prerequisite(cs322,   [cs221]).
prerequisite(cs322l,  []).
prerequisite(cs323,   [cs132, cs211]).
prerequisite(cs323l,  [cs132, cs211]).
prerequisite(cs324,   [third_year_standing]).
prerequisite(cs325,   [cs211]).
prerequisite(cfe105b, [cfe105a]).

% --- Year 4 ---
prerequisite(cfe106a,  [cfe105b]).
prerequisite(cs411,    [cs324]).
prerequisite(cs412,    [third_year_standing]).
prerequisite(cs413,    [gethics, cs231, cs321]).
prerequisite(cse_slot1,[third_year_standing]).
prerequisite(cse_slot2,[third_year_standing]).
prerequisite(cfe106b,  [cfe106a]).
prerequisite(cs421,    [cs411]).
prerequisite(cs422,    [fourth_year_standing]).
prerequisite(cse_slot3,[fourth_year_standing]).
prerequisite(cse_slot4,[fourth_year_standing]).

% --- Elective pool: all require 3rd year standing ---
prerequisite(C, [third_year_standing]) :-
    course(C, _, _, 5, 0, 'CSE').

% --- Default: no prereqs if not listed ---
prerequisite(C, []) :-
    course(C, _, _, _, _, _),
    \+ clause(prerequisite(C, _), _).

% ==============================================================================
%   STANDING LOGIC (Dynamic Major Completion)
% ==============================================================================

% Helper: Checks if all 'CS' courses from Year X have been finished.
% A course is a "CS major" if its Code starts with 'cs' and Type is 'CS'.
all_cs_majors_finished(Finished, TargetYear) :-
    findall(Code, 
        (course(Code, _, _, TargetYear, _, _), sub_atom(Code, 0, 2, _, cs)), 
        RequiredMajors),
    subset(RequiredMajors, Finished).

% 3rd Year Standing: Completed all Year 1 and Year 2 CS majors
has_standing(Finished, third_year_standing) :-
    all_cs_majors_finished(Finished, 1),
    all_cs_majors_finished(Finished, 2).

% 4th Year Standing: 3rd year standing + completed all Year 3 CS majors
has_standing(Finished, fourth_year_standing) :-
    has_standing(Finished, third_year_standing),
    all_cs_majors_finished(Finished, 3).

% ==============================================================================
%   ELIGIBILITY CHECKING CORE
% ==============================================================================

% check_reqs(+Reqs, +Finished, -Missing)
check_reqs([], _, []).
check_reqs([H|T], Finished, Missing) :-
    (   member(H, Finished)
    ;   has_standing(Finished, H)
    ), !,
    check_reqs(T, Finished, Missing).
check_reqs([H|T], Finished, [H|Rest]) :-
    check_reqs(T, Finished, Rest).

% check_course(+Course, +Finished, -Status, -Missing)
check_course(Course, Finished, Status, Missing) :-
    % If a prerequisite rule exists, use it. If not, Reqs is empty list [].
    ( prerequisite(Course, Reqs) -> true ; Reqs = [] ),
    check_reqs(Reqs, Finished, Missing),
    ( Missing == [] -> Status = eligible ; Status = locked ).

% ==============================================================================
%   JSON API — called by the Flask backend
%   get_status_json(+FinishedList)
%   Writes a JSON array of all course objects to stdout.
% ==============================================================================
get_status_json(Finished) :-
    findall(
        json([
            code    = Code,
            title   = Title,
            units   = Units,
            year    = Year,
            sem     = Sem,
            type    = Type,
            status  = Status,
            missing = MissingStrs
        ]),
        (
            course(CodeAtom, Title, Units, Year, Sem, Type),
            atom_string(CodeAtom, Code),
            check_course(CodeAtom, Finished, StatusAtom, MissingAtoms),
            atom_string(StatusAtom, Status),
            maplist(atom_string, MissingAtoms, MissingStrs)
        ),
        Objects
    ),
    with_output_to(string(JSON), json_write(current_output, Objects)),
    write(JSON).

% ==============================================================================
%   SINGLE COURSE CHECK API
%   check_single_json(+CourseCode, +FinishedList)
% ==============================================================================
check_single_json(CourseAtom, Finished) :-
    ( course(CourseAtom, Title, Units, Year, Sem, Type) ->
        check_course(CourseAtom, Finished, StatusAtom, MissingAtoms),
        atom_string(CourseAtom, Code),
        atom_string(StatusAtom, Status),
        maplist(atom_string, MissingAtoms, MissingStrs),
        Obj = json([
            code    = Code,
            title   = Title,
            units   = Units,
            year    = Year,
            sem     = Sem,
            type    = Type,
            status  = Status,
            missing = MissingStrs
        ]),
        with_output_to(string(JSON), json_write(current_output, Obj)),
        write(JSON)
    ;
        write('{"error":"course_not_found"}')
    ).
