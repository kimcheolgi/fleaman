import { useEffect } from 'react';
import { useRef } from 'react';
<script src="https://accounts.google.com/gsi/client" async defer></script>

const useScript = (url, onload) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.onload = onload;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [url, onload]);
};

export default function GoogleLogin({
  onGoogleSignIn = () => {},
  text = 'signin_with',
}) {
  const googleSignInButton = useRef(null);
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  useScript('https://accounts.google.com/gsi/client', () => {
    // https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.initialize
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onGoogleSignIn,
    });
    // https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.renderButton
    window.google.accounts.id.renderButton(
      googleSignInButton.current,
      { theme: 'filled_blue', size: 'large', text, width: '250' }, // customization attributes
    );
  });

  return <div ref={googleSignInButton}></div>;
}