import { UseNav } from "../Providers/NavProvider";

export const Error404Page = () => {
  const { navigate, navUrls } = UseNav();
  return (
    <section>
      <h1>404 Page not found</h1>
      <div>
        Whoops! You either navigated to an invalid url or are not currently
        logged in.
      </div>
      <button
        onClick={() => {
          navigate(navUrls.login);
        }}
      >
        Login
      </button>
    </section>
  );
};
