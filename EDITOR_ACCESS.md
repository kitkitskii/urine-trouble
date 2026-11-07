# Instructor editing and download access

## Open the editor

Choose **Edit Content** and enter the instructor password. The editor locks again when you leave it, apply changes, reload the page, or choose **Lock editor**. Learners can play without this password. Give the instructor the password privately; keep it separate from the project files and public repository.

## Download a website copy

The existing instructor password also controls the website’s **Downloads** interface; the password has not been changed for this feature.

1. Choose **Downloads** and select the standalone HTML, website ZIP, or CI transfer kit.
2. Enter the instructor password to create the selected download. The download permission is used once, then locks again.
3. To download another copy, enter the password again. Closing the prompt or leaving the page cancels a pending check.

An instructor already in an unlocked editor may use its export controls without an additional prompt. **CSV score-sheet downloads remain available during play without a password.** Keep an independent offline copy after downloading; prebuilt HTML, ZIP, JSON backup, and quick-start text are no longer published as direct-download files in the current website deployment.

## If the password is forgotten

Choose **Forgot password?** below the password form in **Edit Content**, **Downloads**, or **Change password**. The help stays with the current form, preserving the selected download type and unsaved editor draft.

First check the browser's Password Manager for this website's address, or ask the instructor/project maintainer for the private password record. The website cannot display the current password or send a reset email.

### Maintainer reset without the old password

If no saved copy exists, an authorized repository maintainer can replace the password without knowing the old one:

1. In **Forgot password?**, open the maintainer instructions and choose **Open reset tool**. You can also save the portable `recovery.html` tool and open it later in a current full browser.
2. Enter a new password of **12–128 characters** twice. Create and download the replacement **editor-access.js** file. If the browser adds a number to its filename, rename it to exactly `editor-access.js` before uploading.
3. Sign into the project GitHub repository with an account allowed to maintain it. At the repository root, choose **Add file → Upload files**, upload the new `editor-access.js` to replace the previous file, and **Commit changes**.
4. Wait for the connected Render deployment to show **Live** (or for GitHub Pages publication to succeed). Refresh the website, using a hard refresh or private/incognito window if needed, and test the new password in both **Edit Content** and **Downloads**.
5. Keep the new password privately and retain an updated project backup. Do not put the plaintext password in the repository, guides, or transfer kit.

The tool creates the replacement settings locally using browser cryptography. It needs no old password and does not send or store the new password. The downloaded file contains a salted verifier, not a readable password.

**Creating or downloading this file does not reset or unlock the running website.** The existing password remains active until an authorized maintainer publishes the replacement settings. Anyone can use the generic helper to make a file, but they cannot apply it to the shared website without repository access. No questions, scores, or browser content are erased by the helper.

The recovery tool is included in modular website exports and the CI kit, and can be opened or saved from the standalone offline copy. If browser password verification is unavailable, use the HTTPS website or a current full browser that supports the tool.

## Change the password

1. Unlock **Edit Content**, then choose **Change password**.
2. Enter the current password and a new password of **12–128 characters**. Confirm the new password.
3. Save it. This updates the password in the current browser; it does not publish the change for other devices.
4. Choose **Download editor-access.js**. In the GitHub repository, sign in with an account that can maintain the project, choose **Add file → Upload files**, and upload that downloaded file at the repository root, replacing the previous `editor-access.js`. Commit the change.
5. The connected Render site normally redeploys automatically after the commit. Wait for the latest deployment to show **Live**, refresh the website, and test the new password. GitHub Pages also rebuilds from the configured branch.

A full website HTML, website ZIP, or CI transfer-kit export also retains the current password settings. Publishing the complete website ZIP is another way to share the update. A project JSON content backup does not change password settings. Restoring question defaults does not remove the password requirement.

## What the lock protects

This static/offline website uses a password prompt to deter casual access to the editing and website-download interfaces. It is **not server authentication or encryption**. The public source and repository history remain accessible; a technical visitor can still copy public source or modify downloaded files and browser copies. Browser edits do not overwrite the published website; that requires the repository owner's or an authorized maintainer's access.

The files contain only a salted PBKDF2 password verifier, never the plaintext password or an unlocked login session. There is no online password-recovery service. The included recovery tool can create replacement settings without the old password; an authorized maintainer must publish them to reset the shared website. Keep an independent backup and agreed maintainer access.

For an instructor-only shared administration system with server-enforced permissions and direct online publishing, the project would need an authenticated backend. That service is not part of this portable release.

## If editing does not open

- Check that you have the instructor password; a learner's solo name is not an editing password.
- Use the HTTPS website in a current full browser. Offline-file support for password verification depends on that browser. If verification is unavailable, editing and website downloads stay locked.
- After a shared password update, wait for hosting deployment and refresh the page. A new published verifier supersedes an older password change saved by that browser.
