// src/pages/WorkShopFullPage.jsx
import React from "react";
import { AlertProvider } from '../context/AlertContext';
import { COLLECTIONS, STORAGES, ENTITY_FLAG } from "../constants"; // Adjust the import paths as necessary

import AssociatedEntityFullPage from "../Components/AssociatedEntityFullPage";

function WorkShopFullPage() {
  return (
    <AlertProvider>
      <AssociatedEntityFullPage
        entityCollectionName={COLLECTIONS.WORKSHOPS}
        storageCollectionName={STORAGES.WORKSHOPICON}
        defaultImageUrl="https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
      />
    </AlertProvider>
  );
}

export default WorkShopFullPage;
