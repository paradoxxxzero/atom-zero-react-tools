'use babel'
/* global atom */

import { CompositeDisposable } from 'atom'

export default {
  modalPanel: null,
  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily
    // Cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'zero-react-tools:toggle-sass-jsx': () => this.toggleSassJsx(),
      'zero-react-tools:add-sass-import': () => this.addSassImport(),
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  serialize() {
  },

  insertOnLine(editor, line) {
    const position = editor.getCursorScreenPosition()
    const chkpt = editor.getBuffer().createCheckpoint()
    editor.moveToTop()
    editor.insertText(`${ line }\n`)
    // editor.autoIndentSelectedRows()
    editor.getBuffer().groupChangesSinceCheckpoint(chkpt)
    editor.setCursorScreenPosition(position)
    editor.moveDown(1)
  },

  toggleSassJsx() {
    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) {
      return
    }
    const path = editor.getPath()
    let newPath = ''
    if (path.match(/.+\.jsx$/)) {
      newPath = path.replace(/\.jsx$/, '.sass')
    } else if (path.match(/.+\.sass$/)) {
      newPath = path.replace(/\.sass$/, '.jsx')
    } else {
      return
    }
    atom.workspace.open(newPath)
  },

  addSassImport() {
    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) {
      return
    }
    const path = editor.getPath()
    const match = path.match(/.*\/(.+)\.jsx$/)
    if (!match) {
      return
    }
    const [, component] = match
    this.insertOnLine(editor, `import './${ component }.sass'`)
  }
}
