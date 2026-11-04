# Are You Kidney Me? — The Kidney Arcade

An editable urinary-system learning website for solo practice and classroom play. The game files run independently of ChatGPT and include their own images, editor, scoring, and offline export tools.

## Project status

| Item | Status |
| --- | --- |
| Source repository | [kitkitskii/urine-trouble](https://github.com/kitkitskii/urine-trouble) — confirmed public repository |
| Repository owner | `kitkitskii` |
| Public website | **Published — GitHub deployment succeeded** |
| Public website address | [Open Are You Kidney Me?](https://kitkitskii.github.io/urine-trouble/) |

GitHub Pages uses **Deploy from a branch → main → /(root)**. GitHub confirmed the [successful publication](https://github.com/kitkitskii/urine-trouble/actions/runs/41637448097). Public visitors need no GitHub or ChatGPT account. See [the publishing record](PUBLISHING.md).

## Homepage and dashboard

[Home](https://kitkitskii.github.io/urine-trouble/index.html?v=5) introduces the arcade. [Dashboard](https://kitkitskii.github.io/urine-trouble/dashboard.html?v=5) contains the games, session controls and playcard.

Wrong attempts remain retryable; an eventual correct answer earns the challenge’s points once. Hints do not lock the answer. Sorting retries retain earlier correct cards.

## Arcade Run and free play

Choose **Arcade Run** for a mix of up to five unfinished challenges, with a stage trail and pause/resume. Choose any illustrated game card for free play. Both options use the same answer rationales and scoring. Word tiles support typing and Backspace as well as clicking.

## Play and learn

| Game | Activity |
| --- | --- |
| **Urine It to Win It** | Answer multiple-choice and true/false questions. |
| **Spell Relief** | Build medical terms with letter tiles or enter a term. |
| **Match Made in the Medulla** | Connect matching terms and definitions. |
| **Double Trouble** | Flip cards to match terms with definitions. |
| **Filter Files** | Sort urinary-system cards into categories. |
| **Word on the Wee** | Find medical terms in a classic letter grid. |
| **The Flow Show** | Put anatomical routes and processes in order. |
| **Pee-k at the Clues** | Enlarge picture clues and find their connecting term. |
| **Spot the Leak** | Identify an incorrect or unsafe clinical statement. |

The project includes 68 urinary-system questions, 32 picture clues, 12 matching pairs in three rounds, six ordering activities, eight clinical-mistake checklists, ten learning notes, eight sorting rounds, three memory rounds, and flashcards. Together, the games contain 100 scored challenges.

Choose solo practice or classroom mode for two to four teams. Solo players earn points once when a challenge is solved, including after mistakes. In classroom mode, teams answer first, then the host reveals the solution and marks each correct team. Scores remain in the browser; a CSV score sheet can be exported.

## Offline and editable copies

- [Download the standalone editable HTML](downloads/Urine_Trouble_Editable.html?raw=1).
- [Download the complete website ZIP](downloads/Urine_Trouble_Editable_Website.zip?raw=1).

Open the standalone HTML in a full modern browser on a computer. No account, installation, local server, or internet connection is required after downloading. Local-file saved progress depends on browser support.

## Update the content

Use **Edit Content** to change questions, answers, accepted terms, pictures, game titles, instructions, points, learning notes, and website settings.

**Edits save in the current browser. They do not automatically update the public website on other devices.**

To publish a change:

1. Apply and test the edited content.
2. Export an updated website ZIP.
3. Extract it and replace the repository’s root website files.
4. Commit the changes, wait for the Pages deployment, and verify the published copy.

The adviser can maintain the project through a GitHub collaborator account. Maintaining the site requires no ChatGPT login and no coding for ordinary content changes.

## Adviser handover

- [Project record and ownership handover](PROJECT_HANDOVER.md)
- [Maintenance and publishing guide](MAINTENANCE_GUIDE.md)
- [One-page adviser quick start](ADVISER_QUICK_START.pdf)
- [File inventory and checksums](HANDOVER_MANIFEST.json)

Complete the project-team, school, adviser, and maintainer fields before submission. The current technical repository owner is `kitkitskii`; agree who should control it long term and add the adviser as a collaborator.

## Technical notes

The source uses HTML, CSS, and plain JavaScript. There is no backend, database, package installation, build command, or ChatGPT API dependency. `content.js` contains the question bank and embedded clue images. `assets.js` contains the mascot. `engine.js`, `app.js`, and `editor.js` handle the rules, games, and content editing. The remaining scripts provide portable HTML and ZIP exports.

The public repository includes the source code and answer bank. The complete source can also be hosted by the school or another static host. No custom domain is registered or connected by these files.

## Discovery homepage and named solo play

The homepage offers an organ explorer, flip facts and a study trail. Solo sessions accept a name or nickname, which appears on the playcard and CSV score sheet. Names and scores remain in the current browser. The word-search game uses editable matching terms.

## CI ownership and recovery

Use **Downloads → Download CI transfer kit** for the current editable website, standalone offline copy, JSON backup, Render blueprint and [CI handover guide](CI_HANDOVER.md). Ending ChatGPT Plus does not remove the separately hosted files. Deleting the actual source account or repository can remove its hosted copy. Keep independent copies and agree a CI/school-controlled hosting account.

A free project-named address on another host is pending a connected hosting account and verified deployment. This repository contains a static render.yaml setup; an administrator can review it through [Render deployment](https://render.com/deploy?repo=https://github.com/kitkitskii/urine-trouble). No new provider address is claimed live.
