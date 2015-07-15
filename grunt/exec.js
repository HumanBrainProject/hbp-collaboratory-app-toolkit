var exec = {
  gitRelease: [
    'git commit ./package.json ./bower.json ./CHANGELOG.md -m "bump v<%= pkg.version %>"',
    // Use the GITHUB_API_TOKEN passed to travis and the TRAVIS_REPO_SLUG to push
    'git push -q https://$GITHUB_API_TOKEN@github.com/$TRAVIS_REPO_SLUG master',
    'git add -f ./dist',
    'git commit -m "dist files"',
    'git tag v<%= pkg.version %>',
    'git push -q https://$GITHUB_API_TOKEN@github.com/$TRAVIS_REPO_SLUG v<%= pkg.version %>'
  ].join(' && '),
  changelog: 'printf "### Version <%= pkg.version %>\n\n$(cat CHANGELOG.md)\n" > CHANGELOG.md'
}

module.exports = exec;
