# Maykin UI

A reusable component library developed by [Maykin Media](https://www.maykinmedia.nl).


## DEVELOPMENT NOTICE

This libray is in active development.

## Release procedure

When releasing a new version of the package, follow these steps:

```bash
git pull
npm run build
npm run makemessages # Check that nothing changed, otherwise stop
npm run compilemessages # Check that nothing changed, otherwise stop
```
Update the version in the `package.json` file. Then:

```bash
npm install
git add package.json package-lock.json
git commit -m ":bookmark: - chore: <new version>"
git push
```

If you do not have the rights to push directly to `main`, make a release branch with the
release commit and merge it. Then, `git pull` the changes on `main` and:

```bash
git tag 0.0.XX-alpha
git push --tags
npm publish --tag alpha --access=public
```

If you do not have credentials to publish to npm, ask someone else to do it.