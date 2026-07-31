# Change Log

All notable changes to the "extendnba" extension will be documented in this file.

## [0.0.3]

- Fixed diagnostics/gutter markers incorrectly appearing on virtual/temporary documents (e.g. the `git` diff view of a tracked file), which previously showed up as duplicate problems like `batch_submit.py.git`.
- Added the `extendnba.ignorePatterns` setting to let users exclude files or folders by glob pattern.

## [0.0.2]

- Added gutter indicators and Problems panel diagnostics for non-basic ASCII characters.
