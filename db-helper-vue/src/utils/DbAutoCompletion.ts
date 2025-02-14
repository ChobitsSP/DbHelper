import { CompletionContext } from '@codemirror/autocomplete';
import _ from 'lodash';

import filterBy from '@/filters/filterBy';
import { IColumn } from '@/models/Index';

export function SqlInputAutoComplete(context: CompletionContext, columns: IColumn[]) {
  let word = context.matchBefore(/\w*/);
  if (word === null) return null;
  if (word.from === word.to && !context.explicit) return null;

  return {
    from: word.from,
    options: [],
  };
}