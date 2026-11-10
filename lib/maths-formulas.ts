/**
 * Formula & trick bank for the SSC CGL quantitative aptitude syllabus.
 *
 * Text fields use the same markdown-lite + LaTeX ($...$, $$...$$) format as
 * the PYQ bank and are rendered by `features/pyq/RichText`. Avoid a bare `*`
 * outside LaTeX (it means italics) and use ₹ for money (a `$` starts LaTeX).
 *
 * Every example has been worked through by hand; keep it that way when adding
 * entries. Later this list can come from the database in the same shape.
 */

export type FormulaCategory =
  | "arithmetic"
  | "number"
  | "algebra"
  | "geometry"
  | "mensuration"
  | "trigonometry"
  | "statistics";

export type FormulaKind = "formula" | "trick";

export interface FormulaTopic {
  /** Also the URL hash, e.g. /SSC/maths/formula-practice#percentage */
  id: string;
  name: string;
  category: FormulaCategory;
}

export interface FormulaEntry {
  id: string;
  topic: string;
  kind: FormulaKind;
  title: string;
  /** The formula itself (one or more lines). */
  body: string;
  /** When / why it applies. */
  note?: string;
  example?: string;
}

export const FORMULA_CATEGORIES: { id: FormulaCategory; label: string }[] = [
  { id: "arithmetic", label: "Arithmetic" },
  { id: "number", label: "Number System" },
  { id: "algebra", label: "Algebra" },
  { id: "geometry", label: "Geometry" },
  { id: "mensuration", label: "Mensuration" },
  { id: "trigonometry", label: "Trigonometry" },
  { id: "statistics", label: "Statistics & DI" },
];

export const FORMULA_TOPICS: FormulaTopic[] = [
  { id: "number-system", name: "Number System", category: "number" },
  { id: "surds-indices", name: "Surds, Indices & Simplification", category: "number" },
  { id: "percentage", name: "Percentage", category: "arithmetic" },
  { id: "profit-loss", name: "Profit, Loss & Discount", category: "arithmetic" },
  { id: "ratio", name: "Ratio, Partnership & Mixtures", category: "arithmetic" },
  { id: "averages", name: "Averages", category: "arithmetic" },
  { id: "interest", name: "Simple & Compound Interest", category: "arithmetic" },
  { id: "time-work", name: "Time & Work, Pipes & Cisterns", category: "arithmetic" },
  { id: "speed", name: "Time, Speed & Distance", category: "arithmetic" },
  { id: "algebra-identities", name: "Algebraic Identities", category: "algebra" },
  { id: "equations", name: "Equations", category: "algebra" },
  { id: "triangles", name: "Triangles", category: "geometry" },
  { id: "circles", name: "Circles", category: "geometry" },
  { id: "polygons", name: "Quadrilaterals & Polygons", category: "geometry" },
  { id: "mensuration-2d", name: "Mensuration 2D", category: "mensuration" },
  { id: "mensuration-3d", name: "Mensuration 3D", category: "mensuration" },
  { id: "trig-identities", name: "Trigonometric Ratios & Identities", category: "trigonometry" },
  { id: "trig-values", name: "Maximum, Minimum & Values", category: "trigonometry" },
  { id: "heights-distances", name: "Heights & Distances", category: "trigonometry" },
  { id: "statistics", name: "Statistics", category: "statistics" },
  { id: "data-interpretation", name: "Data Interpretation", category: "statistics" },
  { id: "probability", name: "Probability", category: "statistics" },
];

const t = String.raw;

export const FORMULAS: FormulaEntry[] = [
  /* ───────────── Number System ───────────── */
  {
    id: "ns-divisibility",
    topic: "number-system",
    kind: "trick",
    title: "Divisibility rules",
    body: t`- $3$ and $9$: sum of digits divisible by $3$ / $9$
- $4$: last two digits divisible by $4$; $8$: last three digits divisible by $8$
- $11$: (sum of digits in odd places) $-$ (sum in even places) is $0$ or a multiple of $11$`,
    note: "For 6, 12, 15, 18... test the co-prime factors separately (12 = 3 × 4).",
    example: t`$918082$: $(9+8+8) - (1+0+2) = 22$, a multiple of $11$, so $918082$ is divisible by $11$.`,
  },
  {
    id: "ns-hcf-lcm",
    topic: "number-system",
    kind: "formula",
    title: "HCF and LCM",
    body: t`$$\text{HCF} \times \text{LCM} = a \times b$$
- The product rule holds for two numbers only
- HCF of fractions $= \dfrac{\text{HCF of numerators}}{\text{LCM of denominators}}$
- LCM of fractions $= \dfrac{\text{LCM of numerators}}{\text{HCF of denominators}}$`,
    example: t`HCF of $\tfrac{2}{3}$ and $\tfrac{4}{9}$ $= \tfrac{\text{HCF}(2,4)}{\text{LCM}(3,9)} = \tfrac{2}{9}$.`,
  },
  {
    id: "ns-factors",
    topic: "number-system",
    kind: "formula",
    title: "Number and sum of factors",
    body: t`If $N = p^a \, q^b \, r^c$ (prime factorisation):
- Number of factors $= (a+1)(b+1)(c+1)$
- Sum of factors $= \dfrac{p^{a+1}-1}{p-1} \cdot \dfrac{q^{b+1}-1}{q-1} \cdot \dfrac{r^{c+1}-1}{r-1}$`,
    example: t`$72 = 2^3 \cdot 3^2$ has $(3+1)(2+1) = 12$ factors.`,
  },
  {
    id: "ns-unit-digit",
    topic: "number-system",
    kind: "trick",
    title: "Unit digit by cyclicity",
    body: t`- Digits $2, 3, 7, 8$ repeat every $4$ powers; $4$ and $9$ every $2$; $0, 1, 5, 6$ never change.
- Divide the power by $4$ and use the remainder (remainder $0$ means use power $4$).`,
    example: t`Unit digit of $7^{95}$: $95 \div 4$ leaves $3$, and $7^3 = 343$, so the answer is $3$.`,
  },
  {
    id: "ns-series",
    topic: "number-system",
    kind: "formula",
    title: "Sum of first n natural numbers, squares, cubes",
    body: t`$$\sum n = \frac{n(n+1)}{2}$$
$$\sum n^2 = \frac{n(n+1)(2n+1)}{6}$$
$$\sum n^3 = \left[\frac{n(n+1)}{2}\right]^2$$
- Sum of first $n$ odd numbers $= n^2$; first $n$ even numbers $= n(n+1)$`,
    example: t`$1^2 + 2^2 + \dots + 10^2 = \tfrac{10 \cdot 11 \cdot 21}{6} = 385$.`,
  },
  {
    id: "ns-remainder",
    topic: "number-system",
    kind: "trick",
    title: "Remainders of large powers",
    body: t`- $(a+1)^n \div a$ always leaves remainder $1$
- $(a-1)^n \div a$ leaves $1$ if $n$ is even and $a-1$ if $n$ is odd
- Remainder of a product $=$ product of the individual remainders (then reduce again)`,
    example: t`$2^{100} \div 3$: $2 = 3 - 1$ and $100$ is even, so the remainder is $1$.`,
  },
  {
    id: "ns-trailing-zeros",
    topic: "number-system",
    kind: "trick",
    title: "Trailing zeros in n!",
    body: t`$$\left\lfloor \tfrac{n}{5} \right\rfloor + \left\lfloor \tfrac{n}{25} \right\rfloor + \left\lfloor \tfrac{n}{125} \right\rfloor + \cdots$$`,
    note: "Each zero needs a 2 × 5 pair and 5s are the scarcer factor.",
    example: t`$100!$ ends in $20 + 4 = 24$ zeros.`,
  },
  {
    id: "ns-recurring",
    topic: "number-system",
    kind: "formula",
    title: "Recurring decimal to fraction",
    body: t`- $0.\overline{ab} = \dfrac{ab}{99}$
- $0.a\overline{b} = \dfrac{ab - a}{90}$ (one $9$ per repeating digit, one $0$ per non-repeating digit)`,
    example: t`$0.3\overline{6} = \tfrac{36 - 3}{90} = \tfrac{33}{90} = \tfrac{11}{30}$.`,
  },

  /* ───────────── Surds, Indices & Simplification ───────────── */
  {
    id: "si-indices",
    topic: "surds-indices",
    kind: "formula",
    title: "Laws of indices",
    body: t`- $a^m \cdot a^n = a^{m+n}$, $\;\dfrac{a^m}{a^n} = a^{m-n}$, $\;(a^m)^n = a^{mn}$
- $a^0 = 1$, $\;a^{-n} = \dfrac{1}{a^n}$, $\;a^{m/n} = \sqrt[n]{a^m}$`,
    example: t`$8^{2/3} = (\sqrt[3]{8})^2 = 4$.`,
  },
  {
    id: "si-rationalise",
    topic: "surds-indices",
    kind: "formula",
    title: "Rationalising a surd",
    body: t`$$\frac{1}{\sqrt{a} + \sqrt{b}} = \frac{\sqrt{a} - \sqrt{b}}{a - b}$$`,
    note: "Multiply top and bottom by the conjugate.",
    example: t`$\tfrac{1}{\sqrt{3} + \sqrt{2}} = \sqrt{3} - \sqrt{2}$.`,
  },
  {
    id: "si-infinite-roots",
    topic: "surds-indices",
    kind: "trick",
    title: "Infinite nested roots",
    body: t`If $x = n(n+1)$:
- $\sqrt{x + \sqrt{x + \sqrt{x + \cdots}}} = n + 1$
- $\sqrt{x - \sqrt{x - \sqrt{x - \cdots}}} = n$
- $\sqrt{x\sqrt{x\sqrt{x \cdots}}} = x$`,
    example: t`$\sqrt{12 + \sqrt{12 + \cdots}} = 4$ because $12 = 3 \times 4$.`,
  },
  {
    id: "si-squares",
    topic: "surds-indices",
    kind: "trick",
    title: "Fast squares",
    body: t`- Ending in $5$: $(10n + 5)^2 = n(n+1)$ followed by $25$
- Near $100$: $(100 + a)^2 = (100 + 2a)$ followed by $a^2$ as two digits`,
    example: t`$85^2$: $8 \times 9 = 72$, so $7225$. $\;104^2$: $108$ then $16$, so $10816$.`,
  },

  /* ───────────── Percentage ───────────── */
  {
    id: "pc-successive",
    topic: "percentage",
    kind: "formula",
    title: "Successive percentage change",
    body: t`$$\text{Net change} = x + y + \frac{xy}{100}\ \%$$`,
    note: "Use a negative sign for a decrease.",
    example: t`$+20\%$ then $-10\%$: $20 - 10 - 2 = 8\%$ increase.`,
  },
  {
    id: "pc-more-less",
    topic: "percentage",
    kind: "formula",
    title: "x% more / x% less",
    body: t`- If A is $x\%$ more than B, B is $\dfrac{x}{100 + x} \times 100\%$ less than A
- If A is $x\%$ less than B, B is $\dfrac{x}{100 - x} \times 100\%$ more than A`,
    example: t`A is $25\%$ more than B, so B is $\tfrac{25}{125} = 20\%$ less than A.`,
  },
  {
    id: "pc-consumption",
    topic: "percentage",
    kind: "formula",
    title: "Price rises, keep spending the same",
    body: t`$$\text{Cut} = \frac{r}{100 + r} \times 100\%$$`,
    note: "For a price fall of r%, consumption can rise by r/(100 − r) × 100%.",
    example: t`Price up $25\%$: cut consumption by $\tfrac{25}{125} = 20\%$.`,
  },
  {
    id: "pc-population",
    topic: "percentage",
    kind: "formula",
    title: "Population growth and depreciation",
    body: t`$$P_n = P\left(1 \pm \frac{r}{100}\right)^n$$`,
    example: t`$10{,}000$ growing at $10\%$ for 2 years $= 10000 \times 1.21 = 12{,}100$.`,
  },
  {
    id: "pc-fractions",
    topic: "percentage",
    kind: "trick",
    title: "Fraction ↔ percentage table",
    body: t`- $\tfrac{1}{6} = 16.67\%$, $\;\tfrac{1}{7} = 14.28\%$, $\;\tfrac{1}{8} = 12.5\%$, $\;\tfrac{1}{9} = 11.11\%$
- $\tfrac{1}{11} = 9.09\%$, $\;\tfrac{1}{12} = 8.33\%$, $\;\tfrac{1}{15} = 6.67\%$, $\;\tfrac{1}{16} = 6.25\%$`,
    note: "Learn these and most percentage questions become fraction questions.",
    example: t`$12.5\%$ of $480$ is $\tfrac{480}{8} = 60$.`,
  },

  /* ───────────── Profit, Loss & Discount ───────────── */
  {
    id: "pl-basic",
    topic: "profit-loss",
    kind: "formula",
    title: "Profit and loss",
    body: t`- $\text{Profit}\% = \dfrac{SP - CP}{CP} \times 100$
- $SP = CP\left(1 + \dfrac{P\%}{100}\right)$, $\;CP = \dfrac{100 \times SP}{100 + P\%}$`,
    note: "Profit and loss percentages are always on cost price.",
    example: t`CP $₹400$, SP $₹500$: profit $= \tfrac{100}{400} = 25\%$.`,
  },
  {
    id: "pl-mp-cp",
    topic: "profit-loss",
    kind: "formula",
    title: "Marked price and cost price",
    body: t`$$\frac{MP}{CP} = \frac{100 + \text{Profit}\%}{100 - \text{Discount}\%}$$`,
    example: t`$20\%$ profit after a $10\%$ discount: $\tfrac{MP}{CP} = \tfrac{120}{90} = \tfrac{4}{3}$, so mark $33.33\%$ above CP.`,
  },
  {
    id: "pl-same-sp",
    topic: "profit-loss",
    kind: "trick",
    title: "Same SP, x% gain on one and x% loss on other",
    body: t`$$\text{Always a loss of } \frac{x^2}{100}\%$$`,
    example: t`Two items sold at the same price, one at $10\%$ gain and one at $10\%$ loss: net loss $1\%$.`,
  },
  {
    id: "pl-dishonest",
    topic: "profit-loss",
    kind: "formula",
    title: "Dishonest dealer (false weight)",
    body: t`$$\text{Gain}\% = \frac{E}{T - E} \times 100$$`,
    note: "E = error in weight, T = true weight.",
    example: t`Using $900\,\text{g}$ for $1\,\text{kg}$: $\tfrac{100}{900} \times 100 = 11.11\%$ gain.`,
  },
  {
    id: "pl-successive-discount",
    topic: "profit-loss",
    kind: "formula",
    title: "Successive discounts",
    body: t`$$D = x + y - \frac{xy}{100}\ \%$$`,
    note: "D = single equivalent discount. For three discounts, combine the first two, then combine the result with the third.",
    example: t`$20\%$ and $10\%$: $20 + 10 - 2 = 28\%$.`,
  },

  /* ───────────── Ratio, Partnership & Mixtures ───────────── */
  {
    id: "rt-proportional",
    topic: "ratio",
    kind: "formula",
    title: "Mean, third and fourth proportional",
    body: t`- Mean proportional of $a, b = \sqrt{ab}$
- Third proportional of $a, b = \dfrac{b^2}{a}$
- Fourth proportional of $a, b, c = \dfrac{bc}{a}$`,
    example: t`Mean proportional of $4$ and $9$ is $\sqrt{36} = 6$.`,
  },
  {
    id: "rt-partnership",
    topic: "ratio",
    kind: "formula",
    title: "Partnership",
    body: t`$$P_1 : P_2 = C_1 T_1 : C_2 T_2$$`,
    note: "P = profit share, C = capital, T = time invested. Extends to any number of partners.",
    example: t`$₹5000$ for 12 months and $₹6000$ for 8 months: $60000 : 48000 = 5 : 4$.`,
  },
  {
    id: "rt-alligation",
    topic: "ratio",
    kind: "trick",
    title: "Alligation",
    body: t`$$\frac{\text{Cheaper quantity}}{\text{Dearer quantity}} = \frac{d - m}{m - c}$$`,
    note: "c = cheaper price, d = dearer price, m = mean price. Works for any weighted average (speeds, percentages, marks).",
    example: t`Mix $₹15$/kg and $₹20$/kg rice to get $₹18$/kg: $\tfrac{20 - 18}{18 - 15} = 2 : 3$.`,
  },
  {
    id: "rt-replacement",
    topic: "ratio",
    kind: "formula",
    title: "Repeated replacement",
    body: t`$$\text{Pure liquid left} = x\left(1 - \frac{y}{x}\right)^n$$`,
    note: "x = total quantity, y = quantity drawn out and replaced each time, n = number of times.",
    example: t`$40\,\text{L}$ milk, $4\,\text{L}$ replaced with water twice: $40 \times 0.9^2 = 32.4\,\text{L}$ milk.`,
  },

  /* ───────────── Averages ───────────── */
  {
    id: "av-basic",
    topic: "averages",
    kind: "formula",
    title: "Average basics",
    body: t`- Average $= \dfrac{\text{Sum of observations}}{\text{Number of observations}}$
- Average of first $n$ natural numbers $= \dfrac{n+1}{2}$
- Average of consecutive numbers $=$ the middle term (or mean of the two middle terms)`,
    example: t`Average of $11, 12, \dots, 19$ is $15$.`,
  },
  {
    id: "av-replace",
    topic: "averages",
    kind: "trick",
    title: "One member replaced",
    body: t`$$\text{New} = \text{Old} \pm n \times \Delta$$`,
    note: "n = number of members, Δ = change in the average (+ if it rose).",
    example: t`Average of 8 people rises by $2$ kg when a $50$ kg man is replaced: newcomer $= 50 + 8 \times 2 = 66$ kg.`,
  },
  {
    id: "av-combined",
    topic: "averages",
    kind: "formula",
    title: "Combined average",
    body: t`$$\bar{x} = \frac{n_1 a_1 + n_2 a_2}{n_1 + n_2}$$`,
    example: t`30 students average $60$, 20 average $70$: $\tfrac{1800 + 1400}{50} = 64$.`,
  },

  /* ───────────── Simple & Compound Interest ───────────── */
  {
    id: "in-si",
    topic: "interest",
    kind: "formula",
    title: "Simple interest",
    body: t`$$SI = \frac{P \times R \times T}{100}$$
$$A = P + SI$$`,
    note: "A sum doubles at simple interest in 100 / R years.",
    example: t`$₹2000$ at $5\%$ for 3 years: $SI = ₹300$.`,
  },
  {
    id: "in-ci",
    topic: "interest",
    kind: "formula",
    title: "Compound interest",
    body: t`$$A = P\left(1 + \frac{R}{100}\right)^T$$
$$CI = A - P$$
- Half-yearly: use $\tfrac{R}{2}$ and $2T$; quarterly: $\tfrac{R}{4}$ and $4T$`,
    example: t`$₹10{,}000$ at $10\%$ for 2 years: $A = ₹12{,}100$, $CI = ₹2100$.`,
  },
  {
    id: "in-diff",
    topic: "interest",
    kind: "trick",
    title: "CI − SI difference",
    body: t`- 2 years: $P\left(\dfrac{R}{100}\right)^2$
- 3 years: $P\left(\dfrac{R}{100}\right)^2\left(3 + \dfrac{R}{100}\right)$`,
    example: t`$₹10{,}000$ at $10\%$ for 2 years: $10000 \times 0.01 = ₹100$.`,
  },
  {
    id: "in-effective",
    topic: "interest",
    kind: "trick",
    title: "Effective rate for 2 years at CI",
    body: t`$$2R + \frac{R^2}{100}\ \%$$`,
    example: t`$10\%$ CI for 2 years equals $21\%$ in total.`,
  },
  {
    id: "in-multiple",
    topic: "interest",
    kind: "trick",
    title: "Sum becomes x times",
    body: t`At compound interest, if a sum becomes $x$ times in $n$ years, it becomes $x^k$ times in $nk$ years.`,
    example: t`Doubles in 4 years, so it becomes $2^3 = 8$ times in 12 years.`,
  },

  /* ───────────── Time & Work, Pipes ───────────── */
  {
    id: "tw-together",
    topic: "time-work",
    kind: "formula",
    title: "Two people working together",
    body: t`$$\text{Time together} = \frac{ab}{a + b}$$`,
    note: "a and b are the days each needs alone.",
    example: t`A in 10 days, B in 15 days: $\tfrac{150}{25} = 6$ days.`,
  },
  {
    id: "tw-lcm",
    topic: "time-work",
    kind: "trick",
    title: "LCM (total work) method",
    body: t`Take total work $=$ LCM of the days; each person's efficiency $= \dfrac{\text{total work}}{\text{their days}}$.`,
    example: t`A 12 days, B 18 days: work $= 36$, efficiencies $3$ and $2$, together $\tfrac{36}{5} = 7.2$ days.`,
  },
  {
    id: "tw-mdh",
    topic: "time-work",
    kind: "formula",
    title: "Men, days, hours",
    body: t`$$\frac{M_1 D_1 H_1}{W_1} = \frac{M_2 D_2 H_2}{W_2}$$`,
    example: t`12 men finish in 15 days, so 20 men take $\tfrac{12 \times 15}{20} = 9$ days.`,
  },
  {
    id: "tw-pipes",
    topic: "time-work",
    kind: "formula",
    title: "Filling and emptying pipes",
    body: t`$$\text{Net time} = \frac{ab}{b - a}$$`,
    note: "Pipe fills in a hours, leak empties in b hours (b > a).",
    example: t`Fill in 6 h, leak empties in 10 h: $\tfrac{60}{4} = 15$ h.`,
  },

  /* ───────────── Time, Speed & Distance ───────────── */
  {
    id: "sd-units",
    topic: "speed",
    kind: "trick",
    title: "Unit conversion",
    body: t`$$1\ \text{km/h} = \frac{5}{18}\ \text{m/s}$$
$$1\ \text{m/s} = \frac{18}{5}\ \text{km/h}$$`,
    example: t`$72$ km/h $= 72 \times \tfrac{5}{18} = 20$ m/s.`,
  },
  {
    id: "sd-average",
    topic: "speed",
    kind: "formula",
    title: "Average speed over equal distances",
    body: t`$$\text{Average speed} = \frac{2xy}{x + y}$$`,
    note: "Only for equal distances. For equal times it is simply (x + y) / 2.",
    example: t`Go at $40$ km/h, return at $60$ km/h: $\tfrac{4800}{100} = 48$ km/h.`,
  },
  {
    id: "sd-trains",
    topic: "speed",
    kind: "formula",
    title: "Trains",
    body: t`- Crossing a pole or man: $t = \dfrac{L}{s}$; a platform or bridge: $t = \dfrac{L + P}{s}$
- Two trains: $t = \dfrac{L_1 + L_2}{s_1 + s_2}$ (opposite) or $\dfrac{L_1 + L_2}{s_1 - s_2}$ (same direction)`,
    example: t`A $120$ m train at $54$ km/h ($15$ m/s) passes a pole in $8$ s.`,
  },
  {
    id: "sd-boats",
    topic: "speed",
    kind: "formula",
    title: "Boats and streams",
    body: t`$$u = \frac{D + U}{2}$$
$$v = \frac{D - U}{2}$$`,
    note: "u = boat in still water, v = stream, D = downstream (u + v), U = upstream (u − v).",
    example: t`Downstream $14$, upstream $8$: boat $= 11$ km/h, stream $= 3$ km/h.`,
  },
  {
    id: "sd-meeting",
    topic: "speed",
    kind: "trick",
    title: "After meeting, times a and b to finish",
    body: t`$$\frac{S_1}{S_2} = \sqrt{\frac{b}{a}}$$`,
    note: "Two people start towards each other; after meeting, the first takes a hours and the second b hours to reach their destinations.",
    example: t`$a = 9$ h, $b = 16$ h: $S_1 : S_2 = 4 : 3$.`,
  },
  {
    id: "sd-late-early",
    topic: "speed",
    kind: "trick",
    title: "Late at one speed, early at another",
    body: t`$$D = \frac{S_1 S_2}{S_2 - S_1} \times \Delta t$$`,
    note: "Δt = total time difference (late + early), in hours.",
    example: t`At $4$ km/h late by $10$ min, at $5$ km/h early by $5$ min: $D = 20 \times \tfrac{15}{60} = 5$ km.`,
  },

  /* ───────────── Algebraic Identities ───────────── */
  {
    id: "al-squares",
    topic: "algebra-identities",
    kind: "formula",
    title: "Square identities",
    body: t`- $(a \pm b)^2 = a^2 \pm 2ab + b^2$
- $a^2 - b^2 = (a + b)(a - b)$
- $(a + b)^2 - (a - b)^2 = 4ab$, $\;(a + b)^2 + (a - b)^2 = 2(a^2 + b^2)$
- $(a + b + c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ca)$`,
    example: t`$101 \times 99 = 100^2 - 1^2 = 9999$.`,
  },
  {
    id: "al-cubes",
    topic: "algebra-identities",
    kind: "formula",
    title: "Cube identities",
    body: t`- $(a \pm b)^3 = a^3 \pm b^3 \pm 3ab(a \pm b)$
- $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$
- $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$`,
    example: t`If $a + b = 5$ and $ab = 6$, then $a^3 + b^3 = 125 - 90 = 35$.`,
  },
  {
    id: "al-abc",
    topic: "algebra-identities",
    kind: "formula",
    title: "a³ + b³ + c³ − 3abc",
    body: t`$a^3 + b^3 + c^3 - 3abc$ $= (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ca)$
- If $a + b + c = 0$, then $a^3 + b^3 + c^3 = 3abc$`,
    example: t`$a = 25, b = -15, c = -10$ sum to $0$, so $a^3 + b^3 + c^3 = 3(25)(-15)(-10) = 11{,}250$.`,
  },
  {
    id: "al-half-sum",
    topic: "algebra-identities",
    kind: "formula",
    title: "a² + b² + c² − ab − bc − ca",
    body: t`$a^2 + b^2 + c^2 - ab - bc - ca$ $= \tfrac{1}{2}[(a - b)^2 + (b - c)^2 + (c - a)^2]$`,
    note: "If this is 0 then a = b = c.",
    example: t`$a - b = 3$, $b - c = 2$ so $c - a = -5$: value $= \tfrac{1}{2}(9 + 4 + 25) = 19$.`,
  },
  {
    id: "al-reciprocal",
    topic: "algebra-identities",
    kind: "formula",
    title: "If x + 1/x = k",
    body: t`- $x^2 + \dfrac{1}{x^2} = k^2 - 2$
- $x^3 + \dfrac{1}{x^3} = k^3 - 3k$
- $x^4 + \dfrac{1}{x^4} = (k^2 - 2)^2 - 2$
- If $x - \dfrac{1}{x} = k$: $x^2 + \dfrac{1}{x^2} = k^2 + 2$, $\;x^3 - \dfrac{1}{x^3} = k^3 + 3k$`,
    example: t`$x + \tfrac{1}{x} = 4$: $x^2 + \tfrac{1}{x^2} = 14$, $x^3 + \tfrac{1}{x^3} = 52$, $x^4 + \tfrac{1}{x^4} = 194$.`,
  },
  {
    id: "al-special",
    topic: "algebra-identities",
    kind: "trick",
    title: "Special values of x + 1/x",
    body: t`- $x + \tfrac{1}{x} = 2 \Rightarrow x = 1$; $\;x + \tfrac{1}{x} = -2 \Rightarrow x = -1$
- $x + \tfrac{1}{x} = 1 \Rightarrow x^3 = -1$; $\;x + \tfrac{1}{x} = -1 \Rightarrow x^3 = 1$
- $x + \tfrac{1}{x} = \sqrt{3} \Rightarrow x^6 = -1$`,
    example: t`If $x + \tfrac{1}{x} = 1$, then $x^{51} = (x^3)^{17} = -1$.`,
  },
  {
    id: "al-put-values",
    topic: "algebra-identities",
    kind: "trick",
    title: "Put values",
    body: t`When a condition is symmetric, pick simple numbers that satisfy it and evaluate the options.`,
    note: "Check the condition still holds, and avoid values that make a denominator zero.",
    example: t`Given $a + b + c = 0$, take $a = 1, b = 1, c = -2$ and test each option.`,
  },

  /* ───────────── Equations ───────────── */
  {
    id: "eq-quadratic",
    topic: "equations",
    kind: "formula",
    title: "Quadratic equation",
    body: t`$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
- Sum of roots $= -\tfrac{b}{a}$, product $= \tfrac{c}{a}$
- $D = b^2 - 4ac$: $D > 0$ real and distinct, $D = 0$ equal, $D < 0$ no real roots`,
    example: t`$x^2 - 5x + 6 = 0$: sum $5$, product $6$, roots $2$ and $3$.`,
  },
  {
    id: "eq-linear",
    topic: "equations",
    kind: "formula",
    title: "Pair of linear equations",
    body: t`For $a_1x + b_1y = c_1$ and $a_2x + b_2y = c_2$:
- $\tfrac{a_1}{a_2} \ne \tfrac{b_1}{b_2}$: one solution
- $\tfrac{a_1}{a_2} = \tfrac{b_1}{b_2} = \tfrac{c_1}{c_2}$: infinitely many
- $\tfrac{a_1}{a_2} = \tfrac{b_1}{b_2} \ne \tfrac{c_1}{c_2}$: no solution`,
    example: t`$2x + 3y = 5$, $4x + 6y = 9$: $\tfrac{2}{4} = \tfrac{3}{6} \ne \tfrac{5}{9}$, so no solution.`,
  },

  /* ───────────── Triangles ───────────── */
  {
    id: "tr-basics",
    topic: "triangles",
    kind: "formula",
    title: "Triangle basics",
    body: t`- Sum of angles $= 180^\circ$; exterior angle $=$ sum of the two opposite interior angles
- Any two sides sum to more than the third: $|a - b| < c < a + b$`,
    example: t`Sides $4$ and $7$: the third side is between $3$ and $11$.`,
  },
  {
    id: "tr-triplets",
    topic: "triangles",
    kind: "trick",
    title: "Pythagorean triplets",
    body: t`$(3, 4, 5)$, $(5, 12, 13)$, $(8, 15, 17)$, $(7, 24, 25)$, $(9, 40, 41)$, $(20, 21, 29)$, $(12, 35, 37)$`,
    note: "Multiples work too: (6, 8, 10), (9, 12, 15).",
    example: t`Legs $16$ and $30$: double of $(8, 15, 17)$, so hypotenuse $34$.`,
  },
  {
    id: "tr-centres",
    topic: "triangles",
    kind: "formula",
    title: "Centres of a triangle",
    body: t`- Incentre I: $\angle BIC = 90^\circ + \tfrac{A}{2}$
- Circumcentre O: $\angle BOC = 2A$ (acute triangle)
- Orthocentre H: $\angle BHC = 180^\circ - A$
- Centroid G divides each median $2 : 1$ from the vertex`,
    example: t`$\angle A = 70^\circ$: $\angle BIC = 125^\circ$, $\angle BOC = 140^\circ$, $\angle BHC = 110^\circ$.`,
  },
  {
    id: "tr-equilateral",
    topic: "triangles",
    kind: "formula",
    title: "Equilateral triangle (side a)",
    body: t`- Height $= \tfrac{\sqrt{3}}{2}a$, area $= \tfrac{\sqrt{3}}{4}a^2$
- Inradius $= \tfrac{a}{2\sqrt{3}}$, circumradius $= \tfrac{a}{\sqrt{3}}$, so $R = 2r$`,
    example: t`Side $6$: height $3\sqrt{3}$, area $9\sqrt{3}$, $R = 2\sqrt{3}$.`,
  },
  {
    id: "tr-similar",
    topic: "triangles",
    kind: "formula",
    title: "Similar triangles and BPT",
    body: t`- Ratio of areas $=$ ratio of squares of corresponding sides (or heights, medians)
- Basic proportionality: if $DE \parallel BC$, $\tfrac{AD}{DB} = \tfrac{AE}{EC}$`,
    example: t`Sides in ratio $2 : 3$, so areas are in ratio $4 : 9$.`,
  },
  {
    id: "tr-bisector",
    topic: "triangles",
    kind: "formula",
    title: "Angle bisector theorem",
    body: t`$$\frac{AB}{AC} = \frac{BD}{DC}$$`,
    note: "AD bisects angle A and meets BC at D.",
    example: t`$AB = 6$, $AC = 9$, $BC = 10$: $BD = 4$, $DC = 6$.`,
  },
  {
    id: "tr-apollonius",
    topic: "triangles",
    kind: "formula",
    title: "Apollonius' theorem (median)",
    body: t`$$AB^2 + AC^2 = 2(AD^2 + BD^2)$$
- All three medians: $3(a^2 + b^2 + c^2) = 4(m_1^2 + m_2^2 + m_3^2)$`,
    note: "AD is the median to BC, so BD = BC / 2.",
    example: t`$AB = 7$, $AC = 9$, $BC = 8$: $130 = 2(AD^2 + 16)$, so $AD = 7$.`,
  },
  {
    id: "tr-right",
    topic: "triangles",
    kind: "formula",
    title: "Right triangle radii and altitude",
    body: t`- Inradius $r = \tfrac{P + B - H}{2}$, circumradius $R = \tfrac{H}{2}$
- Altitude to the hypotenuse $= \tfrac{P \times B}{H}$`,
    example: t`$6, 8, 10$ triangle: $r = 2$, $R = 5$, altitude $= 4.8$.`,
  },

  /* ───────────── Circles ───────────── */
  {
    id: "ci-angles",
    topic: "circles",
    kind: "formula",
    title: "Angle properties",
    body: t`- Angle at the centre $= 2 \times$ angle at the circumference on the same arc
- Angle in a semicircle $= 90^\circ$; angles in the same segment are equal
- Opposite angles of a cyclic quadrilateral sum to $180^\circ$
- Tangent is perpendicular to the radius; two tangents from a point are equal`,
    example: t`Arc subtends $50^\circ$ at the circumference, so $100^\circ$ at the centre.`,
  },
  {
    id: "ci-chords",
    topic: "circles",
    kind: "formula",
    title: "Chords, secants and tangents",
    body: t`- Intersecting chords: $PA \cdot PB = PC \cdot PD$
- Tangent and secant from P: $PT^2 = PA \cdot PB$
- Perpendicular from the centre bisects a chord: $\left(\tfrac{\text{chord}}{2}\right)^2 + d^2 = r^2$`,
    example: t`$PA = 4$, $PB = 6$, $PC = 3$, so $PD = \tfrac{24}{3} = 8$.`,
  },
  {
    id: "ci-tangents",
    topic: "circles",
    kind: "formula",
    title: "Common tangents of two circles",
    body: t`- Direct: $\sqrt{d^2 - (r_1 - r_2)^2}$
- Transverse: $\sqrt{d^2 - (r_1 + r_2)^2}$`,
    note: "d = distance between the centres.",
    example: t`$d = 13$, $r_1 = 8$, $r_2 = 3$: direct tangent $= \sqrt{169 - 25} = 12$.`,
  },

  /* ───────────── Quadrilaterals & Polygons ───────────── */
  {
    id: "po-polygon",
    topic: "polygons",
    kind: "formula",
    title: "Regular polygon with n sides",
    body: t`- Sum of interior angles $= (n - 2) \times 180^\circ$
- Each exterior angle $= \tfrac{360^\circ}{n}$
- Number of diagonals $= \tfrac{n(n - 3)}{2}$`,
    example: t`Hexagon: interior sum $720^\circ$, exterior angle $60^\circ$, $9$ diagonals.`,
  },
  {
    id: "po-quads",
    topic: "polygons",
    kind: "formula",
    title: "Quadrilateral properties",
    body: t`- Parallelogram: diagonals bisect each other
- Rhombus: diagonals bisect at $90^\circ$, $4a^2 = d_1^2 + d_2^2$
- Rectangle: diagonals equal; square: diagonals equal and at $90^\circ$`,
    example: t`Rhombus diagonals $12$ and $16$: side $= \sqrt{36 + 64} = 10$.`,
  },

  /* ───────────── Mensuration 2D ───────────── */
  {
    id: "m2-triangle",
    topic: "mensuration-2d",
    kind: "formula",
    title: "Area of a triangle",
    body: t`- $\tfrac{1}{2} \times \text{base} \times \text{height}$
- Heron: $\sqrt{s(s - a)(s - b)(s - c)}$, $\;s = \tfrac{a + b + c}{2}$
- Two sides and included angle: $\tfrac{1}{2}ab\sin C$`,
    example: t`Sides $13, 14, 15$: $s = 21$, area $= \sqrt{21 \cdot 8 \cdot 7 \cdot 6} = 84$.`,
  },
  {
    id: "m2-rect",
    topic: "mensuration-2d",
    kind: "formula",
    title: "Rectangle and square",
    body: t`- Rectangle: area $lb$, perimeter $2(l + b)$, diagonal $\sqrt{l^2 + b^2}$
- Square: area $a^2 = \tfrac{d^2}{2}$, diagonal $a\sqrt{2}$`,
    example: t`Square with diagonal $10$: area $= 50$.`,
  },
  {
    id: "m2-quads",
    topic: "mensuration-2d",
    kind: "formula",
    title: "Parallelogram, rhombus, trapezium",
    body: t`- Parallelogram: base $\times$ height
- Rhombus: $\tfrac{1}{2}d_1 d_2$
- Trapezium: $\tfrac{1}{2}(a + b) \times h$`,
    example: t`Trapezium with parallel sides $10, 6$ and height $4$: area $32$.`,
  },
  {
    id: "m2-circle",
    topic: "mensuration-2d",
    kind: "formula",
    title: "Circle, sector, semicircle",
    body: t`- Area $\pi r^2$, circumference $2\pi r$
- Sector: area $\tfrac{\theta}{360} \pi r^2$, arc $\tfrac{\theta}{360} \cdot 2\pi r$
- Semicircle perimeter $= \pi r + 2r$`,
    example: t`$r = 7$, $\theta = 90^\circ$: sector area $= \tfrac{1}{4} \cdot \tfrac{22}{7} \cdot 49 = 38.5$.`,
  },
  {
    id: "m2-hexagon",
    topic: "mensuration-2d",
    kind: "formula",
    title: "Regular hexagon",
    body: t`$$\text{Area} = \frac{3\sqrt{3}}{2}a^2$$`,
    note: "It is six equilateral triangles of side a.",
    example: t`Side $2$: area $= 6\sqrt{3}$.`,
  },
  {
    id: "m2-path",
    topic: "mensuration-2d",
    kind: "trick",
    title: "Path around a rectangle",
    body: t`- Outside path of width $w$: $2w(l + b + 2w)$
- Inside path of width $w$: $2w(l + b - 2w)$`,
    example: t`$20 \times 15$ lawn, $2.5$ m path outside: $2 \times 2.5 \times 40 = 200\ \text{m}^2$.`,
  },
  {
    id: "m2-percent",
    topic: "mensuration-2d",
    kind: "trick",
    title: "Percentage change in area",
    body: t`If every length changes by $x\%$, the area changes by $2x + \dfrac{x^2}{100}\ \%$.`,
    note: "For volume, apply the successive-change formula three times.",
    example: t`Radius up $10\%$: area up $21\%$.`,
  },

  /* ───────────── Mensuration 3D ───────────── */
  {
    id: "m3-cuboid",
    topic: "mensuration-3d",
    kind: "formula",
    title: "Cuboid and cube",
    body: t`- Cuboid: $V = lbh$, TSA $= 2(lb + bh + hl)$, diagonal $\sqrt{l^2 + b^2 + h^2}$
- Cube: $V = a^3$, TSA $= 6a^2$, diagonal $a\sqrt{3}$`,
    example: t`Cuboid $3 \times 4 \times 12$: diagonal $= \sqrt{169} = 13$.`,
  },
  {
    id: "m3-cylinder",
    topic: "mensuration-3d",
    kind: "formula",
    title: "Cylinder",
    body: t`$$V = \pi r^2 h$$
$$CSA = 2\pi rh$$
$$TSA = 2\pi r(r + h)$$`,
    example: t`$r = 7$, $h = 10$: $V = 1540$, $CSA = 440$.`,
  },
  {
    id: "m3-cone",
    topic: "mensuration-3d",
    kind: "formula",
    title: "Cone",
    body: t`$$V = \tfrac{1}{3}\pi r^2 h$$
$$CSA = \pi r l$$
$$TSA = \pi r(l + r)$$
$$l = \sqrt{r^2 + h^2}$$`,
    example: t`$r = 3$, $h = 4$: $l = 5$, $CSA = 15\pi$.`,
  },
  {
    id: "m3-sphere",
    topic: "mensuration-3d",
    kind: "formula",
    title: "Sphere and hemisphere",
    body: t`- Sphere: $V = \tfrac{4}{3}\pi r^3$, $SA = 4\pi r^2$
- Hemisphere: $V = \tfrac{2}{3}\pi r^3$, $CSA = 2\pi r^2$, $TSA = 3\pi r^2$`,
    example: t`Sphere $r = 3$: $V = 36\pi$.`,
  },
  {
    id: "m3-frustum",
    topic: "mensuration-3d",
    kind: "formula",
    title: "Frustum of a cone",
    body: t`$$V = \tfrac{1}{3}\pi h(R^2 + r^2 + Rr)$$
$$CSA = \pi l(R + r)$$`,
    note: "l = √(h² + (R − r)²). Buckets and truncated vessels.",
    example: t`$R = 4$, $r = 1$, $h = 4$: $l = 5$, $CSA = 25\pi$.`,
  },
  {
    id: "m3-prism",
    topic: "mensuration-3d",
    kind: "formula",
    title: "Prism and pyramid",
    body: t`- Prism: $V = $ base area $\times h$; lateral surface $=$ base perimeter $\times h$
- Pyramid: $V = \tfrac{1}{3} \times$ base area $\times h$; lateral surface $= \tfrac{1}{2} \times$ perimeter $\times$ slant height`,
    example: t`Square pyramid, base $6$, height $4$: $V = \tfrac{1}{3} \cdot 36 \cdot 4 = 48$.`,
  },
  {
    id: "m3-recast",
    topic: "mensuration-3d",
    kind: "trick",
    title: "Melting and recasting",
    body: t`$$n = \frac{V_{\text{original}}}{V_{\text{one new}}}$$`,
    note: "Volume is conserved; surface area is not.",
    example: t`Sphere of radius $6$ into spheres of radius $2$: $\left(\tfrac{6}{2}\right)^3 = 27$.`,
  },

  /* ───────────── Trigonometric Ratios & Identities ───────────── */
  {
    id: "tg-identities",
    topic: "trig-identities",
    kind: "formula",
    title: "Pythagorean identities",
    body: t`$$\sin^2\theta + \cos^2\theta = 1$$
$$\sec^2\theta - \tan^2\theta = 1$$
$$\csc^2\theta - \cot^2\theta = 1$$`,
    example: t`$\sin\theta = \tfrac{3}{5}$ gives $\cos\theta = \tfrac{4}{5}$.`,
  },
  {
    id: "tg-table",
    topic: "trig-identities",
    kind: "trick",
    title: "Standard values",
    body: t`For $0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$:
- $\sin$: $\tfrac{\sqrt{0}}{2}, \tfrac{\sqrt{1}}{2}, \tfrac{\sqrt{2}}{2}, \tfrac{\sqrt{3}}{2}, \tfrac{\sqrt{4}}{2}$ and $\cos$ is the same list reversed
- $\tan$: $0, \tfrac{1}{\sqrt{3}}, 1, \sqrt{3}$, not defined`,
    example: t`$\sin 60^\circ = \tfrac{\sqrt{3}}{2}$, $\;\cos 60^\circ = \tfrac{1}{2}$.`,
  },
  {
    id: "tg-complementary",
    topic: "trig-identities",
    kind: "formula",
    title: "Complementary angles",
    body: t`- $\sin(90^\circ - \theta) = \cos\theta$, $\;\tan(90^\circ - \theta) = \cot\theta$, $\;\sec(90^\circ - \theta) = \csc\theta$
- If $A + B = 90^\circ$: $\sin A = \cos B$ and $\tan A \tan B = 1$`,
    example: t`$\tan 1^\circ \tan 2^\circ \cdots \tan 89^\circ = 1$.`,
  },
  {
    id: "tg-sec-tan",
    topic: "trig-identities",
    kind: "trick",
    title: "If sec θ + tan θ = k",
    body: t`- $\sec\theta - \tan\theta = \tfrac{1}{k}$
- $\sec\theta = \tfrac{k^2 + 1}{2k}$, $\;\tan\theta = \tfrac{k^2 - 1}{2k}$, $\;\sin\theta = \tfrac{k^2 - 1}{k^2 + 1}$`,
    note: "Same pattern for cosec θ + cot θ.",
    example: t`$\sec\theta + \tan\theta = 5$, so $\sec\theta - \tan\theta = \tfrac{1}{5}$ and $\sin\theta = \tfrac{24}{26} = \tfrac{12}{13}$.`,
  },
  {
    id: "tg-sum-product",
    topic: "trig-identities",
    kind: "trick",
    title: "If sin θ + cos θ = k",
    body: t`$$\sin\theta\cos\theta = \frac{k^2 - 1}{2}$$`,
    example: t`$k = \tfrac{7}{5}$: $\sin\theta\cos\theta = \tfrac{49/25 - 1}{2} = \tfrac{12}{25}$.`,
  },
  {
    id: "tg-compound",
    topic: "trig-identities",
    kind: "formula",
    title: "Compound angles",
    body: t`- $\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B$
- $\cos(A \pm B) = \cos A\cos B \mp \sin A\sin B$
- $\tan(A + B) = \dfrac{\tan A + \tan B}{1 - \tan A\tan B}$`,
    example: t`$\sin 75^\circ = \sin 45^\circ\cos 30^\circ + \cos 45^\circ\sin 30^\circ = \tfrac{\sqrt{6} + \sqrt{2}}{4}$.`,
  },
  {
    id: "tg-multiple",
    topic: "trig-identities",
    kind: "formula",
    title: "Double and triple angles",
    body: t`- $\sin 2\theta = 2\sin\theta\cos\theta$, $\;\cos 2\theta = 1 - 2\sin^2\theta = 2\cos^2\theta - 1$
- $\sin 3\theta = 3\sin\theta - 4\sin^3\theta$, $\;\cos 3\theta = 4\cos^3\theta - 3\cos\theta$
- $\sin\theta \cdot \sin(60^\circ - \theta) \cdot \sin(60^\circ + \theta) = \tfrac{1}{4}\sin 3\theta$`,
    example: t`$\sin 20^\circ \sin 40^\circ \sin 80^\circ = \tfrac{1}{4}\sin 60^\circ = \tfrac{\sqrt{3}}{8}$.`,
  },

  /* ───────────── Maximum, Minimum & Values ───────────── */
  {
    id: "tv-asin-bcos",
    topic: "trig-values",
    kind: "formula",
    title: "Max and min of a sin θ + b cos θ",
    body: t`$$\text{Max} = \sqrt{a^2 + b^2}$$
$$\text{Min} = -\sqrt{a^2 + b^2}$$`,
    example: t`$3\sin\theta + 4\cos\theta$ lies between $-5$ and $5$.`,
  },
  {
    id: "tv-sq",
    topic: "trig-values",
    kind: "formula",
    title: "Squared forms",
    body: t`- $a\sin^2\theta + b\cos^2\theta$ lies between $a$ and $b$
- Minimum of $a\tan^2\theta + b\cot^2\theta$ (or $a\sin^2\theta + b\csc^2\theta$ when $a \ge b$) $= 2\sqrt{ab}$`,
    example: t`Minimum of $9\tan^2\theta + 4\cot^2\theta = 2\sqrt{36} = 12$.`,
  },
  {
    id: "tv-put-values",
    topic: "trig-values",
    kind: "trick",
    title: "Put θ = 45° (or 0°, 90°)",
    body: t`For an identity-style question, put a convenient angle into the expression and into each option; the option that matches is the answer.`,
    note: "Use 0° or 90° only when nothing becomes undefined. If two options match, try a second angle.",
    example: t`$\tfrac{\sin\theta}{1 + \cos\theta} + \tfrac{1 + \cos\theta}{\sin\theta}$ at $90^\circ$ is $2$, which matches $2\csc\theta$.`,
  },

  /* ───────────── Heights & Distances ───────────── */
  {
    id: "hd-ratios",
    topic: "heights-distances",
    kind: "trick",
    title: "Angle to side ratio",
    body: t`- $30^\circ$: height : base $= 1 : \sqrt{3}$
- $45^\circ$: height : base $= 1 : 1$
- $60^\circ$: height : base $= \sqrt{3} : 1$`,
    example: t`Elevation $60^\circ$ from $10$ m away: height $= 10\sqrt{3}$ m.`,
  },
  {
    id: "hd-complementary",
    topic: "heights-distances",
    kind: "trick",
    title: "Complementary angles of elevation",
    body: t`$$h = \sqrt{ab}$$`,
    note: "From points a and b away from the foot (same side), the elevations are complementary.",
    example: t`$a = 4$ m, $b = 9$ m: height $= 6$ m.`,
  },
  {
    id: "hd-two-points",
    topic: "heights-distances",
    kind: "formula",
    title: "Two observation points",
    body: t`$$h = \frac{d}{\cot\alpha - \cot\beta}$$`,
    note: "Moving d towards the tower raises the elevation from α to β.",
    example: t`$30^\circ$ to $60^\circ$ after walking $20$ m: $h = \tfrac{20}{\sqrt{3} - 1/\sqrt{3}} = 10\sqrt{3}$ m.`,
  },

  /* ───────────── Statistics ───────────── */
  {
    id: "st-central",
    topic: "statistics",
    kind: "formula",
    title: "Mean, median, mode",
    body: t`- Median: the $\tfrac{n+1}{2}$th value ($n$ odd) or mean of the $\tfrac{n}{2}$th and $(\tfrac{n}{2} + 1)$th ($n$ even), after sorting
- Mode: the most frequent value
- Empirical relation: $\text{Mode} = 3\,\text{Median} - 2\,\text{Mean}$`,
    example: t`Median $20$, mean $22$: mode $\approx 60 - 44 = 16$.`,
  },
  {
    id: "st-spread",
    topic: "statistics",
    kind: "formula",
    title: "Range, variance, standard deviation",
    body: t`- Range $=$ max $-$ min
- $\sigma^2 = \dfrac{\sum (x - \bar{x})^2}{n}$, $\;\sigma = \sqrt{\sigma^2}$
- Variance of the first $n$ natural numbers $= \dfrac{n^2 - 1}{12}$`,
    note: "Adding a constant to every value does not change σ; multiplying by k multiplies σ by |k|.",
    example: t`Variance of $1, 2, \dots, 10$ is $\tfrac{99}{12} = 8.25$.`,
  },

  /* ───────────── Data Interpretation ───────────── */
  {
    id: "di-change",
    topic: "data-interpretation",
    kind: "formula",
    title: "Growth and share",
    body: t`- Percentage change $= \dfrac{\text{New} - \text{Old}}{\text{Old}} \times 100$
- Share of total $= \dfrac{\text{Part}}{\text{Total}} \times 100$`,
    example: t`Sales $250 \to 300$: growth $= \tfrac{50}{250} = 20\%$.`,
  },
  {
    id: "di-pie",
    topic: "data-interpretation",
    kind: "trick",
    title: "Pie charts",
    body: t`- Central angle $= \dfrac{\text{Value}}{\text{Total}} \times 360^\circ$
- $1\% = 3.6^\circ$, so $10\% = 36^\circ$ and $25\% = 90^\circ$`,
    example: t`A $72^\circ$ sector is $\tfrac{72}{3.6} = 20\%$ of the total.`,
  },
  {
    id: "di-approx",
    topic: "data-interpretation",
    kind: "trick",
    title: "Approximate before you calculate",
    body: t`Round values to friendly fractions ($12.5\% = \tfrac{1}{8}$, $16.67\% = \tfrac{1}{6}$), compare options, and only compute exactly if two options are close.`,
    example: t`$\tfrac{1247}{4986} \approx \tfrac{1250}{5000} = 25\%$.`,
  },

  /* ───────────── Probability ───────────── */
  {
    id: "pr-basics",
    topic: "probability",
    kind: "formula",
    title: "Probability basics",
    body: t`- $P(E) = \dfrac{\text{Favourable outcomes}}{\text{Total outcomes}}$, $\;P(\bar{E}) = 1 - P(E)$
- $P(A \cup B) = P(A) + P(B) - P(A \cap B)$
- Independent events: $P(A \cap B) = P(A) \cdot P(B)$`,
    note: "Coin: 2 outcomes, die: 6, two dice: 36, deck of cards: 52.",
    example: t`Sum of $7$ on two dice: $6$ of $36$ outcomes, so $\tfrac{1}{6}$.`,
  },
];

export function topicById(id: string): FormulaTopic | undefined {
  return FORMULA_TOPICS.find((topic) => topic.id === id);
}
