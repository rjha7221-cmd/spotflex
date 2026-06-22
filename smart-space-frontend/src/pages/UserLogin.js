import React from "react";
import { ShieldCheck } from "lucide-react";

import AuthAccessForm from "../components/AuthAccessForm";

function UserLogin() {
  return (
    <AuthAccessForm
      role="user"
      accountLabel="User"
      visualIcon={ShieldCheck}
      visualEyebrow="Flexible booking"
      visualTitle="Find the right space when plans change."
      visualText="Search, compare, book, and manage short-term spaces from one clean workspace."
      successPath="/home"
      registerPath="/user-register"
      registerPrompt="New to SpotFlex?"
      registerLabel="Create User Account"
      loginSuccessMessage="Welcome back to your booking workspace."
    />
  );
}

export default UserLogin;
