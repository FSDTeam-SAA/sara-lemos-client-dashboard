"use client";
import React, { useState } from "react";
import UserDataShow from "../common/UserDataShow";
import UserDetailsContainer from "./UserDetailsContainer";

const ClientDetails = () => {
  const [edit, setEdit] = useState(false);
  return (
    <section>
      <div className="container mx-auto">
        {edit ? (
          <UserDetailsContainer />
        ) : (
          <UserDataShow onSetEdit={setEdit} edit={edit} />
        )}
      </div>
    </section>
  );
};

export default ClientDetails;
