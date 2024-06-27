import { Suspense } from 'react';
import ChatContainer from './components/ChatContainer';
import Loading from './loading';

export default function HomePage() {
  return (
    <Suspense fallback={<Loading/>}>
      <ChatContainer />
    </Suspense>
  )
}
