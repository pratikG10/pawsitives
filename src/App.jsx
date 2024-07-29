import { Button } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayouts from "./Layouts/PageLayouts/PageLayouts";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import Tales from "./pages/TalesPage/Tales";
import Dogs from "./pages/TalesPage/dogs";
import Cats from "./pages/TalesPage/Cats";
import Otheranimal from "./pages/TalesPage/Otheranimal";
import DonationPage from "./pages/TalesPage/DonationPage";
import Message from "./pages/Chat/Message";
import SavedPosts from "./componentes/Profile/SavedPosts";
import AddPet from "./pages/TalesPage/AddPet";

function App() {
  const [authUser] = useAuthState(auth);
  return (
    <PageLayouts>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/auth"} />}
        />
        <Route
          path="/auth"
          element={!authUser ? <AuthPage /> : <Navigate to={"/"} />}
        />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/tales" element={<Tales />} />

        <Route path="/dogs" element={<Dogs />} />
        <Route path="/cats" element={<Cats />} />
        <Route path="/other-animals" element={<Otheranimal />} />
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/Chat" element={<Message />} />
        <Route path="saved" element={<SavedPosts />} />
        <Route path="/add-dog" element={<AddPet />} />
      </Routes>
    </PageLayouts>
  );
}

export default App;
