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

Both indicators update live as you type, switch editors, or open/close files.

## Requirements

No additional requirements or configuration — the extension works out of the
box on all open text documents.

## Known Issues

None currently known.

## Release Notes

### 0.0.2

Added gutter indicators and Problems panel diagnostics for non-basic ASCII
characters.

**Enjoy!**
