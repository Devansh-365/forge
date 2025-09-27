"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";

const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear select-none group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={"yo"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center gap-2">
              <div className="from-light-primary to-primary rounded-md bg-gradient-to-br p-[7px] text-white [&>svg]:size-3.5">
                icon
              </div>
              <div className="instrument-serif text-xl font-semibold">Yo</div>
            </div>
            <>{children}</>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* <div className="flex items-center gap-2 px-4">
        <ThemeSwitch />
      </div> */}
    </header>
  );
};

export default Header;
