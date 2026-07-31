// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { minimatch } from 'minimatch';

// A "basic ASCII" character is a printable character in the range 0x20-0x7E,
// plus the common whitespace control characters (tab, line feed, carriage return).
// Anything else (extended/control characters, non-ASCII Unicode, emoji, etc.) is
// considered "non-basic ASCII".
const NON_BASIC_ASCII_RE = /[^\x09\x0A\x0D\x20-\x7E]/;
const NON_BASIC_ASCII_RE_GLOBAL = /[^\x09\x0A\x0D\x20-\x7E]/g;

const DIAGNOSTIC_MESSAGE = 'Non-basic ASCII characters present';
const DIAGNOSTIC_SOURCE = 'extendnba';
const CONFIG_SECTION = 'extendnba';

// Document URI schemes that represent a "real" file worth analyzing. Other
// schemes (e.g. "git", "gitlens", "output", "vscode-userdata", ...) are used by
// VS Code and other extensions for virtual/diff/temporary documents that
// shouldn't be reported as problems in the user's actual files.
const ANALYZABLE_SCHEMES = new Set(['file', 'untitled']);

let gutterDecorationType: vscode.TextEditorDecorationType;
let diagnosticCollection: vscode.DiagnosticCollection;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "extendnba" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('extendnba.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from extendnba!');
	});

	context.subscriptions.push(disposable);

	gutterDecorationType = vscode.window.createTextEditorDecorationType({
		gutterIconPath: context.asAbsolutePath('media/non-basic-ascii.svg'),
		gutterIconSize: 'contain',
		overviewRulerColor: '#e2c08d',
		overviewRulerLane: vscode.OverviewRulerLane.Right
	});
	context.subscriptions.push(gutterDecorationType);

	diagnosticCollection = vscode.languages.createDiagnosticCollection('extendnba');
	context.subscriptions.push(diagnosticCollection);

	// Analyze all currently visible editors on activation
	vscode.window.visibleTextEditors.forEach(editor => updateEditor(editor));

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				updateEditor(editor);
			}
		}),
		vscode.window.onDidChangeVisibleTextEditors(editors => {
			editors.forEach(editor => updateEditor(editor));
		}),
		vscode.workspace.onDidChangeTextDocument(event => {
			const editor = vscode.window.visibleTextEditors.find(e => e.document === event.document);
			if (editor) {
				updateEditor(editor);
			} else {
				updateDiagnostics(event.document);
			}
		}),
		vscode.workspace.onDidOpenTextDocument(document => {
			updateDiagnostics(document);
		}),
		vscode.workspace.onDidCloseTextDocument(document => {
			diagnosticCollection.delete(document.uri);
		}),
		vscode.workspace.onDidChangeConfiguration(event => {
			if (event.affectsConfiguration(`${CONFIG_SECTION}.ignorePatterns`)) {
				// Ignore patterns changed: re-evaluate everything currently open.
				vscode.window.visibleTextEditors.forEach(editor => updateEditor(editor));
			}
		})
	);
}

/**
 * Reads the user-configurable list of glob patterns to ignore.
 */
function getIgnorePatterns(): string[] {
	const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const patterns = config.get<string[]>('ignorePatterns', []);
	return Array.isArray(patterns) ? patterns : [];
}

/**
 * Determines whether a document should be analyzed at all: it must be backed
 * by a real (or untitled) file, and must not match any of the user's
 * configured ignore glob patterns.
 */
function shouldAnalyze(document: vscode.TextDocument): boolean {
	if (!ANALYZABLE_SCHEMES.has(document.uri.scheme)) {
		return false;
	}

	const patterns = getIgnorePatterns();
	if (patterns.length === 0) {
		return true;
	}

	const relativePath = vscode.workspace.asRelativePath(document.uri, false);
	const fsPath = document.uri.fsPath;

	return !patterns.some(pattern =>
		minimatch(relativePath, pattern, { dot: true }) || minimatch(fsPath, pattern, { dot: true })
	);
}

/**
 * Recomputes gutter decorations and diagnostics for a given text editor.
 */
function updateEditor(editor: vscode.TextEditor): void {
	const document = editor.document;

	if (!shouldAnalyze(document)) {
		editor.setDecorations(gutterDecorationType, []);
		diagnosticCollection.delete(document.uri);
		return;
	}

	const decorations: vscode.DecorationOptions[] = [];

	for (let line = 0; line < document.lineCount; line++) {
		const lineText = document.lineAt(line).text;
		if (NON_BASIC_ASCII_RE.test(lineText)) {
			decorations.push({ range: new vscode.Range(line, 0, line, 0) });
		}
	}

	editor.setDecorations(gutterDecorationType, decorations);
	updateDiagnostics(document);
}

/**
 * Recomputes the Problems panel diagnostic for a given document.
 */
function updateDiagnostics(document: vscode.TextDocument): void {
	if (!shouldAnalyze(document)) {
		diagnosticCollection.delete(document.uri);
		return;
	}

	const text = document.getText();
	NON_BASIC_ASCII_RE_GLOBAL.lastIndex = 0;
	const match = NON_BASIC_ASCII_RE_GLOBAL.exec(text);

	if (!match) {
		diagnosticCollection.delete(document.uri);
		return;
	}

	const startPos = document.positionAt(match.index);
	const endPos = document.positionAt(match.index + match[0].length);
	const diagnostic = new vscode.Diagnostic(
		new vscode.Range(startPos, endPos),
		DIAGNOSTIC_MESSAGE,
		vscode.DiagnosticSeverity.Warning
	);
	diagnostic.source = DIAGNOSTIC_SOURCE;

	diagnosticCollection.set(document.uri, [diagnostic]);
}

// This method is called when your extension is deactivated
export function deactivate() {}
