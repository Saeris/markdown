---
"markdown-github-alerts": patch
---

Fix the alert accent border/background showing as neutral grey in the VSCode
preview. VSCode 1.85+ styles `.markdown-alert` with unlayered rules that beat
the plugin's `@layer`-scoped defaults; re-assert the accent unlayered in the
extension's stylesheet (a host-integration concern, kept out of the plugin).
