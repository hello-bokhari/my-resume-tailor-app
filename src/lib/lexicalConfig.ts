
import { HeadingNode, QuoteNode, ParagraphNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { TextNode } from 'lexical';

export const initialConfig = {
  namespace: 'ResumeTailorEditor',
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    AutoLinkNode,
    LinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    ParagraphNode,
    TextNode,
  ],
  onError: (error: Error) => {
    console.error(error);
  },
  theme: {
    paragraph: "",
    text: {
      bold: "",
      italic: "",
    },
  },
};
