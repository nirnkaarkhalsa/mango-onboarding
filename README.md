# BrightPath Onboarding

A first-version onboarding portal for BrightPath Technologies, built as a prototype to show Sarah (HR Manager). It has three views: the new hire's path, Sarah's HR view of everyone onboarding, and a manager's view of their team. Switch between them from the profile menu in the top corner.

New hires see one place with everything they need to do, broken into **Before Day 1**, **First Week** and **First Month**. Instead of a long checklist, tasks sit on a game-style path that highlights the one thing to focus on next. Mango, the mascot, grows and ripens alongside the new hire and graduates when onboarding is done.

## Who it's for

- **Emily, a new hire.** This prototype is her view. She asked for one thing above all: "I just want to know what I should focus on first."
- **Sarah, HR Manager.** She asked for this. Her view shows who's done, who's on time and who needs a nudge, and lets her add tasks, send messages and build plans for new hires.
- **David, Engineering Manager.** He sees the same view, showing only his team. His point that every department needs different steps shows up in the department templates.

## What the new hire sees

- **Shows one next step.** A "Start here" stone and Mango's speech bubble point to the earliest-due task that isn't done. Overdue tasks come first. **Show me where** scrolls to it on the path.
- **Keeps everything in one place.** Forms, documents, trainings, meetings and setup steps live on the path. Messages from HR and managers live separately in **Mail**, because they are information, not tasks.
- **Shows the plan by date.** The **Calendar** tab puts every task on the day it's due.
- **Tracks progress at a glance.** A ring for overall progress, one ring per phase, and an overdue count that only turns red when something needs attention.
- **Opens each task in full.** Due date, time it takes, who to ask (click the name for their contact details), step-by-step instructions and links, plus a **Task completed? Yes** box.
- **Celebrates progress.** Each completed task gets confetti and its own Mango celebration: a dance, a backflip, a party, then graduation. Finishing a section grows Mango from small and green to fully ripe. One click returns to the path, right at the next task.
- **Shows every task from the rings.** Click any progress ring to see all tasks, or one section's, filtered by done and to do.
- **Shifts color as you go.** The page background takes on a hint of Mango's color: pale green before Day 1, pale yellow in First Week, pale orange in First Month.
- **Fills in as you go.** Unfinished tasks are a light ghost of their phase color and fill in when done. A faded graduated Mango waits at the end of the path.
- **Keeps red for problems.** Phases are green, yellow-green and golden orange, so red only ever means overdue.
- **Shows who sent each message.** In Mail, click the sender's name for their contact details.
- **Remembers progress.** Completed tasks stay completed after a refresh. The **Completed** tab lists them so Emily can reopen anything later.

## What Sarah sees

- **Who needs attention, at a glance.** One pie chart and three mangos: Completed (graduated mango), On time (nerdy mango in big glasses) and Has an overdue task (worried mango). Click any of them to filter the list.
- **Everyone onboarding.** An alphabetical list with search, how long each person has been here, their progress and status.
- **A new hire's page.** Their rings and path, exactly as they see it. A **+** stone at the end of each section adds a task to their path.
- **Jump to what's overdue.** On a new hire's page, click the overdue count next to their name to jump to the task they haven't finished. Click again for the next one.
- **Messages that land in the new hire's Mail.** About a specific task, a general note, or a pre-filled reminder from their overdue count.
- **Mail.** Updates to everyone, a department, or chosen people.
- **Add new hire.** Pick a department to load its template, adjust it, choose the manager and publish.

David, as a manager, gets the same dashboard and mail for his team only, plus a **Team history** tab: on-time results for the 14 engineers who onboarded on his team since January 2025, the tasks most often finished late, and a table of every past engineer.

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
3. Read the task details, then check **Task completed? Yes**. Before Day 1 is now complete: Mango dances and grows from small and green to yellow-green. Click **Back to my path** and you land on the next task, and the background turns a touch yellow.
4. Open the glowing stone, security training, and complete it. Mango does a backflip and grows fully ripe, and the background turns a touch orange.
5. Complete the 30-day check-in for a Mango party, then the last task for graduation.
6. Click a progress ring at the top to see every task, done and to do.
7. In any task, click the name under **Questions?** to see how to reach that person. In **Mail**, click a sender's name to do the same.
8. Open **Calendar** to see every task by due date, and **Completed** to revisit finished tasks.

Then the HR side:

9. Open the profile menu in the top corner and choose **Sarah**.
10. Click the worried mango to see the five people with overdue tasks, then open **Emily**.
11. Click her overdue count to send a pre-filled reminder, and use a **+** stone to add a task to her First Week.
12. Open **Add new hire**, pick a department, adjust the template and publish.
13. On Emily's page, click **2 overdue** next to her name to jump to each unfinished task.
14. Switch to **David** to see only his team, then open **Team history**. Or switch back to **Emily** to see Sarah's reminder and the new task.

Click **Reset demo** at the bottom to start over.

## What we guessed and what we left out

Every assumption and every cut is logged in [DECISIONS.md](DECISIONS.md).

Highlights:
- **Guessed:** the three phases, what counts as a task versus a message, and that tasks can be opened in any order.
- **Left out:** editing published plans, AI-drafted plans, replies in Mail, real login and integrations.

## How it's built

- [React](https://react.dev) and [Vite](https://vite.dev) for the app, [Tailwind CSS](https://tailwindcss.com) for styling.
- Sample data lives in [`src/data/onboarding.js`](src/data/onboarding.js) (Emily), [`src/data/roster.js`](src/data/roster.js) (everyone onboarding, managers and department templates) and [`src/data/history.js`](src/data/history.js) (David's past engineers). Progress is saved in the browser with `localStorage`.
- No backend, accounts or API keys, so it runs anywhere.
- The mascot is an original SVG character drawn for this prototype.

Built with [Claude](https://claude.ai) as the AI coding tool.
