export interface YCommentBody {
  mentions: string[];
  text: string;
  // invalidMention: boolean;
}

/**
 * コメント要素を取得し、YComment に変換する
 */
export interface YComment {
  elm: HTMLElement; //これを消したらまるっと消える
  insertElm: Element | null; // ここにボタンを付け足したら丁度いい
  author: string;
  commentBody: YCommentBody;
}

export default function getComment(elm: HTMLElement): YComment {
  const commentElement = elm.querySelector('#content-text span');
  const commentBody = extractTextFromElement(commentElement);

  return {
    elm,
    insertElm: elm.querySelector('#body.ytd-comment-view-model ytd-comment-engagement-bar #toolbar') ?? null,
    author: elm.querySelector('#author-text span')?.textContent?.trim() ?? '',
    commentBody: commentBody
  };
}

function extractTextFromElement(element: Element | null): YCommentBody {
  if (!element) {
    // return { mentions: [], text: '', invalidMention: false }; // 要素がない場合、空のデータを返す
    return { mentions: [], text: '' }; // 要素がない場合、空のデータを返す
  }
  const anchorTexts: string[] = [];
  let outerText = '';
  // let invalidMention = false

  // 子ノードをループ
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === 'SPAN') {
        // SPAN 内の <a> タグのテキストを取得
        el.querySelectorAll('a').forEach((a) => {
          anchorTexts.push(a.textContent?.trim() || '');
        });
      }
    }
    else if (node.nodeType === Node.TEXT_NODE) {
      const { textContent } = node
      if (textContent) {
        // const invalidMentionPattern = new RegExp(/^(@\S+)\s/); // 空白以外の文字にマッチするよう修正
        // invalidMention = invalidMentionPattern.test(textContent)
        // 一番外側の span に囲まれていないテキスト
        outerText += textContent.trim();
      }
    }
  });
  // return { mentions: anchorTexts, text: outerText, invalidMention };
  return { mentions: anchorTexts, text: outerText }
}
