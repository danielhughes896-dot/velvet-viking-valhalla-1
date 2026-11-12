import CtaButton from "@/components/ui/CtaButton";
import { appSignInUrl } from "@/content/site";
import { buildUrl } from "@/content/journey";
import {
  builderStages,
  entryLabels,
  overviewRows,
  overviewStage,
} from "@/content/builderEntry";

// STAGE 01 OF THE APP'S BUILDER, ON THE WEBSITE'S OWN ROUTE.
//
// A re-rendering of app start.html's pane-build at bldCurrentStage 0: the
// eleven-segment rail, the 01 / 11 counter, the stage name, the heading and
// lede from the spec, the three orientation rows, and Continue. See
// content/builderEntry.ts for what moved, what could not, and why the seam
// is at this button.
//
// THE NUMBERS BELOW ARE THE APP'S NUMBERS, not approximations of them. Every
// size, weight, tracking, radius and gap is lifted from the matching rule in
// start.html or vvv-shell.css and named in a comment beside it, so a reader
// can check this against the source rather than trusting that it looks close.
// They are written as explicit values rather than Tailwind's scale because
// the app's scale is not Tailwind's: 13.5px type, 1.4px tracking, a 3px rail
// and a 10px radius have no utility classes, and rounding each to the nearest
// one is exactly the drift this screen exists to avoid.
//
// OSWALD IS THE FACE FOR EVERYTHING HERE, which is the single correction that
// made this stop looking almost-right. The app's shell sets
// `body{font-family:var(--text-face)}` and --text-face is Oswald, so its
// ledes and row details inherit the condensed face. This site's body is
// Inter, so the same markup rendered wider, wrapped in different places and
// read as a web page quoting an app screen. The rule here is the app's rule:
// this screen is Oswald top to bottom.
//
// AND THE BUTTONS ARE THE APP'S BUTTONS — through CtaButton, not around it.
// The site's default button is an uppercase, wide-tracked pill: right
// everywhere else, wrong here, where the app draws a 10px-radius 13.5px
// button in sentence case reading "Continue →". The first pass hand-rolled
// those two buttons in this file, which painted bg-vv-cherry-fill outside
// CtaButton and tripped visualReconciliation's "exactly one component knows
// how to paint the accent" — a guard that was right to fire. So the shapes
// moved INTO CtaButton as `chrome`, the paint stayed where it already was,
// and this screen asks for the app's geometry by name.
//
// WHAT IS DELIBERATELY NOT THE APP'S. The lede and the row details are full
// ink here, where the app dims them to --ink-dim. Founder: "I want all text
// to be white!! Titles sub tex ect. Use the same rules as the app. Titles
// big, sub text smaller but not this odd white grey shit." So the app's SIZE
// rules carry the hierarchy — 20px heading, 16px row title, 13.5px detail —
// and colour does not. The cherry counter stays cherry: that is a colour,
// not a greying-out.
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export default function BuilderEntry() {
  // Stage 01, so the first rail segment is `now` and the other ten are
  // untouched. The app's `done` state (--cherry-dim) cannot occur on this
  // screen, because there is no stage behind it to have been completed.
  const current = 0;

  return (
    // font-head is Oswald — the app's --text-face, and its body face.
    <section className="bg-vv-bg font-head">
      {/* start.html overrides .vvv-shell to max-width:560px, and the page
          pads 20px either side / 24px top. */}
      <div className="mx-auto w-full max-w-[560px] px-5 pt-6 pb-20 sm:pb-28">
        {/* #signin-instead — .vvv-btn.vvv-btn-ghost, which the app shows on
            this stage only (`classList.toggle('vvv-hidden', bldCurrentStage
            !== 0)`). Stage 01 is the one stage this route renders, so here it
            is simply always present. width:100%; min-height:48px; padding:
            12px 18px; border:1px var(--line); border-radius:8px;
            background:none; font-size:14px; weight:600; tracking:.04em.
            margin-bottom:18px is set inline on the element in the app. */}
        <CtaButton href={appSignInUrl} variant="ghost" chrome="appShell" className="mb-[18px]">
          {entryLabels.signIn}
        </CtaButton>

        {/* .bld-progress — display:flex; align-items:center; gap:6px. One
            .bld-step per stage: flex:1 1 0; height:3px; border-radius:99px. */}
        <div
          className="flex items-center gap-[6px]"
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={1}
          aria-valuemax={builderStages.length}
          aria-label={`Stage ${current + 1} of ${builderStages.length}: ${overviewStage.name}`}
        >
          {builderStages.map((stage, i) => (
            <div
              key={stage.key}
              className="h-[3px] flex-1 rounded-[99px]"
              style={{ background: i === current ? "var(--vv-cherry)" : "var(--vv-line)" }}
            />
          ))}
        </div>

        {/* .bld-progress-meta — align-items:baseline; space-between;
            margin:9px 0 2px. */}
        <div className="mt-[9px] mb-[2px] flex items-baseline justify-between">
          {/* .bld-stage-no — --num-face (JetBrains Mono), --fs-meta (11px),
              700, letter-spacing:1px, --cherry-text. */}
          <span className="font-mono text-[11px] font-bold tracking-[1px] text-vv-cherry-text">
            {pad2(current + 1)} / {pad2(builderStages.length)}
          </span>
          {/* .bld-stage-name — uppercase, letter-spacing:1.4px, --fs-label
              (11px). The app sets --ink-faint; white here. */}
          <span className="text-[11px] tracking-[1.4px] text-vv-ink uppercase">
            {overviewStage.name}
          </span>
        </div>

        {/* .bld-stage-h — uppercase, letter-spacing:.8px, --fs-title (20px),
            --ink, margin:14px 0 4px. It is an h1 rather than the app's h3
            because this is a page on a public site and the document needs a
            top-level heading; the app's is a pane inside one. */}
        <h1 className="mt-[14px] mb-[4px] text-[20px] tracking-[0.8px] text-vv-ink uppercase">
          {overviewStage.heading}
        </h1>

        {/* .bld-lede — --fs-body (16px), --lh-body (1.5), margin:0 0 18px. */}
        <p className="mb-[18px] text-[16px] leading-[1.5] text-vv-ink">{overviewStage.lede}</p>

        {/* .bld-overview — margin-top:4px; padding:2px 0. Rows are
            padding:15px 0 with a 1px --line-soft rule, none on the last. */}
        <div className="mt-[4px] py-[2px]">
          {overviewRows.map((row, i) => (
            <div
              key={row.title}
              className="py-[15px]"
              style={
                i === overviewRows.length - 1
                  ? undefined
                  : { borderBottom: "1px solid var(--vv-line-soft)" }
              }
            >
              {/* .bor-t — --fs-body (16px), 600, letter-spacing:.3px, --ink,
                  margin-bottom:3px. */}
              <span className="mb-[3px] block text-[16px] font-semibold tracking-[0.3px] text-vv-ink">
                {row.title}
              </span>
              {/* .bor-d — --fs-support (13.5px), --lh-support (1.45). The app
                  sets --ink-dim; white here, smaller is the hierarchy. */}
              <span className="block text-[13.5px] leading-[1.45] text-vv-ink">{row.detail}</span>
            </div>
          ))}
        </div>

        {/* .bld-actions — display:flex; gap:10px; margin-top:22px, with
            `.bld-actions .btn{flex:1 1 0}` so Continue fills the row once
            Back is hidden, which it is on stage 01.

            #bld-next — .btn.btn-primary: radius var(--radius-sm) (10px),
            padding 11px 18px, 13.5px, weight 600, min-height 44px, gap 7px;
            and under .builder-light, background var(--cherry-fill), colour
            var(--cherry-btn-ink), box-shadow inset 0 0 0 1px var(--cherry),
            border:none.

            THIS IS THE HANDOFF. The athlete has answered nothing yet, so
            crossing to the app's origin here costs them nothing, and every
            question after this one is asked once, by the app, in the app's
            own storage. */}
        <div className="mt-[22px] flex gap-[10px]">
          <CtaButton href={buildUrl} variant="cherry" chrome="appBtn" className="flex-1">
            {entryLabels.continue}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
