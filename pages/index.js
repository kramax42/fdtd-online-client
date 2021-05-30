import React from "react";

import { MainLayout } from "../components/MainLayout.js";
require("url").URL;
require("url").URLSearchParams;
export default function Index({
  title,
  labName,
  isOK
}) {

 
  return (
    <React.Fragment>
      <MainLayout labName={labName} title={title} />
      <div>{"isOK working: " + isOK}</div>
    </React.Fragment>
  );
}

export async function getServerSideProps(context) {
  const response = await fetch(
    process.env.API_URL +
      "api/echo?" +
      new URLSearchParams({
        type: "main",
      })
  );
  const data = await response.json();
  return {
    props: {
      title: "ВОЛНОВАЯ ОПТИКА",
      labName: "Выберите лабораторную",
      isOK: data.isOK,
    },
  };
}
