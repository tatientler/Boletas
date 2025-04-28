import { SearchTickets } from "../pages/SearchTickets";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "../layout";

const PublicRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<SearchTickets />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default PublicRoutes;
