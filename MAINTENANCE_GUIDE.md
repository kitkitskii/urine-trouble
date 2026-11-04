# Are You Kidney Me? — Adviser maintenance guide

## GitHub Pages configuration

1. Open the confirmed public repository: https://github.com/kitkitskii/urine-trouble.
2. Confirm the complete website files have been committed to `main`. `index.html` must be at the repository root, alongside `app.js`, `content.js`, and the other source files. If an upload is still needed, extract the website ZIP and upload its contents rather than only the ZIP or an extra nested folder.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**, then select **main** and **/(root)**. Save. An account with repository administration access must complete this setting; the connected file-editing tools cannot enable Pages.
5. Wait for GitHub’s Pages deployment to finish. Open the website address shown by GitHub and test it in a private/incognito browser window. Public visitors should reach the game without a ChatGPT login.
6. Add the adviser under **Settings → Collaborators** and give the agreed maintenance permission. Complete the project record in `PROJECT_HANDOVER.md`.

The public address is https://kitkitskii.github.io/urine-trouble/. The saved source is `main` / `/(root)`, and GitHub confirmed the [successful deployment](https://github.com/kitkitskii/urine-trouble/actions/runs/41637448097). See `PUBLISHING.md` for the publication record.

## Update questions, pictures, or game titles

1. Open the website and choose **Edit Content**.
2. Make the changes. The editor supports the site title and theme, game labels and instructions, question choices and answer keys, accepted answers, per-choice rationales, sorting cards, picture clues, matching pairs, ordered steps, mistake checklists, and learning notes.
3. Use **Apply changes** to make the edited content active in that browser. Applying changes starts a fresh score session.
4. Test the changed questions and read their explanations.
5. Export an updated **website ZIP**. The export includes the current content and the editor.
6. Extract the updated ZIP. In the GitHub repository, use **Add file → Upload files** and upload the exported root files, replacing the previous versions. Commit the change with a short description such as “Update catheter-care questions.”
7. Wait for the Pages deployment to finish. Reload the public website and test the changed item. A hard refresh or a private/incognito window helps confirm the new published copy rather than a browser’s saved draft.

Changes are shared with other visitors **after the hosting files are updated and published**. A local browser draft or **Apply changes** alone does not publish them.

## Keep backups

- Export the project/question data as JSON after making important content changes.
- Keep the latest website ZIP and standalone HTML together with the guides.
- Export a CSV score sheet if a session’s scores need to be retained. Content exports do not transfer live game scores between devices.
- Keep an earlier working ZIP or use GitHub’s commit history before replacing a working version.

## Offline use

Open `Urine_Trouble_Editable.html` in a full browser on a computer. The games, images, editor, and exports are included in that file. No ChatGPT account or internet connection is needed after it has been downloaded. Some phone file-preview apps do not run the game’s JavaScript.

To resume saved local progress, use the same browser and keep the file in the same location when the browser permits local-file storage. The game remains usable for the current visit if storage is unavailable.

## If something looks wrong

| Symptom | Check |
| --- | --- |
| The website shows a repository page or a 404 | Confirm `index.html` is at the published root and Pages is using `main` / `/(root)`. |
| A recent edit is visible only on one device | Export the edited website, replace the hosting files, and wait for publication. Local drafts are device/browser specific. |
| An old title or question still appears | Check the latest Pages deployment, then try a hard refresh or private/incognito window. A saved local draft may override the published default content in that browser. Back up the draft before restoring defaults. |
| Images disappear after a file update | Upload the complete exported source set. Do not remove `content.js` or `assets.js`. Uploaded clue images should remain embedded through the editor. |
| The editor blocks a change | Read the validation message. Check correct-answer choices, word-tile letter counts, required pictures, unique matching pairs, and ordered steps. |
| Scores need to start again | Choose **New session**. In classroom mode, click a marked team again to correct an award. |

## Hosting on a different provider or school domain

The source ZIP is portable. Publish the folder containing `index.html` on a static host with no build command. If the school has an existing website, its administrator can host the files there or connect a project domain. The files do not require ChatGPT hosting, authentication, or services to run.

## Arcade Run

The run chooses up to five unfinished challenges across different enabled games. Pause returns to the menu; Continue Arcade Run resumes the stage sequence. A new session or applied content update resets it. Its score rules are the same as free play. The question bank, game labels, and rationales remain editable through Edit Content.

## Home, dashboard and retries

Retain both index.html and dashboard.html when updating the hosting files. The standalone HTML includes both screens. Brand title: Are You Kidney Me? Wrong attempts do not remove points; corrected solutions earn the item’s points once. A sorting card must be corrected before the next card.
