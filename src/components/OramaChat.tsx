import { OramaChatBox } from '@orama/react-components';

<OramaChatBox
  index={{
    endpoint: import.meta.env.VITE_ORAMA_ENDPOINT,
    api_key: import.meta.env.VITE_ORAMA_API_KEY
  }}
  sourcesMap={{
    title: 'name',
    description: 'content',
    path: 'url'
  }}
/>