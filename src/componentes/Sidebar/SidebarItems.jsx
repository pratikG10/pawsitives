import CreatePost from "./CreatePost";
import Furryt from "./Furryt";
import Home from "./Home";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import Chat from "./Chat";

const SidebarItems = () => {
  return (
    <>
      <Home />
      <Search />

      <CreatePost />
      <Furryt />
      <ProfileLink />
    </>
  );
};

export default SidebarItems;
