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
| 10 | Branding | Original mango mascot and an orange-and-green palette inspired by MangoApps. | Makes onboarding feel encouraging, like a game, rather than a chore. |

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
