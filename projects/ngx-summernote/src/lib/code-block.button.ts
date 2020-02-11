declare var $;

const codeBlockButtonStyle = `font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
font-size: 12px;
padding: 14px 12px;
margin-bottom: 12px;
line-height: 1.42857;
word-break: break-all;
overflow-wrap: break-word;
background-color: rgb(250, 251, 253);
border: 1px solid rgb(234, 236, 240);
border-radius: 4px; color: #60a0b0;
white-space: pre-wrap;`;

export const codeBlockButton = function(context) {
  const ui = $.summernote.ui;

  // create button
  const button = ui.button({
    contents: '<i class="note-icon-frame" style="margin-right: 4px"></i> Code block',
    tooltip: 'Add code block',
    container: '.note-editor',
    className: 'note-btn',
    click: function() {
      let selectedText = null;
      // The below code will copy the selected block and add it into our code block
      if (window.getSelection) {
        selectedText = window
          .getSelection()
          .toString()
          .replace(/^\s+|\s+$/g, '');
      }
      const codeText = selectedText ? selectedText : `Place your code here.`;
      const codeBlock = `<pre class="code-block" style="${codeBlockButtonStyle}">${codeText}</pre>`;
      context.invoke('editor.pasteHTML', codeBlock);
    }
  });

  return button.render(); // return button as jquery object
};
