# Urine Trouble! — The Kidney Arcade

An editable urinary-system learning website for solo practice and classroom play. The game files run independently of ChatGPT and include their own images, editor, scoring, and offline export tools.

## Project status

| Item | Status |
| --- | --- |
| Source repository | [kitkitskii/urine-trouble](https://github.com/kitkitskii/urine-trouble) — confirmed public repository |
| Repository owner | `kitkitskii` |
| Public website | **Pending GitHub Pages activation and verification** |
| Expected website address | `https://kitkitskii.github.io/urine-trouble/` — not confirmed live yet |

To enable publication, a repository administrator must open **Settings → Pages → Deploy from a branch**, select **main** and **/(root)**, and save. After deployment, verify the returned website address in a private/incognito window. Public visitors will not need a GitHub or ChatGPT account.

## Play and learn

| Game | Activity |
| --- | --- |
| **Urine It to Win It** | Answer multiple-choice and true/false questions. |
| **Spell Relief** | Build medical terms with letter tiles or enter a term. |
| **Match Made in the Medulla** | Connect matching terms and definitions. |
| **The Flow Show** | Put anatomical routes and processes in order. |
| **Pee-k at the Clues** | Enlarge picture clues and find their connecting term. |
| **Spot the Leak** | Identify an incorrect or unsafe clinical statement. |

The project includes 50 original urinary-system questions, 32 picture clues, 12 matching pairs in three rounds, six ordering activities, eight clinical-mistake checklists, six learning notes, and flashcards. Together, the games contain 67 scored challenges.

Choose solo practice or classroom mode for two to four teams. Solo first attempts earn points. In classroom mode, teams answer first, then the host reveals the solution and marks each correct team. Scores remain in the browser; a CSV score sheet can be exported.

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
