# Product Overview — IntakeFlow

> Single source of truth for the product. The product name (**IntakeFlow**) and branding
> are confirmed; clinic volume remains **provisional** and marked `(TBD)` until set.

## What it is

A patient intake dashboard for a small clinic. Patients complete their intake form
from their own phone before arriving; front-desk staff work a single live queue instead
of a stack of paper and phone callbacks; and every patient gets an automatic SMS
confirmation once their intake is received.

The product replaces the clipboard-and-callback loop — paper forms, manual re-keying,
and confirmation phone tag — with one shared flow that keeps the front desk moving.

## Who it's for

- **Patients** — fill in their intake details on their own device, ahead of the visit,
  and receive an SMS confirming the clinic has them.
- **Front-desk / clinical staff** — see incoming intakes as a live, ordered queue;
  pick up, work, and clear each patient without paper or callbacks.
- **Clinic owner / operator** *(buyer)* — a small clinic operator who wants to reclaim
  front-desk hours, cut no-shows, and keep cleaner intake records.

## Core jobs (the product's reason to exist)

1. **Patient intake submission** — a patient submits an intake form (their details,
   reason for visit, and required info) from their own device.
2. **Live staff queue** — submitted intakes appear in an ordered queue staff can view,
   triage, and clear in real time.
3. **SMS confirmation** — on submission, the patient automatically receives an SMS
   confirming their intake was received.

## The verified operation

The domain event this app exists to perform is a **patient intake submitted** — a real
patient completing and submitting their intake form in the deployed app, which then
enters the staff queue and triggers the SMS confirmation. This is the unit the product
is measured by.

## Positioning & tone

- **Positioning**: the calm, no-paperwork front desk for small clinics. Not a full EHR
  or practice-management suite — a focused intake-and-queue tool that does the first
  five minutes of every visit brilliantly.
- **Tone**: clear, trustworthy, calm, healthcare-appropriate. Reassuring to patients,
  efficient and low-friction for staff. Privacy-respecting language throughout.
- **Name & branding**: **IntakeFlow**. Calm, trustworthy, medical-friendly identity —
  soft blue/teal palette, clean modern flat logo, warm rather than clinical-cold.

## Scope

**In scope (v1) — the build now**
- Patient-facing **landing page**: a calm, mobile-first front door that explains the
  clinic and lets a patient tap one button to begin intake. This is the first slice we
  ship.

**Planned next (roadmap — grounded in the core jobs above)**
- Patient-facing intake form (own device, pre-arrival) — the front door leads straight here.
- Staff queue view of submitted intakes (ordered, workable, clearable).
- Automatic SMS confirmation to the patient on submission.

**Out of scope — unless later confirmed**
- Full EHR / clinical charting and records management.
- Appointment scheduling / calendar booking.
- Billing, insurance, or payments.
- Two-way SMS conversations beyond the confirmation.

## Strategic principles

- **Remove the loop, don't add a system.** Every feature should kill paper, re-keying,
  or a phone call — not create new busywork.
- **Patient effort is the enemy.** Intake must be fast and obvious on a phone; the fewer
  taps to submit, the higher the completion rate.
- **The queue is the product for staff.** It must always reflect reality at a glance —
  who's waiting, who's been handled, what's next.
- **Confirmation builds trust.** The SMS is not a nicety; it's the signal that quietly
  reduces no-shows and reassures the patient.

## Provisional / to confirm

- Final product name and branding `(TBD)`.
- Clinic size — number of front-desk/clinical staff and weekly patient volume `(TBD)`;
  needed to project Weekly Verified Operations and ROI.
