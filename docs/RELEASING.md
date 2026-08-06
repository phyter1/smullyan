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
