Branches:
main = development as well as production branch

[when deploying to cpanel, zip of src is done and is uploaded manually]

also make sure to make migrations while doing any db changes
and run mgiration from cpanel terminal after uploading src.zip file

## Run Locally

Clone the project

```bash
  git clone <project-url>
```

Go to the project directory

```bash
  cd project_dir
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

API Docs

```
http://localhost:<port>/api-docs

```
