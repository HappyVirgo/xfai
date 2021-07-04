import { Box } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from "../componets/Header/Header";
import { Farm } from "../pages/Farm/Farm";
import Faq from "../pages/Faq/Faq";
import Footer from "../componets/Footer/Footer";

export const AppRouter = () => {
  return (
    <Router>
        <Header />
        <Box className="background">
          <Box pb={50}>
            <Switch>
              <Route exact path="/">
                <Farm />
              </Route>
              <Route exact path="/faq">
                <Faq />
              </Route>
            </Switch>
          </Box>
        </Box>
        <Footer />
    </Router>
  );
};
