# BrightPath Onboarding

A first-version onboarding portal for new hires at BrightPath Technologies, built as a prototype to show Sarah (HR Manager).

New hires see one place with everything they need to do, broken into **Before Day 1**, **First Week** and **First Month**. Instead of a long checklist, tasks sit on a game-style path that highlights the one thing to focus on next. Mango, the mascot, grows and ripens alongside the new hire and graduates when onboarding is done.

## Who it's for

- **Emily, a new hire.** This prototype is her view. She asked for one thing above all: "I just want to know what I should focus on first."
- **Sarah, HR Manager.** She asked for this and is the audience for the demo.
- **David, Engineering Manager.** His point that every department needs different steps shows up in the task data: each task is tagged Company-wide or Engineering.

## What it does

- **Shows one next step.** A "Start here" stone and Mango's speech bubble point to the earliest-due task that isn't done. Overdue tasks come first. **Show me where** scrolls to it on the path.
- **Keeps everything in one place.** Forms, documents, trainings, meetings and setup steps live on the path. Messages from HR and managers live separately in **Mail**, because they are information, not tasks.
- **Shows the plan by date.** The **Calendar** tab puts every task on the day it's due.
- **Tracks progress at a glance.** A ring for overall progress, one ring per phase, and an overdue count that only turns red when something needs attention.
- **Opens each task in full.** Due date, time it takes, who to ask (click the name for their contact details), step-by-step instructions and links, plus a **Task completed? Yes** box that turns into a **Next task** button once checked.
- **Celebrates progress.** Confetti and a quick Mango dance, backflip or party for each task. Finishing a phase grows Mango from small and green to fully ripe. Finishing everything shows Mango graduating.
- **Fills in as you go.** Unfinished tasks are a light ghost of their phase color and fill in when done. A faded graduated Mango waits at the end of the path.
- **Keeps red for problems.** Phases are green, yellow-green and golden orange, so red only ever means overdue.
- **Remembers progress.** Completed tasks stay completed after a refresh. The **Completed** tab lists them so Emily can reopen anything later.

## Run it locally

You need [Node.js](https://nodejs.org) version 20.19 or newer.

```bash
git clone https://github.com/nirnkaarkhalsa/mango-onboarding.git
cd mango-onboarding
npm install
npm run dev
```

Then open the address it prints, usually http://localhost:5173.

## Demo walkthrough

1. The page opens on Emily's **Day 19** (Friday, Nov 20, 2026). She has done 15 of 19 tasks, and two are overdue.
2. Mango points to the first one: **Read the Employee Handbook**. Click **Show me where**, then click the glowing stone.
3. Read the task details, then check **Task completed? Yes**. Before Day 1 is now complete, and Mango grows from small and green to yellow-green.
4. Click **Start First Week** to jump straight to the other overdue task, security training, and complete it. Mango grows again, now fully ripe.
5. Click **Start First Month**, complete the 30-day check-in, and Mango pops into the corner to celebrate. Click **Next task**.
6. Complete the last task and Mango graduates.
7. In any task, click the name under **Questions?** to see how to reach that person.
8. Open **Calendar** to see every task by due date, **Mail** for messages from Sarah, David and IT, and **Completed** to revisit finished tasks.

Click **Reset demo** at the bottom to start over.

## What we guessed and what we left out

Every assumption and every cut is logged in [DECISIONS.md](DECISIONS.md).

Highlights:
- **Guessed:** the three phases, what counts as a task versus a message, and that tasks can be opened in any order.
- **Left out of v1:** the manager view, Sarah's HR view for editing plans, auto-generated plans by role, real login and integrations.

## How it's built

- [React](https://react.dev) and [Vite](https://vite.dev) for the app, [Tailwind CSS](https://tailwindcss.com) for styling.
- Sample data lives in [`src/data/onboarding.js`](src/data/onboarding.js). Progress is saved in the browser with `localStorage`.
- No backend, accounts or API keys, so it runs anywhere.
- The mascot is an original SVG character drawn for this prototype.

Built with [Claude](https://claude.ai) as the AI coding tool.
