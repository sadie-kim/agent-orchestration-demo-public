# Agent Orchestration Publish Runbook

This runbook is only for publishing the single file:

`demo/agent-orchestration.html`

## What is live

- Remote server SSH alias: `twcc`
- Remote server IP: `103.124.74.57`
- Remote folder: `~/demo`
- Published file: `~/demo/agent-orchestration.html`
- Web server port on the remote machine: `8001`
- Public URL: `https://sadie-demo.ngrok.io/agent-orchestration.html`

## How it works

The HTML file is copied to the remote server.

A simple Python web server on the remote machine serves files from `~/demo` on port `8001`.

`ngrok` makes that private server reachable on the public internet through:

`https://sadie-demo.ngrok.io`

## Publish a new version

From your Mac:

```bash
cd /Users/digitalintern/Documents/agent-orchestration-demo/demo
scp agent-orchestration.html twcc:~/demo/agent-orchestration.html
```

## Verify the file is on the server

```bash
ssh twcc 'ls -l ~/demo/agent-orchestration.html'
```

## Start the web server

```bash
ssh twcc 'cd ~/demo && nohup python3 -m http.server 8001 > ~/demo/http-8001.log 2>&1 < /dev/null &'
```

## Check the web server

```bash
ssh twcc 'pgrep -af "python3 -m http.server 8001"'
ssh twcc 'curl -I http://127.0.0.1:8001/agent-orchestration.html'
```

You want to see `HTTP/1.0 200 OK`.

## Start ngrok

```bash
ssh twcc 'cd ~ && nohup /usr/local/bin/ngrok http 8001 --domain=sadie-demo.ngrok.io --log=stdout > ~/ngrok-8001.log 2>&1 < /dev/null &'
```

## Check ngrok

```bash
ssh twcc 'ps -ef | grep "ngrok http 8001" | grep -v grep'
ssh twcc 'tail -n 50 ~/ngrok-8001.log'
```

You want the log to mention:

```text
url=https://sadie-demo.ngrok.io
```

## Open the public page

[https://sadie-demo.ngrok.io/agent-orchestration.html](https://sadie-demo.ngrok.io/agent-orchestration.html)

## Stop the web server

```bash
ssh twcc 'pkill -f "python3 -m http.server 8001"'
```

## Stop ngrok

```bash
ssh twcc 'pkill -f "ngrok http 8001 --domain=sadie-demo.ngrok.io"'
```

## Restart both

```bash
ssh twcc 'pkill -f "python3 -m http.server 8001" || true'
ssh twcc 'pkill -f "ngrok http 8001 --domain=sadie-demo.ngrok.io" || true'
ssh twcc 'cd ~/demo && nohup python3 -m http.server 8001 > ~/demo/http-8001.log 2>&1 < /dev/null &'
ssh twcc 'cd ~ && nohup /usr/local/bin/ngrok http 8001 --domain=sadie-demo.ngrok.io --log=stdout > ~/ngrok-8001.log 2>&1 < /dev/null &'
```

## Quick public check

From your Mac:

```bash
curl -I https://sadie-demo.ngrok.io/agent-orchestration.html
```
