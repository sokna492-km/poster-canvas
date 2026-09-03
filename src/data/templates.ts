import type { PosterTemplate } from "@/core/types";

export const STARTER_CODE = `import { Poster, Image } from "@poster/core";

export default function App() {
  const features = [
    {
      icon: "📚",
      text: "លំហាត់ជាង ៥០,០០០+ (ថ្នាក់ទី ៧-១២) សម្រាប់អនុវត្ត",
    },
    {
      icon: "🔬",
      text: "គ្រប់មុខវិជ្ជា ទាំងផ្នែកវិទ្យាសាស្ត្រពិត និងវិទ្យាសាស្ត្រសង្គម",
    },
    {
      icon: "🤖",
      text: "ជំនួយការ AI Chatbot ជួយដោះស្រាយ និងពន្យល់ភ្លាមៗ",
    },
    {
      icon: "🎯",
      text: "ត្រៀមប្រឡងបាក់ឌុប ឌីប្លូម ប្រចាំឆមាស និង ប្រចាំខែ",
    },
    {
      icon: "📱",
      text: "រៀនបានគ្រប់ទីកន្លែង តាមទូរស័ព្ទ ថេប្លេត ឬកុំព្យូទ័រ",
      fullWidth: true,
    },
  ];

  return (
    <Poster background="linear-gradient(to bottom right, #F8FAFC, #EFF6FF, #DBEAFE)" color="#0F172A" className="p-14 flex flex-col justify-between box-border select-none font-sans">
      {/* Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] bg-[#60A5FA]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Mathematical Elements */}
      <div className="absolute top-20 right-16 text-[#2563EB]/15 text-8xl font-serif font-black pointer-events-none rotate-6">
        ∑
      </div>
      <div className="absolute top-28 right-56 text-[#2563EB]/10 text-4xl font-mono font-bold pointer-events-none -rotate-12">
        lim(x→∞)
      </div>
      <div className="absolute top-[38%] right-12 text-[#2563EB]/15 text-5xl font-mono font-semibold pointer-events-none rotate-12">
        f'(x) = dy/dx
      </div>
      <div className="absolute top-[40%] left-8 text-[#2563EB]/15 text-8xl font-serif font-bold pointer-events-none -rotate-6">
        π
      </div>
      <div className="absolute top-24 left-1/3 text-[#2563EB]/10 text-5xl font-serif italic pointer-events-none">
        ∫ eˣ dx
      </div>
      <div className="absolute bottom-52 left-14 text-[#2563EB]/15 text-6xl font-mono font-bold pointer-events-none rotate-12">
        Δx → 0
      </div>
      <div className="absolute bottom-40 right-20 text-[#2563EB]/15 text-7xl font-serif font-black pointer-events-none -rotate-6">
        √a² + b²
      </div>
      <div className="absolute bottom-28 right-72 text-[#2563EB]/10 text-5xl font-mono font-bold pointer-events-none">
        θ ≈ 3.14159
      </div>
      <div className="absolute top-1/2 right-1/4 text-[#2563EB]/10 text-7xl font-serif font-bold pointer-events-none rotate-45">
        ∞
      </div>
      <div className="absolute bottom-60 right-1/3 text-[#2563EB]/10 text-4xl font-mono pointer-events-none">
        ± √Δ / 2a
      </div>

      {/* Top Header: Brand & Identity */}
      <header className="relative z-10 flex items-center justify-between gap-6">
        <div className="inline-flex items-center gap-3.5 bg-white/90 backdrop-blur-md px-7 py-4 rounded-full border border-blue-100 shadow-sm" data-poster-layer="text" data-poster-layer-name="Brand Badge">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-2xl font-bold text-[#1E3A8A] tracking-wide">
            បច្ចេកវិទ្យា AI ជំនួយការរៀន
          </span>
        </div>
        <Image src="../KruMath_Horizontal.png" alt="KruMath Logo" className="h-16 w-auto object-contain shrink-0 drop-shadow-sm" />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 my-auto flex flex-col gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-[#2563EB]/10 text-[#2563EB] text-2xl font-bold px-5 py-2.5 rounded-2xl border border-[#2563EB]/20" data-poster-layer="text" data-poster-layer-name="Tag Line">
            <span>📐</span> KruMath Interactive — សប្បាយរៀន | ងាយយល់
          </div>

          <h1 className="text-[74px] font-black leading-[1.2] tracking-tight text-[#0F172A]" data-poster-layer="text" data-poster-layer-name="Headline">
            រៀននៅសាលា <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#0284C7] to-[#0EA5E9]">
              អ​នុវត្តនៅលើ KruMath
            </span>
          </h1>

          <p className="text-[26px] text-[#475569] font-medium max-w-3xl leading-relaxed" data-poster-layer="text" data-poster-layer-name="Description">
            មិនបាច់ហត់រកសៀវភៅលំហាត់ច្រើននាំតែវិលមុខទេ! នៅលើគេហទំព័រ KruMath មានគ្រប់ទាំងអស់ចាប់ពីថ្នាក់ទី ៧ ដល់ទី ១២។
          </p>
        </div>

        {/* 5 Feature Points Grid */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {features.map((item, idx) => (
            <div
              key={idx}
              data-poster-layer="text"
              data-poster-layer-name={\`Feature \${idx + 1}\`}
              className={\`flex items-center gap-4 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-blue-100 shadow-sm shadow-blue-950/5 \${
                item.fullWidth ? "col-span-2" : ""
              }\`}
            >
              {/* Enlarged Icon Badge */}
              <span className="flex items-center justify-center min-w-[58px] h-[58px] rounded-2xl bg-blue-50 text-[#2563EB] text-[34px] font-bold shrink-0">
                {item.icon}
              </span>

              {/* Text: Enlarged specifically for the full-width item */}
              <span
                className={\`font-bold text-[#1E293B] leading-snug \${
                  item.fullWidth ? "text-[27px]" : "text-[23px]"
                }\`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="relative z-10 bg-white rounded-3xl p-6 border border-blue-100 shadow-xl shadow-blue-500/10 flex items-center justify-between">
        <div className="pl-4" data-poster-layer="text" data-poster-layer-name="Website URL">
          <p className="text-lg uppercase tracking-wider font-bold text-[#64748B]">
            បង្កើតគណនីដោយឥតគិតថ្លៃ
          </p>
          <p className="text-4xl font-black text-[#2563EB] tracking-tight">
            www.KruMath.com
          </p>
        </div>

        <div className="bg-[#2563EB] hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-[26px] shadow-lg shadow-blue-600/30 flex items-center gap-4 cursor-pointer transition-colors" data-poster-layer="text" data-poster-layer-name="CTA Button">
          <span>ចុះឈ្មោះចូលរៀនឥឡូវនេះ</span>
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.8}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </footer>
    </Poster>
  );
}
`;

export const TEMPLATES: PosterTemplate[] = [
  {
    id: "katex-math-lab",
    name: "KaTeX Math Lab",
    category: "Education",
    description: "Showcase inline/display math, matrices, aligned equations, and chemistry.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Text, Math, BlockMath, Stack } from "@poster/core";

export default function App() {
  return (
    <Poster background="#0f172a" color="#e2e8f0" className="p-16 box-border">
      <Stack gap={28} className="h-full justify-between">
        <div>
          <Text size={28} color="#38bdf8" className="tracking-[0.2em] uppercase">
            Poster Studio · KaTeX
          </Text>
          <Text size={72} weight={700} className="mt-4">
            Math that renders
          </Text>
          <Text size={36} color="#94a3b8" className="mt-3">
            {"Inline in Text: $e^{i\\\\pi}+1=0$ · also \\\\(\\\\frac{a}{b}\\\\)"}
          </Text>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-10">
          <Text size={32} weight={600} className="mb-6 text-sky-300">
            Display and matrix
          </Text>
          <BlockMath
            color="#f8fafc"
            tex={String.raw\`\\sum_{n=1}^{N} n = \\frac{N(N+1)}{2}\`}
          />
          <div className="mt-8">
            <BlockMath
              color="#f8fafc"
              tex={String.raw\`\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}\`}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-10">
          <Text size={32} weight={600} className="mb-6 text-emerald-300">
            Aligned and chemistry
          </Text>
          <BlockMath
            color="#f8fafc"
            tex={String.raw\`\\begin{aligned} a &= b + c \\\\ x^2 &= \\sqrt{y} \\end{aligned}\`}
          />
          <div className="mt-8 flex items-center gap-4">
            <Text size={36}>Reaction:</Text>
            <Math tex={String.raw\`\\ce{CO2 + H2O}\`} color="#f8fafc" />
          </div>
        </div>

        <Text size={28} color="#64748b">
          Prefer {"<Math />"} / {"<BlockMath />"} or $…$ inside {"<Text>"}. Lone $50 stays text.
        </Text>
      </Stack>
    </Poster>
  );
}
`,
  },
  {
    id: "phnom-penh-boulevards",
    name: "Phnom Penh Boulevards",
    category: "Education",
    description: "Six main boulevards guide for new students in Phnom Penh.",
    width: 1080,
    height: 1080,
    code: `export default function Poster() {
  const boulevards = [
    {
      num: "01",
      name: "មហាវិថី សហព័ន្ធរុស្ស៊ី",
      tag: "តំបន់សាកលវិទ្យាល័យធំៗ",
      badgeColor: "bg-sky-100 text-sky-950 border-sky-300",
      landmarks: ["RUPP (ភូមិន្ទ)", "ITC (តិចណូ)", "IFL (ភាសា)", "ព្រលានយន្តហោះចាស់"],
    },
    {
      num: "02",
      name: "មហាវិថី ព្រះមុនីវង្ស",
      tag: "សរសៃឈាមកណ្តាលក្រុង",
      badgeColor: "bg-blue-100 text-blue-950 border-blue-300",
      landmarks: ["ស្ថានីយរថភ្លើង", "ផ្សារធំថ្មី", "ពេទ្យកាល់ម៉ែត", "ស្ពានច្បារអំពៅ"],
    },
    {
      num: "03",
      name: "មហាវិថី ព្រះនរោត្តម",
      tag: "រដ្ឋបាល & ច្បាប់",
      badgeColor: "bg-indigo-100 text-indigo-950 border-indigo-300",
      landmarks: ["វិមានឯករាជ្យ", "សាលាច្បាប់ (RULE)", "ស្ពានក្បាលថ្នល់", "ក្រសួងអប់រំ"],
    },
    {
      num: "04",
      name: "មហាវិថី ម៉ៅសេទុង",
      tag: "ពាណិជ្ជកម្ម & សាលារៀន",
      badgeColor: "bg-cyan-100 text-cyan-950 border-cyan-300",
      landmarks: ["ផ្សារដើមគ", "ស្ថានទូតចិន", "ផ្សារបឹងកេងកង", "ស្ពានអាកាស ៧មករា"],
    },
    {
      num: "05",
      name: "មហាវិថី ព្រះស៊ីសុវត្ថិ",
      tag: "មាត់ទន្លេ & លំហែកាយ",
      badgeColor: "bg-teal-100 text-teal-950 border-teal-300",
      landmarks: ["មាត់ទន្លេបួនមុខ", "ព្រះបរមរាជវាំង", "ផ្សាររាត្រី", "សាលាវិចិត្រសិល្បៈ"],
    },
    {
      num: "06",
      name: "មហាវិថី សម្តេចហ៊ុនសែន",
      tag: "ផ្លូវ ៦០ ម៉ែត្រ",
      badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300",
      landmarks: ["ផ្សារទំនើប អ៊ីអន ៣", "ផ្លូវ ២៧១", "ច្រកចេញក្រវាត់ក្រុង", "តំបន់ពង្រីកក្រុង"],
    },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-sky-100 text-slate-900 font-sans flex flex-col justify-between p-7 select-none">

      {/* Background Glows */}
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-cyan-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <header className="relative z-10 shrink-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-600/10 border-2 border-sky-400/50 text-sky-950 text-base font-bold mb-1">
          <span className="text-lg">🎓</span>
          <span className="text-[20px]">សម្រាប់និស្សិតថ្មីមកពីខេត្ត</span>
        </div>

        <h1 className="text-[52px] font-black text-slate-950 tracking-tight leading-tight">
          ផ្លូវសំខាន់ៗនៅទីក្រុងភ្នំពេញ
        </h1>

        <p className="text-xl font-bold text-sky-900 mt-0.5 text-right">
          ស្គាល់ ៦ មហាវិថីស្នូល ធ្វើដំណើរទៅរៀនមិនបារម្ភរឿងវង្វេងផ្លូវ
        </p>
      </header>

      {/* Main 6 Boulevards Grid */}
      <main className="relative z-10 flex-1 grid grid-cols-2 grid-rows-3 gap-3.5 my-2.5">
        {boulevards.map((item) => (
          <div
            key={item.num}
            className="h-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 px-5 border-2 border-sky-200/90 shadow-[0_4px_16px_rgba(2,132,199,0.06)] flex flex-col justify-start gap-2.5"
          >

            {/* Top Area: Number & Street Name */}
            <div className="flex items-center gap-3">
              <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-sky-600 text-white font-mono font-black text-2xl shadow-sm">
                {item.num}
              </span>

              <h2 className="text-[32px] font-black text-slate-950 leading-tight tracking-tight truncate">
                {item.name}
              </h2>
            </div>

            {/* Tag */}
            <div>
              <span
                className={\`inline-block text-base font-semibold px-2.5 py-1 rounded-md border \${item.badgeColor}\`}
              >
                {item.tag}
              </span>
            </div>

            {/* Landmark Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              {item.landmarks.map((landmark, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-[20px] font-normal leading-tight px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 min-w-0"
                >
                  <span className="text-rose-500 text-base shrink-0">
                    📍
                  </span>

                  <span className="truncate">
                    {landmark}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Student Survival Tips Footer */}
      <footer className="relative z-10 shrink-0 bg-white backdrop-blur-md rounded-2xl border-2 border-sky-300 p-3.5 px-6 flex items-center justify-between shadow-sm">

        <div className="flex items-center gap-4">

          {/* Footer Icon */}
          <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-3xl shadow-sm">
            💡
          </div>

          <div>
            {/* Footer Heading */}
            <p className="text-lg font-bold text-sky-900 uppercase tracking-wide">
              គន្លឹះចាំផ្លូវងាយៗនៅភ្នំពេញ
            </p>

            {/* Footer Main Text */}
            <p className="text-[22px] font-normal text-slate-800 leading-snug">
              • ផ្លូវលេខ{" "}
              <span className="text-sky-700 font-bold underline underline-offset-4">
                សេស
              </span>{" "}
              (កើត ⇄ លិច) | ផ្លូវលេខ{" "}
              <span className="text-sky-700 font-bold underline underline-offset-4">
                គូ
              </span>{" "}
              (ជើង ⇄ ត្បូង)
            </p>
          </div>
        </div>

        {/* Google Maps Button */}
        <div className="flex items-center gap-2 bg-sky-50 px-5 py-2.5 rounded-xl border-2 border-sky-300 text-xl font-bold text-sky-950">
          <span className="text-2xl">🛵</span>
          <span>បើក Google Maps</span>
        </div>

      </footer>
    </div>
  );
}
`,
  },
  {
    id: "minimal-event",
    name: "Minimal Event Poster",
    category: "Minimal",
    description: "Type-led event announcement with a rule and date block.",
    width: 1080,
    height: 1350,
    code: `export default function Poster() {
  return (
    <div className="w-full h-full bg-[#f5f2ec] text-neutral-900 flex flex-col p-24">
      <div className="text-[24px] tracking-[0.4em]">PHNOM PENH · 2026</div>
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-[150px] leading-[0.85] font-semibold">DESIGN<br />NIGHT</h1>
        <div className="mt-10 h-[3px] w-40 bg-neutral-900" />
        <p className="mt-10 text-[36px] max-w-[70%] text-neutral-600">
          A small evening about code, type and posters.
        </p>
      </div>
      <div className="flex justify-between text-[28px] tracking-wide">
        <span>MAR 14</span>
        <span>19:00</span>
        <span>FREE ENTRY</span>
      </div>
    </div>
  );
}
`,
  },
  {
    id: "corporate",
    name: "Corporate Announcement",
    category: "Corporate",
    description: "Split layout with brand bar and key message.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Stack, Text, Badge, Divider } from "@poster/core";

export default function App() {
  return (
    <Poster background="#0b1220" color="#f8fafc">
      <div className="h-6 w-full bg-sky-500" />
      <Stack gap={28} className="p-24 flex-1 justify-center">
        <Badge>ANNOUNCEMENT</Badge>
        <Text size={92} weight={700} lineHeight={1}>
          New Regional Office in Phnom Penh
        </Text>
        <Divider color="#1e293b" />
        <Text size={34} color="#94a3b8">
          Effective 1 April 2026, our operations team moves to a new
          headquarters on Norodom Boulevard.
        </Text>
      </Stack>
      <div className="px-24 pb-20 text-[26px] tracking-[0.3em] text-slate-500">
        ACME GROUP
      </div>
    </Poster>
  );
}
`,
  },
  {
    id: "social",
    name: "Social Media Post",
    category: "Social",
    description: "Square post with big statement type.",
    width: 1080,
    height: 1080,
    code: `export default function Poster() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-800 text-white">
      <div className="text-center px-20">
        <div className="text-[28px] tracking-[0.4em] opacity-80">TIP 07</div>
        <h1 className="mt-8 text-[110px] leading-[0.95] font-bold">
          Write code.<br />Get posters.
        </h1>
        <p className="mt-10 text-[36px] opacity-85">poster-studio.dev</p>
      </div>
    </div>
  );
}
`,
  },
  {
    id: "infographic",
    name: "Business Infographic",
    category: "Infographic",
    description: "Metric grid with progress bars.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Grid, Metric, Progress, Text } from "@poster/core";

export default function App() {
  return (
    <Poster background="#ffffff" color="#0f172a" className="p-20">
      <Text size={64} weight={700}>Q1 Overview</Text>
      <Text size={30} color="#64748b">Consolidated results, 2026</Text>
      <Grid columns={2} gap={20} className="mt-12">
        <Metric label="Revenue" value="$4.2M" delta="+12%" />
        <Metric label="Customers" value="18,420" delta="+8%" />
        <Metric label="Churn" value="1.8%" delta="-0.4%" />
        <Metric label="NPS" value="61" delta="+5" />
      </Grid>
      <div className="mt-14 space-y-8">
        <Progress label="Marketing" value={72} />
        <Progress label="Product" value={54} />
        <Progress label="Operations" value={88} />
      </div>
    </Poster>
  );
}
`,
  },
  {
    id: "dashboard",
    name: "Data Dashboard Poster",
    category: "Data",
    description: "Charts rendered from data arrays.",
    width: 1200,
    height: 1500,
    code: `import { Poster, BarChart, LineChart, PieChart, Text, Grid } from "@poster/core";

export default function App() {
  return (
    <Poster background="#0a0a0a" color="#fafafa" className="p-20">
      <Text size={58} weight={700}>Traffic Report</Text>
      <Text size={28} color="#a1a1aa">January – June 2026</Text>

      <div className="mt-12">
        <BarChart
          data={[40, 65, 30, 80, 55, 92]}
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          height={340}
          color="#f59e0b"
        />
      </div>

      <Grid columns={2} gap={24} className="mt-14">
        <LineChart data={[10, 32, 24, 48, 40, 70]} height={280} color="#38bdf8" />
        <PieChart
          data={[
            { label: "Mobile", value: 58, color: "#f472b6" },
            { label: "Desktop", value: 32, color: "#38bdf8" },
            { label: "Other", value: 10, color: "#a3e635" },
          ]}
          size={280}
        />
      </Grid>
    </Poster>
  );
}
`,
  },
  {
    id: "quote",
    name: "Quote Poster",
    category: "Minimal",
    description: "Serif quote with attribution.",
    width: 1080,
    height: 1350,
    code: `export default function Poster() {
  return (
    <div className="w-full h-full bg-[#111214] text-[#f4f1ea] flex flex-col justify-center p-24">
      <div className="text-[160px] leading-none text-amber-500">&ldquo;</div>
      <p className="text-[62px] leading-[1.2] font-light">
        Simplicity is not the absence of detail, it is the absence of noise.
      </p>
      <div className="mt-14 text-[30px] tracking-[0.3em] text-neutral-500">
        — UNKNOWN DESIGNER
      </div>
    </div>
  );
}
`,
  },
  {
    id: "product",
    name: "Product Promotion",
    category: "Commerce",
    description: "Offer poster with price badge.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Circle, Text, Stack, Button } from "@poster/core";

export default function App() {
  return (
    <Poster background="#fef3c7" color="#1c1917">
      <Stack gap={24} className="p-24 flex-1 justify-center">
        <Text size={30} weight={600} className="tracking-[0.4em]">LIMITED DROP</Text>
        <Text size={128} weight={800} lineHeight={0.9}>Studio Mug</Text>
        <Text size={36} color="#78716c">Ceramic, 350ml, matte glaze.</Text>
        <Button>Order now</Button>
      </Stack>
      <div className="absolute right-20 top-20">
        <Circle size={260} color="#1c1917">
          <span className="text-[70px] font-bold text-amber-300">$19</span>
        </Circle>
      </div>
    </Poster>
  );
}
`,
  },
  {
    id: "education",
    name: "Educational Poster",
    category: "Education",
    description: "Numbered steps for classroom use.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Text, Stack } from "@poster/core";

const steps = [
  ["1", "Read the problem twice"],
  ["2", "Write what you know"],
  ["3", "Choose a strategy"],
  ["4", "Solve step by step"],
  ["5", "Check your answer"],
];

export default function App() {
  return (
    <Poster background="#f8fafc" color="#0f172a" className="p-20">
      <Text size={70} weight={800}>Problem Solving</Text>
      <Text size={30} color="#475569">Five steps for every maths question</Text>
      <Stack gap={18} className="mt-14">
        {steps.map(([n, text]) => (
          <div key={n} className="flex items-center gap-8 rounded-md bg-white p-8 shadow-sm">
            <span className="flex h-24 w-24 items-center justify-center rounded-md bg-indigo-600 text-[44px] font-bold text-white">
              {n}
            </span>
            <span className="text-[40px]">{text}</span>
          </div>
        ))}
      </Stack>
    </Poster>
  );
}
`,
  },
  {
    id: "financial",
    name: "Financial Report",
    category: "Data",
    description: "Table-driven summary sheet.",
    width: 2480,
    height: 3508,
    code: `import { Poster, Table, Text, Divider } from "@poster/core";

export default function App() {
  return (
    <Poster background="#ffffff" color="#111827" className="p-40">
      <Text size={120} weight={700}>Annual Report</Text>
      <Text size={56} color="#6b7280">Fiscal year 2026</Text>
      <Divider className="my-20" />
      <Table
        fontSize={52}
        columns={["Segment", "Revenue", "Growth"]}
        rows={[
          ["Education", "$1.8M", "+18%"],
          ["Publishing", "$0.9M", "+6%"],
          ["Services", "$1.5M", "+11%"],
          ["Total", "$4.2M", "+12%"],
        ]}
      />
    </Poster>
  );
}
`,
  },
  {
    id: "cambodia",
    name: "Cambodia Themed",
    category: "Featured",
    description: "Angkor-inspired dark poster with shapes.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Shape, Text, Divider } from "@poster/core";

export default function App() {
  return (
    <Poster background="#0d0b07" color="#f7f3e8">
      <Shape width={1080} height={520} color="#8f2d1f" className="absolute -top-40 -right-40 rotate-12 opacity-70" />
      <div className="relative z-10 flex h-full flex-col justify-end p-24">
        <Text size={26} className="tracking-[0.5em] text-amber-400">KINGDOM OF WONDER</Text>
        <Text size={170} weight={800} lineHeight={0.85}>KHMER<br />2026</Text>
        <Divider color="#3a3226" className="my-12" />
        <Text size={36} color="#a8a093">
          Culture · Technology · Education
        </Text>
      </div>
    </Poster>
  );
}
`,
  },
];
