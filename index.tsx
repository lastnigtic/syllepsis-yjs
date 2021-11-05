/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror';
import { SylEditor } from '@syllepsis/access-react';
import { SylApi } from '@syllepsis/adapter';
import {
  AlignCenterPlugin,
  AlignJustifyPlugin,
  AlignLeftPlugin,
  AlignRightPlugin,
  AudioPlugin,
  BlockQuotePlugin,
  BoldPlugin,
  BulletListPlugin,
  FontSizePlugin,
  FormatClearPlugin,
  FormatPainterPlugin,
  HeaderPlugin,
  HrPlugin,
  ItalicPlugin,
  LetterSpacePlugin,
  LineHeightPlugin,
  LineIndentPlugin,
  ListItemPlugin,
  OrderedListPlugin,
  ParagraphPlugin,
  RedoPlugin,
  SpaceAfterPlugin,
  SpaceBeforePlugin,
  SpaceBothPlugin,
  StrikePlugin,
  SubPlugin,
  SupPlugin,
  UnderlinePlugin,
  UndoPlugin,
  VideoPlugin,
} from '@syllepsis/plugin-basic';
import { ToolbarLoader } from '@syllepsis/editor';
import { EditorState } from 'prosemirror-state';
import '@syllepsis/plugin-basic/assets/style.css';

const unWrapSylKeymapHandler = (fn: (state: EditorState) => boolean) => (editor: SylApi, state: EditorState) =>
  fn(state);

const Editor = () => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider('wss://localhost:1234', '', ydoc);
  const yXmlFragment = ydoc.getXmlFragment('prosemirror');

  // @ts-ignore
  window.example = { provider, ydoc, yXmlFragment };
  return (
    <SylEditor
      // @ts-ignore
      getEditor={(editor: SylApi) => (window.editor = editor)}
      keymap={{
        'Mod-z': unWrapSylKeymapHandler(undo),
        'Mod-y': unWrapSylKeymapHandler(redo),
        'Mod-Shift-z': unWrapSylKeymapHandler(redo),
      }}
      plugins={[
        ySyncPlugin(yXmlFragment),
        yCursorPlugin(provider.awareness),
        yUndoPlugin(),
        new RedoPlugin(),
        new UndoPlugin(),
        new BoldPlugin(),
        new BlockQuotePlugin(),
        new ListItemPlugin({
          maxNestedLevel: 4,
          matchInnerTags: ['section', 'p'],
          allowedLineHeights: [],
          allowedSpaceBefores: [],
          allowedSpaceAfters: { default: true, value: 20 },
          allowedSpaceBoths: [],
        }),
        new BulletListPlugin(),
        new OrderedListPlugin(),
        new HrPlugin(),
        new HeaderPlugin(),
        new ItalicPlugin(),
        new SubPlugin(),
        new SupPlugin(),
        new StrikePlugin(),
        new UnderlinePlugin(),
        new ParagraphPlugin({
          addMatchTags: ['section'],
          allowedAligns: [{ value: 'left', default: true }, 'center', 'right', 'justify'],
          allowedClass: [],
          allowedLineHeights: false,
          allowedLineIndents: [],
          allowedSpaceBefores: { default: true, value: 0 },
          allowedSpaceAfters: { default: true, value: 20 },
          allowedSpaceBoths: [],
        }),
        new FormatClearPlugin(),
        new FontSizePlugin({
          allowedValues: [12, 14, 16, { value: 17, default: true }, 18, 20, 24, 32],
          values: [12, 14, 16, { value: 17, default: true }, 18, 20, 24, 32],
          unit: 'px',
        }),
        new LetterSpacePlugin({
          allowedValues: [0, 0.5, 1, 1.5],
        }),
        new AlignLeftPlugin(),
        new AlignCenterPlugin(),
        new AlignRightPlugin(),
        new AlignJustifyPlugin(),
        new SpaceBeforePlugin({ values: [0, 4, 8, 12, 16, { value: 20, default: true }, 24, 28, 30] }),
        new SpaceAfterPlugin({ values: [0, 4, 8, 12, 16, { value: 20, default: true }, 24, 28, 30] }),
        new SpaceBothPlugin({ values: [0, 4, 8, 12, 16, { value: 20, default: true }, 24, 28, 30] }),
        new LineHeightPlugin({
          values: [1, 1.5, { value: 1.75, default: true }, 1.88, 2, 3],
        }),
        new LineIndentPlugin(),
        new FormatPainterPlugin(),
        new VideoPlugin({
          uploader: async (file) =>
            Promise.resolve({
              src: URL.createObjectURL(file),
              size: file.size,
              type: file.type,
              title: file.name,
            }),
          addAttributes: {
            test: {
              default: 'test',
              getFromDOM: () => 'test',
              setDOMAttr: (val, attrs) => (attrs.test = val),
            },
          },
        }),
        new AudioPlugin({
          uploader: (file: File) =>
            Promise.resolve({
              src: URL.createObjectURL(file),
            }),
        }),
      ]}
      module={{
        toolbar: {
          Ctor: ToolbarLoader,
          option: {
            tools: [
              BoldPlugin.getName(),
              ItalicPlugin.getName(),
              LetterSpacePlugin.getName(),
              LineHeightPlugin.getName(),
              LineIndentPlugin.getName(),
              OrderedListPlugin.getName(),
              SpaceAfterPlugin.getName(),
              SpaceBeforePlugin.getName(),
              SpaceBothPlugin.getName(),
              StrikePlugin.getName(),
              SubPlugin.getName(),
              SupPlugin.getName(),
              UnderlinePlugin.getName(),
              BlockQuotePlugin.getName(),
              BulletListPlugin.getName(),
              FontSizePlugin.getName(),
              FormatClearPlugin.getName(),
              FormatPainterPlugin.getName(),
              HeaderPlugin.getName(),
              HrPlugin.getName(),
              AlignLeftPlugin.getName(),
              AlignCenterPlugin.getName(),
              AlignRightPlugin.getName(),
              AlignJustifyPlugin.getName(),
              AudioPlugin.getName(),
              VideoPlugin.getName(),
            ],
          },
        },
      }}
    />
  );
};

ReactDOM.render(<Editor />, document.querySelector('#editor'));
