import Link from 'next/link';
import messages from '../../messages/en.json';
import '@/styles/globals.scss';

/** 404 for requests the proxy does not localise (e.g. unknown files). Uses the default-locale messages. */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>{messages.notFound.title}</h1>
          <p>{messages.notFound.description}</p>
          <Link href="/">{messages.notFound.backHome}</Link>
        </main>
      </body>
    </html>
  );
}
