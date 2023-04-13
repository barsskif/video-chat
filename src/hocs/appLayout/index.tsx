import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { StyledBoxPagesComponent } from 'components/StyledComponents';

const appLayout = (PageComponent: () => JSX.Element, header = true, footer = true) => {
  return function WithPage({ ...props }) {
    return (
      <>
        {header && <Header />}
        <StyledBoxPagesComponent>
          <PageComponent {...props} />
        </StyledBoxPagesComponent>
        {footer && <Footer />}
      </>
    );
  };
};

export default appLayout;
