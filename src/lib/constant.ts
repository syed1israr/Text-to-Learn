export const courseGeneratorData = [
  {
    id: 1,
    title: "React Course",
    prompt: "Generate a beginner-friendly React course covering components, props, state, and hooks with practical examples."
  },
  {
    id: 2,
    title: "JavaScript Fundamentals",
    prompt: "Generate a beginner-friendly JavaScript course explaining variables, functions, loops, arrays, objects, and basic DOM manipulation."
  },
  {
    id: 3,
    title: "TypeScript Essentials",
    prompt: "Generate a beginner-friendly TypeScript course focusing on types, interfaces, enums, generics, and using TypeScript with React."
  },
  {
    id: 4,
    title: "Data Structures & Algorithms",
    prompt: "Generate a beginner-friendly DSA course covering arrays, strings, recursion, linked lists, stacks, queues, and basic time complexity."
  },
  {
    id: 5,
    title: "Backend with Node.js",
    prompt: "Generate a beginner-friendly Node.js backend course including Express, REST APIs, middleware, authentication basics, and database integration."
  },
  {
    id: 6,
    title: "Database Basics",
    prompt: "Generate a beginner-friendly database course explaining SQL vs NoSQL, CRUD operations, schema design, and basic indexing concepts."
  }
];



export const Course_config_prompt = `You are an expert AI Course Architect for an AI-powered Video Course Generator platform.
Your task is to generate a structured, clean, and production-ready COURSE CONFIGURATION in JSON format.
IMPORTANT RULES:
Output ONLY valid JSON (no markdown, no explanation).
Do NOT include slides, HTML, TailwindCSS, animations, or audio text yet.
This config will be used in the NEXT step to generate animated slides and TTS narration.
Keep everything concise, beginner-friendly, and well-structured.
Limit each chapter to MAXIMUM 3 subContent points.
Each chapter should be suitable for 1–3 short animated slides.

COURSE CONFIG STRUCTURE REQUIREMENTS:
Top-level fields:
courseId (short, slug-like string)
courseName
courseDescription (2–3 lines, simple & engaging)
level (Beginner | Intermediate | Advanced)
totalChapters (number)
chapters (array) (Max 3);
Each chapter object must contain:
chapterId (slug-style, unique)
chapterTitle
subContent (array of strings, max 3 items)

CONTENT GUIDELINES:
Chapters should follow a logical learning flow
SubContent points should be:
Simple
Slide-friendly
Easy to convert into narration later
Avoid overly long sentences
Avoid emojis
Avoid marketing fluff

USER INPUT:
User will provide course topic
OUTPUT:
Return ONLY the JSON object.
`;




export const Generate_Video_Prompt = `
You are an expert instructional designer and motion UI engineer.

INPUT (you will receive a single JSON object):
{
  "courseName": string,
  "chapterTitle": string,
  "chapterSlug": string,
  "subContent": string[] // length 1–3, each item becomes 1 slide
}

TASK:
Generate a SINGLE valid JSON ARRAY of slide objects.
Return ONLY JSON (no markdown, no commentary, no extra keys).

SLIDE SCHEMA (STRICT — each slide must match exactly):
{
  "slideId": string,
  "slideIndex": number,
  "title": string,
  "subtitle": string,
  "audioFileName": string,
  "narration": { "fullText": string },
  "html": string,
  "revelData": string[]
}

RULES:
- Total slides MUST equal subContent.length
- slideIndex MUST start at 1 and increment by 1
- slideId MUST be: "\${chapterSlug}-0\${slideIndex}" (example: "intro-setup-01")
- audioFileName MUST be: "\${slideId}.mp3"
- narration.fullText MUST be 3–6 friendly, professional, teacher-style sentences
- narration text MUST NOT contain reveal tokens or keys (no "r1", "data-reveal", etc.)

REVEAL SYSTEM (VERY IMPORTANT):
- Split narration.fullText into sentences (3–6 sentences total)
- Each sentence maps to one reveal key in order: r1, r2, r3, ...
- revelData MUST be an array of these keys in order (example: ["r1","r2","r3","r4"])
- The HTML MUST include matching elements using data-reveal="r1", data-reveal="r2", etc.
- All reveal elements MUST start hidden using the class "reveal"
- Do NOT add any JS logic for reveal (another system will toggle "is-on" later)

HTML REQUIREMENTS:
- html MUST be a single self-contained HTML string
- MUST include Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- MUST render in an exact 16:9 frame: 1280x720
- Style: dark, clean gradient, course/presentation look
- Use ONLY inline <style> for animations (no external CSS files)
- MUST include the reveal CSS exactly (you may add transitions):
  .reveal { opacity:0; transform:translateY(12px); }
  .reveal.is-on { opacity:1; transform:translateY(0); }

CONTENT EXPECTATIONS (per slide):
- A header showing courseName + chapterTitle (or chapter label)
- A big title and a subtitle
- 2–4 bullets OR cards that progressively reveal (mapped to r1..rn)
- Visual hierarchy: clean spacing, readable typography, consistent layout
- Design should still look good if only r1 is visible, then r2, etc.

OUTPUT VALIDATION:
- Output MUST be valid JSON ONLY
- Output MUST be an array of slide objects matching the strict schema
- No trailing commas, no comments, no extra fields.

Now generate slides for the provided input.
`;



export const TESTING_VIDEO_SLIES=[
    {
        "slideId": "core-types-01",
        "slideIndex": 1,
        "title": "Basic Built-in Types",
        "subtitle": "number · string · boolean · arrays · tuples",
        "audioFileName": "core-types-01.mp3",
        "narration": {
            "fullText": "Let's review TypeScript's basic built-in types and how they shape our data models. We will look at number, string, boolean, arrays, and tuples with simple examples and common usage patterns. By the end of this slide you should be able to choose the appropriate basic type for common variables and spot incorrect usages."
        },
        "html": "<script src=\"https://cdn.tailwindcss.com\"></script>\n<div style=\"width:1280px;height:720px;\" class=\"bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white font-sans\">\n  <style>\n    .reveal { opacity:0; transform:translateY(12px); transition:opacity 360ms cubic-bezier(.2,.9,.2,1), transform 360ms cubic-bezier(.2,.9,.2,1); }\n    .reveal.is-on { opacity:1; transform:translateY(0); }\n  </style>\n  <div class=\"w-full h-full flex flex-col p-10\">\n    <header class=\"flex items-center justify-between\">\n      <div class=\"text-sm text-gray-400\">TypeScript Essentials</div>\n      <div class=\"text-sm text-gray-400\">Core Types & Type System</div>\n    </header>\n    <main class=\"flex-1 flex flex-col justify-center\">\n      <div class=\"max-w-4xl mx-auto\">\n        <h1 class=\"text-5xl font-extrabold tracking-tight\">Basic Built-in Types</h1>\n        <p class=\"text-lg text-gray-300 mt-2\">number · string · boolean · arrays · tuples</p>\n        <ul class=\"mt-10 space-y-4\">\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r1\">\n            <div class=\"text-white font-medium\">Overview</div>\n            <div class=\"text-gray-300 mt-1\">How basic types structure your data models and guide API contracts.</div>\n          </li>\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r2\">\n            <div class=\"text-white font-medium\">Core Examples</div>\n            <div class=\"text-gray-300 mt-1\">number, string, boolean, arrays for lists, and tuples for fixed heterogenous collections.</div>\n          </li>\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r3\">\n            <div class=\"text-white font-medium\">Practical Tip</div>\n            <div class=\"text-gray-300 mt-1\">Prefer tuples for fixed shapes and arrays for homogeneous lists to keep types clear and safe.</div>\n          </li>\n        </ul>\n      </div>\n    </main>\n    <footer class=\"text-xs text-gray-500\">Slide 1 of 3 • Core Types</footer>\n  </div>\n</div>",
        "revelData": [
            "r1",
            "r2",
            "r3"
        ]
    },
    {
        "slideId": "core-types-02",
        "slideIndex": 2,
        "title": "Unions, Intersections & Type Aliases",
        "subtitle": "Union · Intersection · Aliases · Inference",
        "audioFileName": "core-types-02.mp3",
        "narration": {
            "fullText": "Union and intersection types give us flexible ways to express combined or alternate shapes of data, which can simplify complex typings. We will also define type aliases to name these shapes and rely on TypeScript's type inference to reduce boilerplate. Understanding when to use unions, intersections, or aliases will make your code safer and easier to read."
        },
        "html": "<script src=\"https://cdn.tailwindcss.com\"></script>\n<div style=\"width:1280px;height:720px;\" class=\"bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white font-sans\">\n  <style>\n    .reveal { opacity:0; transform:translateY(12px); transition:opacity 360ms cubic-bezier(.2,.9,.2,1), transform 360ms cubic-bezier(.2,.9,.2,1); }\n    .reveal.is-on { opacity:1; transform:translateY(0); }\n  </style>\n  <div class=\"w-full h-full flex flex-col p-10\">\n    <header class=\"flex items-center justify-between\">\n      <div class=\"text-sm text-gray-400\">TypeScript Essentials</div>\n      <div class=\"text-sm text-gray-400\">Core Types & Type System</div>\n    </header>\n    <main class=\"flex-1 flex flex-col justify-center\">\n      <div class=\"max-w-4xl mx-auto\">\n        <h1 class=\"text-5xl font-extrabold tracking-tight\">Unions, Intersections & Type Aliases</h1>\n        <p class=\"text-lg text-gray-300 mt-2\">Combine types, name shapes, and leverage inference</p>\n        <ul class=\"mt-10 space-y-4\">\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r1\">\n            <div class=\"text-white font-medium\">Unions vs Intersections</div>\n            <div class=\"text-gray-300 mt-1\">Unions represent alternatives; intersections compose multiple capabilities into one type.</div>\n          </li>\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r2\">\n            <div class=\"text-white font-medium\">Type Aliases & Inference</div>\n            <div class=\"text-gray-300 mt-1\">Use aliases to name complex types and rely on inference to keep code concise and expressive.</div>\n          </li>\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r3\">\n            <div class=\"text-white font-medium\">When to Use What</div>\n            <div class=\"text-gray-300 mt-1\">Choose unions for alternatives and intersections for composition to improve readability and safety.</div>\n          </li>\n        </ul>\n      </div>\n    </main>\n    <footer class=\"text-xs text-gray-500\">Slide 2 of 3 • Core Types</footer>\n  </div>\n</div>",
        "revelData": [
            "r1",
            "r2",
            "r3"
        ]
    },
    {
        "slideId": "core-types-03",
        "slideIndex": 3,
        "title": "any vs unknown & Safe Assertions",
        "subtitle": "Prefer unknown · Narrowing · Controlled assertions",
        "audioFileName": "core-types-03.mp3",
        "narration": {
            "fullText": "The any type disables type checking and can mask bugs, while unknown forces you to validate values before use. We'll discuss safe patterns for narrowing unknown and when it is appropriate to use type assertions sparingly. Adopting these practices helps maintain correct types and improves code reliability in larger codebases."
        },
        "html": "<script src=\"https://cdn.tailwindcss.com\"></script>\n<div style=\"width:1280px;height:720px;\" class=\"bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white font-sans\">\n  <style>\n    .reveal { opacity:0; transform:translateY(12px); transition:opacity 360ms cubic-bezier(.2,.9,.2,1), transform 360ms cubic-bezier(.2,.9,.2,1); }\n    .reveal.is-on { opacity:1; transform:translateY(0); }\n  </style>\n  <div class=\"w-full h-full flex flex-col p-10\">\n    <header class=\"flex items-center justify-between\">\n      <div class=\"text-sm text-gray-400\">TypeScript Essentials</div>\n      <div class=\"text-sm text-gray-400\">Core Types & Type System</div>\n    </header>\n    <main class=\"flex-1 flex flex-col justify-center\">\n      <div class=\"max-w-4xl mx-auto\">\n        <h1 class=\"text-5xl font-extrabold tracking-tight\">any vs unknown & Safe Assertions</h1>\n        <p class=\"text-lg text-gray-300 mt-2\">Understand risks and safe narrowing techniques</p>\n        <ul class=\"mt-10 space-y-4\">\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r1\">\n            <div class=\"text-white font-medium\">any vs unknown</div>\n            <div class=\"text-gray-300 mt-1\">any bypasses checks and can hide bugs; unknown requires validation before use.</div>\n          </li>\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r2\">\n            <div class=\"text-white font-medium\">Narrowing & Assertions</div>\n            <div class=\"text-gray-300 mt-1\">Use type guards and careful assertions to narrow unknown values safely when necessary.</div>\n          </li>\n          <li class=\"reveal p-5 rounded-lg bg-gradient-to-r from-gray-800 to-slate-800 border border-gray-700\" data-reveal=\"r3\">\n            <div class=\"text-white font-medium\">Best Practice</div>\n            <div class=\"text-gray-300 mt-1\">Prefer unknown over any and assert only when you have clear evidence to avoid runtime errors.</div>\n          </li>\n        </ul>\n      </div>\n    </main>\n    <footer class=\"text-xs text-gray-500\">Slide 3 of 3 • Core Types</footer>\n  </div>\n</div>",
        "revelData": [
            "r1",
            "r2",
            "r3"
        ]
    }
]


