# AdDaptive Front-end

Static front-end for platform.addaptive.com served by nginx.

## Compiling

Gulp is used to compile, concatenate, and minify LESS and JS.

### Tasks

`gulp` - Compiles all JS/CSS then start watch tasks that will compile when JS/LESS files change in real-time
`gulp build` - Compiles all JS/CSS then exits

### Auto-versioning

`./index.html` serves as a template that compiles to `./index.min.html`. Variable strings are replaced by the `html` gulp task during the compile process. Each file's mtime is checked, and the date is used to generate an md5 hash that becomes the query string `?v={hash}`.

### Deploy

Need docs here to explain the tagging business

## Server Config

An nginx server config is found is `./config/nginx.conf`. This can be modified to setup a localhost, and is also intended for use on dev and production servers (modifications needed with each)