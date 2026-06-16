import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.jsx"),
  route("setup", "routes/setup.jsx"),
  route("quiz", "routes/quiz.jsx"),
  route("results", "routes/results.jsx"),
];
