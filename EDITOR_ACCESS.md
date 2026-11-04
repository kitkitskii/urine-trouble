# Instructor editing access

## Open the editor

Choose **Edit Content** and enter the instructor password. The editor locks again when you leave it, apply changes, reload the page, or choose **Lock editor**. Learners can play without this password. Give the instructor the password privately; keep it separate from the project files and public repository.

## Change the password

1. Unlock **Edit Content**, then choose **Change password**.
2. Enter the current password and a new password of **12–128 characters**. Confirm the new password.
3. Save it. This updates the password in the current browser; it does not publish the change for other devices.
4. Choose **Download editor-access.js**. In the GitHub repository, sign in with an account that can maintain the project, choose **Add file → Upload files**, and upload that downloaded file at the repository root, replacing the previous `editor-access.js`. Commit the change.
5. The connected Render site normally redeploys automatically after the commit. Wait for the latest deployment to show **Live**, refresh the website, and test the new password. GitHub Pages also rebuilds from the configured branch.

A full website HTML, website ZIP, or CI transfer-kit export also retains the current password settings. Publishing the complete website ZIP is another way to share the update. A project JSON content backup does not change password settings. Restoring question defaults does not remove the password requirement.

## What the lock protects

This static/offline website uses a password prompt to deter casual access to the editing interface. It is **not server authentication**. A visitor can still modify their own downloaded files or browser copy. Browser edits do not overwrite the published website; that requires the repository owner's or an authorized maintainer's access.

The files contain only a salted PBKDF2 password verifier, never the plaintext password or an unlocked login session. No online password-recovery service is included. A forgotten password requires the project maintainer to create and publish a replacement verifier; keeping an independent backup and agreed maintainer access remains necessary.

For an instructor-only shared administration system with server-enforced permissions and direct online publishing, the project would need an authenticated backend. That service is not part of this portable release.

## If editing does not open

- Check that you have the instructor password; a learner's solo name is not an editing password.
- Use the HTTPS website in a current full browser. Offline-file support for password verification depends on that browser. If verification is unavailable, the editor stays locked.
- After a shared password update, wait for hosting deployment and refresh the page. A new published verifier supersedes an older password change saved by that browser.
