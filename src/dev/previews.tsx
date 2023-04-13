import React from "react";
import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox";
import { PaletteTree } from "./palette";
import { UserProfilePage } from "pages/UserProfilePage/UserProfilePage";

const ComponentPreviews = () => {
  return (
      <Previews palette={ <PaletteTree/> }>
        <ComponentPreview path="/UserProfilePage">
          <UserProfilePage/>
        </ComponentPreview>
      </Previews>
  );
};

export default ComponentPreviews;