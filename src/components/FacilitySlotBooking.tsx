import React from 'react';
import { CalendarCheck, Check, Loader2 } from 'lucide-react';

/**
 * Day-care slot booking for the Indoor Facility.
 *
 * Unlike the other services -- which are "request a visit, the clinic calls
 * back" -- this shows real inventory: six beds per one-hour slot, 09:30-13:30,
 * and how many are left right now. The visitor picks a date, sees live
 * availability, chooses up to three slots and holds them. The counts and the
 * three-slot cap come from the API (GET /facility/availability), never
 * hard-coded here, so a change to the rules on the server needs no change here.
 *
 * A held slot is PENDING: it occupies a bed immediately -- the count must not
 * lie -- and the clinic confirms it. That is stated on the confirmation so a
 * visitor does not read "held" as "guaranteed and paid".
 */

const CLINIC_API = (import.meta as any).env?.VITE_CLINIC_API_URL ?? '/api/v1';

interface Slot {
  slot: number;
  start: string;
  end: string;
  label: string;
  beds_total: number;
  beds_available: number;
}

interface Availability {
  date: string;
  beds_total: number;
  max_slots_per_booking: number;
  slots: Slot[];
}

interface Props {
  /** Close the whole booking panel (the visitor is done). */
  onClose: () => void;
}

/** Today and the next 13 days, as YYYY-MM-DD in the visitor's own zone. */
function nextDays(count: number): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;
    const label =
      i === 0
        ? 'Today'
        : i === 1
          ? 'Tomorrow'
          : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    out.push({ value, label });
  }
  return out;
}

export const FacilitySlotBooking: React.FC<Props> = ({ onClose }) => {
  // Its own confirmation, not the appointment-shaped BookingSuccessModal: this
  // booking has a reference, a date and slots, not a specialist and an email,
  // so it says exactly what was held.
  const [booked, setBooked] = React.useState<{ reference: string; detail: string } | null>(null);
  const days = React.useMemo(() => nextDays(14), []);
  const [date, setDate] = React.useState(days[0].value);
  const [avail, setAvail] = React.useState<Availability | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [chosen, setChosen] = React.useState<number[]>([]);
  const [form, setForm] = React.useState({ petName: '', ownerName: '', ownerPhone: '', note: '' });
  const [website, setWebsite] = React.useState(''); // honeypot
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const maxSlots = avail?.max_slots_per_booking ?? 3;

  // Load availability whenever the date changes; clear the slot selection so a
  // slot chosen for one day can't carry over to another.
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setChosen([]);
    setError('');
    fetch(`${CLINIC_API}/facility/availability?date=${date}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Availability) => {
        if (!cancelled) setAvail(d);
      })
      .catch(() => {
        if (!cancelled) setAvail(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const toggleSlot = (slot: number, available: number) => {
    if (available <= 0) return;
    setChosen((prev) => {
      if (prev.includes(slot)) return prev.filter((s) => s !== slot);
      if (prev.length >= maxSlots) return prev; // cap enforced in the UI and re-enforced by the API
      return [...prev, slot].sort((a, b) => a - b);
    });
  };

  const canSubmit =
    chosen.length > 0 && form.petName.trim() && form.ownerName.trim() && form.ownerPhone.trim() && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${CLINIC_API}/facility/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date, slots: chosen, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        // A 409 means a slot filled between load and submit; re-fetch so the
        // visitor sees the truth rather than a stale count.
        setError(data.detail || 'That could not be booked. Please try another time.');
        if (res.status === 409) {
          fetch(`${CLINIC_API}/facility/availability?date=${date}`)
            .then((r) => r.json())
            .then((d: Availability) => setAvail(d))
            .catch(() => {});
          setChosen([]);
        }
        return;
      }
      setBooked({ reference: data.reference, detail: data.detail });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    'w-full bg-transparent border-b border-[#d4c3bd] focus:border-[#84523e] outline-none py-2 text-[#3C2117] placeholder:text-[#a8988f]';
  const labelCls = 'block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium';

  if (booked) {
    return (
      <div className="pt-2 text-center">
        <div className="w-14 h-14 rounded-full bg-[#3C2117] text-white flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7" />
        </div>
        <h4 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] font-light mb-3">
          Slots held
        </h4>
        <p className="font-['Inter'] text-sm text-[#504440] leading-relaxed mb-5">{booked.detail}</p>
        <p className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-6">
          Reference {booked.reference}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#3C2117] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#84523e] transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="pt-2">
      <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-5">
        <CalendarCheck className="w-4 h-4" />
        Choose a day and time
      </p>

      {/* Date */}
      <label className={labelCls} htmlFor="fac-date">
        Date
      </label>
      <select
        id="fac-date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={`${field} mb-6`}
      >
        {days.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {/* Slots */}
      <span className={labelCls}>
        Time slot{' '}
        <span className="text-[#84523e] normal-case tracking-normal font-normal">
          — up to {maxSlots}, {avail?.beds_total ?? 6} beds each
        </span>
      </span>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#504440] py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Checking availability…
        </div>
      ) : !avail ? (
        <p className="text-sm text-[#84523e] py-4">
          Could not load availability. Please call the clinic to book.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {avail.slots.map((s) => {
            const isChosen = chosen.includes(s.slot);
            const full = s.beds_available <= 0;
            const blocked = !isChosen && chosen.length >= maxSlots;
            return (
              <button
                key={s.slot}
                type="button"
                disabled={full}
                aria-pressed={isChosen}
                onClick={() => toggleSlot(s.slot, s.beds_available)}
                className={`relative text-left p-3 border transition-colors ${
                  full
                    ? 'border-[#d4c3bd]/40 bg-[#f2ede7] text-[#a8988f] cursor-not-allowed'
                    : isChosen
                      ? 'border-[#3C2117] bg-[#3C2117] text-white'
                      : blocked
                        ? 'border-[#d4c3bd]/40 text-[#a8988f]'
                        : 'border-[#d4c3bd] text-[#3C2117] hover:border-[#84523e]'
                }`}
              >
                {isChosen && <Check className="absolute top-2 right-2 w-4 h-4" />}
                <span className="block font-medium text-sm">{s.label}</span>
                <span className={`block text-xs mt-1 ${isChosen ? 'text-white/80' : 'text-[#84523e]'}`}>
                  {full ? 'Full' : `${s.beds_available} of ${s.beds_total} beds free`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Details */}
      <div className="space-y-5">
        <div>
          <label className={labelCls} htmlFor="fac-pet">
            Pet&rsquo;s name *
          </label>
          <input
            id="fac-pet"
            className={field}
            placeholder="e.g. Bruno"
            value={form.petName}
            onChange={(e) => setForm({ ...form, petName: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls} htmlFor="fac-owner">
              Your name *
            </label>
            <input
              id="fac-owner"
              className={field}
              placeholder="e.g. Priya"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="fac-phone">
              Phone *
            </label>
            <input
              id="fac-phone"
              className={field}
              placeholder="e.g. 98765 43210"
              value={form.ownerPhone}
              onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="fac-note">
            Anything we should know?
          </label>
          <input
            id="fac-note"
            className={field}
            placeholder="Optional"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        {/* Honeypot: hidden from people, catches bots. Same contract as the
            booking form's `website` field. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute left-[-9999px] w-px h-px opacity-0"
        />
      </div>

      {error && <p className="text-sm text-[#b23b3b] mt-4">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full bg-[#3C2117] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#84523e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {chosen.length > 0
          ? `Hold ${chosen.length} slot${chosen.length > 1 ? 's' : ''}`
          : 'Choose a slot'}
      </button>
      <p className="text-xs text-[#84523e] mt-3 leading-relaxed">
        Slots are held pending the clinic&rsquo;s confirmation — we&rsquo;ll call to confirm. Day care
        is offered alongside a course of physiotherapy.
      </p>
    </form>
  );
};
