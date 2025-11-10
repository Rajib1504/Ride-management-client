import React from "react";
import { Link } from "react-router";

const Unauthorised = () => {
  return (
    <div className="place-content-between">
      You're Unauthorised to visit this route
      <Link to={"/"} className="inline-block border-2 p-2 rounded-xl">
        Home
      </Link>
    </div>
  );
};

export default Unauthorised;
