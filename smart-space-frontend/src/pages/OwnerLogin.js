import React from "react";
import { Building2 } from "lucide-react";

import AuthAccessForm from "../components/AuthAccessForm";

function OwnerLogin() {
  return (
    <AuthAccessForm
      role="owner"
      accountLabel="Owner"
      visualIcon={Building2}
      visualEyebrow="Owner console"
      visualTitle="Manage listings, bookings, and earnings confidently."
      visualText="SpotFlex gives owners a focused dashboard for space operations and guest communication."
      visualVariant="owner"
      successPath="/owner-dashboard"
      registerPath="/owner-register"
      registerPrompt="Listing for the first time?"
      registerLabel="Create Owner Account"
      loginSuccessMessage="Your owner dashboard is ready."
    />
  );
}

export default OwnerLogin;
