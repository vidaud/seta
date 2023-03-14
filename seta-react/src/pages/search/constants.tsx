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
    // if(p) {
    //     setTest(p.index);
    // }
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
    // setTreeLeaf(root.root);
}

export const itsPhrase = (s): boolean => {
    const reWhiteSpace = new RegExp("\\s+");
    const underscore = s.includes('_');
        if (reWhiteSpace.test(s) || underscore) {
            return true;
        }
        return false;
}