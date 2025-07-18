import React from "react";
import Header from "../Layout/Header";
import Navigation from "../Layout/Navigation";

/**
 * MainLayout provides the common layout for all main (authenticated) pages.
 * Usage:
 *   <MainLayout currentPage={...} setCurrentPage={...}>
 *      ...your current page content...
 *   </MainLayout>
 */
const MainLayout = ({ currentPage, setCurrentPage, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Sidebar navigation */}
        <Navigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        {/* Main content area */}
        <main className="flex-1 ml-64 pt-16 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
