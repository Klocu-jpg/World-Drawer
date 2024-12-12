import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Navbar />
      <h2 className="p-4">Welcome to Global Route Drawer</h2>
      <Link to="/editor" className="text-blue-600 p-4">Start Drawing</Link>
    </div>
  );
};

export default Home;
