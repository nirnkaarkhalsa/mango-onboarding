# Decisions Log

A running record of the guesses and cuts made while building this prototype.
These feed directly into the "what I had to guess about" and "what I left out"
sections of the demo.

## Who it's for

- **Primary user:** Emily, a new hire. This prototype is her onboarding portal.
- **Customer:** Sarah, HR Manager at BrightPath. She asked for this and is the person the demo is for.
- **Also considered:** David, Engineering Manager, whose need for department-specific checklists shapes the task data.

## Assumptions

_What the brief didn't say, and what we assumed instead._

| # | Question | What we assumed | Why |
|---|----------|-----------------|-----|
| 1 | Which new hire do we show? | One new hire: Emily, a software engineer on David's team. | One complete, believable journey beats several thin ones in a 3-hour prototype. |
| 2 | How is onboarding broken up? | Three phases: **Before Day 1**, **First Week**, **First Month**. | Matches Sarah's request ("before their first day... first few weeks"). |
| 3 | What counts as a "task"? | Things the new hire must *do*: forms, documents to review, trainings, meetings, setup steps. | Messages from HR or a manager are information, not tasks, so they live in a separate Mail tab. |
| 4 | How do tasks differ by department? | Each task is tagged **Company-wide** or **Engineering**. | Shows David's point (engineers need dev tools) without building a manager view. |
| 5 | What day is it in the demo? | Emily is on **Day 3** (Wed, Nov 4, 2026). Start date was Mon, Nov 2. | Shows every state at once: one phase nearly done, one in progress, one upcoming. |
| 6 | When is a task "in progress"? | As soon as Emily opens it. Checking **Yes** marks it complete. | Simplest rule that still tells her what she's started. |
| 7 | Must tasks be done in order? | No. Future tasks are dimmed but can still be opened. | Unlike lessons in a game, real onboarding tasks often overlap. |
| 8 | How does Emily know what to do first? | The path highlights one **"Start here"** task: the earliest-due task that isn't done. | Directly answers Emily: "I just want to know what I should focus on first." |
| 9 | Where does task data come from? | Made-up sample tasks, messages and links stored in the app. Progress saves in the browser. | No HR system or real content is available for the prototype. |
| 11 | Contact details | Made-up emails on the reserved `brightpath.example` domain, and phone numbers in the fictional 555 range. | Realistic for the demo without pointing at real people. |
| 10 | Branding | Original mango mascot and an orange-and-green palette inspired by MangoApps. | Makes onboarding feel encouraging, like a game, rather than a chore. |

## Changes after the first test

_What changed after clicking through v1 as Emily would._

| # | What we noticed | What we changed |
|---|-----------------|-----------------|
| 1 | The First Month color was a red-orange, so those tasks looked overdue. | Red is now reserved for "overdue." First Week is yellow-green and First Month is golden orange. The three phase colors were checked so they stay distinguishable for colorblind users. |
| 2 | The mascot didn't change as Emily progressed. | Mango now grows and ripens with her: small and green before Day 1, bigger and yellow-green in the first week, fully ripe in the first month. Finishing the last task shows a graduation pop-up with Mango in a cap. |
| 3 | "Up next" jumped straight into the task, so Emily never saw where she was on her path. | "Show me where" scrolls to her current stone and makes it flash. She can open the task from there. |
| 4 | Confetti alone got repetitive. | After each task, Mango pops into the corner and dances, does a backflip or throws a party, chosen at random. |
| 5 | Getting from one task to the next took several clicks. | Completing a task turns the "Task completed?" box into a **Next task** button. Finishing a phase leads straight into the next phase's first task. |
| 6 | Gray stones for unfinished tasks didn't show which phase they belonged to, and done tasks didn't stand out enough. | Unfinished tasks are a light "ghost" of their phase color. Done tasks fill in with full color, so the path visibly fills up. |
| 7 | The path showed order but not dates. | Added a **Calendar** tab: a month grid on desktop and a day-by-day list on phones. Same colors as the path, with overdue tasks outlined in red. |
| 8 | "Questions? Sarah" named a person but gave no way to reach her. | Clicking the name shows a contact card with email, Slack, phone and where to find them, plus an **Email** button that fills in the task as the subject. |
| 9 | Emily couldn't see what she was working toward. | A faded graduated Mango waits at the end of the path as a teaser, and comes into full color when she finishes. |

## Not doing yet

_What we deliberately left out of v1, and why._

| # | Feature | Why it's out of v1 | When it might come in |
|---|---------|--------------------|-----------------------|
| 1 | Manager view (David sees his new hires' progress) | Focus v1 on the new hire, Sarah's "especially our new employees." | v2: the next most important user. |
| 2 | HR view (Sarah creates and edits plans) | Needs plan editing, which is a bigger build. | v2 or v3. |
| 3 | Auto-generated plans by role or department | Sarah said "eventually." Tagged task data is the groundwork for it. | Later: templates per department, or an AI-drafted plan from a job description. |
| 4 | More than one new hire | One complete journey is a better demo than several partial ones. | With the manager view. |
| 5 | Celebration GIFs | Animated mascot and confetti first; GIFs after feedback. | After the first review with Sarah. |
| 6 | Real login, email and HR system integrations | Not needed to test whether the experience works for new hires. | Before any real rollout. |
