import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Signup from "@/pages/Signup";
import Feed from "@/pages/Feed";
import Videos from "@/pages/Videos";
import Tweets from "@/pages/Tweets";
import Streams from "@/pages/Streams";
import MeetUp from "@/pages/MeetUp";
import Wall from "@/pages/Wall";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Landing />,
    },
    {
      element: <Layout />,
      children: [
        { path: "/feed", element: <Feed /> },
        { path: "/videos", element: <Videos /> },
        { path: "/tweets", element: <Tweets /> },
        { path: "/streams", element: <Streams /> },
        { path: "/meetup", element: <MeetUp /> },
        { path: "/wall", element: <Wall /> },
        { path: "/wall/:handle", element: <Wall /> },
      ],
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ],
  { basename: "/yoibi" }
);