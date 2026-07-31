# extendnba

Additional indicators for non-basic ASCII characters in your files.

"Basic ASCII" here means printable ASCII characters (`0x20`-`0x7E`) plus the
common whitespace control characters tab, line feed, and carriage return.
Anything else — extended/control characters, accented letters, emoji, smart
quotes, non-breaking spaces, other Unicode symbols, etc. — is treated as
"non-basic ASCII".

## Features

* **Gutter indicator**: any line containing a non-basic ASCII character gets a
  marker in the editor gutter, making it easy to spot at a glance.
* **Problems panel entry**: whenever a file contains one or more non-basic
  ASCII characters, a warning diagnostic titled `Non-basic ASCII characters
  present` is added to the Problems panel, pointing at the first offending
  character.
* Only real files (on-disk or unsaved "untitled" editors) are analyzed.
  Virtual/temporary documents created by other tooling — such as the `git`
  diff view VS Code shows for version-controlled files — are ignored
  automatically, so you won't see duplicate or bogus problems like
  `batch_submit.py.git`.

Both indicators update live as you type, switch editors, or open/close files.

## Extension Settings

This extension contributes the following setting:

* `extendnba.ignorePatterns`: An array of glob patterns for files/paths that
  should be excluded from the gutter indicator and Problems panel diagnostic.
  Patterns are matched against both the workspace-relative path and the
  absolute file path. Defaults to `["**/.git/**"]`.

  ```json
  "extendnba.ignorePatterns": [
    "**/.git/**",
    "**/dist/**",
    "**/*.min.js"
  ]
  ```

## Requirements

No additional requirements or configuration — the extension works out of the
box on all open text documents.

## Known Issues

None currently known.

## Release Notes

### 0.0.3

* Fixed diagnostics/gutter markers incorrectly appearing on virtual/temporary
  documents (e.g. the `git` diff view of a tracked file), which previously
  showed up as duplicate problems like `batch_submit.py.git`.
* Added the `extendnba.ignorePatterns` setting to let users exclude files or
  folders by glob pattern.

### 0.0.2

Added gutter indicators and Problems panel diagnostics for non-basic ASCII
characters.

**Enjoy!**
