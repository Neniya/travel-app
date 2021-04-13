import { checkInputData } from "../src/client/js/checkData";
const today = new Date();
const tripStart = new Date();
tripStart.setDate(tripStart.getDate() + 1);
const tripStartPast = new Date();
tripStartPast.setDate(tripStartPast.getDate() - 1);

describe("Testing if the input data is correct", () => {
  test("Testing the checkInputData() function. Everything is included", () => {
    expect(
      checkInputData("San Fracisco", String(tripStart), tripStart, today)
    ).toBe("");
  });

  test("Testing the checkInputData() function. City is not included", () => {
    expect(checkInputData("", String(tripStart), tripStart, today)).toBe(
      "Please enter city's name"
    );
  });

  test("Testing the checkInputData() function. Trip start date is not included", () => {
    expect(checkInputData("San Fracisco", "", undefined, today)).toBe(
      "Please enter the date when your trip starts"
    );
  });

  test("Testing the checkInputData() function. Everything is included", () => {
    expect(
      checkInputData(
        "San Fracisco",
        String(tripStartPast),
        tripStartPast,
        today
      )
    ).toBe("Please enter the future date");
  });
});
