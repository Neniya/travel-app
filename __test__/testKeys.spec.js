import { getProjectParameters } from "../src/server/server.js";

test("checking if the geoname's api is filled", () => {
  expect(getProjectParameters().API_GEONAMES).not.toBe("");
});

test("checking if the weatherbit api is filled", () => {
  expect(getProjectParameters().API_WEATHERBIT).not.toBe("");
});

test("checking if the pixabay api is filled", () => {
  expect(getProjectParameters().API_PIXABAY).not.toBe("");
});
