import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { setupStore } from 'store/store';
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "./dev";

const store = setupStore();

const str = 'Добро пожаловать в Let`s Meet';
const style = [
  'padding: 1rem;',
  'font: 1.3rem/3 Grunge;',
  'color: #333333;',
  'background: #FFFFFF;',
  'text-shadow: 2px 2px 0px #FFFFFF, 5px 4px 0px rgba(0,0,0,0.15);',
  'h1',
].join('');

console.log('%c%s', style, str);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <BrowserRouter>
      <Provider store={ store }>
        <DevSupport ComponentPreviews={ ComponentPreviews }
                    useInitialHook={ useInitial }
        >
          <App/>
        </DevSupport>
      </Provider>
    </BrowserRouter>,
);
