const octokit = require('@octokit/rest')();
const fs = require('fs');

// token (https://github.com/settings/tokens)
octokit.authenticate({
  type: 'token',
  token: process.env.accessToken,
})

/**
 * Paginates a call
 * @param {Function} call 
 */
async function paginate (call) {
  let response = await call({per_page: 100})
  let {data} = response
  while (octokit.hasNextPage(response)) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
  }
  return data
}

paginate(() => octokit.repos.getForOrg({org: process.env.org}))
  .then(data => {
    fs.writeFileSync('/repos', JSON.stringify(data));
  }).catch(err => {
      console.log(err.message);
      process.exit(1);
  });
