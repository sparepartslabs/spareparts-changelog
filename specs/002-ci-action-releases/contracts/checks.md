# Required Check Contract

Configure branch protection for `main` with these exact check names after each has run once:

- `Tests / Node 20`
- `Tests / Node 22`
- `Tests / Node 24`
- `Distribution / committed artifacts`
- `Dependency scan / npm audit`
- `Secret scan / trufflehog`

Pull-request workflows use `contents: read` or no permissions and receive no repository secrets. Check names are compatibility contracts: renaming them requires updating branch protection.
