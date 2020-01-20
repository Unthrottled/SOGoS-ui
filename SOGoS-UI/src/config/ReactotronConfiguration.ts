import Reactotron from 'reactotron-react-js';
import {reactotronRedux} from 'reactotron-redux';

declare global {
  interface Console {
    tron: (...args: any[]) => void;
  }
}

// @ts-ignore
console.tron = Reactotron.log;

const reactotronInstance = Reactotron.configure({
  name: 'SOGoS-UI',
})
  .use(reactotronRedux())
  .connect();

export default reactotronInstance;
