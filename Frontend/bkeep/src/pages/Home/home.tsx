import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-slate-200 min-h-screen justify-center text-center  py-20">
      <h1 className="text-5xl text-black">Welcome here</h1>
      <span>
        <Link to="/register">Get started</Link>
      </span>
    </div>
  );
}

export default HomePage;
