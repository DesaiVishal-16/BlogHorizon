import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import {
  ErrorPage,
  LandingPage,
  AuthPage,
  MainPage,
  PostsPage,
  ProfilePage,
  NewPostPage,
  SinglePostPage,
} from "./pages";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { profileLoader } from "./utils";
import { ProtectedRoute } from "./routes";

function App() {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const router = createBrowserRouter([
    { path: "/", element: <LandingPage />, errorElement: <ErrorPage /> },
    {
      path: "/auth/:type",
      element: <AuthPage />,
      errorElement: <ErrorPage />,
      loader: async ({ params }) => {
        const validTypes = ["register", "login"];
        if (!validTypes.includes(params.type!)) {
          return redirect("/auth/register");
        }
        return null;
      },
    },
    {
      path: "/",
      element: <MainPage />,
      errorElement: <ErrorPage />,
      hydrateFallbackElement: <></>,
      children: [
        {
          element: <ProtectedRoute />,
          children: [
            { path: "posts", element: <PostsPage /> },
            { path: "create-new-post", element: <NewPostPage /> },
            {
              path: "profile/:username",
              element: <ProfilePage />,
              loader: profileLoader,
            },
            { path: "profile/:username/:postId", element: <SinglePostPage /> },
          ],
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
