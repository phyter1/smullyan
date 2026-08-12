# Releasing smullyan

Releases are driven by [changesets](https://github.com/changesets/changesets) and
published to npm from GitHub Actions using **trusted publishing (OIDC)**. There is
no `NPM_TOKEN` secret in this repository in steady state.

## One-time bootstrap (unavoidable)

Trusted publishing cannot create a package. npm's own docs are explicit: _"The
package you're configuring must already exist on the npm registry."_ The Trusted
Publisher panel only exists on a package's settings page, and `npm trust github`
rejects a name that has never been published. So version `0.0.0` (or the real
`0.1.0`) must be published **once, by a human, from a laptop**:

```sh
npm login                 # interactive, with 2FA
pnpm run build
npm publish --access public --provenance=false
```

Use `npm publish` (not `pnpm publish`) for the bootstrap so the local login
credentials are used directly, and skip provenance — provenance requires a
supported cloud CI runner and will fail from a laptop.

Do **not** mint a granular access token with "bypass 2FA" for this. Since
2026-07-31 those tokens can no longer change package access, maintainers, or
trusted-publishing configuration, and around January 2027 they lose direct
publish rights entirely. An interactive `npm login` is the correct bootstrap.

### Then register the trusted publisher

Either at `https://www.npmjs.com/package/smullyan/access` → _Trusted Publisher_ →
_GitHub Actions_, or from the CLI (npm >= 11.15.0, 2FA required):

```sh
npm trust github smullyan \
  --repository phyter1/smullyan \
  --file release.yml \
  --environment npm-publish \
  --allow-publish
```

The registered values must match the workflow **exactly**:

| Field           | Value         | Notes                                                                     |
| --------------- | ------------- | ------------------------------------------------------------------------- |
| Organization    | `phyter1`     | GitHub org or username                                                    |
| Repository      | `smullyan`    | repo name only                                                            |
| Workflow        | `release.yml` | **filename only**, not `.github/workflows/release.yml`                    |
| Environment     | `npm-publish` | optional on npm's side, but if set it must match the job's `environment:` |
| Allowed actions | `npm publish` | required for configs created after 2026-05-20                             |

Finally, on the package settings page set publishing access to **"Require
two-factor authentication and disallow tokens"**. Trusted publishing is exempt
from that restriction, so this closes the token path permanently.

## Steady state

1. Open a PR. Add a changeset: `pnpm changeset`.
2. Merge to `main`. The `Release` workflow opens or updates a
   **"chore(release): version packages"** PR containing the version bumps and the
   generated `CHANGELOG.md`.
3. Merge the version PR. The same workflow runs again, sees no changesets left,
   runs `pnpm run release` (`build` + `changeset publish`), publishes to npm over
   OIDC with provenance, and pushes the git tag and GitHub release.

Nothing is ever published from a local machine again.

## Verifying provenance

Consumers can verify the whole dependency tree's attestations with:

```sh
npm audit signatures
```

On npmjs.com the package page shows a **Provenance** panel naming the source
commit, the repository, and the workflow run that built the tarball, plus a
"Published via GitHub Actions" / trusted-publisher badge. The attestation itself
is signed by Sigstore and recorded in the public Rekor transparency log.

Provenance proves _where and how_ the tarball was built. It does not attest that
the code is safe.

---

## Signed release commits

`changesets/action` builds the version commit with `git commit`, and commits
pushed that way are **never GitHub-signed** — the web-flow signature is only
applied to commits created through the API or web UI. Since `main` requires
signed commits, every release PR previously had to be merged with `--admin`.

The `version` job now signs its commit with a dedicated SSH key.

### How it is scoped

|            |                                                                           |
| ---------- | ------------------------------------------------------------------------- |
| Key        | Dedicated ed25519, used only for release commits                          |
| Storage    | **Environment** secret `RELEASE_SIGNING_KEY` on `release-signing`         |
| Reach      | Only jobs declaring that environment — i.e. `release.yml`'s `version` job |
| Revocation | Independent of your personal signing key                                  |

An environment secret is invisible to any job that does not declare the
environment, so no other workflow in the repo can read it. `release-signing`
has no protection rules, so it does not gate ordinary merges.

### The trade-off, stated plainly

**This job can produce commits attributable to the account.** The commit is
authored as `81502122+phyter1@users.noreply.github.com` because GitHub verifies
an SSH signature against signing keys on the account whose _email authored the
commit_ — authoring as `github-actions[bot]` would fail verification, since no
signing key can be added to that bot account.

Anyone who can land a workflow file in this repo could, in principle, read an
environment secret by declaring that environment. On a public repo that accepts
outside pull requests, secrets are **not** exposed to forked-PR runs, so the
practical risk is limited to collaborators with write access.

If that trade is ever unwanted, the alternatives are: drop
`required_signatures` on `main` (loses a real guarantee about every human
commit), or go back to merging the version PR with `--admin`.

### Rotating the key

```sh
ssh-keygen -t ed25519 -N "" -C "smullyan-ci-release-signing" -f /tmp/k
gh secret set RELEASE_SIGNING_KEY --env release-signing < /tmp/k
gh ssh-key add /tmp/k.pub --type signing --title "smullyan-ci-release-signing"
rm -f /tmp/k /tmp/k.pub
```

Then delete the old signing key from <https://github.com/settings/keys>.

### If the key is missing

The job fails immediately with an explicit error rather than producing an
unsigned commit that silently cannot be merged.

## Historical: why the version PR used to need an admin merge

`changesets/action` builds the "Version Packages" commit by running `git commit`
on the runner. Commits pushed that way are **never signed** — GitHub's web-flow
signature is only applied to commits created through the API or web UI. The
commit therefore lands as:

```
author=github-actions[bot]  verified=false  reason=unsigned
```

`main` has branch protection with `required_signatures: true`, so the version PR
is `BLOCKED` and must be merged with `gh pr merge <n> --squash --admin`.
`enforce_admins` is deliberately `false` so this is possible.

### Two other CI facts that compound with it

1. **The version PR gets no CI on creation.** GitHub does not fire
   `pull_request` events for PRs opened with `secrets.GITHUB_TOKEN`. Closing and
   reopening the PR as a user (`gh pr close N && gh pr reopen N`) triggers a
   real `reopened` event and runs the full suite — worth doing before the admin
   merge, so the release commit is actually tested.

2. **`release.yml` runs `pnpm run ci` before publishing.** That is the real
   gate: format, lint, typecheck, 100% coverage, declaration emit, and package
   verification all run on the same execution that publishes.

### If you want this fully automated

Three options, in increasing order of how much you have to trust CI:

- **Leave it.** A human admin-merge before every publish is a defensible gate
  for an action that is irreversible from the public's point of view. This is
  the current state.
- **Give CI a signing key.** Generate a dedicated SSH key, add the public half
  to the account as a _Signing Key_, put the private half in repo secrets, and
  configure `git config gpg.format ssh` in the release job. Bot commits then
  verify. The cost is a private key living in CI, which is exactly the thing
  trusted publishing was adopted to avoid elsewhere in this pipeline.
- **Drop `required_signatures`.** Simplest, and loses a real guarantee about
  human commits for the sake of one bot commit. Not recommended.

### Repo settings this depends on

- **Settings → Actions → Workflow permissions →** "Allow GitHub Actions to
  create and approve pull requests" must be **on**, or the version job fails
  with `GitHub Actions is not permitted to create or approve pull requests`.
- `LEFTHOOK=0` is set in `release.yml`, and `prepare` skips hook installation
  when `CI` is set. Without both, `changesets/action`'s `git commit` fires the
  pre-commit hook on a runner that has no `gitleaks` or `convco`.
