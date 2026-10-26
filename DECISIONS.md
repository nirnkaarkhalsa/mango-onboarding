# Decisions Log

A running record of the guesses and cuts made while building this prototype.
These feed directly into the "what I had to guess about" and "what I left out"
sections of the demo.

## Who it's for

- **Primary user:** Emily, a new hire. Her onboarding path was built first.
- **Customer:** Sarah, HR Manager at BrightPath. She asked for this, and now has her own view of everyone onboarding.
- **Also served:** David, Engineering Manager. He gets the same view as Sarah, showing only his team, which covers "managers should be able to see how their new employees are progressing."

## Assumptions

_What the brief didn't say, and what we assumed instead._

| # | Question | What we assumed | Why |
|---|----------|-----------------|-----|
| 1 | Which new hire do we show? | Emily, a software engineer on David's team, is the fully worked example. Twelve more sample new hires fill out Sarah's and David's views. | One complete, believable journey for the new hire, plus enough people for the HR view to mean something. |
| 2 | How is onboarding broken up? | Three phases: **Before Day 1**, **First Week**, **First Month**. | Matches Sarah's request ("before their first day... first few weeks"). |
| 3 | What counts as a "task"? | Things the new hire must *do*: forms, documents to review, trainings, meetings, setup steps. | Messages from HR or a manager are information, not tasks, so they live in a separate Mail tab. |
| 4 | How do tasks differ by department? | Each department has a template: company-wide tasks plus its own. Templates exist for Engineering, Marketing, Sales, Legal and Business Operations, plus "Other" for company-wide only. | Answers David ("I don't want everyone following exactly the same checklist") and is the first step toward Sarah's "automatically create plans based on role or department." |
| 5 | What day is it in the demo? | Emily is on **Day 19** (Fri, Nov 20, 2026). She started Mon, Nov 2. One task is overdue in Before Day 1 (the handbook) and one in First Week (security training). Three First Month tasks are still coming up. | Shows every state at once, and lets the demo show catching up on overdue work, finishing phases and graduating in a few clicks. |
| 6 | When is a task "in progress"? | As soon as Emily opens it. Checking **Yes** marks it complete. | Simplest rule that still tells her what she's started. |
| 7 | Must tasks be done in order? | No. Future tasks are dimmed but can still be opened. | Unlike lessons in a game, real onboarding tasks often overlap. |
| 8 | How does Emily know what to do first? | The path highlights one **"Start here"** task: the earliest-due task that isn't done. | Directly answers Emily: "I just want to know what I should focus on first." |
| 9 | Where does task data come from? | Made-up sample tasks, messages and links stored in the app. Progress saves in the browser. | No HR system or real content is available for the prototype. |
| 10 | Branding | Original mango mascot and an orange-and-green palette inspired by MangoApps. | Makes onboarding feel encouraging, like a game, rather than a chore. |
| 11 | Contact details | Made-up emails on the reserved `brightpath.example` domain, and phone numbers in the fictional 555 range. | Realistic for the demo without pointing at real people. |
| 12 | How does the prototype show different people? | A **View as** menu on the profile picture switches between Emily, Sarah and David. | There is no real login, and switching views live makes the demo easy to follow. |
| 13 | What do Sarah's three categories mean? | **Completed**: every task done. **On time**: still working, nothing overdue. **Has an overdue task**: at least one task past its due date. | Matches Sarah's ask to see whether new hires have completed their tasks or not. |
| 14 | Who appears in Sarah's list? | Everyone with an active onboarding plan, including people who start soon and people who finished within their first month. Sorted by first name. | The brief only gives first names. |
| 15 | Can Sarah or David check off a new hire's tasks? | No. They can view, add tasks and send messages. Only the new hire marks tasks done. | Keeps the new hire's checklist honest and their own. |
| 16 | What mood is the overdue mascot? | Worried, not angry. | Sarah may share her screen, and the tone should stay supportive. |
| 17 | When is an added task due? | By default, the end of the section it's added to, but never sooner than three days from today. The form warns if a past date is picked. | A task added on Day 19 to First Week shouldn't show as overdue the moment it's created. |
| 18 | What happens when Sarah publishes a new plan? | The new hire appears in her list and David's (if he's the manager), and a welcome message is added to their mail. No real email is sent. | Shows the full loop without needing real email. |
| 19 | Customer name | Kept **BrightPath Technologies**, because the brief names the customer. The mango mascot is the nod to MangoApps. | Building for the customer named in the request is part of the exercise. |

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
| 10 | With the demo on Day 19, the mascot needed a clear rule for when it grows. | Mango grows one size only when Emily fully completes a section: small and green until Before Day 1 is done, bigger and yellow-green until First Week is done, then fully ripe, then graduated. On Day 19 he starts small because the handbook is still open, so the demo shows him grow twice and graduate in a few clicks. |
| 11 | The First Week section bar looked more olive than yellow. | Shifted First Week to a yellower shade (rechecked for colorblind users) and brightened its section bar. |
| 12 | After a task, Emily was pushed straight into the next one, and "Next task" buttons kept prompting her. | Every completion now shows a celebration, and one click returns her to the path, scrolled to the next task. The "Next task" buttons are gone. |
| 13 | Random celebrations made the demo unpredictable. | The celebrations play in a fixed order: a dance, a backflip, a party, then graduation. The two section completions also show Mango growing. |
| 14 | The progress rings showed totals but not which tasks they counted. | Clicking any ring opens a list of every task, or one section's, filtered by done and to do. Each task opens from there. |
| 15 | In Mail, Emily could read a message but not see how to reach the sender. | Clicking the sender's name shows the same contact card used in task details. |
| 16 | The page looked the same no matter how far Emily had come. | The background takes on a hint of Mango's color: pale green before Day 1, pale yellow in First Week, pale orange in First Month. (The first version used green for First Month, which didn't match Mango.) |
| 17 | A "See all tasks" label under the big ring added clutter. | Removed the label. The rings still open the task list and grow slightly on hover to show they're clickable. |

## Added in v1.1: Sarah's and David's views

_Built after the new hire's path, once it felt solid._

- **Dashboard:** one pie chart (Completed, On time, Has an overdue task) and three mangos: happy with a graduation cap, studious with glasses and a book, and worried. Clicking a slice or a mango filters the list below and shows the count in big print.
- **List of new hires:** alphabetical by first name, with search, how long each person has been at the company, progress and status.
- **A new hire's page:** the same rings and path the new hire sees. A ghost **+** stone at the end of each section adds a task, and it appears on their path right away.
- **Messaging:** message a new hire about a specific task, send a general note, or click their overdue count for a pre-filled reminder listing the overdue tasks.
- **Mail:** send updates to everyone onboarding, one department, or chosen people, and see what has been sent.
- **Add new hire:** pick a department to load its template, remove or add tasks, choose the manager, then publish.
- **David's view:** the same dashboard and mail, limited to his team. He can't add new hires.

## Added in v1.2

_Changes after a fresh look the next day._

- **Nerdier On time mango:** oversized thick-rimmed glasses and magnified eyes.
- **Jump to what's overdue:** on a new hire's page in Sarah's or David's view, clicking the overdue count next to their name scrolls to the unfinished task and flashes it. With several, each click moves to the next.

## Not doing yet

_What we deliberately left out, and why._

| # | Feature | Why it's out | When it might come in |
|---|---------|--------------|-----------------------|
| 1 | Editing or removing tasks on a plan that's already published | Adding covers the most common need. Editing raises questions like whether to notify the new hire. | Next, after feedback from Sarah. |
| 2 | AI-drafted plans from a job description | Department templates come first. A drafted plan still needs Sarah to review it. | Later, built on the templates. |
| 3 | Replies and conversations in Mail | One-way updates cover reminders and announcements. | When Mail moves to the real messaging system. |
| 4 | Celebration GIFs | Animated mascot and confetti first; GIFs after feedback. | After the first review with Sarah. |
| 5 | Real login, email and HR system integrations | Not needed to test whether the experience works. | Before any real rollout. |
| 6 | Onboarding history and trends (for example, a manager's past hires and their on-time rate) | Tried as a tab for David, then cut to keep the demo focused on what Sarah asked for. It also needs real history to be meaningful. | Once real data exists. |
