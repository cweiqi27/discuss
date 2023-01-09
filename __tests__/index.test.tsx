import { render, screen } from "@testing-library/react";
import Layout from "pages/index";
import "@testing-library/jest-dom";

test("null", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});
