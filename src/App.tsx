import { useEffect, useRef, useState } from 'react'
import './App.css'
import {EditorState, TextSelection} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {schema} from "prosemirror-schema-basic"
import {undo, redo, history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"
import { NodeType, Schema } from 'prosemirror-model';
import { InputRule, inputRules } from "prosemirror-inputrules"
import ReactDOM from 'react-dom' 


function App() {

  const CustomComponent = () => {
    return <div style={{ backgroundColor: 'yellow', padding: '5px' }}>Custom Component</div>;
  };

  let customSchema = new Schema({
    nodes: schema.spec.nodes.append({
      em_link: {
        group: "inline+",
        content: "text*",
        toDOM() { return ["p", {class:'em-link'}, 0] },
      },
      blueText: {
        group: 'inline',
        inline: true,
        content: 'text*', // Allow only text content
        attrs: {
          color: { default: 'blue' },
          backgroundColor: { default: 'lightblue' },
        },
        toDOM(node) {
          return ['span', { style: `color: ${node.attrs.color}; background-color: ${node.attrs.backgroundColor}` }, node.textContent];
        },
        parseDOM: [
          {
            tag: 'span',
            getAttrs(dom) {
              return {
                color: 'blue',
                backgroundColor: 'lightblue',
              };
            },
          },
        ],
      },
      box: {
        group: 'block',
        content: 'text*',
        toDOM() { return ['div', {class: 'box'}, 0] },
      },
      placeholder: {
        inline: true,
        group: 'inline',
      }
    }),

    marks: schema.spec.marks
  });

  const [button, setButton] = useState(false);
  const blueTextNode = customSchema.nodes.blueText as NodeType;

  const renderComponent = () => {
    const component = <CustomComponent />;
    const dom = document.createElement('div');
    ReactDOM.render(component, dom);
    return dom;
  };

  

  const customInlineInputRule = new InputRule(
    /\s<>$/, // Regular expression pattern to match
    (state, match, start, end) => {
      console.log('start')

      const randomText = Math.random().toString(36).substring(7); // Generate a random string
      const tr = state.tr.replaceWith(start+1, end+1, blueTextNode.create(null, [customSchema.text(`<> ${randomText} `)])); // Replace with blue text node containing 'hello'
      return tr;
    }
  );

    

    useEffect(() => {
      setButton(true)
    })

  useEffect(() => {
    if(button){ 
      const editorConatiner = document.querySelector('#editor') as HTMLElement;
      const addBlock = document.querySelector('#addBlock') as HTMLElement;

    let state = EditorState.create({
      schema: customSchema,
      plugins: [
        history(),
        keymap({"Mod-z": undo, "Mod-y": redo}),
        keymap(baseKeymap),
        inputRules({rules: [customInlineInputRule]}),
      ]
    })
  
  
  let view = new EditorView(editorConatiner, {
    state,
    dispatchTransaction(transaction) {
      console.log("Document size went from", transaction.before.content.size,
                  "to", transaction.doc.content.size)
      let newState = view.state.apply(transaction)
      view.updateState(newState)
    },
  });

  addBlock.addEventListener('click', (evt) => {
    evt.preventDefault();
    console.log('add block');
    let tr1 = view.state.tr.insert(0, customSchema.nodes.paragraph.create(null, null));
    tr1 = tr1.insert(1, customSchema.nodes.horizontal_rule.create(null, null));
    tr1 = tr1.setSelection(TextSelection.create(tr1.doc, 0));
    view.dispatch(tr1); 
  
  });

  addBlock.addEventListener('mousedown', (evt) => {
    evt.preventDefault();
    console.log('mouse down');
    
  })}

  }, [button])

  


  return (
    <>
    <div id='app'>
      <h1>Ideaflow-Coding-Challenge</h1>
      <button id="addBlock">add block</button>
      <div id="editor"></div>
    </div>
  
    </>
  )
}

export default App
