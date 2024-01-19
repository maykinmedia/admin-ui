# Contribution guidelines

If you want to contribute, we ask you to follow these guidelines.

## Reporting bugs

If you have encountered a bug in this project, please check if an issue already exists in the list
of existing [issues][issues]. If such an issue does not exist, you can create a [new
issue][new_issue]. When writing the bug report, try to add a clear example that shows how to
reproduce said bug.

## Adding new features

Before making making changes to the code, we advise you to first check the list of existing
[issues][issues] for this project to see if an issue for the suggested changes already exists. If
such an issue does not exist, you can create a [new issue][new_issue]. Creating an issue gives an
opportunity for other developers to give tips even before you start coding.

### Code style

To keep the code clean and readable, this project uses:

- [`eslint`](https://www.npmjs.com/package/eslint) to format the code and keep diffs for pull
  requests small

- [`prettier`](https://www.npmjs.com/package/prettier) to automatically format the code, including
  import sorting

- [`commitlint`](https://www.npmjs.com/package/commitlint) to automatically check for the commit
  message format (see next section).

Whenever a branch is pushed or a pull request is made, the code will be checked in CI by the tools
mentioned above, so make sure to install these tools and run them locally before pushing
branches/making pull requests.

### Making the changes

Please ensure that an issue exists before you start committing changes. Ideally, every commit can be
traced back to a Github issue.

On your local machine, create a new branch, and name it like:

- `feature/some-new-feature`, if the changes implement a new feature
- `issue/some-issue`, if the changes fix an issue

Once you have made changes or additions to the code, you can commit them (try to keep the commit
message descriptive but short). Make sure to format your commit message like
`:sparkles: #1 - feat: implement new feature`.

### Making a pull request

If all changes have been committed, you can push the branch to your fork of the repository and
create a pull request to the `main` branch of this project's repository. Your pull request will be
reviewed, if applicable, feedback will be given and if everything is approved, it will be merged.

When your branch is not ready yet to be reviewed, please mark it as draft so we don't run
unnecessary Chromatic builds (our quota are limited under the free plan).

### Reviews on releases

All pull requests will be reviewed by a project memeber before they are merged to a release branch.

[issues]: https://github.com/maykinmedia/maykin-ui/issues
[new_issue]: https://github.com/maykinmedia/maykin-ui/issues/new
[repository]: https://github.com/maykinmedia/maykin-ui
