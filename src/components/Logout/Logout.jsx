import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = ({logout}) => {
  const navigate = useNavigate();
  useEffect(() => {
    logout()
    sessionStorage.clear();
    navigate("/login");
  }, [navigate]);

  return;
};
