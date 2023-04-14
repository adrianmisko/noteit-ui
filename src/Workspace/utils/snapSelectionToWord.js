function snapSelectionToWord() {
  let sel;
  // Check for existence of window.getSelection() and that it has a
  // modify() method. IE 9 has both selection APIs but no modify() method.
  if (window.getSelection) {
    sel = window.getSelection();
  }
  if (window.getSelection && sel.modify !== null) {
    if (!sel.isCollapsed) {
      // Detect if selection is backwards
      const range = document.createRange();
      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);
      const backwards = range.collapsed;
      range.detach();

      // modify() works on the focus of the selection
      const endNode = sel.focusNode;
      const endOffset = sel.focusOffset;
      sel.collapse(sel.anchorNode, sel.anchorOffset);

      let direction = [];
      if (backwards) {
        direction = ['backward', 'forward'];
      } else {
        direction = ['forward', 'backward'];
      }

      sel.modify('move', direction[0], 'character');
      sel.modify('move', direction[1], 'word');
      sel.extend(endNode, endOffset);
      sel.modify('extend', direction[1], 'character');
      sel.modify('extend', direction[0], 'word');
    }
  } else {
    sel = document.selection;
    if (sel !== null && sel.type !== 'Control') {
      const textRange = sel.createRange();
      if (textRange.text) {
        textRange.expand('word');
        // Move the end back to not include the word's trailing space(s),
        // if necessary
        while (/\s$/.test(textRange.text)) {
          textRange.moveEnd('character', -1);
        }
        textRange.select();
      }
    }
  }
}

export default snapSelectionToWord;
