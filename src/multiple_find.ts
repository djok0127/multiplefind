import {
	window,
	ThemeColor,
	TextDocument,
    Position,
    Range,
    TextEditorDecorationType
} from 'vscode';


/////////////////////
// Global Constant //
/////////////////////


// set the background color constant
const decorationType1 = window.createTextEditorDecorationType({
    color: "#000000", // black font
    backgroundColor: "#eca1a6" // pink
});

const decorationType2 = window.createTextEditorDecorationType({
    color: "#000000", // black font
    backgroundColor: "#e3eaa7" // yellowish green
});

const decorationType3 = window.createTextEditorDecorationType({
    color: "#000000", // black font
    backgroundColor: "#d5e1df" // skyblue
});

const decorationType4 = window.createTextEditorDecorationType({
    color: "#000000", // black font
    backgroundColor: "#618685" // cyan
});

const decorationType5 = window.createTextEditorDecorationType({
    color: "#000000", // black font
    backgroundColor: "#dac292" // woody
});


/////////////////////////////////////
// Function call from extension.ts //
/////////////////////////////////////

// ctrl + shift + 1
export function highlight1() {
    _highlight_text(decorationType1);
}
export function highlight2() {
    _highlight_text(decorationType2);
}
export function highlight3() {
    _highlight_text(decorationType3);
}
export function highlight4() {
    _highlight_text(decorationType4);
}
export function highlight5() {
    _highlight_text(decorationType5);
}

// from the text we got highlight the text
function _highlight_text(deco: TextEditorDecorationType) {

    // set the current active text editor
    const { activeTextEditor } = window;

    // If there's no activeTextEditor, do nothing.
    if (!activeTextEditor) {
        return;
    }

    // get the document and the selection from the active text descriptor
    const { document, selection } = activeTextEditor;

    // get the higlight/selection from the current active document
    const { end, start } = selection;

    // checks if if we are selecting multiple lines
    const isMultiLine = end.line != start.line;

    // If the user is trying to seek while having made a multiline selection, do nothing.
    if (isMultiLine) {
        return;
    }

    // If the beginning and end of selection are on different line or different characters
    // that means the user is performing a selection search, otherwise, it means the user
    // is making a whole word search
    const isSelectionSearch = end.line !== start.line || end.character !== start.character;

    // For selection search, our range is the selection itself. Otherwise, we use
    // `document.getWordRangeAtPosition` to get the range of the word under the cursor
    const wordAtCursorRange = isSelectionSearch ? selection : document.getWordRangeAtPosition(end);

    // If at this point, we don't have a word range, abort.
    if (wordAtCursorRange === undefined) {
        return;
    }

    // get selected word
    const selectedWord = document.getText(wordAtCursorRange);
    let ranges = new Array();
    // go through each line
    for (let current_line = 0; current_line < document.lineCount; current_line++) {
        // get current text line
        let text_line = document.lineAt(current_line);
        if (text_line.isEmptyOrWhitespace) {
            continue;
        } else {
            
            // look for the word
            for (let find_cursor = 0; find_cursor < text_line.text.length; find_cursor++) {
                let substring = text_line.text.substr(find_cursor, selectedWord.length);
                if (selectedWord === substring) {
                    let start = new Position(current_line, find_cursor);
                    let end = new Position(current_line, find_cursor + selectedWord.length);
                    ranges.push(new Range(start, end));

                } // end of if selectedWord ...
            } // end of for find_cursor ...
        } // end of if isEmpty...
    } // end of for current_line...
    if (ranges) {
        setTimeout(() => {
           activeTextEditor.setDecorations(deco, ranges);
       }, 10);
   }
}// end of funct higlight
