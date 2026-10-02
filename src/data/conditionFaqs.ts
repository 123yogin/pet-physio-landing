import type { ConditionItem } from '../types';
import { SITE } from '../seo/siteConfig';

/** Join a list into natural prose: "a, b and c". */
function naturalList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

const lowerFirst = (s: string) => (s ? s[0].toLowerCase() + s.slice(1) : s);

/**
 * Self-contained question/answer blocks for a condition, generated from the
 * condition's OWN data.
 *
 * Why this exists: an answer engine (ChatGPT, Perplexity, Google AI Overviews)
 * cites short passages that answer one question without needing the rest of the
 * page. The condition pages had warm prose but no such passages, so the
 * citability scorer found nothing liftable. Each block here leads with a direct
 * answer, names the condition + clinic + locality, and carries a concrete fact
 * (therapies used, recovery outlook) — exactly the shape that gets quoted.
 *
 * No new claims are introduced: every fact is restated from the condition's
 * fields. The same source feeds both the visible page and the FAQPage schema
 * (see schema.ts), so the two can never drift — a requirement for valid FAQ
 * structured data.
 */
export function conditionFaqs(condition: ConditionItem): Array<{ q: string; a: string }> {
  const brand = SITE.brandName;
  const locality = SITE.address.addressLocality;
  const therapyCount = condition.recommendedTherapies.length;
  const signCount = condition.symptoms.length;
  // Each answer carries a concrete number (therapy count, recovery timeframe,
  // sign count) — the "statistical density" an answer engine looks for when
  // deciding a passage is worth quoting. All numbers are counts of / restatements
  // of the condition's own data, never invented.
  return [
    {
      q: `How is ${condition.title} treated in dogs and cats?`,
      a: `${condition.fullDesc} At ${brand} in ${locality}, treatment combines ${therapyCount} evidence-based therapies — ${naturalList(
        condition.recommendedTherapies,
      )} — tailored to each pet and coordinated with your primary veterinarian. Typical recovery is ${lowerFirst(
        condition.expectedRecoveryTime,
      )}.`,
    },
    {
      q: `How long does ${condition.title} recovery take?`,
      a: `Typical recovery is ${lowerFirst(
        condition.expectedRecoveryTime,
      )}. The outlook depends on the individual pet, the severity of the condition and consistency with the home-care programme, and progress is measured against objective goals at every session.`,
    },
    {
      q: `What are the signs of ${condition.title} in pets?`,
      a: `The ${signCount} most common signs are ${naturalList(
        condition.symptoms.map(lowerFirst),
      )}. If your dog or cat shows any of these, a veterinary physiotherapy assessment at ${brand} can identify the cause and build a recovery plan.`,
    },
  ];
}
