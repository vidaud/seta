import { Observable, of } from "rxjs";
import { Operators, Term, TermType } from "../../models/term.model";

export const defaultTypeOfSearch = {
    code: "AC",
    name: "Autocomplete"
}
export const itemsBreadCrumb = [
    {label: 'Search', url: '/seta-ui/search'},
    {label: 'Document List'}
];
export const home = { icon: 'pi pi-home', url: '/seta-ui' }
export const typeOfSearches = [
    { name: 'Autocomplete', code: 'AC' },
    { name: 'Related term clusters', code: 'RC' },
    { name: 'Related terms', code: 'RT' }
];
export const columns = [
    {header: 'List'}
];

export const getWordAtNthPosition = (str: string, position: number | any) => {
    const n: any = str.substring(position).match(/^[a-zA-Z0-9-_]+/);
    const p: any = str.substring(0, position).match(/[a-zA-Z0-9-_]+$/);
    // if you really only want the word if you click at start or between
    // but not at end instead use if (!n) return
    
    //let test: any =  (p || '') + (n || ''); // demo
    let selected: any = !p && !n ? '' : (p || '') + (n || '');
    let value;
    if (p) {
        value = p.index;
    }
    let obj = [selected, value];
    return obj;
  }
  
export const createTree = (nodes) => {
    let label, key, children, node_list: any = [];
    nodes.forEach(node => {
        label = node[0];
        key = node[0];
        // node.shift();
        var children_list: any = [];
        var obj: any = {};
        node.forEach((item) => {
            obj = {'label': item, 'key': item};
            children_list.push(obj);
        });
        children = children_list;
        let tree_node = {
            key,
            label,
            children
        }
        node_list.push(tree_node);
    });
    let root;
    root = {
            "root": node_list
            
    }
}

export const isPhrase = (s): boolean => {
    const reWhiteSpace = new RegExp("\\s+");
        if (reWhiteSpace.test(s)) {
            return true;
        }
        return false;
}

export const transform = (textInput: string | { display: string; value: string } | any) => {
    let item: any = null;
    // is it a string?
    if (typeof textInput === `string`) {
      // is it an operator?
      if (textInput === `AND`) {
        item = new Term({
          display: `${textInput}`,
          termType: TermType.OPERATOR,
          value: `${textInput}`,
          isOperator: true,
          operator: Operators.properties[Operators.AND],
        });
      } else {
        /*Check if there is a pair of quotes*/
        const areQuotesPresent = textInput.match('"') !== null ? true : false;
        // are quotes present?
        if (areQuotesPresent) {
          const startQuote = textInput.indexOf('"');
          const finalQuote = textInput.indexOf('"', textInput.length - 1);
          if (startQuote === 0) {
            if (textInput.length >= 3 && finalQuote === textInput.length - 1) {
              item = new Term({
                display: `${textInput}`,
                termType: TermType.VERTEX,
                value: textInput.replace(/^"|"$/g, ''),
                isOperator: false,
              });
            //   setCopyQuery(item.display);
            }
          }
        } else {
            item = new Term({
                display: textInput.indexOf(`-`) !== -1 ? `"${textInput}"` : `${textInput}`,
                termType: TermType.VERTEX,
                value: textInput.replace(/^"|"$/g, ''),
                isOperator: false,
            });
        }
      }
    } else {
      // is it an operator?
      if (textInput.display === `AND`) {
        item = new Term({
          display: `${textInput.display}`,
          termType: TermType.OPERATOR,
          value: textInput.value.replace(/^"|"$/g, ''),
          isOperator: true,
          operator: Operators.properties[Operators.AND],
        });
      } else {
        item = new Term({
          display: textInput.display.indexOf(` `) !== -1 ?
            (textInput.display.match("\"") !== null ? true : false)
              ?
              `${textInput.display}`
              :
              `"${textInput.display}"`
            :
            textInput.display.indexOf(`-`) !== -1 ? `"${textInput.display}"` : `${textInput.display}`
          ,
          termType: TermType.VERTEX,
          value: textInput.value.replace(/^"|"$/g, ''), isOperator: false
        });
      }
    }

    if (item === null) {
        textInput = textInput + ` `;
        return of();
    } else {
        textInput = ` `;
    }
    return item;
}

export const getSelectedTerms = (suggestions: Term[]): string => {
  let suggestionsCopy: any = [...suggestions]
  suggestionsCopy = suggestionsCopy.filter((sugg) => { return sugg.termType !== TermType.DOCUMENT})
  let suggestionString = ``;
  let finalSuggestionString = ``;
  for (let index = 0; index < suggestionsCopy.length; index++) {
  const suggestion = suggestionsCopy[index];
  if (index < suggestionsCopy.length - 1) {
      if (suggestion.isOperator) {
      continue;
      } else {
      if (suggestion.display === `AND` || suggestion.display === `OR`) {
          continue;
      } else {
          if (
          (suggestionsCopy[index + 1].isOperator && suggestionsCopy[index + 1].operator.index === Operators.AND)
          ||
          (suggestionsCopy[index + 1].display === `AND`)
          ) {
          suggestionString += suggestion.display.replace('\\\"', '"') + Operators.properties[Operators.AND].code;
          } else {
          suggestionString += suggestion.display.replace('\\\"', '"') + Operators.properties[Operators.OR].code;
          }
      }
      }
  } else {
      suggestionString += suggestion.display.replace('\\\"', '');
  }
  }

  const suggestionList = suggestionString.split(` AND `)
  if (suggestionList.length > 0) {
  finalSuggestionString = suggestionList.reduce((total, currentValue, currentIndex, arr) => {
      if (currentIndex === 1) {
      return `(${total})` + ` AND ` + `(${currentValue})`;
      } else {
      return total + ` AND ` + `(${currentValue})`;
      }
  })
  } else {
  finalSuggestionString = suggestionString
  }
  return finalSuggestionString;
}

export const getListOfTerms = (terms) => {
  let listOF = terms.replace(/"([^"]+)"|\s+/g, (m, g1) => g1 ? g1 : '\"').split('"');
  let newListOF: any = [];
  listOF.forEach(element => {
    isPhrase(element) ? newListOF.push(`"${element}"`) : newListOF.push(element);
  });
  let transformedList: any = [];
  newListOF.forEach(element => {
      transformedList.push(transform(element))
  });
  return transformedList;
}

export const transformOntologyList = (nodes: any) => {
  let list: any = [];
  nodes.forEach((item) => {
      let element = {
          id: item[0],
          node: item
      }
      list.push(element);
  });
  return list;
}