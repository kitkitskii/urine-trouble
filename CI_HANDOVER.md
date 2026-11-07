# Are You Kidney Me? — CI handover and continuity

This learning website is a portable collection of HTML, CSS, JavaScript, and embedded images. Keep the project files as the lasting deliverable, together with control of the hosting account and a tested recovery copy.

**Project creators:** Bill, Janez, Yesha, Aethan, Richelaine, Francine, Jochebid, Divine, and Shakira.

## What happens if a subscription or account ends?

**Ending ChatGPT Plus will not delete the separately hosted website or the downloaded project files.** The website has no ChatGPT API, sign-in, or subscription dependency at runtime. ChatGPT was used to develop the files; the external hosting account serves them.

**Deleting the GitHub account that owns the current repository can delete its repositories and GitHub Pages website.** Transfer the repository or retain an independent copy before deleting that account. GitHub documents this consequence in [personal account management](https://docs.github.com/en/account-and-profile/concepts/account-management).

A URL is not a guarantee of permanent hosting. A provider account, applicable plan and service terms must remain active. A local backup can still be used and rehosted when an online service changes.

## A project-branded free address

A project name can replace the student's personal username in the public address. Example names below are **proposals, not reserved or verified live addresses**.

| Option | Example | Ownership and continuity |
| --- | --- | --- |
| Cloudflare Pages | `are-you-kidney-me.pages.dev` | Suitable for these static files. Create the project in an account controlled by the agreed CI/school owner. Give maintainers their own member access. Keep an independent export. |
| Render static site | `are-you-kidney-me.onrender.com` | Free project-named static hosting under an agreed owner’s account. Connect Render or deploy the supplied blueprint; the name is not reserved until deployment succeeds. |
| Netlify | `are-you-kidney-me.netlify.app` | Supports a project-named address and documented team-transfer workflow. Current Free-plan credit and collaboration limits need checking before handover. |
| School subdomain or custom domain | `kidney.school.example` or an owned project domain | Gives the institution more control over the address and allows hosting to change behind it. A registered domain normally needs renewal; a school subdomain depends on the school's policy. |

Free provider addresses still include the provider's suffix, such as `pages.dev` or `netlify.app`. A school-controlled or owned custom domain is needed to remove those suffixes entirely. [GitHub Pages also supports owned custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages), but changing the address alone does not transfer control of its underlying hosting or repository.

Cloudflare documents [direct upload and project addresses](https://developers.cloudflare.com/pages/get-started/direct-upload/). Direct Upload can publish a complete folder without connecting a GitHub repository. For this static project, Cloudflare's current documentation says [static-asset requests are free and unlimited](https://developers.cloudflare.com/pages/functions/pricing/); other project limits and terms still apply.

Netlify documents [project-name addresses](https://docs.netlify.com/manage/domains/domains-fundamentals/understand-domains/) and [signed-in drag-and-drop publication](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/). Use a signed-in, agreed owner account instead of leaving a deployment unclaimed. Its [current Free-plan limitations](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/) include pausing after monthly limits and restrictions on adding team members. New Free projects may show a provider badge; the owner can [turn it off in project settings](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/).

## Recommended handover arrangement

For a free static deployment, create the new project directly under an agreed CI/school-controlled hosting account. Cloudflare supports account members with assigned permissions, and recommends more than one Super Administrator for continuity. Each person should use their own login. The documented [member-management process](https://developers.cloudflare.com/fundamentals/manage-members/manage/) allows another administrator to retain control when one maintainer leaves. No invitations have been sent as part of this guide.

This is an operational recommendation, not a promise that a free provider will remain available forever. The reliable recovery path is possession of the complete files and the ability to publish them elsewhere.

## Transfer and acceptance checklist

1. Agree who owns the project and who will maintain it after submission. Record the CI/school custodian and a second maintainer.
2. Use **Downloads** with the instructor password to create the website ZIP, standalone editable HTML, or CI transfer kit. Supply these copies with the project JSON backup and maintenance guides to both the project team and the CI/school.
3. Confirm the CI can open the offline HTML on a computer without ChatGPT or an internet connection.
4. Place the hosted project under the agreed owner. Grant suitable administrator/member permissions using individual logins; do not hand over a personal password.
5. Confirm the CI can sign in, edit one nonclinical title, export it, upload the changed files, and restore a prior version.
6. Record the verified public URL only after publication succeeds. Test both the homepage and dashboard while signed out.
7. If retaining GitHub as the source repository, transfer it to the agreed CI/school account or organization before the student account is deleted. GitHub supports [repository transfers](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository), but its Pages addresses are not automatically redirected after transfer. Recheck the hosting configuration and links.
8. If using Netlify, check its [project-transfer requirements](https://docs.netlify.com/manage/projects/transfer-project/) and destination-plan restrictions. A transfer to an unrelated team may require support. Do not assume a transfer has completed until the CI has verified access.
9. For Cloudflare, retaining the project in the same institutional account and changing its administrators avoids depending on a move between separate accounts. If a move becomes necessary, confirm the current provider process; redeployment is portable but the free address may change.
10. Keep the original host and backups until the CI has accepted and tested the new deployment. Remove or delete an old account only after that acceptance.

## Maintaining the teaching content

Unlock **Edit Content** with the instructor password, apply and test the changes, then export a new website ZIP. Publish the exported files to share the update. Browser drafts and scores are local to a device; they are not a shared database. Keep JSON and website backups after significant revisions.

## Instructor password and publication

Give the instructor the password privately, separately from this kit. The same password is used for **Edit Content** and website **Downloads**; no new password is introduced for downloads. Leaving the editor, applying changes, reloading, or choosing **Lock editor** locks editing again. Games and CSV score-sheet downloads remain available without this password.

For a website copy, choose **Downloads**, select HTML, website ZIP, or CI transfer kit, and enter the instructor password. Each successful check creates one selected download and relocks. Closing the prompt or navigating away cancels a pending request. An instructor already working in the unlocked editor may export without entering the password again.

When the current password is known, unlock the editor and choose **Change password**. Enter the current password, then a new password of **12–128 characters** twice. A saved password change first applies only to that browser. Choose **Download editor-access.js**, sign into the project GitHub repository with maintenance access, upload that file at the repository root to replace its previous version, and commit. The connected Render site normally redeploys after the commit; wait for **Live** and refresh before testing the new password. Full website exports also carry the current password settings. Content JSON imports and question-default restoration do not change the lock.

This is a static/offline interface lock, not server authentication or encryption. Current prebuilt HTML, ZIP, JSON backup, and quick-start text are not served at public direct-download URLs; the password-prompted interface creates the selected export. Public source and older repository history remain accessible, so a technical visitor can still copy the public source or modify a local copy. Visitors cannot overwrite the published website without authorized repository access. The public files contain a salted PBKDF2 verifier, not the plaintext password or an unlocked session. A genuine instructor-only shared admin service would require an authenticated backend. Keep the password private and agree how the maintainer will replace its verifier if it is forgotten.

## Custody record — complete before submission

| Record | Agreed details |
| --- | --- |
| Project owner / institution | ______________________________ |
| Clinical instructor / custodian | ______________________________ |
| Primary hosting administrator | ______________________________ |
| Second maintainer | ______________________________ |
| Hosting provider and project name | ______________________________ |
| Verified public URL | ______________________________ |
| Source repository owner | ______________________________ |
| Independent backup locations | ______________________________ |
| Acceptance and recovery test date | ______________________________ |

No new free-host address, ownership transfer, or CI access is claimed as completed by this document.

## Supplied Render setup

The included render.yaml defines a static site with no database or server process. Render documents free static sites and project onrender.com addresses at https://render.com/docs/static-sites. Use an agreed CI/school-controlled workspace. The owner reports having created a Render Blueprint, but its service URL and successful deployment have not been verified in this record. Record the returned project address after checking the live site; this kit does not claim to have reserved one. Usage allowances and account terms still apply.

## Solo identities

Player names and scores stay in the current browser. Export a score CSV separately when a class record is needed. Content/website exports intentionally do not distribute students’ session names or scores.

## Forgotten-password help and maintainer reset

The **Forgot password?** guidance is available from editing, download, and password-change forms. It works offline and preserves the selected form and unsaved draft. Check the browser's Password Manager or the private instructor record first; the website cannot show the current password or send a reset email.

A repository maintainer can create replacement settings without the old password:

1. Open the maintainer instructions under **Forgot password?**, then choose **Open reset tool**, or save `recovery.html` for offline use.
2. Enter a new password of **12–128 characters** twice and create the replacement `editor-access.js`. Keep the password private. The tool creates only a salted verifier and does not send or store the password.
3. Sign into GitHub using authorized repository-maintenance access. At the project root, use **Add file → Upload files** to replace `editor-access.js`, then commit. Preserve that exact filename.
4. Wait for the connected Render deployment to show **Live**, or for GitHub Pages publication to succeed. Hard-refresh the website if necessary, then test **Edit Content** and **Downloads** with the new password.

Generating a settings file does not reset or unlock the existing website. Only an authorized maintainer can publish it to the shared site. The generic helper is public and portable; it does not grant repository access, clear content or scores, or provide server authentication. It is included in modular exports and the CI kit and can be opened or saved from the standalone copy. See [instructor access instructions](EDITOR_ACCESS.md) for the full procedure.
