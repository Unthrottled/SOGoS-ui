import Reactotron from 'reactotron-react-js';
import {reactotronRedux} from "reactotron-redux";

const reactotronInstance = Reactotron.configure({
    name: 'SOGoS-UI',
})
    .use(reactotronRedux())
    .connect();

export default reactotronInstance;
