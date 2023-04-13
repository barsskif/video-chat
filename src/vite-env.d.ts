/// <reference types="vite/client" />
/// <reference types="@types/w3c-screen-orientation" />

declare global {
  interface Navigator {
    wakeLock: {
      request: (type: 'screen') => Promise<WakeLockSentinel>;
    };
  }
}

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}


interface ImportMeta {
  readonly env: ImportMetaEnv
}

