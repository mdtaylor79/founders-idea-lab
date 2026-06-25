import React, { useState } from "react";

// ---- UNT brand palette (from UNT Brand Reference Guide; CMYK mapped to digital hex) ----
const C = {
  green: "#00853E",   // UNT Green (primary)
  navy: "#00472A",    // deep UNT green (dark surfaces, headings)
  teal: "#00853E",    // secondary green label
  gold: "#C4D600",    // UNT chartreuse accent
  blue: "#00AEEF",    // UNT bright blue accent
  paper: "#f5f8f5",
  white: "#ffffff",
  ink: "#16231c",
  sub: "#5c6b62",
  line: "#e0e8e2",
};

const DISPLAY = "'EB Garamond', Georgia, serif";
const BODY = "'Helvetica Neue', Arial, sans-serif";

// ---- Data ----
const MARKETS = [
  { name: "Artificial Intelligence", whyNow: "AI tools got cheap and powerful fast, so a small team can build what used to take a giant company.", problems: ["Teachers spend hours grading", "People drown in too much information", "Small businesses cannot afford help desks"] },
  { name: "Cybersecurity", whyNow: "Almost everything moved online and attacks keep rising.", problems: ["People reuse weak passwords", "Seniors get tricked by scams", "Small shops cannot protect customer data"] },
  { name: "Fintech & Money", whyNow: "Young people want simple, mobile ways to manage money.", problems: ["Teens never learn to budget", "Splitting costs with friends is messy", "Saving feels boring"] },
  { name: "Data & Analytics", whyNow: "Every business has data and needs answers fast.", problems: ["Coaches cannot track player progress", "Stores guess what to stock", "Clubs lose track of members"] },
  { name: "Robotics & Automation", whyNow: "Robots are getting affordable for everyday tasks.", problems: ["Boring chores eat people's time", "Warehouses cannot hire fast enough", "Farms need more hands"] },
  { name: "Clean Energy & Climate", whyNow: "The world is racing to cut waste and switch to clean power.", problems: ["Homes waste energy", "Recycling is confusing", "People cannot see their footprint"] },
  { name: "Healthcare & Biotech", whyNow: "People want care that is faster, closer, and more personal.", problems: ["Patients forget medicine", "Mental health support is hard to reach", "Clinics have long waits"] },
  { name: "Business & E-commerce", whyNow: "Anyone can sell online and reach the world from a bedroom.", problems: ["New sellers cannot get noticed", "Shipping costs too much", "Stores run out of best sellers"] },
  { name: "Gaming & XR", whyNow: "Games and AR/VR are becoming tools for work and learning, not just play.", problems: ["Learning feels boring", "Practicing real skills is risky", "Players want safer communities"] },
  { name: "Creator & Content", whyNow: "Creators are a real industry and they need tools to grow.", problems: ["Editing takes forever", "Hard to find an audience", "Creators burn out"] },
  { name: "Space & Aerospace", whyNow: "Private companies made space cheaper to reach.", problems: ["Tracking satellites is complex", "Space education is rare", "Drones need smarter navigation"] },
  { name: "Smart Agriculture & Food", whyNow: "Farms are going high-tech to grow more with less.", problems: ["Crops get diseases unnoticed", "Food spoils in transit", "Water gets wasted"] },
  { name: "Education Tech", whyNow: "Learning is going online and getting personal with AI.", problems: ["Students study the wrong way", "Tutoring is expensive", "Teachers lack time for each kid"] },
  { name: "Logistics & Drones", whyNow: "People expect fast delivery everywhere.", problems: ["Rural areas wait days for packages", "Delivery costs too much", "Lost packages frustrate people"] },
];

const AUDIENCES = ["Kids my age", "Students", "Parents", "Grandparents", "Small businesses", "Local shops", "Athletes", "Teachers", "Gamers", "My community"];

const MONEY_MODELS = [
  { name: "Subscription", desc: "People pay every month to keep using it.", ex: "A study app for $3 a month." },
  { name: "Freemium", desc: "Free basic version, pay for the extras.", ex: "Free game, pay for new skins." },
  { name: "Ads", desc: "Free to use, brands pay to show ads.", ex: "A free app with short ads." },
  { name: "Marketplace fee", desc: "Connect buyers and sellers, take a small cut.", ex: "A resale app keeps 5% of each sale." },
  { name: "One-time sale", desc: "Pay once to own it.", ex: "A $5 app or a physical product." },
  { name: "Pay-per-use", desc: "Pay only when you use it.", ex: "Pay per ride or per print." },
  { name: "Sponsorship", desc: "A company funds you to reach your audience.", ex: "A brand sponsors your video series." },
];
const MODEL_CHIPS = MONEY_MODELS.map((m) => m.name);

const TECH = ["an AI chatbot", "a smart sensor", "a phone app", "a drone", "a blockchain ledger", "a VR headset", "a 3D printer", "a data dashboard", "a wearable device", "a friendly robot", "a smart camera", "a voice assistant"];
const GOALS = ["helping people save money", "reducing food waste", "making online shopping safer", "helping students study", "cutting energy use at home", "getting medicine to remote towns", "helping small businesses find customers", "keeping passwords and data safe", "helping farmers grow more food", "recycling more plastic", "helping people find good jobs", "making city traffic less crowded"];

const STATIONS = [
  ["Opportunity", "Pick a growing market and find real problems worth solving."],
  ["Sparks", "Get three AI startup ideas, each with a way to make money."],
  ["Build", "Fill a venture canvas and get scored by an AI investor."],
  ["Money", "Learn how businesses earn and match a model to your idea."],
  ["Remix", "Mash a technology with a goal to spark something new."],
  ["Prompt", "Practice writing prompts that get better AI answers."],
];

// ---- API helper ----
async function callClaude(messages, system) {
  // Calls our own serverless function, which holds the API key securely.
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages }),
  });
  if (!res.ok) throw new Error("network");
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

function parseJSON(text) {
  let t = (text || "").trim();
  t = t.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/g, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a !== -1 && b !== -1) t = t.slice(a, b + 1);
  return JSON.parse(t);
}

// ---- Primitives ----
function GradientRule({ width }) {
  return <div style={{ height: 4, width: width || 60, borderRadius: 4, background: `linear-gradient(90deg, ${C.blue}, ${C.green})` }} />;
}

function PrimaryButton({ children, onClick, disabled, full }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ backgroundColor: disabled ? "#9bc3a8" : C.green, color: C.white }}
      className={`btn px-6 py-3 rounded-md font-bold text-base shadow-sm disabled:cursor-not-allowed ${full ? "w-full" : ""}`}>
      {children}
    </button>
  );
}

function LimeButton({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ backgroundColor: disabled ? "#e6efb0" : C.gold, color: C.navy }}
      className="btn px-6 py-3 rounded-md font-bold text-base shadow-sm disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ color: C.green, borderColor: C.green, backgroundColor: "transparent" }}
      className="btn px-6 py-3 rounded-md border-2 font-bold text-base">
      {children}
    </button>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ backgroundColor: active ? C.green : C.white, color: active ? C.white : C.navy, borderColor: active ? C.green : C.line }}
      className="btn px-3.5 py-2 rounded-md border-2 text-sm font-semibold">
      {label}
    </button>
  );
}

function Field({ label, value, color }) {
  return (
    <div className="mb-3 last:mb-0">
      <div style={{ color: color || C.navy }} className="text-[11px] font-bold uppercase tracking-wider mb-0.5">{label}</div>
      <div style={{ color: C.ink }} className="text-sm leading-snug">{value}</div>
    </div>
  );
}

function Loader({ text }) {
  return (
    <div className="flex items-center gap-3 py-6">
      <div style={{ borderColor: C.green, borderTopColor: "transparent" }} className="w-6 h-6 border-3 rounded-full animate-spin" />
      <span style={{ color: C.navy }} className="font-semibold">{text}</span>
    </div>
  );
}

function ErrorNote({ onRetry }) {
  return (
    <div style={{ backgroundColor: "#f6fadf", borderColor: C.green, color: C.navy }} className="rounded-md border-2 p-4 text-sm font-medium">
      The idea engine could not connect. Check the internet and try again.
      {onRetry && <button onClick={onRetry} style={{ color: C.green }} className="ml-2 underline font-bold">Try again</button>}
    </div>
  );
}

function StationHeader({ n, title, sub }) {
  return (
    <div className="mb-6">
      <div style={{ color: C.green, letterSpacing: "0.18em" }} className="text-xs font-bold uppercase mb-2">Station {n}</div>
      <h2 style={{ color: C.navy, fontFamily: DISPLAY }} className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{title}</h2>
      <GradientRule />
      <p style={{ color: C.sub }} className="mt-3 text-sm max-w-2xl leading-relaxed">{sub}</p>
    </div>
  );
}

function Card({ children, hover }) {
  return (
    <div style={{ backgroundColor: C.white, borderColor: C.line }} className={`rounded-xl border p-5 shadow-sm ${hover ? "lift" : ""}`}>
      {children}
    </div>
  );
}

function SparkCard({ s }) {
  return (
    <div style={{ backgroundColor: C.white, borderColor: C.line }} className="fade-in rounded-xl border p-5 shadow-sm">
      <div style={{ borderColor: C.line }} className="border-b pb-3 mb-3">
        <h3 style={{ color: C.navy }} className="text-lg font-bold">{s.name}</h3>
      </div>
      <Field label="The problem" value={s.problem} />
      <Field label="The solution" value={s.solution} />
      <Field label="Where AI helps" value={s.aiRole} color={C.teal} />
      {s.money && <Field label="How it makes money" value={s.money} color={C.green} />}
    </div>
  );
}

// ---- Stations ----
function Opportunity({ market, setMarket, setTab }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ops, setOps] = useState([]);
  const m = MARKETS.find((x) => x.name === market);

  async function findMore() {
    if (!market) return;
    setLoading(true); setError(false); setOps([]);
    try {
      const text = await callClaude(
        [{ role: "user", content: `Market: ${market}. Find 3 fresh problems worth solving right now.` }],
        `You are a startup coach for students ages 11 to 18 at a youth entrepreneurship camp. For the given market, list 3 real problems a young founder could build a business around. Do not invent specific statistics. Respond ONLY with valid JSON, no markdown and no backticks, in this exact shape: {"opportunities":[{"problem":"","who":"","whyNow":""}]}`
      );
      setOps(parseJSON(text).opportunities || []);
    } catch (e) { setError(true); } finally { setLoading(false); }
  }

  return (
    <div>
      <StationHeader n={1} title="Find an Opportunity" sub="Founders start with a problem, not a product. Pick a growing market and look for problems worth solving." />
      <div className="flex flex-wrap gap-2 mb-5">
        {MARKETS.map((x) => <Chip key={x.name} label={x.name} active={market === x.name} onClick={() => { setMarket(x.name); setOps([]); }} />)}
      </div>

      {m ? (
        <div className="fade-in"><Card>
          <div style={{ color: C.green }} className="text-[11px] font-bold uppercase tracking-wider mb-1">Why now</div>
          <p style={{ color: C.ink }} className="text-sm mb-4 leading-relaxed">{m.whyNow}</p>
          <div style={{ color: C.green }} className="text-[11px] font-bold uppercase tracking-wider mb-2">Problems waiting to be solved</div>
          <ul className="space-y-2 mb-5">
            {m.problems.map((p) => (
              <li key={p} className="flex gap-2 items-start">
                <span style={{ backgroundColor: C.gold }} className="w-2 h-2 rounded-full mt-2 shrink-0" />
                <span style={{ color: C.ink }} className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <LimeButton onClick={findMore} disabled={loading}>Find more with AI</LimeButton>
            <PrimaryButton onClick={() => setTab("spark")}>Spark ideas here</PrimaryButton>
          </div>
        </Card></div>
      ) : <p style={{ color: C.sub }} className="text-sm">Pick a market above to see why it is growing and what problems are open.</p>}

      <div className="mt-5">
        {loading && <Loader text="Scouting opportunities..." />}
        {error && <ErrorNote onRetry={findMore} />}
        {ops.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {ops.map((o, i) => (
              <div key={i} className="fade-in"><Card>
                <Field label="Problem" value={o.problem} />
                <Field label="Who feels it" value={o.who} color={C.teal} />
                <Field label="Why now" value={o.whyNow} color={C.green} />
              </Card></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Sparks({ market, setMarket }) {
  const [aud, setAud] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sparks, setSparks] = useState([]);

  async function run() {
    setLoading(true); setError(false); setSparks([]);
    try {
      const text = await callClaude(
        [{ role: "user", content: `Market: ${market}. Customer: ${aud}. Give me 3 startup ideas.` }],
        `You are a startup coach for students ages 11 to 18 at a youth entrepreneurship camp. Generate 3 startup ideas in the given market for the given customer. Each must solve a real problem, use AI helpfully where it fits, and include a simple way it makes money. Keep language simple and exciting. Do not invent specific statistics. Respond ONLY with valid JSON, no markdown and no backticks, in this exact shape: {"sparks":[{"name":"","problem":"","solution":"","aiRole":"","money":""}]}`
      );
      setSparks(parseJSON(text).sparks || []);
    } catch (e) { setError(true); } finally { setLoading(false); }
  }

  return (
    <div>
      <StationHeader n={2} title="Idea Sparks" sub="Pick a market and a customer. The AI returns three startup ideas, each with a way to make money." />
      <div className="mb-5">
        <div style={{ color: C.navy }} className="font-bold text-sm mb-2">1. Pick a market</div>
        <div className="flex flex-wrap gap-2">{MARKETS.map((x) => <Chip key={x.name} label={x.name} active={market === x.name} onClick={() => setMarket(x.name)} />)}</div>
      </div>
      <div className="mb-6">
        <div style={{ color: C.navy }} className="font-bold text-sm mb-2">2. Who is the customer?</div>
        <div className="flex flex-wrap gap-2">{AUDIENCES.map((a) => <Chip key={a} label={a} active={aud === a} onClick={() => setAud(a)} />)}</div>
      </div>
      <PrimaryButton onClick={run} disabled={!market || !aud || loading}>Generate 3 startup ideas</PrimaryButton>
      <div className="mt-6">
        {loading && <Loader text="Sparking ideas..." />}
        {error && <ErrorNote onRetry={run} />}
        <div className="grid gap-4 md:grid-cols-3">{sparks.map((s, i) => <SparkCard key={i} s={s} />)}</div>
      </div>
    </div>
  );
}

function scoreColor(n) { return n >= 7 ? C.green : C.navy; }

function BuildLab() {
  const [f, setF] = useState({ problem: "", customer: "", solution: "", ai: "", money: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [out, setOut] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const addModel = (mname) => setF((p) => ({ ...p, money: p.money ? `${p.money}, ${mname}` : mname }));
  const ready = f.problem && f.customer && f.solution && f.ai && f.money && f.name;

  async function run() {
    setLoading(true); setError(false); setOut(null);
    try {
      const text = await callClaude(
        [{ role: "user", content: `Problem: ${f.problem}\nCustomer: ${f.customer}\nSolution: ${f.solution}\nWhere AI helps: ${f.ai}\nHow it makes money: ${f.money}\nName: ${f.name}` }],
        `You are a friendly startup investor coaching a student ages 11 to 18 at a youth entrepreneurship camp. Turn their venture notes into a short pitch and give kind, real feedback. Respond ONLY with valid JSON, no markdown and no backticks, in this exact shape: {"pitch":"","moneyModelNote":"","mvpFirstStep":"","investorQuestion":"","readinessScore":0,"scoreReason":""}. readinessScore is a whole number from 1 to 10. Keep each text value to 1 or 2 sentences, simple and encouraging.`
      );
      setOut(parseJSON(text));
    } catch (e) { setError(true); } finally { setLoading(false); }
  }

  const steps = [
    ["1. What problem did you spot?", "problem", "Small shops run out of best sellers..."],
    ["2. Who is the customer?", "customer", "Local business owners who pay monthly..."],
    ["3. Your solution in one sentence", "solution", "A tool that predicts what to reorder..."],
    ["4. Where does AI do the heavy lifting?", "ai", "AI studies past sales to forecast demand..."],
  ];

  return (
    <div>
      <StationHeader n={3} title="Build the Venture" sub="Fill the canvas. The AI investor builds your pitch, checks your money model, and scores how ready you are." />
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map(([label, key, ph]) => (
          <div key={key} className={key === "solution" || key === "ai" ? "md:col-span-2" : ""}>
            <div style={{ color: C.navy }} className="font-bold text-sm mb-1">{label}</div>
            <textarea value={f[key]} onChange={set(key)} placeholder={ph} rows={2} style={{ borderColor: C.line, color: C.ink }} className="field w-full rounded-md border-2 p-3 text-sm" />
          </div>
        ))}
        <div className="md:col-span-2">
          <div style={{ color: C.navy }} className="font-bold text-sm mb-1">5. How will it make money?</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {MODEL_CHIPS.map((mname) => (
              <button key={mname} onClick={() => addModel(mname)} style={{ backgroundColor: C.white, color: C.navy, borderColor: C.line }} className="btn px-3 py-1.5 rounded-md border-2 text-xs font-semibold">+ {mname}</button>
            ))}
          </div>
          <textarea value={f.money} onChange={set("money")} placeholder="Tap a model above or type your own..." rows={2} style={{ borderColor: C.line, color: C.ink }} className="field w-full rounded-md border-2 p-3 text-sm" />
        </div>
        <div>
          <div style={{ color: C.navy }} className="font-bold text-sm mb-1">6. What would you name it?</div>
          <textarea value={f.name} onChange={set("name")} placeholder="ShopSense" rows={2} style={{ borderColor: C.line, color: C.ink }} className="field w-full rounded-md border-2 p-3 text-sm" />
        </div>
      </div>
      <div className="mt-5"><PrimaryButton onClick={run} disabled={!ready || loading}>Pitch to the AI investor</PrimaryButton></div>
      <div className="mt-6">
        {loading && <Loader text="The investor is reviewing..." />}
        {error && <ErrorNote onRetry={run} />}
        {out && (
          <div className="fade-in"><Card>
            <div className="flex items-center gap-4 mb-4">
              <div style={{ backgroundColor: scoreColor(out.readinessScore), color: C.white }} className="w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-black leading-none">{out.readinessScore}</span>
                <span className="text-[10px] font-bold">of 10</span>
              </div>
              <div>
                <div style={{ color: C.navy }} className="text-[11px] font-bold uppercase tracking-wider">Readiness score</div>
                <div style={{ color: C.ink }} className="text-sm">{out.scoreReason}</div>
              </div>
            </div>
            <div style={{ backgroundColor: C.navy, color: C.white }} className="rounded-md p-4 mb-4">
              <div style={{ color: C.gold }} className="text-[11px] font-bold uppercase tracking-wider mb-1">Your pitch</div>
              <div className="text-base font-medium leading-snug">{out.pitch}</div>
            </div>
            <Field label="Money model check" value={out.moneyModelNote} color={C.green} />
            <Field label="Your first build step" value={out.mvpFirstStep} color={C.navy} />
            <Field label="The investor wants to know" value={out.investorQuestion} color={C.teal} />
          </Card></div>
        )}
      </div>
    </div>
  );
}

function Money() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [out, setOut] = useState(null);

  async function run() {
    setLoading(true); setError(false); setOut(null);
    try {
      const text = await callClaude(
        [{ role: "user", content: `My idea: ${idea}. Suggest money models.` }],
        `You are a startup coach for students ages 11 to 18. Suggest 2 or 3 ways the given idea could make money, using simple models a teen understands. Respond ONLY with valid JSON, no markdown and no backticks, in this exact shape: {"suggestions":[{"model":"","whyItFits":""}],"topPick":""}. Keep it simple and encouraging.`
      );
      setOut(parseJSON(text));
    } catch (e) { setError(true); } finally { setLoading(false); }
  }

  return (
    <div>
      <StationHeader n={4} title="Money Models" sub="A real venture has a plan to make money. Learn the common models, then get one matched to your idea." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {MONEY_MODELS.map((m) => (
          <div key={m.name} style={{ backgroundColor: C.white, borderColor: C.line }} className="lift rounded-xl border p-4 shadow-sm">
            <div style={{ color: C.navy }} className="font-bold mb-1">{m.name}</div>
            <div style={{ color: C.ink }} className="text-sm mb-2">{m.desc}</div>
            <div style={{ color: C.green }} className="text-xs italic">{m.ex}</div>
          </div>
        ))}
      </div>
      <div style={{ color: C.navy }} className="font-bold text-sm mb-2">Match a model to your idea</div>
      <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={2} placeholder="An app that helps students study from their notes..." style={{ borderColor: C.line, color: C.ink }} className="field w-full rounded-md border-2 p-3 text-sm mb-3" />
      <PrimaryButton onClick={run} disabled={!idea.trim() || loading}>Suggest money models</PrimaryButton>
      <div className="mt-6">
        {loading && <Loader text="Crunching the model..." />}
        {error && <ErrorNote onRetry={run} />}
        {out && (
          <div className="fade-in"><Card>
            {(out.suggestions || []).map((s, i) => <Field key={i} label={s.model} value={s.whyItFits} color={C.teal} />)}
            {out.topPick && (
              <div style={{ backgroundColor: "#eef7e6", borderColor: C.green }} className="rounded-md border-2 p-3 mt-2">
                <span style={{ color: C.green }} className="text-[11px] font-bold uppercase tracking-wider">Best fit to start: </span>
                <span style={{ color: C.ink }} className="text-sm font-semibold">{out.topPick}</span>
              </div>
            )}
          </Card></div>
        )}
      </div>
    </div>
  );
}

function Remix() {
  const [tech, setTech] = useState(TECH[0]);
  const [goal, setGoal] = useState(GOALS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [out, setOut] = useState(null);

  function shuffle() {
    setTech(TECH[Math.floor(Math.random() * TECH.length)]);
    setGoal(GOALS[Math.floor(Math.random() * GOALS.length)]);
    setOut(null);
  }

  async function run() {
    setLoading(true); setError(false); setOut(null);
    try {
      const text = await callClaude(
        [{ role: "user", content: `Combine ${tech} with the goal of ${goal} into one startup.` }],
        `You are an inventive startup coach for students ages 11 to 18. Combine the given technology and goal into one creative, realistic startup in any industry, and include how it makes money. Respond ONLY with valid JSON, no markdown and no backticks, in this exact shape: {"name":"","idea":"","aiRole":"","money":""}. Keep it simple and fun.`
      );
      setOut(parseJSON(text));
    } catch (e) { setError(true); } finally { setLoading(false); }
  }

  return (
    <div>
      <StationHeader n={5} title="Idea Remix" sub="Stuck? Mash a technology with a goal and let it spark something new. Shuffle until it surprises you." />
      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <div style={{ backgroundColor: C.white, borderColor: C.line, borderLeftColor: C.blue, borderLeftWidth: 4 }} className="rounded-md border p-4">
          <div style={{ color: C.green }} className="text-[11px] font-bold uppercase tracking-wider mb-1">Technology</div>
          <div style={{ color: C.navy }} className="text-lg font-bold capitalize">{tech}</div>
        </div>
        <div style={{ backgroundColor: C.white, borderColor: C.line, borderLeftColor: C.gold, borderLeftWidth: 4 }} className="rounded-md border p-4">
          <div style={{ color: C.navy }} className="text-[11px] font-bold uppercase tracking-wider mb-1">Goal</div>
          <div style={{ color: C.navy }} className="text-lg font-bold">{goal}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <LimeButton onClick={shuffle}>Shuffle</LimeButton>
        <PrimaryButton onClick={run} disabled={loading}>Fuse into a startup</PrimaryButton>
      </div>
      <div className="mt-6">
        {loading && <Loader text="Fusing..." />}
        {error && <ErrorNote onRetry={run} />}
        {out && (
          <div className="fade-in"><Card>
            <h3 style={{ color: C.navy }} className="text-2xl font-bold mb-3">{out.name}</h3>
            <Field label="The idea" value={out.idea} />
            <Field label="Where AI helps" value={out.aiRole} color={C.teal} />
            <Field label="How it makes money" value={out.money} color={C.green} />
          </Card></div>
        )}
      </div>
    </div>
  );
}

function PromptPower() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function run() {
    setLoading(true); setError(false); setReply("");
    try {
      const r = await callClaude(
        [{ role: "user", content: text }],
        `You are a startup coach for students ages 11 to 18 at a youth entrepreneurship camp. Reply with helpful startup guidance in any industry. If their prompt is vague, gently show them how to add detail, then answer anyway. Keep it short, kind, and simple.`
      );
      setReply(r);
    } catch (e) { setError(true); } finally { setLoading(false); }
  }

  const ingredients = [
    ["Role", "Tell the AI who to be", "Act like a startup coach for teens."],
    ["Goal", "Say what you want", "Give me 3 fintech app ideas for students."],
    ["Details", "Add who and where", "For college students who overspend."],
    ["Format", "Say how to show it", "List each with a name and one line."],
  ];

  return (
    <div>
      <StationHeader n={6} title="Prompt Power" sub="AI is leverage for a founder. The better your prompt, the better the help. Use four ingredients." />
      <div className="grid gap-3 md:grid-cols-2 mb-5">
        <div style={{ backgroundColor: "#fbeaea", borderColor: "#e0b4b4" }} className="rounded-md border p-4">
          <div style={{ color: "#a13030" }} className="text-[11px] font-bold uppercase tracking-wider mb-1">Weak prompt</div>
          <div style={{ color: C.ink }} className="text-sm italic">"Give me a business idea."</div>
        </div>
        <div style={{ backgroundColor: "#eef7e6", borderColor: "#9fcf86" }} className="rounded-md border p-4">
          <div style={{ color: C.green }} className="text-[11px] font-bold uppercase tracking-wider mb-1">Strong prompt</div>
          <div style={{ color: C.ink }} className="text-sm italic">"Act like a startup coach for teens. Give me 3 fintech app ideas that help college students stop overspending. List each with a name and one line."</div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 mb-6">
        {ingredients.map(([k, what, ex], i) => (
          <div key={k} style={{ backgroundColor: C.white, borderColor: C.line }} className="rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ backgroundColor: C.navy, color: C.white }} className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black">{i + 1}</span>
              <span style={{ color: C.navy }} className="font-bold">{k}</span>
            </div>
            <div style={{ color: C.ink }} className="text-xs mb-2">{what}</div>
            <div style={{ color: C.green }} className="text-xs italic">{ex}</div>
          </div>
        ))}
      </div>
      <div style={{ color: C.navy }} className="font-bold text-sm mb-2">Try your own prompt</div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Act like a startup coach for teens. Give me..." style={{ borderColor: C.line, color: C.ink }} className="field w-full rounded-md border-2 p-3 text-sm mb-3" />
      <PrimaryButton onClick={run} disabled={!text.trim() || loading}>Send to the AI</PrimaryButton>
      <div className="mt-6">
        {loading && <Loader text="Thinking..." />}
        {error && <ErrorNote onRetry={run} />}
        {reply && <div className="fade-in" style={{ backgroundColor: C.white, borderColor: C.line, color: C.ink }} ><div className="rounded-xl border p-5 shadow-sm text-sm whitespace-pre-wrap leading-relaxed">{reply}</div></div>}
      </div>
    </div>
  );
}

// ---- Landing page ----
function Landing({ onLaunch }) {
  const quick = [
    ["1", "Find an opportunity", "Browse growing markets and spot a problem people actually have."],
    ["2", "Build your venture", "Turn it into a solution, a customer, and a plan to make money."],
    ["3", "Pitch to the AI investor", "Get a readiness score and one sharp question to improve."],
  ];
  return (
    <div>
      {/* Top bar */}
      <div style={{ backgroundColor: C.white, borderColor: C.line }} className="border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div style={{ color: C.green, fontFamily: DISPLAY }} className="text-xl font-bold">Founder's Idea Lab</div>
          <button onClick={onLaunch} style={{ backgroundColor: C.green, color: C.white }} className="btn px-5 py-2.5 rounded-md font-bold text-sm shadow-sm">Launch the Lab</button>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: `linear-gradient(180deg, ${C.white}, ${C.paper})` }} className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div style={{ color: C.green, letterSpacing: "0.18em" }} className="text-xs font-bold uppercase mb-4">Youth Entrepreneurship, powered by AI</div>
            <h1 style={{ color: C.navy, fontFamily: DISPLAY }} className="text-5xl md:text-6xl font-bold leading-[1.05] mb-5">Turn what you notice into a venture.</h1>
            <p style={{ color: C.sub }} className="text-lg leading-relaxed mb-7 max-w-xl">A guided lab where young founders find a real problem, shape a business around it, and pitch it to an AI investor. No experience needed.</p>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={onLaunch}>Launch the Lab</PrimaryButton>
              <GhostButton onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>See how it works</GhostButton>
            </div>
          </div>
          {/* Preview card */}
          <div className="fade-in">
            <div style={{ backgroundColor: C.white, borderColor: C.line }} className="rounded-xl border shadow-md p-6 max-w-md mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div style={{ backgroundColor: C.green, color: C.white }} className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xl font-black leading-none">8</span>
                  <span className="text-[9px] font-bold">of 10</span>
                </div>
                <div>
                  <div style={{ color: C.navy }} className="text-lg font-bold">StudySpark</div>
                  <div style={{ color: C.sub }} className="text-xs">Education Tech, for students</div>
                </div>
              </div>
              <div style={{ backgroundColor: C.navy }} className="rounded-md p-3 mb-3">
                <div style={{ color: C.gold }} className="text-[10px] font-bold uppercase tracking-wider mb-1">Pitch</div>
                <div style={{ color: C.white }} className="text-sm">An app that turns your notes into a study plan and quick quizzes, sold to students for a small monthly fee.</div>
              </div>
              <Field label="The investor wants to know" value="How will you reach your first 100 students?" color={C.teal} />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ backgroundColor: C.white }} className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div style={{ color: C.green, letterSpacing: "0.18em" }} className="text-xs font-bold uppercase mb-2">How it works</div>
          <h2 style={{ color: C.navy, fontFamily: DISPLAY }} className="text-3xl md:text-4xl font-bold mb-3">Three steps to your first pitch</h2>
          <GradientRule width={72} />
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {quick.map(([n, t, d]) => (
              <div key={n} style={{ backgroundColor: C.paper, borderColor: C.line }} className="rounded-xl border p-6">
                <div style={{ color: C.gold, fontFamily: DISPLAY }} className="text-4xl font-bold mb-2">{n}</div>
                <div style={{ color: C.navy }} className="font-bold text-lg mb-1">{t}</div>
                <div style={{ color: C.sub }} className="text-sm leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stations */}
      <section style={{ backgroundColor: C.paper }} className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div style={{ color: C.green, letterSpacing: "0.18em" }} className="text-xs font-bold uppercase mb-2">Inside the lab</div>
          <h2 style={{ color: C.navy, fontFamily: DISPLAY }} className="text-3xl md:text-4xl font-bold mb-3">Six stations, one founder's path</h2>
          <GradientRule width={72} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {STATIONS.map(([t, d], i) => (
              <div key={t} className="lift" style={{ backgroundColor: C.white, borderColor: C.line }}>
                <div className="rounded-xl border p-6 h-full" style={{ borderColor: C.line }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ backgroundColor: C.green, color: C.white }} className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-black">{i + 1}</span>
                    <span style={{ color: C.navy }} className="font-bold text-lg">{t}</span>
                  </div>
                  <p style={{ color: C.sub }} className="text-sm leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Using a station */}
          <div style={{ backgroundColor: C.white, borderColor: C.line }} className="rounded-xl border p-6 mt-6">
            <div style={{ color: C.navy }} className="font-bold mb-2">Using any station</div>
            <p style={{ color: C.sub }} className="text-sm leading-relaxed">Make your choices with the buttons, tap the green action, then react to what the AI returns. Treat every answer as a starting draft to push on, not a final answer. It works best in small teams, and it needs an internet connection.</p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section style={{ backgroundColor: C.navy }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ color: C.white, fontFamily: DISPLAY }} className="text-3xl md:text-4xl font-bold mb-4">Ready to build something?</h2>
          <p style={{ color: "#cfe8d6" }} className="mb-7">Pick a problem you care about and see where it leads.</p>
          <button onClick={onLaunch} style={{ backgroundColor: C.gold, color: C.navy }} className="btn px-8 py-3.5 rounded-md font-bold text-base shadow-sm">Launch the Idea Lab</button>
        </div>
      </section>

      <footer style={{ backgroundColor: C.white, borderColor: C.line, color: C.sub }} className="border-t px-6 py-8">
        <div className="max-w-6xl mx-auto text-center text-xs">
          <div className="mb-1">UNT Frisco, Digital Health Pioneer Camp 2026</div>
          <div>AI refines, it does not replace. You are the founder.</div>
        </div>
      </footer>
    </div>
  );
}

// ---- App shell ----
const TABS = [["opportunity", "Opportunity"], ["spark", "Sparks"], ["build", "Build"], ["money", "Money"], ["remix", "Remix"], ["prompt", "Prompt"]];

function AppShell({ tab, setTab, market, setMarket, onHome }) {
  return (
    <div style={{ backgroundColor: C.paper }} className="min-h-screen">
      <header style={{ backgroundColor: C.white, borderColor: C.line }} className="border-b sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <button onClick={onHome} style={{ color: C.green, fontFamily: DISPLAY }} className="text-xl font-bold">Founder's Idea Lab</button>
          <button onClick={onHome} style={{ color: C.sub }} className="text-sm font-semibold hover:underline">Home</button>
        </div>
        <div className="max-w-5xl mx-auto px-3 pb-2">
          <div style={{ backgroundColor: C.paper }} className="flex gap-1 p-1 rounded-md overflow-x-auto">
            {TABS.map(([id, label]) => {
              const on = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)}
                  style={{ backgroundColor: on ? C.white : "transparent", color: on ? C.green : C.sub, boxShadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
                  className="px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all">{label}</button>
              );
            })}
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 py-8">
        {tab === "opportunity" && <Opportunity market={market} setMarket={setMarket} setTab={setTab} />}
        {tab === "spark" && <Sparks market={market} setMarket={setMarket} />}
        {tab === "build" && <BuildLab />}
        {tab === "money" && <Money />}
        {tab === "remix" && <Remix />}
        {tab === "prompt" && <PromptPower />}
      </main>
      <footer style={{ color: C.sub }} className="max-w-5xl mx-auto px-5 pb-10 text-center text-xs">AI refines, it does not replace. You are the founder.</footer>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [tab, setTab] = useState("opportunity");
  const [market, setMarket] = useState("");
  return (
    <div style={{ fontFamily: BODY, color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;0,600;0,700;1,600&display=swap');
        .btn { transition: filter .15s ease, transform .08s ease; }
        .btn:hover:not(:disabled) { filter: brightness(0.94); }
        .btn:active:not(:disabled) { transform: scale(0.98); }
        .lift { transition: box-shadow .2s ease, transform .2s ease; border-radius: 0.75rem; }
        .lift:hover { box-shadow: 0 12px 28px rgba(0,71,42,0.10); transform: translateY(-3px); }
        .field { transition: border-color .15s ease, box-shadow .15s ease; outline: none; }
        .field:focus { border-color: ${C.green}; box-shadow: 0 0 0 3px rgba(0,133,62,0.15); }
        .fade-in { animation: fadeIn .35s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>
      {view === "home"
        ? <Landing onLaunch={() => { setView("app"); setTab("opportunity"); window.scrollTo(0, 0); }} />
        : <AppShell tab={tab} setTab={setTab} market={market} setMarket={setMarket} onHome={() => { setView("home"); window.scrollTo(0, 0); }} />}
    </div>
  );
}
