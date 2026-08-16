import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Signup from "@/pages/Signup";
import Feed from "@/pages/Feed";
import Videos from "@/pages/Videos";
import Tweets from "@/pages/Tweets";
import Streams from "@/pages/Streams";
import MeetUp from "@/pages/MeetUp";
import Wall from "@/pages/Wall";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/tweets" element={<Tweets />} />
        <Route path="/streams" element={<Streams />} />
        <Route path="/meetup" element={<MeetUp />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/wall/:handle" element={<Wall />} />
      </Route>
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
